import React from 'react';
import { withApollo } from 'react-apollo';
import { ConfigContext } from '../../../containers/AppControl';
import { BasicButton } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import CouncilSurveyModal from './CouncilSurveyModal';

const CouncilSurvey = ({ translate, participant }) => {
	const [open, setOpen] = React.useState(false);
	const config = React.useContext(ConfigContext);
	const primary = getPrimary();

	if (!config.councilSurvey) {
		return null;
	}

	return (
		<div>
			<BasicButton
				color="white"
				text={translate.rate_app_button}
				onClick={() => setOpen(true)}
				buttonStyle={{
					border: `1px solid ${primary}`,
					color: primary
				}}
			/>
			<CouncilSurveyModal
				open={open}
				translate={translate}
				participant={participant}
				autoOpen={() => setOpen(true)}
				requestClose={() => setOpen(false)}
			/>
		</div>
	);
};

export default withApollo(CouncilSurvey);
