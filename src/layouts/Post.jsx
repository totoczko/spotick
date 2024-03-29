import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Navigation from '../components/Navigation';
import BottomAppNavigation from '../components/BottomAppNavigation';
import PostContainer from '../containers/PostContainer';
import PostCard from 'components/PostCard';
import { CircularProgress, Typography } from '@material-ui/core';
import PostActions from '../components/PostActions';

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
  },
  layout: {
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    }
  }
});

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      selectedValue: '',
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = value => {
    this.setState({ selectedValue: value, open: false });
  };

  render() {
    const { id, classes, user } = this.props;
    return (
      <>
        <PostContainer id={id}>
          {(post, loaded) => {
            if (!loaded) {
              return (
                <>
                  <Navigation singlePost={true} />
                  <div className={classes.layout}>
                    <div className={classes.center}>
                      <CircularProgress className={classes.progress} size={30} thickness={5} />
                    </div>
                  </div>
                </>
              )
            }

            return (
              (post.user ? (
                <>
                  <Navigation singlePost={true} openActions={post.user.id === user.uid ? this.handleClickOpen : false} />
                  {post.user.id === user.uid ? (
                    <PostActions
                      selectedValue={this.state.selectedValue}
                      open={this.state.open}
                      onClose={this.handleClose}
                      id={id}
                    />
                  ) : ''}
                  <div className={classes.layout}>
                    <PostCard content={post} />
                  </div>
                </>
              ) : (
                  <>
                    <Navigation onlyBack={true} />
                    <Typography
                      variant="subheading"
                      className={classes.center}
                    >
                      Ten post nie istnieje!
                  </Typography>
                  </>
                ))
            )

          }}
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