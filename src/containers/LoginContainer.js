import React from 'react';
import Login from '../components/Login';
import Header from '../components/Header';
import {connect} from 'react-redux';

class LoginContainer extends React.PureComponent {

    render(){
        return(
            <div style={{height: '100vh', width: '100%', backgroundColor: 'purple'}}>
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