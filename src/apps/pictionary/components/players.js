import { Avatar, makeStyles } from '@material-ui/core';
import React from 'react';
import { getColor } from '../util/colors';
import './../css/players.css';

const useStyles = makeStyles((theme) => ({
    small: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    }
}));

const Players = ({ userList, userId }) => {

    const sortByScore = userList => {
        return userList.sort(function (a, b) {
            var x = a.score; var y = b.score;
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }

    return (
        <div className="player-list">
            {
                sortByScore(userList).map((eachUser, i) => {

                    const { active, connected, currentPlayer, color, displayName, guessedWord, userId: id, score } = eachUser

                    return (
                        active && connected ?
                            <Player
                                key={i}
                                place={i + 1}
                                score={score}
                                userColor={color}
                                isSameUser={id === userId}
                                userName={displayName}
                                guessedWord={guessedWord}
                                isCurrentPlayer={currentPlayer} /> : null
                    )
                })
            }
        </div>
    )

}

const Player = ({ userColor, userName, isCurrentPlayer, isSameUser, guessedWord, score, place }) => {

    const classes = useStyles();

    return (
        <div className='player' style={
            guessedWord ? { backgroundColor: `${getColor('lightGreen', 300)}8f` } : null
        }>
            <div className='player-icon'>
                <span className={`place-${place}`}>{`#${place}`}</span>
                <Avatar className={classes.small} style={{
                    color: userColor[200],
                    backgroundColor: userColor[700],
                    fontSize: '13px',
                    boxShadow: isCurrentPlayer ? `0 0 5px 4px #12ce0f` : 'none'
                }}>{score}</Avatar>
            </div>
            <span>{isSameUser ? "you" : userName}</span>
        </div>
    )
}

export default Players