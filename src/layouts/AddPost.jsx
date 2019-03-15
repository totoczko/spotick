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
    padding: 40
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
      postId: '',
      user: null,
      data: '',
      img: '',
      geo: '',
      shortText: '',
      longText: '',
      step: 2,
      imgSent: false,
      camera: false,
      status: 'beforeSend'
    }
  }

  getCity(lat, long) {
    return fetch("https://us1.locationiq.com/v1/reverse.php?key=2c35b6ae22579a&lat=" + lat + "&lon=" + long + "&format=json", {
      "async": true,
      "crossDomain": true,
      "method": "GET"
    }).then(res => res.json()).then(res => {
      if (res.address.city) {
        return res.address.city;
      } else {
        return res.address.town
      }
    })
  }

  componentDidMount() {
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

    if (this.props.user) {
      this.setState({
        user: {
          id: this.props.user.uid,
          name: this.props.user.displayName
        }
      })
    }
  }

  componentWillUpdate(nextProps, nextState) {
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
    this.setState({ status: 'loading' })
    const imageId = uuid();
    const postId = uuid();
    const storage = firebase.storage();
    const imgRef = storage.ref().child('images').child(imageId);
    let today = new Date();
    today = today.getTime()
    imgRef.put(this.state.img).then(() => {
      imgRef.getDownloadURL().then((url) => {
        //add content
        const itemsRef = firebase.database().ref('posts/' + postId);
        const item = {
          postId: postId,
          imageid: imageId,
          user: this.state.user,
          data: today,
          img: url,
          geo: this.state.geo,
          shortText: this.state.shortText,
          likes: {
            count: 0
          }
        }
        itemsRef.set(item);
        this.setState({
          postId: '',
          imageId: '',
          data: '',
          img: '',
          geo: '',
          shortText: '',
        });
        this.setState({ status: 'loaded' })
        this.props.history.goBack()
      })
    }).catch((err) => {
      this.setState({ status: 'loaded' })
      console.log(err)
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
    // const height = video.videoHeight / (video.videoWidth / canvas.width);
    context.drawImage(video, 0, 0, width, canvas.height);
    video.srcObject.getVideoTracks().forEach(track => {
      track.stop()
    })
    const img = dataURItoBlob(canvas.toDataURL())
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
          <div className={classes.container}>
            <AddFile handleAddFile={this.handleAddFile} />
          </div>
        )
      case 3:
        return (
          <div className={classes.container}>
            <AddInfo handleChange={this.handleChange} values={values} />
            <Button variant="contained" color="primary" className={classes.button} onClick={() => this.handleSend()}>Opublikuj</Button>
          </div>
        )
      default:
        return <CapturePhoto captureImage={this.captureImage} imgSent={imgSent} camera={camera} />
    }
  }

  render() {
    const { classes } = this.props;
    const { step, imgSent, camera, status } = this.state;
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
        {status === 'loading' ? (
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