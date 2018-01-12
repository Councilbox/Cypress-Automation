import React from 'react';
import * as mainActions from '../actions/mainActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Login extends React.PureComponent {

    login = () => {
        this.props.actions.login();
    }

    logout = () => {
        this.props.actions.logout();
    }

    render(){
        return(
            <div>
                {this.props.main.isLogged?
                    <button onClick={this.logout}>Logout</button>
                :
                    <button onClick={this.login}>Login</button>
                }
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(mainActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Login);