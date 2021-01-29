import React from "react";
import { connect } from "react-redux";

const mapStateToProps = state => ({
	translate: state.translate
});

const withTranslations = () => WrappedComponent => {
	const WithTranslations = ({ translate, ...restProps }) => (
		<WrappedComponent translate={translate} {...restProps} />
	);

	return connect(mapStateToProps)(WithTranslations);
};

export default withTranslations;
