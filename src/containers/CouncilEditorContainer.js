import React from 'react';
import CouncilEditorPage from "../components/councilEditor/CouncilEditorPage";
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

const CouncilEditorContainer = ({main, company, user, council, match, translate}) => {
    return (
        <CouncilEditorPage
            main={main}
            translate={translate}
            company={company}
            user={user}
            council={council}
            step={council.step}
            companyID={match.params.company}
            councilID={match.params.id}
        />
    );
}

const mapStateToProps = (state) => ({
    main: state.main,
    company: state.company,
    user: state.user,
    council: state.council,
    translate: state.translate
});


export default connect(mapStateToProps)(withRouter(CouncilEditorContainer));