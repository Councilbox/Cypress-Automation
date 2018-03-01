import React from 'react';
import Login from '../components/Login';
import Header from '../components/Header';
import { connect } from 'react-redux';
import { getPrimary } from '../styles/colors';

class LoginContainer extends React.PureComponent {

    render(){
        const primary = getPrimary();
        return(
            <div style={{backgroundColor: primary, display: 'flex', flex: 1, flexDirection: 'column', height: '100vh', overflow: 'auto'}}>
                <Header helpIcon />
                <Login main={this.props.main} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    main: state.main
});


export default connect(mapStateToProps)(LoginContainer);