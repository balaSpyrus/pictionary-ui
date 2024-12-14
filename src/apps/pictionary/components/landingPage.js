/* eslint-disable react-hooks/exhaustive-deps */
import { Badge, Container, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { withRouter } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { NavBar } from '../../../components';
import Copyright from '../../../components/core/copyright';
import { getAboutDetails } from '../../../util/staticData';
import './../css/landingPage.css';
import ConfigForm from './gameConfigForm';



const useStyles = makeStyles((theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    appBar: {
        backgroundColor: `#628dad`,
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    footerLink: {
        fontSize: `1rem`,
        color: `rgba(0, 0, 0, 0.54)`
    },
    link: {
        margin: theme.spacing(1, 1.5),
        fontSize: `0.875rem !important`
    },
    routerLink: {
        fontWeight: 500,
        textTransform: 'uppercase'
    },
    badge: {
        '&>span': {
            color: `#fff`,
            backgroundColor: `#8c4246`,
            fontSize: `10px`,
        }
    },
    container: {
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `space-between`
    },
    heroContent: {
        padding: theme.spacing(3, 0),
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        justifyContent: `center`,
        background: `linear-gradient(0deg, rgba(255,251,251,0) 0%, rgba(255,251,251,0.1007395540730337) 9%, rgba(255,251,251,0.3029867450842697) 18%, rgba(255,251,251,0.6035485428370786) 37%, rgba(255,251,251,0.6990541608146068) 56%, rgba(255,251,251,0.7018631495786517) 75%, rgba(255,251,251,0.6962451720505618) 100%)`
    },
    footer: {
        background: `linear-gradient(180deg, rgba(255,251,251,0) 0%, rgba(255,251,251,0.1007395540730337) 9%, rgba(255,251,251,0.3029867450842697) 18%, rgba(255,251,251,0.6035485428370786) 37%, rgba(255,251,251,0.6990541608146068) 56%, rgba(255,251,251,0.7018631495786517) 75%, rgba(255,251,251,0.6962451720505618) 100%)`,
        paddingBottom: theme.spacing(1),
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(3),
        }
    },
}));

const LandingPage = ({ location }) => {

    const classes = useStyles();
    const about = getAboutDetails('pictionary', `/apps/pictionary`);
    const getLobbyLink = useMemo(() => location.state ? location.state.lobbyLink : '', [location.state])
    const onAboutClick = () => localStorage.setItem('aboutData', JSON.stringify(about))

    return (
        <main className="main-view">
            <CssBaseline />
            <NavBar hasLogin={false} className={classes.appBar} containerClass={classes.container}>
                <nav>
                    <Link variant="button" color="textPrimary" href="https://forms.gle/vUZQrMxznRD5q4uy9"
                        target="_target" rel="noopener noreferrer" className={classes.link}>
                        Feedback
                        </Link>
                    <RouterLink
                        className={clsx(classes.link, classes.routerLink)}
                        onClick={onAboutClick}
                        to='/about'>About</RouterLink>
                </nav>
                <Container maxWidth="xl" component="main" className={classes.heroContent}>

                    <Badge className={classes.badge} badgeContent={about.version || 0}>
                        <Typography component="h1" variant="h2" align="center" style={{ color: '#8c4246' }} gutterBottom>
                            {about.title}
                        </Typography>
                    </Badge>
                    <Typography variant="subtitle2" className="note" gutterBottom>
                        Works Best on Google Chrome
                    </Typography>
                </Container>
                <Container className='create-user' maxWidth='xl' component="main">
                    <ConfigForm lobbyLink={getLobbyLink} />
                </Container >
                <Container maxWidth="xl" component="footer" className={classes.footer}>
                    <Box mt={5}>
                        <Copyright />
                    </Box>
                </Container>
            </NavBar>
        </main>
    )
}



export default withRouter(LandingPage);