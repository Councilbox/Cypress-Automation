import React from 'react';
import CouncilEditorPage from "../components/councilEditor/CouncilEditorPage";
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

const CouncilEditorContainer = ({ main, company, user, council, match, translate }) => {
    return (
        <CouncilEditorPage
            translate={translate}
            step={match.params.step}
            companyID={match.params.company}
            councilID={match.params.id}
        />
    );
}

const mapStateToProps = (state) => ({
    translate: state.translate
});


export default connect(mapStateToProps)(withRouter(CouncilEditorContainer));