import React, { Component } from 'react';
import CompanyCensusPage from '../components/companyCensus/CompanyCensusPage';
import {connect} from 'react-redux';

class CompanyCensusContainer extends Component {

    render() {
        return (
            <CompanyCensusPage
                main={this.props.main}
                user={this.props.user}
                translate={this.props.translate}
                company={this.props.company}
            />
        );
    }
}

const mapStateToProps = (state) => ({
    main: state.main,
    user: state.user,
    translate: state.translate,
    company: state.companies.list[state.companies.selected]
});

export default connect(mapStateToProps)(CompanyCensusContainer);