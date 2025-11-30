/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useMemo, forwardRef } from 'react';
import Sound from 'react-sound';
import { TextField, IconButton, useMediaQuery } from '@material-ui/core';
import { SOC_REQ_TYPES } from '../util/socketRequestTypes';
import '../css/chatbox.css'
import SendIcon from '@material-ui/icons/Send';

const ChatBox = ({ msgList, sendSocketReq, userId, clue, isActive, setChatInputFocus }, inputRef) => {

    const [value, setValue] = useState('');
    const [playSound, setPlaySound] = useState(false);
    const [msgs, setMsgs] = useState([]);
    const [inputFocused, isInputFocused] = useState(false);

    const msgListRef = useRef(null);

    const isSmallerResolution = useMediaQuery('(max-width : 960px)')

    useEffect(() => {
        setMsgs(msgList)
    }, [msgList])

    useEffect(() => {
        if (msgs.length)
            scrollDown()
    }, [msgs])

    useEffect(() => {
        setChatInputFocus(inputFocused)
    }, [inputFocused])

    const scrollDown = (playsound = true) => {
        msgListRef.current && msgListRef.current.scrollIntoView({ behavior: "smooth" });
        if (playsound)
            setPlaySound(true);
    }

    const sendMessage = () => {
        if (value) {

            if (value.toLowerCase() === clue.toLowerCase() && isActive) {
                setMsgs(prevMsgs => [...prevMsgs, {
                    type: 'info',
                    content: "Helping Friends is not allowed...!!!",
                }])
                setTimeout(() => scrollDown(), 100)
            }
            else
                sendSocketReq(SOC_REQ_TYPES.CHAT, value)
            setValue('')
        }

    }

    const MemoizedMsgs = useMemo(() => msgs.map((msg, i) => {

        const { type, content, name, color, id } = msg

        let userNameColor = "", msgTextColor = "#b3b3b3", msgBgColor = "transparent";

        if (type !== 'info') {
            userNameColor = color[500]
            msgTextColor = color[200]
            msgBgColor = color[700]
        }

        let isInfo = type === 'info'
        return (
            <span key={i} className="chat-bar" ref={i === msgs.length - 1 ? msgListRef : null} >
                {isInfo ? null :
                    <i style={{ color: userNameColor }}>{userId === id ? "you" : name}</i>
                }
                <span
                    style={{
                        color: msgTextColor,
                        backgroundColor: msgBgColor + "54"
                    }}
                    className={isInfo ? 'content-info' : 'content-msg'}>{content}</span>
            </span>
        )
    }), [msgs])

    const onSoundFinish = () => setPlaySound(false)
    const onChange = e => setValue(e.target.value)
    const onFocus = () => {
        scrollDown(false)
        isInputFocused(true)
    }
    const onBlur = () => isInputFocused(false)
    const onKeyPress = e => e.key === 'Enter' ? sendMessage() : null

    let shouldShrink = !isActive &&
        inputFocused &&
        isSmallerResolution

    return <>
        <section className={shouldShrink ? 'chat-box small' : 'chat-box'}>
            {MemoizedMsgs}
        </section>
        <section className='chat-input-container'>
            <TextField
                className='chat-input'
                inputRef={inputRef}
                id="chat-input"
                variant="outlined"
                size="small"
                autoComplete="off"
                placeholder='press "Enter" or send button to send message'
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onKeyPress={onKeyPress}
                onBlur={onBlur} />
            <IconButton aria-label="send message" className="send"
                onClick={sendMessage} color="primary">
                <SendIcon />
            </IconButton>
        </section>
        <Sound url={`${process.env.PUBLIC_URL}/sfx/sms.mp3`}
            playStatus={playSound ? Sound.status.PLAYING : Sound.status.STOPPED}
            onFinishedPlaying={onSoundFinish} />
    </>

}

export default forwardRef(ChatBox)
