import React, { useContext } from 'react';
import { IconButton, Menu, MenuItem, Box, Typography, Avatar, makeStyles } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import { firebaseApp } from '../../auth/firebase';
import { withRouter } from 'react-router';
import { AuthContext } from '../../auth/Auth';

const useStyles = makeStyles((theme) => ({
    user: {
        outline: 'none !important',
        display: 'flex',
        '& > span > *': {
            margin: theme.spacing(1),
        },
    },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  }
}));


const ProfileMenu = ({ history }) => {
    const { currentUser } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const classes = useStyles();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        firebaseApp().auth().signOut().then(() => {
            history.push("/")
        })
    }

    return (
        <div>
            <IconButton
                className={classes.user}
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                {/* <Box pr={1}> */}
                <Avatar alt={currentUser.displayName} src={currentUser.photoURL} className={classes.small} />
                {/* </Box> */}
                <Typography variant="body2" >
                    {currentUser.displayName}
                </Typography>
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 45, left: `1500` }}
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
                      width: '200px',
                    },
                  }}
                keepMounted
                open={open}
                onClose={handleClose}
            >
                <MenuItem ><Box pr={1}>
                    <PersonIcon />
                </Box>My account</MenuItem>
                <MenuItem onClick={() => logout()}> <Box pr={1}>
                    <ExitToAppIcon />
                </Box>Logout</MenuItem>
            </Menu>
        </div>
    )
}

export default withRouter(ProfileMenu);