import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Home from 'layouts/Home';
import Profile from 'layouts/Profile';
import AddPost from 'layouts/AddPost';
import ScrollToTop from 'components/ScrollToTop';
import Login from 'layouts/Login';
import './App.css';

const styles = {
  container: {
    marginTop: 50,
    marginBottom: 50
  }
};

class App extends Component {
  render() {
    const { classes } = this.props
    return (
      <Router>
        <ScrollToTop>
          <div className={classes.container}>
            <Route exact path="/" component={Home} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/add" component={AddPost} />
            <Route exact path="/login" component={Login} />
          </div>
        </ScrollToTop>
      </Router>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);