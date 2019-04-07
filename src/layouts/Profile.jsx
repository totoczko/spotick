import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { Typography, CircularProgress, GridListTile, GridList } from '@material-ui/core';
import BottomAppNavigation from 'components/BottomAppNavigation';
import Navigation from 'components/Navigation';
import UserPostsContainer from '../containers/UserPostsContainer';
import classnames from 'classnames';
import firebase from '../helpers/firebase';
import { Link } from 'react-router-dom';
import { colors } from '../helpers/colors';

const styles = theme => ({
  profile: {
    borderRadius: 0,
    boxShadow: 'none',
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: 15
    }
  },
  layout: {
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  heading: {
    lineHeight: '1em',
    color: colors.textGray,
    marginBottom: 5,
    marginTop: 15
  },
  counter: {
    lineHeight: '1em',
    marginBottom: 15
  },
  gridList: {
    margin: '0 !important',
    overflow: 'visible'
  },
  postCounter: {
    border: '1px solid ' + colors.border,
    textAlign: 'center'
  },
  postCounterButton: {
    width: '50%',
    borderRight: '1px solid ' + colors.border,
    display: 'inline-block',
    boxSizing: 'border-box'
  },
  buttonActive: {
    background: colors.background
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
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  gridListTile: {
    height: 'initial !important',
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    background: colors.primary
  },
  gridListLink: {
    display: 'block',
    paddingTop: '100%'
  }
});

class Profile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      view: 'posts',
      color: null
    }
  }

  componentDidMount() {
    const { user } = this.props;
    this.getUserColor(user.uid)
  }

  switchView = (view) => () => {
    this.setState({ view })
  }

  renderPostsCounter(count, count_likes) {
    const { classes } = this.props;
    const { view } = this.state;
    const count_num = count.length === 0 ? 0 : count;
    const count_likes_num = count_likes.length === 0 ? 0 : count_likes;
    return (
      <div className={classes.postCounter}>
        <div className={classnames(classes.postCounterButton, view === 'posts' ? classes.buttonActive : '')} onClick={this.switchView('posts')}>
          <Typography variant="overline" className={classes.heading}>Moje posty</Typography>
          <Typography variant="overline" className={classes.counter}>{count_num}</Typography>
        </div>
        <div className={classnames(classes.postCounterButton, view === 'likes' ? classes.buttonActive : '')} onClick={this.switchView('likes')}>
          <Typography variant="overline" className={classes.heading}>Polubione</Typography>
          <Typography variant="overline" className={classes.counter}>{count_likes_num}</Typography>
        </div>
      </div >
    )
  }

  getUserColor = (id) => {
    this.usersRef = firebase.database().ref('users/' + id);
    this.usersRef.on('value', (snapshot) => {
      this.setState({ color: snapshot.val().color })
    });
  }

  renderList = (listType) => {
    const { classes } = this.props;
    return (
      <GridList spacing={0} className={classes.gridList}>
        {listType.length > 0 ?
          listType.map((post, index) => (
            <GridListTile
              cols={window.innerWidth > 1100 ? .6666 : 1}
              key={index}
              className={classes.gridListTile}>
              <Link
                to={'/post/' + post.id}
                className={classes.gridListLink}>
                <img src={post.img} alt={post.shortText} className={classes.gridImg} />
              </Link>
            </GridListTile>
          )) : (
            <div className={classes.center}>
              <Typography variant="subheading">
                Brak postów do wyświetlenia
           </Typography>
            </div>
          )
        }
      </GridList >
    )
  }

  render() {
    const { view, color } = this.state;
    const { classes, user } = this.props;

    return (
      <>
        <Navigation />
        <Card className={classes.profile}>
          <CardHeader
            avatar={
              <Avatar className={classes.avatar} style={{ backgroundColor: color }}>{user.displayName ? user.displayName[0].toUpperCase() : ''}</Avatar>
            }
            title={user ? user.displayName : ''}
            subheader={user ? user.email : ''}
          />
        </Card>
        <div className={classes.layout}>
          <UserPostsContainer user={user}>
            {(posts, likes, loaded) => {
              if (!loaded) {
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
                  {view === 'posts' ? this.renderList(posts) : this.renderList(likes)}
                </>
              )
            }
            }
          </UserPostsContainer>
        </div>
        <BottomAppNavigation />
      </>
    )
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);