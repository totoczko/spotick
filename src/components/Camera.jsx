import React, { PureComponent } from 'react';

export class Camera extends PureComponent {
	captureImage() {
		const context = this.canvas.getContext("2d")
		context.drawImage(this.videoStream, 0, 0, 800, 800)
		const image = this.canvas.toDataURL('image/jpeg', 0.5)
		return image
	}

	render() {
		return (
			<>
				<video
					ref={(stream) => { this.videoStream = stream }}
					width='800'
					height='800'
					style={{ display: 'none' }}>
				</video>
				<canvas
					ref={(canvas) => { this.canvas = canvas }}
					width='800'
					height='800'
					style={{ display: 'none' }}
				>
				</canvas>
			</>
		)
	}
}
