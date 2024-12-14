import { Badge, Button, Typography } from '@material-ui/core'
import React, { useMemo } from 'react'
import { getCookie } from '../../../util/cookieHandler'
import '../css/overScreen.css'
import { SOC_REQ_TYPES } from '../util/socketRequestTypes'


export const StartScreen = ({ sendSocketReq }) => {

    const onStartClick = () => {

        let gameConfig = {
            levelTimeout: 60,
            noOfLevels: 3
        }

        if (getCookie(`gameConfig`))
            gameConfig = JSON.parse(getCookie(`gameConfig`))

        sendSocketReq(SOC_REQ_TYPES.START_GAME, gameConfig)

    }
    return (
        <OverScreen
            titleVariant="h2"
            titleClass="word-lobby"
            title='Can your friends guess what you draw..??'
            backgroundCover={`url(${process.env.PUBLIC_URL}/images/start.jpg)`}
        >
            <Typography variant="subtitle2" className="note" gutterBottom>
                Clicking on Home icon redirects and disconnects the game
            </Typography>
            <Button variant="outlined" color="primary"
                onClick={onStartClick}>
                Let's Draw
            </Button>
        </OverScreen>
    )
}

export const FinalScores = ({ userList, onClose }) => {

    const MemoizedFinalScores = useMemo(() => {

        const places = 3;
        let topScores = [], otherScores = []

        userList.forEach((user, i) => {

            let isTop = i < places

            let ele = (
                <Badge max={999} badgeContent={`#${i + 1}`} key={i}
                    className={isTop ? `top-score place-${i + 1}` : 'final-score'} style={{ backgroundColor: `${user.color[700]}c7` }} >
                    <span style={{ color: user.color[200] }}>{user.score}</span>
                    <span style={{ color: user.color[200], fontStyle: 'italic' }}>{user.displayName}</span>
                </Badge>
            )

            if (isTop)
                topScores.push(ele)
            else
                otherScores.push(ele)
        })

        return (<>
            <div className={!otherScores.length ? "top-scores full" : "top-scores"}>
                {topScores}
            </div>
            {otherScores.length ? <div className="other-scores">
                {otherScores}
            </div> : null}
        </>
        )

    }, [userList]);


    return (
        <OverScreen
            className='gameover-page'
            titleVariant="h2"
            titleClass="word-lobby"
            title='GAME OVER'
            backgroundColor='#2f2e2cf5'
            containerClass="final-score-container">
            {MemoizedFinalScores}
            <Button variant="outlined" color="primary"
                onClick={onClose}>
                OK
            </Button>
        </OverScreen>
    )
}

export const UserScores = ({ userList, answer, previousRoundDetails }) => {

    const MemoizedUserScores = useMemo(() => userList.map((user, i) => {

        return (
            <div key={i} className='score' style={{ backgroundColor: `${user.color[700]}c7` }}>
                <span style={{ color: user.color[200] }}>{user.displayName}</span>
                <span style={{ color: user.color[200] }}>{user.score}</span>
            </div>
        )
    }), [userList]);

    let title = `<h1>${previousRoundDetails.turn === userList.length ? 'End of' : ''} Round 
    <span>${previousRoundDetails.level}</span></h1>
    ${answer === 'NO_ANSWER_SELECTED' ? `` : `The answer is <span>${answer}</span>`}`

    return (
        <OverScreen className='answer-page'
            titleClass="word-answer"
            title={title}
            backgroundColor="radial-gradient(circle, #1e1d1dd9, #252424f5, #2c2c2cf2, #333333, #232222)"
            containerClass="score-container">
            {MemoizedUserScores}
        </OverScreen>
    )
}

export const SelectWord = ({ words, onWordSelect }) => {

    const MemoizedWords = useMemo(() => words.map(word => {

        const onClick = () => onWordSelect(word)

        return (
            <Button variant="outlined" key={word}
                color="primary" onClick={onClick}>
                {word}
            </Button>
        )
    }), [words, onWordSelect]);

    return <OverScreen className='word-page'
        titleClass="word-select"
        title='Select a word...'
        backgroundColor="#b7b7b7ab"
        containerClass="words-list">
        {MemoizedWords}
    </OverScreen>
}

const OverScreen = ({ className = '',
    titleClass = "",
    title = '',
    titleVariant = 'h5',
    backgroundColor = "",
    backgroundCover = "",
    containerClass = "",
    children }) => {

    const getBackGround = backgroundColor => {

        if (backgroundColor)
            if (backgroundColor.includes('('))
                return { backgroundImage: backgroundColor }
            else
                return { backgroundColor }

        return null
    }

    return (
        <div className={`landing-page ${className}`} style={getBackGround(backgroundColor)}>
            <Typography variant={titleVariant} className={`landing-text ${titleClass}`} gutterBottom>
                <span dangerouslySetInnerHTML={{ __html: title }} />
            </Typography>
            <div className={`screen-container ${containerClass}`}>
                {children}
            </div>
            {backgroundCover ? <div className="cover" style={{ backgroundImage: backgroundCover }} /> : null}
        </div>
    )
}