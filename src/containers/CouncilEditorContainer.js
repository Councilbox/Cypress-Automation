import React from 'react';
import CouncilEditorPage from "../components/CouncilEditorPage";
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as councilActions from '../actions/councilActions';
import { bindActionCreators } from 'redux';

const CouncilEditorContainer = ({main, company, user, council, match, actions}) => {
    return (
        <CouncilEditorPage
            main={main}
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
    council: state.council
});


export default connect(mapStateToProps)(withRouter(CouncilEditorContainer));