import React, { Component } from 'react'
import PropTypes from 'prop-types';
import firebase from '../helpers/firebase';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { auth } from '../helpers/firebase';
import {
  withRouter
} from 'react-router-dom'
import { colors } from '../helpers/colors';


const styles = theme => ({
  likes: {
    fontSize: 12,
    color: colors.textGray
  },
  liked: {
    color: colors.red
  }
});

class LikeCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: {
        count: 0,
        users: []
      }
    }
  }

  componentDidMount() {
    this.setState({
      likes: this.props.likes
    })
  }

  handleLike = (post_id, likes) => () => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      let count_upd = likes.count;
      let users_upd = likes.users ? likes.users : [];
      const like_index = users_upd.indexOf(userId);
      if (like_index < 0) {
        count_upd++;
        users_upd.push(userId);
      } else {
        count_upd--;
        users_upd.splice(like_index, 1)
      }
      firebase.database().ref('posts/' + post_id).update({
        likes: {
          count: count_upd,
          users: users_upd
        }
      });
      this.setState({
        likes: {
          count: count_upd,
          users: users_upd
        }
      })
    } else {
      this.props.history.push('/login')
    }
  }

  render() {
    const { likes } = this.state;
    const { id, classes } = this.props;
    const user = auth.currentUser;
    const liked = user && likes.users ? likes.users.indexOf(user.uid) >= 0 : false;
    return (
      <>
        <IconButton aria-label="Polajkuj" onClick={this.handleLike(id, likes)}>
          <FavoriteIcon className={liked ? classes.liked : ''} />
        </IconButton>
        <span className={classes.likes}>{likes && likes.count}</span>
      </>
    )
  }
}

LikeCounter.propTypes = {
  classes: PropTypes.object.isRequired
};


const likeCounterWithRouter = withRouter(LikeCounter);

export default withStyles(styles)(likeCounterWithRouter);