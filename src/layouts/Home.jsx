import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PostsContainer from 'containers/PostsContainer';
import PostCard from 'components/PostCard';
import BottomAppNavigation from 'components/BottomAppNavigation';
import Navigation from 'components/Navigation';
import { Typography, CircularProgress } from '@material-ui/core';

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    }
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 4}px 0 !important`
  },
  cardItemGrid: {
    padding: '0 !important'
  },
  cardItem: {
    width: 'calc(100% + 48px)',
    margin: -24
  },
  center: {
    width: '100%',
    height: '100vh',
    position: 'absolute',
    left: 0,
    top: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});


function Home(props) {
  const { classes, auth } = props;

  return (
    <div className={classNames(classes.layout, classes.cardGrid)}>
      <>
        <Navigation />
        <PostsContainer auth={auth}>
          {(posts, status) => {
            if (status === 'loading') {
              return (
                <div className={classes.center}>
                  <CircularProgress className={classes.progress} size={30} thickness={5} />
                </div>
              )
            }
            return (
              <Grid container spacing={40} className={classes.cardItem}>
                {posts.length > 0 ?
                  posts.map((post, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3} className={classes.cardItemGrid}>
                      <PostCard content={post} />
                    </Grid>
                  )) : (
                    <Typography
                      variant="subheading"
                      className={classes.center}
                    >
                      Brak postów do wyświetlenia
                  </Typography>
                  )}
              </Grid>
            )
          }}
        </PostsContainer>
        <BottomAppNavigation />
      </>
    </div>
  );
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Home);