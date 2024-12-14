import { Grid, useMediaQuery } from '@material-ui/core';
import { decompress } from 'lz-string';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router';
import SockJsClient from 'react-stomp';
import { Canvas, ChatBox, Players } from '.';
import { firebaseApp } from '../../../auth/firebase';
import { Loader } from '../../../components';
import { getCookie } from '../../../util/cookieHandler';
import { getServer } from '../../../util/servers';
import { SOC_REQ_TYPES } from '../util/socketRequestTypes';
import { getGameInitialState, getGameOverResults, getGameState, onCorrectWord, onUserConnect, onUserDisconnect, setNewMsg, updatePlayerDetails } from '../util/socketResponseHandler';
import './../css/gamePage.css';
import ActionItems from './actionItems';
import { FinalScores, StartScreen, UserScores } from './overScreen';

const analytics = firebaseApp().analytics();


const Pictionary = ({ match, history }) => {

    const { lobbyID, server } = match.params
    const [msgList, setMsgList] = useState([])
    const [userList, setUserList] = useState([])
    const [words, setWords] = useState([])
    const [clue, setClue] = useState('')
    const [answer, setAnswer] = useState('')
    const [loadingMsg, setLoadingMsg] = useState('')
    const [gameOver, isGameOver] = useState(false)
    const [gameConfig, setGameConfig] = useState({})
    const [currentLevel, setCurrentLevel] = useState(1)
    const [currentTurn, setCurrentTurn] = useState(1)
    const [previousRoundDetails, setPreviousRoundDetails] = useState({
        turn: 1,
        level: 1,
    })
    const [gameStarted, isGameStarted] = useState(false)
    const [connected, isConnected] = useState(false)
    const [currentPlayerID, setCurrentPlayerID] = useState(null)
    const [playerDetails, setPlayerDetails] = useState({})
    const [chatInputFocused, isChatInputFocused] = useState(false)

    const canvasComponent = useRef(null)
    const inputRef = useRef(null)
    const clientRef = useRef(null)
    const isSmallerResolution = useMediaQuery('(max-width : 960px)')

    const sendSocketReq = useCallback(

        (type = '', msg = null) => {

            if (connected) {

                let data = { messageType: type }
                if (msg)
                    data.content = msg instanceof Object ? JSON.stringify(msg) : msg

                // console.log(">>> SEND >>>", data)

                clientRef.current &&
                    clientRef.current.sendMessage(`/app/${lobbyID}`, JSON.stringify(data));
            }

        }, [connected, lobbyID]
    )

    useEffect(() => {
        analytics.logEvent('join_lobby', {
            server: `${server}`,
            value: `${lobbyID}`
        });
        setLoadingMsg('Preparing the canvas...')
    }, [server, lobbyID])


    useEffect(() => {
        if (connected) {
            sendSocketReq(SOC_REQ_TYPES.WHO_AM_I, {
                displayName: getCookie('userName')
            })
        }
    }, [connected, sendSocketReq])


    useEffect(() => {
        setPlayerDetails(playerDetails => updatePlayerDetails(userList, playerDetails.userId))
    }, [userList])

    const getUserDetails = userId => {

        let userDetails = userList.filter(user => user.userId === userId);

        if (userDetails.length)
            return userDetails[0]
        else
            return {}
    }

    const closeAnswerPage = () => setTimeout(() => {
        canvasComponent && canvasComponent.current.clear()
        setAnswer('')
    }, 4000)

    const prepareGame = gameState => {

        const { gameConfig, clue, currentLevel, currentTurn } = gameState
        const { userList, currentPlayerID: newCurrentPlayerID, gameStateFlag } = getGameInitialState(currentPlayerID, gameState)

        if (newCurrentPlayerID)
            setCurrentPlayerID(newCurrentPlayerID)

        setUserList(userList)
        isGameStarted(gameStateFlag)
        setGameConfig(gameConfig)
        setClue(clue)
        setCurrentLevel(currentLevel)
        setCurrentTurn(currentTurn || 1)
        setPreviousRoundDetails({
            level: currentLevel,
            turn: currentTurn || 1,
        })
    }

    const onGameStateChange = gameState => {

        const { userList: newUserList, msgList: newMsgList, currentPlayerID, answer } = getGameState(userList, msgList, previousRoundDetails, gameState)
        const { currentLevel: newCurrentLevel, currentTurn: newCurrentTurn } = gameState

        setCurrentPlayerID(currentPlayerID)
        setUserList(newUserList)
        setMsgList(newMsgList)
        setAnswer(answer)
        setCurrentTurn(newCurrentTurn)
        setCurrentLevel(newCurrentLevel)
        setWords([])
        setClue('')

    }

    const resetGame = finalResults => {

        const { userList: newUserList, answer } = getGameOverResults(userList, finalResults)

        setAnswer(answer)
        setUserList(newUserList)
        isGameStarted(false)
        isGameOver(true)
        setCurrentPlayerID(null)
        setPreviousRoundDetails({ level: currentLevel, turn: currentTurn })
        setMsgList([])

    }

    const onSocketResponse = socketResponse => {

        // console.log('<<< RECIEVED <<< ', socketResponse);

        const { messageType, content, originId } = socketResponse

        switch (messageType) {
            case SOC_REQ_TYPES.CHAT:
                setMsgList(msgList => setNewMsg(msgList, getUserDetails(originId), content));
                break;
            case SOC_REQ_TYPES.CANVAS_UPDATE:
                {
                    if (playerDetails.userId !== originId && canvasComponent.current) {
                        let newCanvasData = decompress(content)
                        if (canvasComponent.current.getSaveData() !== newCanvasData)
                            canvasComponent.current.loadSaveData(newCanvasData, true);
                    }
                    break;
                }
            case SOC_REQ_TYPES.WHO_AM_I:
                setPlayerDetails(content)
                setLoadingMsg('')
                break;
            case SOC_REQ_TYPES.GAME_STARTED:
                {
                    const { gameConfig } = content
                    resetScoresAndRounds();
                    setGameConfig(gameConfig)
                    isGameStarted(true)
                    break;
                }
            case SOC_REQ_TYPES.GAME_STATE_UPDATE:
                {
                    setPreviousRoundDetails({
                        level: currentLevel,
                        turn: currentTurn
                    })
                    onGameStateChange(content)
                    closeAnswerPage();
                    break;
                }
            case SOC_REQ_TYPES.CLEAR_CANVAS:
                canvasComponent.current && canvasComponent.current.clear()
                break;
            case SOC_REQ_TYPES.UNDO_CANVAS:
                canvasComponent.current && canvasComponent.current.undo()
                break;
            case SOC_REQ_TYPES.ATTENDANCE:
                sendSocketReq(SOC_REQ_TYPES.WHO_AM_I)
                break;
            case SOC_REQ_TYPES.GAME_STATE:
                prepareGame(content)
                break;
            case SOC_REQ_TYPES.USER_CONNECTED:
                {
                    if (playerDetails.userId !== originId) {
                        const { userList: newUserList, msgList: newMsgList } = onUserConnect(userList, msgList, content)
                        setUserList(newUserList)
                        setMsgList(newMsgList)
                    }
                    break;
                }
            case SOC_REQ_TYPES.USER_DISCONNECTED:
                {
                    const { userList: newUserList, msgList: newMsgList } = onUserDisconnect(userList, msgList, content)
                    setUserList(newUserList)
                    setMsgList(newMsgList)
                    break;
                }
            case SOC_REQ_TYPES.GAME_OVER:
                resetGame(content)
                closeAnswerPage();
                break;
            case SOC_REQ_TYPES.CHOOSE_WORD:
                setWords(content.words)
                break;
            case SOC_REQ_TYPES.GUESSED_WORD:
                {
                    const { userList: newUserList, msgList: newMsgList } = onCorrectWord(userList, msgList, getUserDetails(content.userId));
                    setUserList(newUserList)
                    setMsgList(newMsgList)
                    break;
                }
            case SOC_REQ_TYPES.CLUE:
                {
                    if (playerDetails.userId === currentPlayerID)
                        setWords([])
                    else
                        setClue(content.clue)
                    break;
                }
            case SOC_REQ_TYPES.ROOM_NOT_AVAILABLE:
                {
                    setLoadingMsg('Invalid Lobby...')
                    clientRef.current && clientRef.current.disconnect()
                    setTimeout(() => { history.push('/apps/pictionary') }, 1000)
                    break;
                }
            default:
                break;
        }

    }

    const setChatInputFocus = focused => isChatInputFocused(focused)
    const onWordSelect = word => setClue(word)
    const onSocketConnect = () => isConnected(true)

    const resetScoresAndRounds = () => {

        setPreviousRoundDetails({
            turn: 1,
            level: 1,
        })
        setUserList(userList => {
            userList.forEach(user => user.score = 0)
            return userList
        })
        isGameOver(false)
    }

    const isActive = playerDetails && playerDetails.currentPlayer
    const onTouchCanvas = () => {
        if (inputRef.current)
            inputRef.current.blur();
    }
    const onSocketDisconnect = () => isConnected(false)
    const setClientRef = cliRef => clientRef.current = cliRef

    return (
        <>
            <Grid container className="h-100 pictionary-container">
                {
                    !isActive &&
                    chatInputFocused &&
                        isSmallerResolution ? null :
                        <Grid item sm={12} md={1} className="user-container">
                            <Players userList={userList} userId={playerDetails.userId} />
                            <ActionItems serverID={server} lobbyID={lobbyID} />
                        </Grid>
                }
                <Grid item sm={12} md={8} className='canvas-container'
                    id='canvas-container' onTouchStart={onTouchCanvas}>
                    {
                        answer ?
                            <UserScores
                                previousRoundDetails={previousRoundDetails}
                                userList={userList}
                                answer={answer} />
                            : null
                    }
                    {
                        gameStarted ?
                            <Canvas
                                activePlayerName={isActive ? playerDetails.displayName : getUserDetails(currentPlayerID).displayName}
                                ref={canvasComponent}
                                sendSocketReq={sendSocketReq}
                                isActive={isActive}
                                gameConfig={gameConfig}
                                turn={currentTurn}
                                clue={clue}
                                currentRound={currentLevel}
                                chatInputFocused={chatInputFocused}
                                answer={answer}
                                words={words}
                                onWordSelect={onWordSelect}
                            />
                            :
                            gameOver ?
                                <FinalScores
                                    userList={userList}
                                    onClose={resetScoresAndRounds} />
                                :
                                <StartScreen
                                    sendSocketReq={sendSocketReq} />
                    }
                </Grid>
                <Grid container item sm={12} md={3} className='chat-container' style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/chat.jpg)`
                }}>
                    <ChatBox
                        userId={playerDetails.userId}
                        msgList={msgList}
                        clue={clue}
                        isActive={isActive}
                        ref={inputRef}
                        setChatInputFocus={setChatInputFocus}
                        sendSocketReq={sendSocketReq} />
                </Grid>
            </Grid>

            <SockJsClient url={`https://${getServer(server)}/pictionary`}
                topics={[`/lobby/${lobbyID}`, `/user/lobby/${lobbyID}`]}
                onMessage={onSocketResponse}
                onConnect={onSocketConnect}
                onDisconnect={onSocketDisconnect}
                ref={setClientRef} />

            {
                loadingMsg ? (
                    <Loader msg={loadingMsg} />
                ) : null
            }
        </>

    )
}

export default withRouter(Pictionary)