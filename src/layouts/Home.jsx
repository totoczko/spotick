import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PostContainer from '../containers/PostContainer';
import PostCard from '../components/PostCard';
import BottomAppNavigation from '../components/BottomAppNavigation';
import Navigation from '../components/Navigation';

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
  }
});


function Home(props) {
  const { classes } = props;

  return (
    <div className={classNames(classes.layout, classes.cardGrid)}>
      <PostContainer>
        {(posts) => (
          <>
            <Navigation />
            <Grid container spacing={40} className={classes.cardItem}>
              {Object.values(posts).map((post, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3} className={classes.cardItemGrid}>
                  <PostCard content={post} />
                </Grid>
              ))}
            </Grid>
            <BottomAppNavigation />
          </>
        )
        }
      </PostContainer>
    </div>
  );
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Home);