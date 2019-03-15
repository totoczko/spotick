import React, { Component } from 'react'
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  center: {
    width: '100%',
    height: '100vh',
    position: 'absolute',
    left: 0,
    top: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#fafafa',
    zIndex: 1
  }
});

class Loading extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.center}>
        <img src="img/icons/icon-144x144.png" alt="" />
      </div>
    )
  }
}

export default withStyles(styles)(Loading);