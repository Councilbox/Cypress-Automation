import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const withTranslations = () => WrappedComponent => {
    const WithTranslations = ({ translate }) => (
        <WrappedComponent
            translate={translate}
        />
    );

    return connect(mapStateToProps)(WithTranslations);
}

const mapStateToProps = (state) => ({
    translate: state.translate
});

export default withTranslations;