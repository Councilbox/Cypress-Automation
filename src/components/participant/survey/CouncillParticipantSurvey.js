import React from 'react';
import { withApollo } from "react-apollo";
import { ConfigContext } from '../../../containers/AppControl';
import CouncilSurveyModal from './CouncilSurveyModal';

const CouncilSurvey = ({ translate }) => {
    const [open, setOpen] = React.useState(false);
    const config = React.useContext(ConfigContext);

    if(!config.councilSurvey){
        return null;
    }

	return (
		<div>
			<div onClick={() => setOpen(true)}>AbrirModal</div>
			<CouncilSurveyModal
                open={open}
                translate={translate}
                requestClose={() => setOpen(false)}
            />
		</div>
	)
}

export default withApollo(CouncilSurvey);