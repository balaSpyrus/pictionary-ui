
import { Avatar, Chip, IconButton, Slider, Typography, useMediaQuery } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import RemoveIcon from '@material-ui/icons/Remove';
import UndoIcon from '@material-ui/icons/Undo';
import React, { useEffect, useMemo, useRef, useState, useCallback, useLayoutEffect, forwardRef } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { debounce } from '../../../util/commonUtil';
import { colorPallete } from '../util/colors';
import { SOC_REQ_TYPES } from '../util/socketRequestTypes';
import './../css/canvas.css';
import { SelectWord } from './overScreen';
import { compress } from 'lz-string';

const Canvas = ({ isActive = false, sendSocketReq, activePlayerName, clue, gameConfig,
    answer, words, currentRound, turn, onWordSelect, setCanvasComponent, chatInputFocused }, canvasComponent) => {

    const [brushSize, setBrushSize] = useState(0)
    const [brushColor, setBrushColor] = useState('black')
    const [height, setHeight] = useState(100)
    const [width, setWidth] = useState(100)

    const canvasContainerRef = useRef(null)
    const palleteRef = useRef(null);
    const toolRef = useRef(null);

    const isSmallerResolution = useMediaQuery('(max-width : 960px)')

    const handleSize = () => {
        if (canvasContainerRef.current) {
            const { width, height } = canvasContainerRef.current.getBoundingClientRect()
            setHeight(height)
            setWidth(width)
        }
    }

    useLayoutEffect(() => {
        handleSize()
        const debouncedHandleResize = debounce(handleSize, 200)
        window.addEventListener('resize', debouncedHandleResize)
        return () => {
            window.removeEventListener('resize', debouncedHandleResize)
        }
    }, [])

    useEffect(() => {
        setBrushColor('black')
        setBrushSize(isActive ? 0.5 : 0)
    }, [turn, isActive])

    useEffect(() => {
        if (isSmallerResolution)
            handleSize()
    }, [chatInputFocused, isSmallerResolution])

    const onCanvasChange = () => {
        if (isActive && canvasComponent.current)
            sendSocketReq(SOC_REQ_TYPES.CANVAS_UPDATE, compress(canvasComponent.current.getSaveData()))
    }

    const onSelectWord = word => {
        sendSocketReq(SOC_REQ_TYPES.CHOSEN_WORD, { chosenWord: word })
        onWordSelect(word)
    }

    const setCanvas = canvas => canvasComponent.current = canvas

    return (
        <>
            <section className="game-config-container" style={{
                left: !answer && palleteRef.current ? palleteRef.current.clientWidth : 0

            }}>
                <Timer timeLimit={gameConfig.levelTimeout} turn={turn} />
                <Chip className="round" label={gameConfig.noOfLevels === currentRound ? `Final Round` : `Round ${currentRound}`} size="small" />
            </section>
            <Chip label={isActive ? "you are drawing now" :
                `${activePlayerName || 'Anonymous'} is drawing now`}
                size="small" className='drawing-status' />
            <section className={isActive ? 'canvas canvas-active' : "canvas"}>
                {
                    isActive ?
                        <section className="pallete" ref={palleteRef}>
                            <Pallete onColorClick={setBrushColor} />
                        </section>
                        : null
                }
                <section ref={canvasContainerRef} className="canvas-area" >
                    <CanvasDraw
                        loadTimeOffset={0}
                        disabled={!isActive}
                        lazyRadius={0}
                        brushRadius={brushSize}
                        brushColor={brushColor}
                        imgSrc={`${process.env.PUBLIC_URL}/images/canvas.jpg`}
                        ref={setCanvas}
                        onChange={onCanvasChange}
                        hideGrid
                        immediateLoading={true}
                        canvasWidth={width}
                        canvasHeight={toolRef.current ? height - toolRef.current.clientHeight : height} />
                    {
                        isActive ? <section className="canvas-tool"
                            ref={toolRef}>
                            <CanvasTools
                                setBrushSize={setBrushSize}
                                brushSize={brushSize}
                                sendSocketReq={sendSocketReq} />
                        </section> : null
                    }
                </section>
            </section>
            {
                clue ?
                    <Typography variant="subtitle2" className="word" gutterBottom>
                        {clue.includes('_') ? <span>CLUE : </span> : null}
                        {clue}
                    </Typography> : null
            }
            {
                words.length ?
                    <SelectWord
                        words={words}
                        onWordSelect={onSelectWord} />
                    :
                    null
            }
        </>
    )
}

const Timer = ({ timeLimit, turn }) => {

    const [time, setTime] = useState(timeLimit);
    const timerID = useRef(null);

    const startOrRestartTimer = useCallback(() => {
        //reset if already going on
        if (timerID.current) {
            clearInterval(timerID.current)
            setTime(timeLimit)
        }

        timerID.current = setInterval(() => {
            setTime(prevTimer => prevTimer - 1 >= 1 ? prevTimer - 1 : timeLimit)
        }, 1000);

    }, [timeLimit])

    useEffect(() => {
        startOrRestartTimer()
    }, [timeLimit, startOrRestartTimer])

    useEffect(() => {
        startOrRestartTimer()
    }, [turn, startOrRestartTimer])

    return <Avatar className="timer">{time}</Avatar>
}

const CanvasTools = ({ sendSocketReq, setBrushSize, brushSize }) => {

    const getActionButton = (IconComponent, action, label) => {

        return (
            <IconButton color="primary" key={label}
                onClick={action}
                aria-label={label} component="span">
                <IconComponent />
            </IconButton>
        )

    }

    const clearCanvas = () => sendSocketReq(SOC_REQ_TYPES.CLEAR_CANVAS)
    const undoCanvas = () => sendSocketReq(SOC_REQ_TYPES.UNDO_CANVAS)
    const resizeBrush = (e, size) => setBrushSize(size)
    const increaseSize = () => setBrushSize(brushSize + 1 < 50 ? brushSize + 1 : 50)
    const decreaseSize = () => setBrushSize(brushSize - 1 > 0 ? brushSize - 1 : 0.1)


    return (
        <span className='h-100 tool-action'>
            {
                [
                    getActionButton(ClearIcon, clearCanvas, "Clear"),
                    getActionButton(UndoIcon, undoCanvas, "undo"),
                    getActionButton(RemoveIcon, decreaseSize, "reduce"),
                    <Slider value={brushSize} key={3} min={0.5} max={50} onChange={resizeBrush}
                        aria-labelledby="continuous-slider" />,
                    getActionButton(AddIcon, increaseSize, "increase")
                ]
            }
        </span>
    )
}

const Pallete = ({ onColorClick }) => {

    const MemoizedColorPallete = useMemo(() => colorPallete.map((color, i) => {

        const onClick = () => onColorClick(color)

        return (<div key={i} className='pallete-color'
            onClick={onClick}
            style={{ backgroundColor: color }} />)
    }), [onColorClick])

    return (<>{MemoizedColorPallete}</>)
}

export default forwardRef(Canvas);