import React, { Component } from 'react';
import CompanySettingsPage from '../components/companySettings/CompanySettingsPage';
import {connect} from 'react-redux';

class CompanySettingsContainer extends Component {

    render() {
        return (
            <CompanySettingsPage
                main={this.props.main}
                translate={this.props.translate}
                company={this.props.company}
            />
        );
    }
}

const mapStateToProps = (state) => ({
    main: state.main,
    translate: state.translate,
    company: state.companies.list[state.companies.selected]
});

export default connect(mapStateToProps)(CompanySettingsContainer);