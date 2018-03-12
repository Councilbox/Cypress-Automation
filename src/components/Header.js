import React, { Component } from 'react';
import logo from '../assets/img/logo.png';
import * as mainActions from '../actions/mainActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { BasicButton, Icon } from './displayComponents';

class Header extends Component{

    logout = () => {
        this.props.actions.logout();
    }

    render(){
        return(
            <header className="App-header" style={{height: '3em', display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white'}}>
                <Link to="/"><img src={logo} className="App-logo" style={{height: '1.5em', marginLeft: '2em'}} alt="logo" /></Link>
                {this.props.helpIcon &&
                    <Icon className="material-icons" style={{marginRight: '2em', fontSize: '1.5em', color: 'grey'}}>live_help</Icon>
                }
                {this.props.user &&
                    <div>
                        <div style={{float: 'right', marginRight: '2em'}} >{this.props.user}</div>
                        <BasicButton
                            text="Logout"
                            onClick={this.logout}
                        />
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