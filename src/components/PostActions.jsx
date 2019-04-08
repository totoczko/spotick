import React, { Component } from 'react'
import PropTypes from 'prop-types';
import firebase from '../helpers/firebase';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import { colors } from '../helpers/colors';

const styles = theme => ({
  action: {
    textAlign: 'center',
    padding: 0,
    minWidth: 200
  },
  actionList: {
    padding: 0
  },
  border: {
    borderBottom: '1px solid ' + colors.border
  }
});

class PostActions extends Component {
  handleDelete = (id) => () => {
    window.history.go(-1)
    firebase.database().ref('posts/' + id).remove();
  }

  render() {
    const { classes, onClose, selectedValue, id, ...other } = this.props;

    return (
      <Dialog onClose={() => onClose()} aria-labelledby="simple-dialog-title" {...other}>
        <div>
          <List className={classes.actionList}>
            <ListItem button className={classes.border} onClick={this.handleDelete(id)}>
              <ListItemText primary="Usuń" className={classes.action} />
            </ListItem>
            <ListItem button onClick={onClose}>
              <ListItemText primary="Anuluj" className={classes.action} />
            </ListItem>
          </List>
        </div>
      </Dialog>
    )
  }
}

PostActions.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
  id: PropTypes.string.isRequired
};


export default withStyles(styles)(PostActions);
