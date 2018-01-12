import React from 'react';
import * as mainActions from '../actions/mainActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Prueba from './Prueba';

class Home extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            text: 'Jose ta aprendendo moito hoxe'
        }
    }
    logout = () => {
        this.props.actions.logout();
    }

    changeText = () => {
        this.setState({
            text: 'Aaron ta aqui'
        })
    }

    render(){
        return(
            <p className="App-intro">
                To get started, edit <code>src/App.js</code> and save to reload.
                <div>
                    <Prueba text={this.state.text} changeText={this.changeText} />
                </div>
                <button onClick={this.logout}>Logout</button>
            </p>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(mainActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Home);