import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class AddFile extends Component {
	render() {
		const { handleAddFile } = this.props;
		return (
			<div id="pick-image">
				<p>Wybierz zdjęcie:</p>
				<input type="file" accept="image/*" id="image-picker" onChange={handleAddFile} />
			</div>
		)
	}
}

AddFile.propTypes = {
	handleAddFile: PropTypes.func.isRequired
};
