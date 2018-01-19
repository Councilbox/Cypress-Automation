import React, { Component } from 'react';
import logo from '../assets/img/logo.png';
import FontIcon from 'material-ui/FontIcon';
import * as mainActions from '../actions/mainActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Header extends Component{

    logout = () => {
        this.props.actions.logout();
    }

    render(){
        return(
            <header className="App-header" style={{height: '3em', display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white'}}>
                <img src={logo} className="App-logo" style={{height: '1.5em', marginLeft: '2em'}} alt="logo" />
                {this.props.helpIcon &&
                    <FontIcon className="material-icons" color={'grey'} style={{marginRight: '2em', fontSize: '1.5em'}}>live_help</FontIcon>
                }
                {this.props.user &&
                    <div>
                        <div style={{float: 'right', marginRight: '2em'}} >{this.props.user}</div>
                        <button onClick={this.logout}>Logout</button>
                    </div>
                }
            </header>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(mainActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Header);