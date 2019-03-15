import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import red from '@material-ui/core/colors/red';
import { Typography, CircularProgress, GridListTile, GridList } from '@material-ui/core';
import BottomAppNavigation from 'components/BottomAppNavigation';
import Navigation from 'components/Navigation';
import UserPostsContainer from '../containers/UserPostsContainer';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

const styles = theme => ({
  profile: {
    maxWidth: 400,
    borderRadius: 0,
    boxShadow: 'none'
  },
  avatar: {
    backgroundColor: red[500],
  },
  heading: {
    lineHeight: '1em',
    color: '#999',
    marginBottom: 5,
    marginTop: 15
  },
  counter: {
    lineHeight: '1em',
    marginBottom: 15
  },
  gridList: {
    margin: '0 !important'
  },
  postCounter: {
    border: '1px solid #eee',
    textAlign: 'center'
  },
  postCounterButton: {
    width: '50%',
    borderRight: '1px solid #eee',
    display: 'inline-block',
    boxSizing: 'border-box'
  },
  buttonActive: {
    background: '#fafafa'
  },
  center: {
    width: '100% !important',
    height: '100vh !important',
    zIndex: -1,
    position: 'absolute',
    left: 0,
    top: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridImg: {
    objectFit: 'cover',
    width: '100%',
    height: '100%'
  }
});

class Profile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      view: 'posts'
    }
  }

  switchView = (view) => {
    this.setState({ view })
  }

  renderPostsCounter(count, count_likes) {
    const { classes } = this.props;
    const { view } = this.state;
    const count_num = count.length === 0 ? 0 : count;
    const count_likes_num = count_likes.length === 0 ? 0 : count_likes;
    return (
      <div className={classes.postCounter}>
        <div className={classnames(classes.postCounterButton, view === 'posts' ? classes.buttonActive : '')} onClick={() => this.switchView('posts')}>
          <Typography variant="overline" className={classes.heading}>Moje posty</Typography>
          <Typography variant="overline" className={classes.counter}>{count_num}</Typography>
        </div>
        <div className={classnames(classes.postCounterButton, view === 'likes' ? classes.buttonActive : '')} onClick={() => this.switchView('likes')}>
          <Typography variant="overline" className={classes.heading}>Polubione</Typography>
          <Typography variant="overline" className={classes.counter}>{count_likes_num}</Typography>
        </div>
      </div >
    )
  }

  render() {
    const { view } = this.state;
    const { classes, user } = this.props;
    const renderList = (listType) => {
      return (
        <GridList spacing={0} className={classes.gridList}>
          {listType.length > 0 ?
            listType.map((post, index) => (
              <GridListTile cols={1} key={index} className={classes.gridListTile}>
                <Link to={'/post/' + post.postId}>
                  <img src={post.img} alt={post.shortText} className={classes.gridImg} />
                </Link>
              </GridListTile>
            )) : (
              <div className={classes.center}>
                <Typography variant="subheading">
                  Brak postów do wyświetlenia
						 </Typography>
              </div>
            )}
        </GridList>
      )
    }
    return (
      <>
        <Navigation />
        <Card className={classes.profile}>
          <CardHeader
            avatar={
              <Avatar className={classes.avatar}>{user ? user.displayName[0].toUpperCase() : ''}</Avatar>
            }
            title={user ? user.displayName : ''}
            subheader={user ? user.email : ''}
          />
        </Card>
        <UserPostsContainer user={user}>
          {(posts, likes, status) => {
            if (status === 'loading') {
              return (
                <>
                  {this.renderPostsCounter(0, 0)}
                  <div className={classes.center}>
                    <CircularProgress className={classes.progress} size={30} thickness={5} />
                  </div>
                </>
              )
            }
            return (
              <>
                {this.renderPostsCounter(posts.length, likes.length)}
                {view === 'posts' ? renderList(posts) : renderList(likes)}
              </>
            )
          }
          }
        </UserPostsContainer>
        <BottomAppNavigation />
      </>
    )
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);