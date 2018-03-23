import React, { Component } from 'react';
import UserSettingsPage from '../components/userSettings/UserSettingsPage';
import {connect} from 'react-redux';

class UserSettingsContainer extends Component {

    render() {
        return (
            <UserSettingsPage
                main={this.props.main}
                translate={this.props.translate}
                user={this.props.user}
            />
        );
    }
}

const mapStateToProps = (state) => ({
    main: state.main,
    translate: state.translate,
    user: state.user
});

export default connect(mapStateToProps)(UserSettingsContainer);