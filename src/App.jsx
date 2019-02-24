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
import Redirect from 'react-router-dom/Redirect';
import { auth } from './helpers/firebase';
import Post from './layouts/Post';

const styles = {
  container: {
    marginTop: 50,
    marginBottom: 50
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: localStorage.getItem('user_data') ? localStorage.getItem('user_data') : null
    }
  }

  componentDidMount() {
    // TODO: przeniesc przy cache
    this.authFirebaseListener = auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user })
        localStorage.setItem('user_data', JSON.stringify(user));
      }
    });
  }

  componentWillUnmount() {
    this.authFirebaseListener && this.authFirebaseListener()
  }

  render() {
    const { classes } = this.props;
    const { user } = this.state;
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={props =>
          user ? (
            <Component {...props} />
          ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: props.location }
                }}
              />
            )
        }
      />
    );
    const PostsContainer = ({ match }) => (
      <Post id={match.params.id} />
    );

    return (
      <Router>
        <ScrollToTop>
          <div className={classes.container}>
            <Route exact path="/" component={Home} />
            <Route exact path="/post/:id" component={PostsContainer} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <PrivateRoute exact path="/add" component={AddPost} />
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