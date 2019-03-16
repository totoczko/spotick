import React, { Component } from 'react'
import { FormGroup, FormControlLabel, Switch, ExpansionPanelDetails, Typography, withStyles } from '@material-ui/core';
import urlBase64ToUint8Array from '../helpers/urlBaseToUint';
import firebase from '../helpers/firebase';

const styles = theme => ({
  pushToggle: {
    marginTop: 15,
    marginBottom: 15,
    background: '#fff',
    borderBottom: '1px solid #eee !important',
    borderTop: '1px solid #eee !important',
    paddingBottom: 10
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
  secondaryHeading: {
    width: '50%',
    float: 'left',
    padding: '15px 0'
  },
  form: {
    width: '50%',
    float: 'right',
    textAlign: 'right'
  }
});

class PushToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      push: false,
      subscription: false
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.user !== this.props.user) {
      this.setState({
        user: nextProps.user
      })
      this.getUserSubscription(nextProps.user.uid)
    }
  }

  handleToggle = () => {
    const currentPush = this.state.push;
    this.setState({ push: !currentPush });
    if (currentPush === false) {
      this.askForNotificationPermission()
    } else {
      this.disableNotifications();
    }
  };

  configurePushSubscription = () => {
    //check if this SW handled through this browser have suscription for this device?
    if (!('serviceWorker' in navigator)) {
      return;
    } else {
      let reg;
      navigator.serviceWorker.ready
        .then((swreg) => {
          reg = swreg;
          return swreg.pushManager.getSubscription();
        })
        .then((sub) => {
          if (sub === null) {
            //simmple subscribe() is not safe - anyone can do this, we need to protect our fb endpoint
            //we will ude VAPID keys with WebPush - it runs on our server so is not visible to users
            const vapidPublicKey = 'BAA_oo8pDlWeI_WxsmFIPu3nA5YwzwLHbmrND2aIv20WRylRYiO-uvslTvIErcoeuAIYb7TtpKQRWGU4RrrYnhw';
            const convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
            reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapidPublicKey
            });
          }
          return sub;
        })
        .then((newSub) => {
          this.setState({
            subscription: JSON.stringify(newSub)
          }, () => {
            this.handleUpdateFirebase('push')
            this.handleUpdateFirebase('subscription')
            this.displayConfirmNotification()
          })
          return true
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  askForNotificationPermission = () => {
    Notification.requestPermission((result) => {
      if (result !== 'granted') {
      } else {
        this.configurePushSubscription();
      }
    })
  }

  disableNotifications = () => {
    this.setState({
      push: false,
      subscription: false
    }, () => {
      this.handleUpdateFirebase('push')
      this.handleUpdateFirebase('subscription')
    })
  }

  displayConfirmNotification = () => {
    if ('serviceWorker' in navigator) {
      const options = {
        body: 'Od teraz będziesz otrzymywać powiadomienie gdy ktoś doda nowy post :)',
        icon: 'img/icons/icon-96x96.png',
        vibrate: [100, 50, 200],
        badge: 'img/icons/icon-96x96.png',
        tag: 'confirm-notification',
        renotify: false,
        actions: [
          {
            action: 'confrim',
            title: 'OK'
          }
        ]
      }
      navigator.serviceWorker.ready.then((swreg) => {
        swreg.showNotification('Włączono powiadomienia!', options);
      })
    }
  }

  getUserSubscription = (userId) => {
    this.userRef = firebase.database().ref('users/' + userId);

    this.userRef.on('value', (snapshot) => {
      const subscription = snapshot.val().subscription;
      const push = snapshot.val().push;
      this.setState({ push, subscription })
    });
  }

  handleUpdateFirebase = (type) => {
    const userId = this.state.user.uid;
    if (type === 'push') {
      firebase.database().ref('users/' + userId).update({
        push: this.state.push
      })
    } else if (type === 'subscription') {
      firebase.database().ref('users/' + userId).update({
        subscription: this.state.subscription
      })
    }
  };


  render() {
    const { push } = this.state;
    const { classes } = this.props;
    return (
      <ExpansionPanelDetails className={classes.pushToggle}>
        <div className={classes.expanded}>
          <Typography className={classes.secondaryHeading}>Powiadomienia</Typography>
          <div className={classes.form}>
            <Switch
              checked={push}
              onChange={() => this.handleToggle()}
              value={!push}
            />
          </div>
        </div>
      </ExpansionPanelDetails>
    )
  }
}


export default withStyles(styles)(PushToggle);