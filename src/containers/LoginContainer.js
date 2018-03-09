import React from 'react';
import Login from '../components/Login';
import Header from '../components/Header';
import { connect } from 'react-redux';

class LoginContainer extends React.PureComponent {

    render(){
        return(
            <div style={{display: 'flex', flex: 1, flexDirection: 'column', height: '100vh', overflow: 'auto', padding: 0, margin: 0}}>
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