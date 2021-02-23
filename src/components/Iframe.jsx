import React, { Component } from 'react';

class Iframe extends Component {
	shouldComponentUpdate(nextProps) {
		// return false;
		return this.props.src !== nextProps.src;
	}

	render() {
		const { src } = this.props;

		return (
			<iframe
				title="IframeCompenent"
				allow="geolocation; microphone; camera"
				scrolling="no"
				src={src}
				allowFullScreen={true}
				style={{
					border: 'none',
					width: '100%',
					height: '100%'
				}}
			>
				Something wrong...
			</iframe>
		);
	}
}

export default Iframe;
