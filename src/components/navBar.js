
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import '../css/navbar.css'
import clsx from 'clsx';


const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: `#3a6382`
    },
    content: {
        flexGrow: 1,
        marginTop: 45,
        height: "calc(100% - 45px)",
    },
    grow: {
        flexGrow: 1,
    }
}));

const NavBar = ({ hasLogin = true, children, containerClass = "", className = "" }) => {
    const classes = useStyles();

    const getChildren = (children, isNav = false) => {

        if (children) {

            return React.Children.map(children, (child, i) => {

                if (child) {
                    if (isNav) {
                        if (child.type === 'nav')
                            return child
                    }
                    else
                        if (child.type !== 'nav')
                            return child
                }
            })
        }

        return null

    }

    return (
        <>
            <AppBar position="fixed" className={clsx(classes.appBar, 'nav-bar', className)}>
                <Toolbar className='nav-content'>
                    <Typography variant="h4" className={classes.grow + ' nav-logo'}>  <Link to={'/'}>GRK WEB</Link></Typography>
                    <div className={classes.grow} />
                    {getChildren(children, true)}
                </Toolbar>
            </AppBar>
            <main className={clsx(classes.content, containerClass)}>
                {getChildren(children, false)}
            </main>
        </>
    )
}

export default withRouter(NavBar);