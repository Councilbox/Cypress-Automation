import React from 'react';
import Login from '../components/Login';
import Header from '../components/Header';
import { connect } from 'react-redux';

class LoginContainer extends React.PureComponent {

    render(){
        return(
            <div style={{display: 'flex', flex: 1, flexDirection: 'column', height: '100vh', overflow: 'auto', padding: 0, margin: 0}}>
                <Header translate={this.props.translate} helpIcon />
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