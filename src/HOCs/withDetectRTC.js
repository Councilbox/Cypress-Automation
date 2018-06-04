import React from "react";
import { connect } from "react-redux";

const withDetectRTC = () => WrappedComponent => {
	const withDetectRTC = ({ detectRTC, ...restProps }) => (
		<WrappedComponent detectRTC={detectRTC} {...restProps} />
	);

	return connect(mapStateToProps)(withDetectRTC);
};

const mapStateToProps = state => ({
	detectRTC: state.detectRTC
});

export default withDetectRTC;
