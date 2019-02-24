import React, { Component } from 'react'
import PropTypes from 'prop-types';
import firebase from '../helpers/firebase';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import red from '@material-ui/core/colors/red';

const styles = theme => ({
  likes: {
    fontSize: 12,
    color: '#979797'
  },
  liked: {
    color: red[500]
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

  handleLike = (post_id, user, likes) => {
    if (user) {
      let count_upd = likes.count;
      let users_upd = likes.users ? likes.users : [];
      const like_index = users_upd.indexOf(user);
      if (like_index < 0) {
        count_upd++;
        users_upd.push(user);
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
      // TODO: przekierowanie do logowania
      console.log('nope')
    }
  }

  render() {
    const { likes } = this.state;
    const { postId, classes } = this.props;
    const current_user = localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data')) : null;
    const liked = current_user && likes.users ? likes.users.indexOf(current_user.uid) >= 0 : false;
    return (
      <>
        <IconButton aria-label="Polajkuj" onClick={() => this.handleLike(postId, current_user ? current_user.uid : null, likes)}>
          <FavoriteIcon className={liked ? classes.liked : ''} />
        </IconButton>
        <span className={classes.likes}>{likes && likes.count}</span>
      </>
    )
  }
}

LikeCounter.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired
};

export default withStyles(styles)(LikeCounter);