import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import firebase from '../helpers/firebase';
import uuid from 'uuid';
import { dataURItoBlob } from '../helpers/imageFiles';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Button, CircularProgress } from '@material-ui/core';
import * as classNames from 'classnames';
import CapturePhoto from '../components/CapturePhoto';
import AddInfo from '../components/AddInfo';
import BottomAppNavigation from '../components/BottomAppNavigation';
import Navigation from '../components/Navigation';
import AddFile from '../components/AddFile';
import webpush from 'web-push';

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: 0,
    marginRight: 0,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    }
  },
  container: {
    padding: 40,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 500,
      marginLeft: 'auto',
      marginRight: 'auto',
    }
  },
  form: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  textField: {
    width: '100%'
  },
  button: {
    width: '100%',
    marginTop: 15,
    height: 50
  },
  center: {
    width: '100%',
    height: '100vh',
    position: 'absolute',
    left: 0,
    top: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(255,255,255,.5)',
    zIndex: 1
  }
});

class AddPost extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      imageId: '',
      id: '',
      user: null,
      data: '',
      img: '',
      geo: '',
      shortText: '',
      longText: '',
      step: 2,
      imgSent: false,
      camera: false,
      loaded: 'beforeSend',
      subscriptions: []
    }
  }

  getCity(lat, long) {
    return fetch("https://us1.locationiq.com/v1/reverse.php?key=2c35b6ae22579a&lat=" + lat + "&lon=" + long + "&format=json", {
      "async": true,
      "crossDomain": true,
      "method": "GET"
    }).then(res => res.json()).then(res => {
      return res.address.city || res.address.town;
    })
  }

  componentDidMount() {
    const { user } = this.props;

    //check if there is navigation, if there is, autofill locatization
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.getCity(position.coords.latitude, position.coords.longitude)
            .then(city => {
              this.setState({
                geo: city
              })
            })
        },
        (err) => {
          console.log(err);
        }
      )
    }

    //check if we have access to the camera
    if ('mediaDevices' in navigator) {
      if ('getUserMedia' in navigator.mediaDevices) {
        this.setState({
          camera: true,
          step: 1
        })
      }
    }

    if (user) {
      let color = '';
      this.usersRef = firebase.database().ref('users/' + user.uid);
      this.usersRef.on('value', (snapshot) => {
        color = snapshot.val().color;
        if (color) {
          this.setState({
            user: {
              id: user.uid,
              name: user.displayName,
              color: color
            }
          })
        }
      });
    }
    this.getSubscriptions();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.setState({
        user: {
          id: nextProps.user.uid,
          name: nextProps.user.displayName
        }
      })
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleAddFile = event => {
    this.setState({
      img: event.target.files[0],
      imgSent: true
    });
  };

  handleSend = () => {
    //add photo 
    const { user, img, geo, shortText, subscriptions } = this.state;
    this.setState({ loaded: false })
    const imageId = uuid();
    const id = uuid();
    const storage = firebase.storage();
    const imgRef = storage.ref().child('images').child(imageId);
    const today = new Date().getTime();

    imgRef.put(img).then(() => {
      imgRef.getDownloadURL()
        .then((url) => {
          //add content
          const itemsRef = firebase.database().ref('posts/' + id);
          const item = {
            id: id,
            imageid: imageId,
            user: user,
            data: today,
            img: url,
            geo: geo,
            shortText: shortText,
            likes: {
              count: 0
            }
          }

          itemsRef.set(item).then(() => {
            fetch("https://us-central1-spot-pwa.cloudfunctions.net/sendNotifications", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
              },
              body: JSON.stringify({
                from: user,
                subscriptions: subscriptions
              })
            })
          });

          this.setState({
            id: '',
            imageId: '',
            data: '',
            img: '',
            geo: '',
            shortText: '',
            loaded: true
          });
          this.props.history.goBack()
        })
      return true
    }).catch((err) => {
      this.setState({ loaded: true })
      console.log(err)
    });
  }

  sendNotifications = () => {
    webpush.setVapidDetails(
      'mailto:test@test.pl',
      'BCpge7IV7kIBHpMQ1ahqFVC0TzobN3sqkN_C5hk3LTrU5ytxj4o2ozTA_vxU-ZHZW8HW0Ldw9JJPfLX6hg-lPkA',
      '52hq0m6auAORzXwI46Os-a6wyxvKtH5B2-IkVfXn2JE');
    const { subscriptions } = this.state;
    subscriptions.forEach((sub) => {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.keys.auth,
          p256dh: sub.keys.p256dh
        }
      }
      webpush.sendNotification(pushConfig, JSON.stringify({
        title: 'Nowy post na Spotick!',
        constent: 'Ktoś wrzucił nowe zdjęcie, zobacz jakie!'
      }));
    })
  }

  getSubscriptions = () => {
    this.usersRef = firebase.database().ref('users');
    const subscriptions = [];
    this.usersRef.on('value', (snapshot) => {
      snapshot.forEach((child) => {
        if (child.val().subscription) {
          subscriptions.push(child.val().subscription);
        }
      })
      this.setState({ subscriptions });
    });
  }

  handleSwitch = (step) => () => {
    this.setState({
      step,
      imgSent: false
    })
  }

  captureImage = (canvas, video) => {
    const context = canvas.getContext('2d');
    const width = canvas.width;
    context.drawImage(video, 0, 0, width, canvas.height);
    video.srcObject.getVideoTracks().forEach(track => {
      track.stop()
    })
    const img = dataURItoBlob(canvas.toDataURL('image/jpeg', 0.5))
    this.setState({
      imgSent: true,
      img
    })
  }

  renderStep = (step) => {
    const { classes } = this.props;
    const { imgSent, camera, shortText, geo } = this.state;
    const values = { shortText, geo };
    switch (step) {
      case 1:
        return <CapturePhoto captureImage={this.captureImage} imgSent={imgSent} camera={camera} />
      case 2:
        return (
          <AddFile handleAddFile={this.handleAddFile} />
        )
      case 3:
        return (
          <div className={classes.container}>
            <AddInfo handleChange={this.handleChange} values={values} />
            <Button variant="contained" color="primary" className={classes.button} onClick={this.handleSend}>Opublikuj</Button>
          </div>
        )
      default:
        return <CapturePhoto captureImage={this.captureImage} imgSent={imgSent} camera={camera} />
    }
  }

  render() {
    const { classes } = this.props;
    const { step, imgSent, camera, loaded } = this.state;
    return (
      <>
        <Navigation handleSwitch={this.handleSwitch} imgSent={imgSent} step={step} />
        <div className={classNames(classes.layout, classes.cardGrid)}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <form noValidate autoComplete="off">
                {this.renderStep(step)}
              </form>
            </Grid>
          </Grid>
        </div>
        {!loaded ? (
          <div className={classes.center}>
            <CircularProgress className={classes.progress} size={30} thickness={5} />
          </div>
        ) : ''}
        <BottomAppNavigation handleSwitch={this.handleSwitch} step={step} camera={camera} />
      </>
    )
  }
}

AddPost.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddPost);