import React from 'react';
import ForgetPdw from '../components/notLogged/ForgetPwd';
import Header from '../components/Header';
import { connect } from 'react-redux';
import { LoadingMainApp } from '../components/displayComponents';

class ForgetPwdContainer extends React.PureComponent {

    render(){
        if(!this.props.translate.login_signin_header){
            return <LoadingMainApp />
        }

        return(
            <div style={{display: 'flex', flex: 1, flexDirection: 'column', height: '100vh', overflow: 'auto', padding: 0, margin: 0}}>
                <Header translate={this.props.translate} helpIcon languageSelector />
                <ForgetPdw main={this.props.main} translate={this.props.translate} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    main: state.main,
    translate: state.translate
});

export default connect(mapStateToProps)(ForgetPwdContainer);