import React, { Component } from 'react'
import {
  HashRouter,
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
import { auth } from './helpers/firebase';
import Post from './layouts/Post';
import Settings from './layouts/Settings';
import PrivateRoute from './components/PrivateRoute'
import Loading from './components/Loading';

const styles = theme => ({
  container: {
    paddingTop: 50,
    paddingBottom: 50,
    minHeight: '100vh',
    boxSizing: 'border-box',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 80,
    },
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLogged: false,
      loading: true,
      auth: null
    }
  }

  componentDidMount() {
    this.authFirebaseListener = auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then((token) => {
          this.setState({ user, isLogged: true, auth: token, loading: false })
        });
      }
    });
  }

  componentWillUnmount() {
    this.authFirebaseListener && this.authFirebaseListener() // Unlisten it by calling it as a function
  }

  getAppContent = () => {
    const { user, isLogged, loading, auth } = this.state;
    const { classes } = this.props;
    return (
      loading ? (
        <Loading />
      ) : (
          <div className={classes.container}>
            <ScrollToTop />
            <Route auth={auth} exact path="/" component={Home} />
            <Route exact path="/post/:id" component={({ match }) => <Post id={match.params.id} user={user} />} />
            <PrivateRoute isLogged={isLogged} exact path="/profile" component={Profile} user={user} />
            <PrivateRoute isLogged={isLogged} exact path="/add" component={AddPost} user={user} />
            <PrivateRoute isLogged={isLogged} exact path="/settings" component={Settings} user={user} />
            <Route exact path="/login" component={Login} />
          </div>
        )
    )
  }

  render() {
    return (
      <HashRouter basename={process.env.PUBLIC_URL}>
        {this.getAppContent()}
      </HashRouter>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);