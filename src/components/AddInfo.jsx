import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';


const styles = theme => ({
  textField: {
    width: '100%'
  },
  button: {
    width: '100%',
    marginTop: theme.spacing.unit * 2
  }
});

class AddInfo extends PureComponent {
  render() {
    const { classes, handleChange, values } = this.props;
    return (
      <>
        <TextField
          id="outlined-name"
          label="Krótki opis"
          className={classes.textField}
          value={values.shortText}
          onChange={handleChange('shortText')}
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="outlined-name"
          label="Długi opis"
          className={classes.textField}
          value={values.longText}
          onChange={handleChange('longText')}
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="outlined-name"
          label="Lokalizacja"
          className={classes.textField}
          value={values.geo}
          onChange={handleChange('geo')}
          margin="normal"
          variant="outlined"
        />
      </>
    )
  }
}

AddInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired
};

export default withStyles(styles)(AddInfo);