import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import '../../css/panel.css'


const useStyles = makeStyles({
    root: {
        backgroundColor: '#7f8b9436'
    },
    title: {
        fontSize: 14,
    }
});

const Panel = ({ children, className = '', title = '', fullHeight = false }) => {
    const classes = useStyles();

    return (
        <Card className={classes.root + " " + className}>
            <CardContent className={fullHeight ? 'card-full-height' : ''}>
                {
                    title ? <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {title}
                    </Typography> : null
                }
                {children}
            </CardContent>
        </Card>
    );
}

export default Panel;






