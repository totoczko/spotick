import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import PlaceIcon from '@material-ui/icons/Place';
import LikeCounter from './LikeCounter';
import { formatData } from '../helpers/formatData';
import firebase from '../helpers/firebase';
import LazyLoad from 'react-lazyload';
import { colors } from '../helpers/colors';

const styles = theme => ({
  card: {
    maxWidth: 500,
    borderRadius: 0,
    boxShadow: 'none',
    margin: '0 auto'
  },
  media: {
    width: '100%',
    height: 380,
    objectFit: 'cover',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: 12,
      paddingRight: 12
    },
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
  localization: {
    color: colors.textGray,
    fontSize: 12,
    display: 'flex',
    alignItems: 'center'
  },
  iconGeo: {
    width: 14,
    height: 14
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between'
  }
});

class PostCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      time: null,
      color: null
    }
  }

  componentDidMount() {
    const { content } = this.props;
    const user = content.user;
    const color = this.getUserColor(user.id)
    this.setState({
      time: formatData(content.data),
      color
    })
  }

  getUserColor = (id) => {
    const userColor = this.props.content.user.color;
    if (userColor) {
      return userColor;
    } else {
      this.usersRef = firebase.database().ref('users/' + id);
      this.usersRef.on('value', (snapshot) => {
        return snapshot.val().color;
      });
    }
  }

  render() {
    const { classes, content } = this.props;
    const { time, color } = this.state;
    const { id, user, img, geo, shortText, likes } = content;
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar} style={{ backgroundColor: color }}>{user && user.name[0].toUpperCase()}</Avatar>
          }
          title={user.name}
          subheader={time}
        />
        <LazyLoad height={380}>
          <img src={img} alt={shortText} className={classes.media} />
        </LazyLoad>
        <CardContent className={classes.info}>
          <div style={{ width: '80%' }}>
            <p className={classes.localization}>
              <PlaceIcon className={classes.iconGeo} />
              {geo}
            </p>
            <Typography component="p">
              {shortText}
            </Typography>
          </div>
          <div style={{ width: '20%' }}>
            <LikeCounter likes={likes} id={id} />
          </div>
        </CardContent>
      </Card >
    );
  }
}

PostCard.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired
};

export default withStyles(styles)(PostCard);
