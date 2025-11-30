import { makeStyles } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import clsx from 'clsx';
import React, { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { AppDrawer, NavBar } from '.';
import '../css/navbar.css';
import { drawerWidth } from './drawer';
import { sideBarMenus } from '../util/staticData';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        height: '100%'
    },
    contentWithDrawer: {
        width: `calc(100% - ${drawerWidth}px)`,
        position: `relative`,
        left: drawerWidth
    },
    content: {
        height: '100%'
    }
}));

const MainView = ({ children, hasSideBar, location }) => {

    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const classes = useStyles();

    const getMenuList = () => {
        return sideBarMenus.default
    }

    const renderUI = () => {

        return (

            hasSideBar ? <Scrollbars
                style={{ width: `100%`, height: `100%` }}
                renderThumbHorizontal={({ style, ...props }) =>
                    <div {...props} style={{
                        ...style, backgroundColor: '#3a6382', width: '8px', borderRadius: '10px'
                    }} />
                }
                renderThumbVertical={({ style, ...props }) =>
                    <div {...props} style={{
                        ...style, backgroundColor: '#3a6382', width: '8px', borderRadius: '10px'
                    }} />
                }
                autoHide
                autoHideTimeout={500}
                autoHideDuration={3000}
                autoHeight
                autoHeightMin={0}
                autoHeightMax={`100%`}
                universal={true}>
                {React.cloneElement(children, { selectedMenuItem, sideBarMenu: getMenuList() })}
            </Scrollbars> : children

        )
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <NavBar>
                {hasSideBar ? <AppDrawer
                    menuList={getMenuList()}
                    onMenuItemChange={setSelectedMenuItem}
                /> : null}
                <main className={clsx(classes.content, hasSideBar ? classes.contentWithDrawer : '')}>
                    {renderUI()}
                </main>
            </NavBar>
        </div>
    );
}

export default MainView;