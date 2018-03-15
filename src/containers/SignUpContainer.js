import React, { Component } from 'react';
import SignUpPage from '../components/signUp/SignUpPage';
import Header from '../components/Header';
import {connect} from 'react-redux';
import { getPrimary } from '../styles/colors';

class SignUpContainer extends Component {

    render() {
        const primary = getPrimary();
        return (
            <div style={{height: '100vh', width: '100%', background: `linear-gradient(to right, ${primary}, #6499B1)`}}>
                <Header translate={this.props.translate} helpIcon />
                <SignUpPage main={this.props.main} translate={this.props.translate} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    main: state.main,
    translate: state.translate
});

export default connect(mapStateToProps)(SignUpContainer);