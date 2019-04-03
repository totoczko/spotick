import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import CameraIcon from '@material-ui/icons/Camera';

const styles = theme => ({
  captureButton: {
    fontSize: '46px'
  },
});

const cx = classNames.bind(styles)

class CapturePhoto extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      elementHeight: 300,
      cameraHeight: null,
      cameraWidth: null,
      elementWidth: null,
      globalStream: null
    }
  }

  componentDidMount() {
    if (this.props.camera) {
      this.turnOnCamera();
      this.timeout = setTimeout(() => {
        const elementHeight = this.divRef ? this.divRef.offsetHeight : 0;
        const elementWidth = elementHeight * this.state.cameraWidth / this.state.cameraHeight;
        this.setState({ elementHeight, elementWidth });
      }, 1000);
    }
  }

  componentWillUnmount() {
    this.turnOffCamera()
    clearTimeout(this.timeout)
  }

  detectMobile = () => {
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      return true;
    }
    else {
      return false;
    }
  }

  turnOnCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.videoStream.srcObject = stream;
      this.setState({ globalStream: stream })
      const cameraHeight = stream.getVideoTracks()[0].getSettings().height;
      const cameraWidth = stream.getVideoTracks()[0].getSettings().width;
      if (!this.detectMobile()) {
        // horizontal
        this.setState({
          cameraHeight,
          cameraWidth
        })
      } else {
        // vertical
        this.setState({
          cameraHeight: cameraWidth,
          cameraWidth: cameraHeight
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  turnOffCamera = () => {
    if (this.state.globalStream) {
      let track = this.state.globalStream.getTracks()[0]
      track.stop()
    }
  }

  render() {
    const { classes, captureImage, imgSent } = this.props;
    const { elementHeight, elementWidth } = this.state;
    const videoClass = cx({
      video: true,
      hidden: imgSent
    });

    const canvasClass = cx({
      canva: true,
      hidden: !imgSent
    });

    const buttonClass = cx({
      captureButton: true,
      hidden: imgSent
    });

    return (
      <>
        <div className="video-container" ref={element => this.divRef = element}>
          <video
            className={videoClass}
            autoPlay
            ref={(stream) => { this.videoStream = stream }}
            height={elementHeight}
            width={elementWidth}
          />
          <canvas
            className={canvasClass}
            ref={(canvas) => { this.canvas = canvas }}
            height={elementHeight}
            width={elementWidth}
          />
        </div>
        <Button
          className={buttonClass}
          color="primary"
          type="button"
          onClick={() => captureImage(this.canvas, this.videoStream)}
          ref={(captureButton) => { this.captureButton = captureButton }}
        >
          <CameraIcon className={classes.captureButton} />
        </Button>
      </>

    )
  }
}


CapturePhoto.propTypes = {
  classes: PropTypes.object.isRequired,
  captureImage: PropTypes.func,
  imgSent: PropTypes.bool,
  camera: PropTypes.bool
};


export default withStyles(styles)(CapturePhoto);