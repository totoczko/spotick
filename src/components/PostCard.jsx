import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import PlaceIcon from '@material-ui/icons/Place';
import LikeCounter from './LikeCounter';
import { formatData } from '../helpers/formatData';

const styles = theme => ({
  card: {
    maxWidth: 400,
    borderRadius: 0,
    boxShadow: 'none'
  },
  media: {
    width: '100%'
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
      time: null
    }
  }

  componentDidMount() {
    this.setState({
      time: formatData(this.props.content.data)
    })
    this.interval = setInterval(() => this.setState({
      time: formatData(this.props.content.data)
    }), 60 * 1000);
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes, content } = this.props;
    const { time } = this.state;
    const { postId, user, img, geo, shortText, likes } = content;
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>{user && user.name[0].toUpperCase()}</Avatar>
          }
          title={user.name}
          subheader={time}
        />
        <img src={img} alt={shortText} className={classes.media} />
        <CardContent className={classes.info}>
          <div width="80%">
            <p className={classes.localization}>
              <PlaceIcon className={classes.iconGeo} />
              {geo}
            </p>
            <Typography component="p">
              {shortText}
            </Typography>
          </div>
          <div width="20%">
            <LikeCounter likes={likes} postId={postId} />
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
