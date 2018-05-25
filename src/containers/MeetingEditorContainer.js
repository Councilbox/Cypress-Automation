import React from 'react';
import MeetingEditorPage from "../components/meeting/editor/MeetingEditorPage";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const MeetingEditorContainer = ({ translate, council, match }) => {
    return (<MeetingEditorPage
        council={council}
        step={match.params.step}
        translate={translate}
        companyID={match.params.company}
        councilID={match.params.id}
    />);
};

const mapStateToProps = (state) => ({
    translate: state.translate,
    council: state.council
});


export default connect(mapStateToProps)(withRouter(MeetingEditorContainer));