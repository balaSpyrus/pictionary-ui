import React from 'react';
import { makeStyles } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LabelIcon from '@material-ui/icons/Label';

export const drawerWidth = 200;

const useStyles = makeStyles(() => ({

    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        marginTop: 45,
        background: '#7596af',
        color: 'white'
    },
    drawerContainer: {
        overflow: 'auto',
    },
    selected: {
        backgroundColor: `rgba(0, 0, 0, 0.34) !important`
    }
}));

const AppDrawer = ({ menuList ,onMenuItemChange}) => {

    const classes = useStyles();
    const [selectedIndex, setSelectedIndex] = React.useState('00');

    const handleListItemClick = (menuItem, index) => {
        setSelectedIndex(index);
        onMenuItemChange(menuItem);
    }

    return (
        <Drawer
            elevation={3}
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}>
            <div className={classes.drawerContainer}>
                {menuList.map((eachSection, i) => {
                    return (
                        <>
                            <List>
                                {
                                    eachSection.map((eachMenuItem, j) => {

                                        let id = i + "" + j
                                        let isSelected = selectedIndex === id

                                        return (
                                            <ListItem button
                                                selected={selectedIndex === id}
                                                className={isSelected ? classes.selected : null}
                                                onClick={(event) => handleListItemClick(eachMenuItem, id)}
                                                key={eachMenuItem + id}>
                                                <ListItemIcon><LabelIcon /></ListItemIcon>
                                                <ListItemText primary={eachMenuItem} />
                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                            <Divider />
                        </>
                    )
                })}
            </div>
        </Drawer>
    );
}

export default AppDrawer;