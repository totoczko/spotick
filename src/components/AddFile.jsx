import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
	button: {
		margin: theme.spacing.unit,
		marginTop: 30
	},
	input: {
		display: 'none',
	},
	label: {
		width: '100%',
		display: 'block',
		textAlign: 'center'
	},
	preview: {
		width: '100%'
	}
});


class AddFile extends Component {
	constructor(props) {
		super(props)
		this.state = {
			file: null
		}
	}

	showImage = (event) => {
		this.setState({
			file: URL.createObjectURL(event.target.files[0])
		})
	}

	render() {
		const { classes, handleAddFile } = this.props;
		return (
			<div id="pick-image">
				{this.state.file ? <img className={classes.preview} src={this.state.file} alt="podgląd" /> : ''}
				<input
					accept="image/*"
					className={classes.input}
					id="image-picker"
					onChange={(event) => {
						this.showImage(event);
						handleAddFile(event)
					}}
					type="file"
				/>
				<label htmlFor="image-picker" className={classes.label}>
					<Button variant="contained" component="span" className={classes.button}>
						Wybierz zdjęcie
        </Button>
				</label>
			</div>
		)
	}
}

AddFile.propTypes = {
	handleAddFile: PropTypes.func.isRequired
};

export default withStyles(styles)(AddFile);