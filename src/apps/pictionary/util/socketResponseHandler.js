import { getRandomColor } from "./colors";


export const setNewMsg = (msgList, userDetails, msg) => {

    let newMsg = {
        id: userDetails.userId,
        name: userDetails.displayName || 'Anonymous',
        type: 'msg',
        content: msg,
        color: userDetails.color
    }

    msgList = [...msgList, newMsg]

    return msgList
}

export const getGameState = (userList, msgList, previousRoundDetails, gameState) => {

    let { previousAnswer, currentPlayer: currentPlayerID, score, currentLevel, currentTurn } = gameState

    let currentPlayerName = null

    userList.forEach(user => {
        if (user.userId === currentPlayerID) {
            user.currentPlayer = true
            currentPlayerName = user.displayName
        }
        else
            user.currentPlayer = false
        user.guessedWord = false
        user.score = score[user.userId] || user.score
    });

    if (previousAnswer) {
        msgList = [...msgList,
        {
            type: 'info',
            content: `The word is ${previousAnswer}...!!`
        }]
    }

    msgList = [...msgList,
    {
        type: 'info',
        content: `${currentPlayerName || 'Anonymous'} is drawing now...`
    }]

    return {
        userList,
        msgList,
        currentPlayerID,
        answer: previousAnswer ?
            previousAnswer : previousRoundDetails.turn === 1 &&
                previousRoundDetails.level === 1 &&
                currentLevel === 1 &&
                currentTurn === 1 ?
                '' : 'NO_ANSWER_SELECTED'
    }
}

export const getGameInitialState = (currentPlayerID, gameStateData) => {

    let { activeUsers: userList, gameState, score } = gameStateData

    userList = userList
        .filter(user => user.active && user.connected)
        .map(user => (
            { ...user, color: getRandomColor(), guessedWord: false, score: score[user.userId] || 0 }
        ))

    let gameStateFlag = gameState === 'LOBBY' ? false : true;

    if (!currentPlayerID) {
        let currentPlayer = userList.filter(user => user.currentPlayer)[0];
        currentPlayerID = currentPlayer ? currentPlayer.userId : null
    }

    return {
        userList,
        gameStateFlag,
        currentPlayerID,
    }
}

export const onUserConnect = (userList, msgList, newUser) => {

    userList = [...userList,
    {
        ...newUser,
        color: getRandomColor(),
        guessedWord: false,
        score: 0
    }]

    msgList = [...msgList,
    {
        type: 'info',
        content: `${newUser.displayName || 'Anonymous'} joined`
    }]

    return { userList, msgList }
}

export const onUserDisconnect = (userList, msgList, user) => {


    userList = userList.filter(data => data.userId !== user.userId)
    msgList = [...msgList,
    {
        type: 'info',
        content: `${user.displayName || 'Anonymous'} left`
    }]

    return { userList, msgList }
}

export const onCorrectWord = (userList, msgList, user) => {

    userList.forEach(eachUser => {
        if (eachUser.userId === user.userId)
            eachUser.guessedWord = true
    })

    msgList = [...msgList,
    {
        type: 'info',
        content: `${user.displayName || 'Anonymous'} guessed the word..!!!`
    }]

    return { userList, msgList }
}

export const getGameOverResults = (userList, finalResults) => {

    const { previousAnswer, score } = finalResults

    userList.forEach(user => {
        user.currentPlayer = false;
        user.guessedWord = false;

        if (score[user.userId])
            user.score = score[user.userId]

        return user
    })

    return {
        answer: previousAnswer || 'NO_ANSWER_SELECTED',
        userList
    }
}

export const updatePlayerDetails = (userList, userID) => userList.filter(user => user.userId === userID)[0] || {}
