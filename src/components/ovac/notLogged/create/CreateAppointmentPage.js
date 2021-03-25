import React from 'react';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as mainActions from '../../../../actions/mainActions';
import { LoadingMainApp } from '../../../../displayComponents';
import withTranslations from '../../../../HOCs/withTranslations';


const CreateAppointmentPage = ({ match, translate, actions }) => {
	const [loadLanguage, setLoadedLanguage] = React.useState(false);
	const { language } = match.params;

	React.useEffect(() => {
		if (language && language !== translate.selectedLanguage) {
			actions.setLanguage(language);
		} else {
			setLoadedLanguage(true);
		}
	}, [language, translate.selectedLanguage]);


	if (!loadLanguage) {
		return <LoadingMainApp />;
	}

	return (
		<div>
			{translate.selectedLanguage} {translate.councils}
		</div>
	);
};

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(mainActions, dispatch)
});

export default withTranslations()(withApollo(connect(null, mapDispatchToProps)(CreateAppointmentPage)));
