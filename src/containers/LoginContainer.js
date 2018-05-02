import React from 'react';
import Login from '../components/notLogged/Login';
import Header from '../components/Header';
import { connect } from 'react-redux';
import { LoadingMainApp } from '../displayComponents';

class LoginContainer extends React.PureComponent {

    render(){
        if(!this.props.translate.login_signin_header){
            return <LoadingMainApp />
        }

        return(
            <div style={{display: 'flex', flex: 1, flexDirection: 'column', height: '100vh', overflow: 'auto', padding: 0, margin: 0}}>
                <Header translate={this.props.translate} helpIcon languageSelector />
                <Login main={this.props.main} translate={this.props.translate} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    main: state.main,
    translate: state.translate
});

export default connect(mapStateToProps)(LoginContainer);