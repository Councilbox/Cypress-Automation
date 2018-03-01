import React from 'react';
import MeetingEditorPage from "../components/meetingEditor/MeetingEditorPage";
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

const MeetingEditorContainer = ({main, company, user, council, match, actions}) => {
    return (
        <MeetingEditorPage
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
    company: state.company.list[state.company.selected],
    user: state.user,
    council: state.council
});


export default connect(mapStateToProps)(withRouter(MeetingEditorContainer));