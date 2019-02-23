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
    width: 80,
    justifyContent: 'space-between'
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

  render() {
    const { classes, content } = this.props;
    const { expanded } = this.state;
    const { user, data, img, geo, shortText, longText, likes } = content;
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
          <IconButton
            aria-label="Polajkuj"
            className={classes.likes}
          >
            <FavoriteIcon />
            {likes}
          </IconButton>
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
