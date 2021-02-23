import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
	detectRTC: state.detectRTC
});

const withDetectRTC = () => WrappedComponent => {
	const wrapped = ({ detectRTC, ...restProps }) => (
		<WrappedComponent detectRTC={detectRTC} {...restProps} />
	);

	return connect(mapStateToProps)(wrapped);
};

export default withDetectRTC;
