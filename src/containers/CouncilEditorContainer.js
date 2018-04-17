import React from 'react';
import CouncilEditorPage from "../components/councilEditor/CouncilEditorPage";
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { LoadingMainApp } from '../components/displayComponents';

const CouncilEditorContainer = ({ main, company, user, council, match, translate }) => {
    if(!company){
        return <LoadingMainApp />
    }

    return (
        <CouncilEditorPage
            translate={translate}
            step={match.params.step}
            company={company}
            councilID={match.params.id}
        />
    );
}

const mapStateToProps = (state) => ({
    translate: state.translate,
    company: state.companies.list[state.companies.selected]
});


export default connect(mapStateToProps)(withRouter(CouncilEditorContainer));