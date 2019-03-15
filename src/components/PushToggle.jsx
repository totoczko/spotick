import React, { Component } from 'react'
import { FormGroup, FormControlLabel, Switch } from '@material-ui/core';
import urlBase64ToUint8Array from '../helpers/urlBaseToUint';
import firebase from '../helpers/firebase';
import { auth } from '../helpers/firebase';

export default class PushToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      push: false,
      subscription: null
    }
  }

  componentDidMount() {
    this.authFirebaseListener = auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user })
        this.getUserSubscription(user.uid)
      }
    });
  }

  componentWillUnmount() {
    this.authFirebaseListener && this.authFirebaseListener()
  }


  handleToggle = name => event => {
    this.setState({ [name]: event.target.checked });
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
          } else {
            //we have sub
            console.log('we have sub')
          }
          return sub;
        })
        .then((newSub) => {
          this.setState({
            subscription: JSON.stringify(newSub)
          })
          return this.handleUpdateFirebase('subscription')
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  askForNotificationPermission = () => {
    Notification.requestPermission((result) => {
      console.log(result);
      if (result !== 'granted') {
      } else {
        this.configurePushSubscription();
      }
    })
  }

  displayConfirmNotification = () => {
    if ('serviceWorker' in navigator) {
      const options = {
        body: 'lorem ipsum',
        icon: 'img/icons/icon-96x96.png',
        vibrate: [100, 50, 200],
        badge: 'img/icons/icon-96x96.png',
        tag: 'confirm-notification',
        renotify: true,
        actions: [
          {
            action: 'confrim',
            title: 'Ok',
            icon: 'img/icons/icon-96x96.png'
          },
          {
            action: 'cancel',
            title: 'Cancel',
            icon: 'img/icons/icon-96x96.png'
          }
        ]
      }
      navigator.serviceWorker.ready.then((swreg) => {
        swreg.showNotification('Succesfully subscribed!', options);
      })
    }
  }

  getUserSubscription = (userId) => {
    this.userRef = firebase.database().ref('users/' + userId + '/subscription');
    let subscription;

    this.userRef.on('value', (snapshot) => {
      subscription = snapshot.val();
      this.setState({ push: true, subscription })
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
      }, (error) => {
        if (!error) {
          this.displayConfirmNotification();
        }
      })
    }
    this.setState({
      expanded: null
    })
  };


  render() {
    const { push } = this.props;
    return (
      <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              checked={push}
              onChange={this.handleToggle('push')}
              value={!push}
            />
          }
          label={push ? 'włączone' : 'wyłączone'}
        />
      </FormGroup>
    )
  }
}
