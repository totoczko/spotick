import React from 'react';
import PropTypes from 'prop-types';
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlaceIcon from '@material-ui/icons/Place';
import classnames from 'classnames';
import LikeCounter from './LikeCounter';

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

  formatData = (data) => {
    let now = new Date();
    let formatted = new Date(data);
    let dd = formatted.getDate();
    let mm = formatted.getMonth() + 1;
    if (dd < 10) {
      dd = '0' + dd
    };
    var diff = (now.getTime() - formatted.getTime()) / 1000;
    const diff_min = Math.abs(Math.round(diff / 60));
    const pl = (num) => {
      if (num === 1) {
        return 'ę';
      } else if (num > 1 && num < 5) {
        return 'y';
      }
      return '';
    }
    let result = diff_min + ' minut' + pl(diff_min) + ' temu';
    if (diff_min >= 60 && diff_min < (60 * 24)) {
      const diff_hour = Math.abs(Math.round(diff / (60 * 60)));
      result = diff_hour + ' godzin' + pl(diff_hour) + ' temu'
    } else if (diff_min >= (60 * 24)) {
      const month = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia']
      result = dd + ' ' + month[mm]
    }
    return result
  }

  render() {
    const { classes, content } = this.props;
    const { expanded } = this.state;
    const { postId, user, data, img, geo, shortText, longText, likes } = content;
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>{user && user.name[0].toUpperCase()}</Avatar>
          }
          title={user.name}
          subheader={this.formatData(data)}
        />
        <CardMedia className={classes.media} image={img} title={shortText}
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
        <CardActions className={classes.actions} disableActionSpacing>
          <LikeCounter likes={likes} postId={postId} />
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
