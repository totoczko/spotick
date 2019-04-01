import React, { Component } from 'react'
import {
  BrowserRouter,
  Route
} from 'react-router-dom';
// import firebase from './helpers/firebase';
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

//    "start": "npm run build && http-server ./build",

const styles = {
  container: {
    paddingTop: 50,
    paddingBottom: 50,
    minHeight: '100vh',
    boxSizing: 'border-box'
  }
};

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
        const idToken = user.getIdToken().then((token) => {
          this.setState({ auth: token })
        });
        this.setState({ user, isLogged: true, auth: idToken })
      }
      this.setState({ loading: false })
    });
  }

  componentWillUnmount() {
    this.authFirebaseListener && this.authFirebaseListener()
  }

  getAppContent = () => {
    const { user, isLogged, loading, auth } = this.state;
    const { classes } = this.props;
    let appState = loading ? 0 : (isLogged ? 1 : 2);
    switch (appState) {
      case 0:
        return <Loading />
      case 1:
        return (
          <div className={classes.container}>
            <Route auth={auth} exact path="/" component={Home} />
            <Route exact path="/post/:id" component={({ match }) => <Post id={match.params.id} user={user} />} />
            <PrivateRoute isLogged={isLogged} exact path="/profile" component={Profile} user={user} />
            <PrivateRoute isLogged={isLogged} exact path="/add" component={AddPost} user={user} />
            <PrivateRoute isLogged={isLogged} exact path="/settings" component={Settings} user={user} />
            <Route exact path="/login" component={Login} />
          </div>
        )
      case 2:
        return (
          <div className={classes.container}>
            <Route exact path="/" component={Home} />
            <Route exact path="/post/:id" component={({ match }) => <Post id={match.params.id} />} />
            <Route exact path="/profile" component={Login} />
            <Route exact path="/add" component={Login} />
            <Route exact path="/settings" component={Login} />
            <Route exact path="/login" component={Login} />
          </div>
        )
      default:
        return <Loading />
    }
  }

  render() {
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <ScrollToTop>
          {this.getAppContent()}
        </ScrollToTop>
      </BrowserRouter>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);