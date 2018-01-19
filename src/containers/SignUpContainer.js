import React, { Component } from 'react';
import SignUpPage from '../components/SignUpPage';
import Header from '../components/Header';
import {connect} from 'react-redux';

class SignUpContainer extends Component {

    render() {
        return (
            <div style={{height: '100vh', width: '100%', backgroundColor: 'purple'}}>
                <Header helpIcon />
                <SignUpPage main={this.props.main} company={this.props.company} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    main: state.main,
    company: state.company
});

export default connect(mapStateToProps)(SignUpContainer);