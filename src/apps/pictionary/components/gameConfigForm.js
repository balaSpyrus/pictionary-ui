import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, withStyles } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import React, { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { firebaseApp } from '../../../auth/firebase';
import { Loader } from '../../../components';
import { copyToClipboard } from '../../../util/commonUtil';
import { getCookie, setCookie } from '../../../util/cookieHandler';
import { getServer, SERVERS } from '../../../util/servers';


const getLink = linkData => {
    let [server, room] = linkData.split('-')
    return `/apps/pictionary/${server}/${room}`
}
const getApiURL = server => {
    return `https://${server}/pictionary/v1/create_room`
}
const analytics = firebaseApp().analytics();

const ConfigForm = ({ lobbyLink }) => {

    const rounds = [5, 8, 10]
    const timeLimits = [70, 100, 120]
    const getConfig = () => (getCookie('gameConfig') ? JSON.parse(getCookie('gameConfig')) : {
        levelTimeout: timeLimits[0],
        noOfLevels: rounds[2]
    });

    const [userName, setUserName] = useState(getCookie('userName') || '')
    const [gameConfig, setGameConfig] = useState(getConfig())
    const [linkData, setLinkData] = useState('');
    const [loadingMsg, setLoadingMsg] = useState('')

    const onClickLobby = () => {

        setCookie('userName', userName, 7, 'days');

        if (!lobbyLink) {
            setLoadingMsg('Creating Lobby link...')
            setCookie('gameConfig', JSON.stringify(gameConfig), 7, 'days')
            getSharableLink()
        }
    }

    const getSharableLink = async () => {
        analytics.logEvent('create_lobby');
        for (let index in SERVERS) {

            let url = getApiURL(getServer(SERVERS[index]));
            let response = await fetch(url, {
                method: 'post',
                body: ''
            });
            let data = await response.json();
            if (data.roomId) {
                setLinkData(`${SERVERS[index]}-${data.roomId}`)
                setLoadingMsg('')
                break;
            }
        }
    }

    const onUserNameChange = e => {
        setUserName(e.target.value)
    }
    const onSelectChange = e => setGameConfig(gameConfig => ({ ...gameConfig, [e.target.name]: Number(e.target.value) }))

    return (
        <div className='form-container'>
            <div className='form'>
                <Typography gutterBottom variant="h6" className={lobbyLink ? 'type blue' : 'type green'}
                    component="h2">
                    {lobbyLink ? 'Join Room' : 'Create Room'}
                </Typography>
                <TextField
                    className='form-input'
                    label="Enter a creative user name"
                    id="outlined-size-small"
                    variant="outlined"
                    size="small"
                    value={userName}
                    onChange={onUserNameChange} />
                {
                    lobbyLink ? null :
                        <>
                            <ConfigGame
                                label='Time Limit'
                                value={gameConfig.levelTimeout}
                                name='levelTimeout'
                                onChange={onSelectChange}
                                dataList={timeLimits} />
                            <ConfigGame
                                label='Rounds'
                                value={gameConfig.noOfLevels}
                                name='noOfLevels'
                                onChange={onSelectChange}
                                dataList={rounds} />
                        </>
                }
                <Button variant="outlined" color="primary" className='enter-btn'
                    disabled={!userName}
                    onClick={onClickLobby}>
                    {
                        lobbyLink ?
                            <RouterLink to={getLink(lobbyLink)}>Join Lobby </RouterLink>
                            : `Create Lobby`
                    }
                </Button>

            </div>
            {
                linkData ?
                    <CopyLink linkData={linkData} />
                    : null
            }
            {
                loadingMsg ? (
                    <Loader msg={loadingMsg} />
                ) : null
            }
        </div>
    )
}
const CopyLink = ({ linkData }) => {

    const [buttonText, setButtonText] = useState('Copy lobby link');

    const ColorButton = withStyles((theme) => ({
        root: {
            color: green[300],
            borderColor: green[300],
            backgroundColor: theme.palette.common.white,
            '&:hover': {
                backgroundColor: green[500],
                color: theme.palette.common.white,
            },
        },
    }))(Button);

    const onClickCopyLink = () => {
        copyToClipboard(`${window.location.origin}/apps/pictionary/join/${linkData}`)
        setButtonText('Copied!');
        setTimeout(() => {
            setButtonText('Copy lobby link');
        }, 2000);
    }


    return (
        <div className='link-container'>
            <span>{`Lobby link : ${window.location.origin}/apps/pictionary/join/${linkData}`}</span>
            <div className='btn-grp'>
                <RouterLink to={getLink(linkData)}>
                    <ColorButton variant="outlined">
                        Go to Lobby
            </ColorButton>
                </RouterLink>
                <ColorButton variant="outlined" onClick={onClickCopyLink}>
                    {buttonText}
                </ColorButton>
            </div>
        </div>
    )
}

const ConfigGame = ({ value, label, name, onChange, dataList }) => {


    let MemoizedOption = useMemo(() => {
        return dataList.map(option => <MenuItem value={option} key={option}>{`${option} ${label === 'Time Limit' ? 'Seconds' : 'Rounds'}`}</MenuItem>)
    }, [label, dataList])

    return (
        <FormControl variant="outlined" className='form-input'>
            <InputLabel id={name}>{label}</InputLabel>
            <Select
                labelId={name}
                id={name}
                value={value}
                name={name}
                onChange={onChange}
                label={label}
            >{MemoizedOption}</Select>
        </FormControl>
    )
}

export default ConfigForm;