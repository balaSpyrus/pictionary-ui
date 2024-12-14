import React from 'react';
import { Grid, Card, CardActionArea, makeStyles, CardContent, Typography, CardActions, Button } from '@material-ui/core';
import Scrollbars from 'react-custom-scrollbars';

const useStyles = makeStyles({
    root: {
        margin: 10
    },
    media: {
        height: 140,
    },
});

const Stocks = () => {
    const classes = useStyles();

    return (
        <Grid container style={{ height: '100%' }}>
            <Grid item xs={12} md={4} >
                <Scrollbars
                    style={{ height: '100%' }}
                    autoHide
                    autoHideTimeout={3000}
                    autoHideDuration={500}
                    universal={true}>
                    {
                        new Array(20).fill(1).map(() => {
                            return (
                                <Card className={classes.root}>
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                Lizard
                                </Typography>
                                            <Typography variant="body2" color="textSecondary" component="p">
                                                Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                                                across all continents except Antarctica
                                </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                        <Button size="small" color="primary">
                                            Share
                              </Button>
                                        <Button size="small" color="primary">
                                            Learn More
                              </Button>
                                    </CardActions>
                                </Card>
                            )
                        })
                    }
                </Scrollbars>
            </Grid>
            <Grid container item xs={false} md={8} style={{ backgroundColor: 'blue' }}>
                <Grid item xs={12} style={{
                    backgroundColor: '#dadada', display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}> <Typography gutterBottom variant="h5" component="h2">
                        Content 1
</Typography></Grid>
                <Grid item xs={12} style={{
                    backgroundColor: '#a9a9a9', display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>  <Typography gutterBottom variant="h5" component="h2">
                        Content 2
</Typography></Grid>
            </Grid>
        </Grid>
    )
}

export default Stocks;