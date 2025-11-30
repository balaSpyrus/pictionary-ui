import { IconButton, Link, Menu, MenuItem, useMediaQuery } from '@material-ui/core';
import FeedbackRounded from '@material-ui/icons/FeedbackRounded';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import isExternal from 'is-url-external';
import React, { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { copyToClipboard } from '../util/commonUtil';
import { getAboutDetails } from '../util/staticData';

const ActionItems = ({ serverID, lobbyID }) => {

    const [isCopyClicked, setCopyClicked] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isSmallerResolution = useMediaQuery('(max-width : 960px)')
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onCopyLinkClick = () => {
        copyToClipboard(`${window.location.origin}/join/${serverID}-${lobbyID}`)
        setCopyClicked(true)
        setTimeout(() => {
            setCopyClicked(false)
            handleClose()
        }, 1000)
    }

    const actionItems = [
        {
            Icon: HomeIcon,
            label: `home`,
            isLink: true,
            action: '/'
        },
        {
            Icon: FileCopyIcon,
            label: `Copy link`,
            isLink: false,
            action: onCopyLinkClick
        },
        {
            Icon: FeedbackRounded,
            label: `feedback`,
            isLink: true,
            action: 'https://forms.gle/vUZQrMxznRD5q4uy9'
        },
        {
            Icon: InfoIcon,
            label: `about`,
            isLink: true,
            action: {
                link: '/about',
                data: getAboutDetails('pictionary', `/${serverID}/${lobbyID}`)
            }
        }
    ]

    const MemoizedActionItem = useMemo(() => actionItems.map(({ Icon, label, isLink, action }, i) => {

        return <AppAction
            isSmallerResolution={isSmallerResolution}
            handleClose={handleClose}
            key={i}
            Icon={Icon}
            label={label === `Copy link` && isCopyClicked ? "Copied" : label}
            isLink={isLink}
            action={action} />

    }), [actionItems, isCopyClicked, isSmallerResolution])

    return (
        <div className={isSmallerResolution ? "app-action-container small" : "app-action-container"}>
            {
                isSmallerResolution ?
                    <>
                        <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            elevation={4}
                            anchorEl={anchorEl}
                            anchorReference="anchorPosition"
                            anchorPosition={{ top: `8%`, right: `0` }}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            PaperProps={{
                                style: {
                                    top: `8%`,
                                    right: 0,
                                    width: '140px',
                                    background: `rgba(47, 46, 44, 0.9)`
                                },
                            }}
                            keepMounted
                            open={open}
                            onClose={handleClose} >
                            {MemoizedActionItem}
                        </Menu>
                    </>
                    :
                    MemoizedActionItem
            }
        </div>
    )
}

const AppAction = ({ Icon, label, isLink, action, isSmallerResolution, handleClose }) => {

    const link = typeof action === 'string' ? action : action.link
    const isAbout = label === 'about'
    const target = isAbout ? "_target" : null
    const rel = isAbout ? "noopener noreferrer" : null

    const onLinkClick = () => localStorage.setItem('aboutData', JSON.stringify(action.data))
    const onRouterLinkClick = () => {
        if (isAbout)
            onLinkClick()
        handleClose()
    }

    const getLinkElement = () => isExternal(link) || link.includes('.html') ?
        <Link href={link} variant="subtitle1" onClick={handleClose}
            target="_target" rel="noopener noreferrer">
            {renderItemContent()}
        </Link>
        :
        <RouterLink to={link} onClick={onRouterLinkClick}
            target={target} rel={rel}>
            {renderItemContent()}
        </RouterLink>

    const renderItemContent = () => <>
        <Icon />
        {isSmallerResolution ? <span>{label}</span> : null}
    </>

    const getAction = () => <span className="app-action">
        {
            isLink ?
                getLinkElement()
                :
                <span onClick={action}>
                    {renderItemContent()}
                </span>
        }
        {isSmallerResolution ? null : <span>{label}</span>}
    </span>

    return isSmallerResolution ? <MenuItem>{getAction()}</MenuItem> : getAction()
}

export default ActionItems;