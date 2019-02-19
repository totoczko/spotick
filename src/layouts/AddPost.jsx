import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import firebase from '../helpers/firebase';
import uuid from 'uuid';
import { dataURItoBlob } from '../helpers/imageFiles';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
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
  cardGrid: {
    padding: `${theme.spacing.unit * 4}px 0`,
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
  }
});

class AddPost extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      id: '',
      user: '',
      data: '',
      img: '',
      geo: '',
      shortText: '',
      longText: '',
      likes: '',
      step: 2,
      imgSent: false,
      camera: false
    }
  }

  componentDidMount() {
    //check if there is navigation, if there is, autofill locatization
    if (("geolocation" in navigator)) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const fetchedLocation = position.coords.latitude + '/' + position.coords.longitude;
          this.setState({
            geo: fetchedLocation
          })
        },
        (err) => {
          console.log(err);
        }
      )
    }

    //check if we have access to the camera
    if (('mediaDevices' in navigator)) {
      if ('getUserMedia' in navigator.mediaDevices) {
        navigator.permissions.query({ name: 'camera' }).then((result) => {
          if (result.state === 'granted') {
            this.setState({
              camera: true,
              step: 1
            })
          }
        });
      }
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
    const imageId = uuid();
    const storage = firebase.storage();
    const imgRef = storage.ref().child('images').child(imageId);
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    let hh = today.getHours();
    let ii = today.getMinutes();
    if (dd < 10) {
      dd = '0' + dd
    };
    if (mm < 10) {
      mm = '0' + mm
    };
    today = mm + '/' + dd + '/' + yyyy + ' ' + hh + ':' + ii;
    imgRef.put(this.state.img).then(() => {
      imgRef.getDownloadURL().then((url) => {
        //add content
        const itemsRef = firebase.database().ref('posts');
        const item = {
          id: imageId,
          user: 'user',
          data: today,
          img: url,
          geo: this.state.geo,
          shortText: this.state.shortText,
          longText: this.state.longText,
          likes: 0
        }
        itemsRef.push(item);
        this.setState({
          id: '',
          user: '',
          data: '',
          img: '',
          geo: '',
          shortText: '',
          longText: '',
          likes: ''
        });
      })
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
    const height = video.videoHeight / (video.videoWidth / canvas.width);
    context.drawImage(video, 0, 0, width, height);
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
    const { imgSent, camera, longText, shortText, geo } = this.state;
    const values = { longText, shortText, geo };
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
            <Button variant="contained" color="primary" className={classes.button} onClick={this.handleSend}>Opublikuj</Button>
          </div>
        )
      default:
        return <CapturePhoto captureImage={this.captureImage} imgSent={imgSent} camera={camera} />
    }
  }

  render() {
    const { classes } = this.props;
    const { step, imgSent, camera } = this.state;

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
        <BottomAppNavigation handleSwitch={this.handleSwitch} step={step} camera={camera} />
      </>
    )
  }
}

AddPost.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddPost);