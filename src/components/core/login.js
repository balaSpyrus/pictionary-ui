import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React, { useContext } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { Redirect, withRouter } from 'react-router';
import { AppList } from '..';
import { AuthContext } from '../../auth/Auth';
import { firebaseApp, uiConfig } from '../../auth/firebase';
import Copyright from './copyright';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/login.jpg)`,
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    }
}));

const Login = ({ location, ...rest }) => {

    const { currentUser } = useContext(AuthContext);
    const classes = useStyles();

    const config = {
        ...uiConfig,
        callbacks: {
            signInSuccess: () => {
                // console.log('login callback');
            }
        }
    }

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={6} md={8} className={classes.image}>
                <Scrollbars
                    className='login-scroll'
                    renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{ display: "none" }} />}
                    renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" style={{ display: "none" }} />}
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    autoHeight
                    autoHeightMin={0}
                    autoHeightMax={`100vh`}
                    universal={true}>
                    <AppList />
                </Scrollbars>
            </Grid>
            <Grid item xs={12} sm={6} md={4} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Grid container>
                        <Grid container item>
                            {
                                !!currentUser ? <Redirect
                                    to={{
                                        pathname: location.state ? location.state.from.pathname : "/apps",
                                        state: { from: location }
                                    }}
                                /> :

                                    [<Grid item xs={12} key={0} className=' login-header' >
                                        <Typography variant="h3" >
                                            <i>Holla..!!</i>
                                        </Typography>
                                        <Typography variant="h4" gutterBottom>
                                            from Grkweb.com
                                        </Typography>
                                        <Typography variant="caption" display="block" gutterBottom>
                                            please click the below sign-in option to access our apps
                                        </Typography>
                                    </Grid>,
                                    <Grid item xs={12} key={1}>
                                        <StyledFirebaseAuth uiConfig={config} firebaseAuth={firebaseApp().auth()} />
                                    </Grid>]
                            }
                        </Grid>
                    </Grid>
                    {
                        location.state ? <Typography variant="h5" color="error" align="center">
                            Need To Login for Access
                    </Typography> : null
                    }
                    <Box mt={5}>
                        <Copyright />
                    </Box>

                </div>
            </Grid>
        </Grid>
    );
}

export default withRouter(Login);
