import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Navigation from '../components/Navigation';
import BottomAppNavigation from '../components/BottomAppNavigation';
import PostContainer from '../containers/PostContainer';
import PostCard from 'components/PostCard';
import { CircularProgress } from '@material-ui/core';


const styles = theme => ({
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

class Post extends Component {
  render() {
    const { id, classes } = this.props;
    return (
      <>
        <Navigation singlePost={true} />
        <PostContainer id={id}>
          {(post) => (
            post === 'loading' ? (
              <div className={classes.center}>
                <CircularProgress className={classes.progress} size={30} thickness={5} />
              </div>
            ) : (
                <PostCard content={post} />
              )
          )}
        </PostContainer>
        <BottomAppNavigation />
      </>
    )
  }
}


Post.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Post);