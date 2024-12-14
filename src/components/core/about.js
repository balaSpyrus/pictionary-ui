import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Copyright from './copyright';
import { getAboutDetails } from '../../util/staticData';
import { Badge } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    badge: {
        '&>span': {
            color: '#fff',
            backgroundColor: '#616060'
        }
    },
    heroButtons: {
        marginTop: theme.spacing(3),
    },
    cardGrid: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(8),
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        flex: '3'
    },
    card: {
        display: 'flex',
    },
    cardMedia: {
        flex: '1 0 auto',
        backgroundSize: `cover`
    },
    cardContent: {
        flex: '1 0 auto',
        backgroundColor: '#e0e0e0'
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
}));

const cards = [{
    name: 'Balasubramanian',
    role: 'Face & Skin',
    imgURL: `${process.env.PUBLIC_URL}/images/bala.jpg`,
    linkedInURL: 'https://www.linkedin.com/in/balasubramanian-nagarajan-9554438a/'
}, {
    name: 'Gokul Raj Kumar',
    role: 'Brain & Heart',
    imgURL: `${process.env.PUBLIC_URL}/images/grk.jpg`,
    linkedInURL: 'https://www.linkedin.com/in/gokulrajkumar/'
}];

const About = () => {
    const classes = useStyles();
    const { title, version, description, backLink } = localStorage.getItem('aboutData') ?
        JSON.parse(localStorage.getItem('aboutData')) : getAboutDetails()

    useEffect(() => {

        return () => {
            localStorage.removeItem('aboutData')
        }
    }, [])

    return (
        <React.Fragment>
            <CssBaseline />
            <main>
                <div className={classes.heroContent} style={{ backgroundColor: '#e0e0e0' }}>
                    <Container maxWidth="md" className={classes.container}>

                        <Badge className={classes.badge} badgeContent={version || 0}>
                            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                {title}
                            </Typography>
                        </Badge>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            {description}
                        </Typography>
                        <Typography variant="h6" align="center" color="textSecondary" paragraph>
                            Check out our other apps on<br />
                            <Link color="blue" href="https://app.grkweb.com/">
                                app.grkweb.com
                            </Link>
                        </Typography>
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <RouterLink to={backLink}>
                                        <Button variant="contained" color="primary">
                                            Back
                                    </Button>
                                    </RouterLink>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </div>
                <Container className={classes.cardGrid} style={{ backgroundImage: `radial-gradient(circle, #7fd9f2, #62cbf5, #4dbcf8, #4aabf9, #5a98f5)` }} maxWidth="xl">
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Typography variant="h4" align="center" component="h2" style={{ color: '#e0e0e0', fontWeight: 500, textShadow: ` 0px 2px 3px #004eaf` }}>
                                Developers
                            </Typography>
                        </Grid>
                        {cards.map((card) => (
                            <Grid item key={card} xs={12} sm={6} md={4}>
                                <Developer {...card} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
            <footer className={classes.footer} style={{ backgroundColor: '#e0e0e0' }}>
                <Copyright />
            </footer>
        </React.Fragment>
    );
}

const Developer = ({ name, role, imgURL, linkedInURL }) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardMedia
                className={classes.cardMedia}
                image={imgURL}
                title="Developer Image"
            />
            <div className={classes.details}>
                <CardContent className={classes.cardContent}>
                    <Typography component="h5" variant="h5" style={{ color: '#3f51b5', fontWeight: 600, whiteSpace: `nowrap` }}>
                        {name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {role}
                    </Typography>
                </CardContent>
            </div>
            <CardActions>
                <Link color="inherit" href={linkedInURL}>
                    <Button size="small" color="primary">
                        <LinkedInIcon style={{ fontSize: 60 }} />
                    </Button>
                </Link>
            </CardActions>
        </Card>
    );
}

export default About;