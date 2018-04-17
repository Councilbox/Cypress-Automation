import React from 'react';
import ChangePwd from '../components/notLogged/ChangePwd';
import Header from '../components/Header';
import { connect } from 'react-redux';
import { LoadingMainApp } from '../components/displayComponents';
import { withRouter } from "react-router-dom";
import  { setLanguage } from "../actions/mainActions";
import { store } from "./App";

class ChangePwdContainer extends React.PureComponent {

    componentDidMount(){
        store.dispatch(setLanguage(this.props.match.params.language));
    }

    render(){
        if(!this.props.translate.login_signin_header){
            return <LoadingMainApp />
        }

        return(
            <div style={{display: 'flex', flex: 1, flexDirection: 'column', height: '100vh', overflow: 'auto', padding: 0, margin: 0}}>
                <Header translate={this.props.translate} helpIcon languageSelector />
                <ChangePwd main={this.props.main} translate={this.props.translate} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    main: state.main,
    translate: state.translate
});

export default connect(mapStateToProps)(withRouter(ChangePwdContainer));