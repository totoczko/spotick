import React, { Component } from 'react'
import firebase from '../helpers/firebase';
import BottomAppNavigation from '../components/BottomAppNavigation';
import Navigation from '../components/Navigation';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button, TextField } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { red } from '@material-ui/core/colors';
import { auth } from '../helpers/firebase';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'hidden',
    background: '#fdfdfd',
    minHeight: '-webkit-fill-available'
  },
  panel: {
    margin: '15px 0 !important',
    boxShadow: 'none',
    borderBottom: '1px solid #eee !important',
    borderTop: '1px solid #eee !important'
  },
  panelButton: {
    margin: '0 !important',
    boxShadow: 'none',
    borderBottom: '1px solid #eee !important',
    borderTop: '1px solid #eee !important',
    width: '100%',
    textAlign: 'left',
    padding: '12px 24px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    fontWeight: 'normal',
    color: red[500],

  },
  heading: {
    flexBasis: '40%',
    flexShrink: 0,
  },
  secondaryHeading: {
    color: theme.palette.text.secondary,
  },
  textField: {
    margin: 0,
    width: '100%',
    borderRadius: '4px 0 0 4px'
  },
  form: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 15
  },
  expanded: {
    width: '100%'
  },
  iconSmall: {
    color: '#212985'
  },
  button: {
    background: '#fafafa',
    border: '1px solid rgba(0, 0, 0, .2)',
    borderLeft: 0,
    borderRadius: '0 4px 4px 0'
  }
});

class Settings extends Component {
  state = {
    expanded: null,
    login: null,
    email: null,
    password: null,
    newLogin: null,
    newEmail: null,
    newPassword: null
  };

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user_data'));
    this.setState({
      login: user.displayName,
      email: user.email
    })
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleLogout = () => {
    firebase.auth().signOut().then(() => {
      localStorage.removeItem('user_data')
      window.location.reload()
    });
  }

  handleEdit = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleUpdateFirebase = (type) => {
    const userId = JSON.parse(localStorage.getItem('user_data')).uid;
    if (type === 'email') {
      firebase.database().ref('users/' + userId).update({
        email: this.state.newEmail
      })
      firebase.auth().currentUser.updateEmail(this.state.newEmail);
    } else if (type === 'login') {
      firebase.database().ref('users/' + userId).update({
        username: this.state.newLogin
      })
      firebase.auth().currentUser.updateProfile({
        displayName: this.state.newLogin
      })
      this.authFirebaseListener = auth.onAuthStateChanged((user) => {
        if (user) {
          localStorage.setItem('user_data', JSON.stringify(user));
        }
      });
    }

  };

  render() {
    const { classes } = this.props;
    const { expanded, login, email } = this.state;
    const settings = [
      {
        type: 'login',
        new: 'newLogin',
        heading: 'Login',
        placeholder: login,
        description: 'Zmień nazwę użytkownika:'
      },
      {
        type: 'email',
        new: 'newEmail',
        heading: 'Email',
        placeholder: email,
        description: 'Zmień swój adres e-mail:'
      },
      {
        type: 'password',
        new: 'newPassword',
        heading: 'Zmień hasło',
        placeholder: '',
        description: 'Zmień hasło:'
      },
      {
        type: 'push',
        heading: 'Powiadomienia',
        placeholder: 'wyłączone',
        description: 'Włącz / wyłącz powiadomienia push:'
      }
    ]
    return (
      <>
        <Navigation onlyBack={true} />
        <div className={classes.root}>
          {settings.map((setting, index) => (
            <ExpansionPanel key={index} expanded={expanded === 'panel' + (index + 1)} onChange={this.handleChange('panel' + (index + 1))} className={classes.panel}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>{setting.heading}</Typography>
                <Typography className={classes.secondaryHeading}>{setting.placeholder}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div className={classes.expanded}>
                  {setting.description}
                  <div className={classes.form}>
                    <TextField
                      id={`outlined-name-${index}`}
                      label={setting.heading}
                      className={classes.textField}
                      onChange={this.handleEdit(setting.new)}
                      margin="normal"
                      variant="outlined"
                      type={setting.type === 'password' ? 'password' : 'text'}
                    />
                    <Button className={classes.button} onClick={() => this.handleUpdateFirebase(setting.type)}><SaveIcon className={classes.iconSmall} /></Button>
                  </div>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
          <Button className={classes.panelButton} onClick={() => this.handleLogout()}>Wyloguj się</Button>
        </div>
        <BottomAppNavigation />
      </>
    )
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);