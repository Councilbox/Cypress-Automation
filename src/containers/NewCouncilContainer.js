import React from 'react';
import NewCouncilPage from "../components/NewCouncilPage";
import {connect} from 'react-redux';


const NewCouncilContainer = ({main, company, user}) => {
    return (
        <NewCouncilPage main={main} company={company} user={user}/>
    );
}

const mapStateToProps = (state) => ({main: state.main, company: state.company, user: state.user});

export default connect(mapStateToProps)(NewCouncilContainer);