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
      elementHeight: 300
    }
  }

  componentDidMount() {
    if (this.props.camera) {
      this.showCamera();
      setTimeout(() => {
        this.setState({ elementHeight: this.divRef.offsetHeight });
      }, 1000);
    }
  }

  showCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.videoStream.srcObject = stream;
    }).catch(err => {
      console.log(err)
    })

  }

  render() {
    const { classes, captureImage, imgSent } = this.props;
    const { elementHeight } = this.state;
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
          />
        </div>
        <canvas
          className={canvasClass}
          ref={(canvas) => { this.canvas = canvas }}
          height={elementHeight}
        />
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