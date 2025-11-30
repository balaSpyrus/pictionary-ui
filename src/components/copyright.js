import { Container, Link, makeStyles, Typography } from '@material-ui/core';
import isExternal from 'is-url-external';
import React from 'react';
import { Route as RouterLink } from 'react-router-dom';
import { footerContent } from '../util/staticData';

const useStyles = makeStyles((theme) => ({
    footerLink: {
        fontSize: `10px`,
        fontWeight: 600,
        color: `rgba(0, 0, 0, 0.54)`
    },
    link: {
        margin: theme.spacing(1, 1.5),
        fontSize: `0.875rem !important`
    },
    list: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        padding: 0
    },
    listItem: {
        display: 'inline-block',
        padding: `0px 10px`,
        borderRight: `1px solid #616161`,
        "&:last-child": {
            borderRight: 'none'
        }
    },
    routerLink: {
        fontWeight: 500,
        textTransform: 'uppercase'
    }
}));


const Copyright = () => {

    const classes = useStyles();
    return (
        <Container>
            {footerContent.map((footer, i) => (
                <ul className={classes.list} key={i}>
                    {footer.description.map(item => (
                        <li key={item.title} className={classes.listItem}>
                            {
                                isExternal(item.link) || item.link.includes('.html') ?
                                    <Link href={item.link} variant="subtitle1" className={classes.footerLink} target="_target" rel="noopener noreferrer">
                                        {item.title}
                                    </Link>
                                    :
                                    <RouterLink to={`/${item.link}`} className={classes.footerLink}>
                                        {item.title}
                                    </RouterLink>
                            }
                        </li>
                    ))}
                </ul>
            ))}
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://grkweb.com/">
                    grkweb.com
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </Container>
    );
}

export default Copyright;