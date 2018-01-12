import React from 'react';
import Login from '../components/Login';
import {connect} from 'react-redux';

class LoginContainer extends React.PureComponent {

    render(){
        return(
            <Login main={this.props.main} />
        );
    }
}

const mapStateToProps = (state) => ({
    main: state.main
});


export default connect(mapStateToProps)(LoginContainer);