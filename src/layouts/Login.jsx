import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { auth } from 'helpers/firebase.js';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Navigation from 'components/Navigation';
import BottomAppNavigation from 'components/BottomAppNavigation';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  typeLink: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center'
  }
});

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: '',
      user: null,
      type: 'login'
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  catchError = (error) => {
    let errorMessage = error.message;
    alert(errorMessage)
  }

  login = (email, password) => {
    auth.signInWithEmailAndPassword(email, password).then(() => {
      this.props.history.push('/')
    }, (error) => { this.catchError(error) })
  }

  register = (email, password) => {
    auth.createUserWithEmailAndPassword(email, password).catch((error) => { this.catchError(error) }).then(() => {
      auth.currentUser.updateProfile({
        displayName: this.state.username
      })
    });
  }

  toggleType = () => {
    this.setState(({ type }) => ({
      type: type === "login" ? "register" : "login"
    }))
  }

  componentWillUnmount() {
    this.setState({
      login: '',
      password: '',
      username: '',
      user: null
    })
  }

  // componentDidUpdate() {
  //   auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       console.log(user)
  //       this.setState({
  //         user
  //       })
  //     }
  //   });
  // }

  render() {
    const { classes } = this.props;
    const { type, login, password } = this.state;

    return (
      <main className={classes.main}>
        <Navigation />
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {type === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
          </Typography>
          <form className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input id="email" name="email" autoComplete="email" autoFocus onChange={this.handleChange('login')} />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Hasło</InputLabel>
              <Input name="password" type="password" id="password" autoComplete="current-password" onChange={this.handleChange('password')} />
            </FormControl>
            {type === 'register' ?
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Login</InputLabel>
                <Input id="username" name="username" onChange={this.handleChange('username')} />
              </FormControl>
              : ''}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => type === 'login' ? this.login(login, password) : this.register(login, password)}
            >
              {type === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
            </Button>
            <small className={classes.typeLink}>{type === 'login' ? 'Nie masz jeszcze konta?' : 'Masz już konto?'}
              <Button color="primary" className={classes.button} onClick={this.toggleType}>
                {type === 'login' ? 'Zarejestruj się' : 'Zaloguj się'}
              </Button></small>
          </form>
        </Paper>
        <BottomAppNavigation />
      </main>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);