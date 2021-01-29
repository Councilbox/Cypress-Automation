import React from 'react';
import { withApollo } from "react-apollo";
import { ConfigContext } from '../../../containers/AppControl';
import { BasicButton } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import CouncilSurveyModal from './CouncilSurveyModal';

const CouncilSurvey = ({ translate }) => {
    const [open, setOpen] = React.useState(false);
    const config = React.useContext(ConfigContext);
    const primary = getPrimary();

    if(!config.councilSurvey){
        return null;
    }

	return (
		<div>
            <BasicButton
                color="white"
                text={'Valore el funcionamiento de la reunión aquí'}
                onClick={() => setOpen(true)}
                buttonStyle={{
                    border: `1px solid ${primary}`,
                    color: primary
                }}
            />
			<CouncilSurveyModal
                open={open}
                translate={translate}
                requestClose={() => setOpen(false)}
            />
		</div>
	)
}

export default withApollo(CouncilSurvey);