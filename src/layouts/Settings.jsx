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
import { Button, TextField, Divider, ExpansionPanelActions } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { auth } from '../helpers/firebase';
import classnames from 'classnames';
import PushToggle from '../components/PushToggle';

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
    boxShadow: 'none',
    borderBottom: '1px solid #eee !important',
    borderTop: '1px solid #eee !important',
    width: '100%',
    textAlign: 'left',
    padding: '15px 24px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    fontWeight: 'normal',
    marginBottom: 15,
    background: '#fff'
  },
  red: {
    color: red[500]
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
    user: null,
    expanded: null,
    login: null,
    email: null,
    password: null,
    newLogin: null,
    newEmail: null,
    newPassword: null,
    push: false
  };

  componentDidMount() {
    this.authFirebaseListener = auth.onAuthStateChanged((user) => {
      this.setState({
        user,
        login: user.displayName,
        email: user.email
      })
      this.getUserSubscription(user.uid)
    });
  }

  componentWillUnmount() {
    this.authFirebaseListener && this.authFirebaseListener()
  }

  getUserSubscription = (userId) => {
    this.userRef = firebase.database().ref('users/' + userId);
    this.userRef.on('value', (snapshot) => {
      const subscription = snapshot.val().subscription;
      const push = snapshot.val().push;
      this.setState({ push, subscription })
    });
  }


  toggleExpand = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleLogout = () => {
    firebase.auth().signOut().then(() => {
      window.location.reload()
    });
  }

  handleEdit = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleUpdateFirebase = (type) => {
    const { user } = this.state;
    if (type === 'email') {
      firebase.database().ref('users/' + user.uid).update({ email: this.state.newEmail })
      firebase.auth().currentUser.updateEmail(this.state.newEmail);
    } else if (type === 'login') {
      firebase.database().ref('users/' + user.uid).update({ username: this.state.newLogin })
      firebase.auth().currentUser.updateProfile({ displayName: this.state.newLogin })
    }
    this.setState({
      expanded: null
    })
  };

  render() {
    const { classes } = this.props;
    const { expanded, login, email, push, user } = this.state;
    const settings = [
      {
        type: 'login',
        new: 'newLogin',
        heading: 'Login',
        placeholder: login,
        description: 'Zmień nazwę użytkownika:',
        show: true
      },
      {
        type: 'email',
        new: 'newEmail',
        heading: 'Email',
        placeholder: email,
        description: 'Zmień swój adres e-mail:',
        show: true
      },
      {
        type: 'password',
        new: 'newPassword',
        heading: 'Zmień hasło',
        placeholder: '',
        description: 'Zmień hasło:',
        show: true
      },
      {
        type: 'push',
        heading: 'Powiadomienia',
        placeholder: push ? 'włączone' : 'wyłączone',
        description: 'Włącz / wyłącz powiadomienia push:',
        show: 'Notification' in window ? true : false
      }
    ]
    return (
      <>
        <Navigation onlyBack={true} />
        <div className={classes.root}>
          {settings.map((setting, index) =>
            setting.show === true ? (
              <ExpansionPanel key={index} expanded={expanded === 'panel' + (index + 1)} onChange={this.toggleExpand('panel' + (index + 1))} className={classes.panel}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>{setting.heading}</Typography>
                  <Typography className={classes.secondaryHeading}>{setting.placeholder}</Typography>
                </ExpansionPanelSummary>
                {setting.type === 'push' ? (
                  <ExpansionPanelDetails>
                    <div className={classes.expanded}>
                      <Typography className={classes.secondaryHeading}>{setting.description}</Typography>
                      <div className={classes.form}>
                        <PushToggle push={push} user={user} />
                      </div>
                    </div>
                  </ExpansionPanelDetails>
                ) : (
                    <div>
                      <ExpansionPanelDetails>
                        <div className={classes.expanded}>
                          <Typography className={classes.secondaryHeading}>{setting.description}</Typography>
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
                          </div>
                        </div>
                      </ExpansionPanelDetails>
                      <Divider />
                      <ExpansionPanelActions>
                        <Button size="small" onClick={this.toggleExpand('panel' + (index + 1))}>Anuluj</Button>
                        <Button size="small" color="primary" onClick={() => this.handleUpdateFirebase(setting.type)}>Zapisz</Button>
                      </ExpansionPanelActions>
                    </div>
                  )}
              </ExpansionPanel>
            ) : ''
          )}
          <Button className={classnames(classes.panelButton, classes.red)} onClick={() => this.handleLogout()}>Wyloguj się</Button>
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