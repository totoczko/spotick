import React from 'react';
import PropTypes from 'prop-types';
import firebase from '../helpers/firebase';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlaceIcon from '@material-ui/icons/Place';
import classnames from 'classnames';

const styles = theme => ({
  card: {
    maxWidth: 400,
    borderRadius: 0,
    boxShadow: 'none'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex'
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  localization: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center'
  },
  iconGeo: {
    width: 14,
    height: 14
  },
  likes: {
    fontSize: 12,
  },
  liked: {
    color: 'red'
  }
});



class PostCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleLike = (post_id, user, likes) => {
    let count_upd = likes.count;
    let users_upd = likes.users ? likes.users : [];
    const like_index = users_upd.indexOf(user);
    if (like_index) {
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
  }

  render() {
    const { classes, content } = this.props;
    const { expanded } = this.state;
    const { postId, user, data, img, geo, shortText, longText, likes } = content;
    const current_user = JSON.parse(localStorage.getItem('user_data')).uid;
    const liked = likes.users ? likes.users.indexOf(current_user) >= 0 : false;
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar
              aria-label="Recipe"
              className={classes.avatar}>{user.name[0].toUpperCase()}
            </Avatar>
          }
          title={user.name}
          subheader={data}
        />
        <CardMedia
          className={classes.media}
          image={img}
          title={shortText}
        />
        <CardContent>
          <p className={classes.localization}>
            <PlaceIcon className={classes.iconGeo} />
            {geo}
          </p>
          <Typography component="p">
            {shortText}
          </Typography>
        </CardContent>
        <CardActions
          className={classes.actions}
          disableActionSpacing
        >
          <IconButton aria-label="Polajkuj" onClick={() => this.handleLike(postId, current_user, likes)}>
            <FavoriteIcon className={liked ? classes.liked : ''} />
          </IconButton>
          <span className={classes.likes}>{likes.count !== undefined ? likes.count : 2}</span>
          <IconButton aria-label="Udostępnij">
            <ShareIcon />
          </IconButton>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={expanded}
            aria-label="Pokaż więcej"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>
              {longText}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

PostCard.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired
};

export default withStyles(styles)(PostCard);
