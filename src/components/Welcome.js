import React from 'react';
import * as mainActions from '../actions/mainActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from './Header';
import { Card, CardActions,CardText, RaisedButton } from 'material-ui';
import { Link } from 'react-router-dom';
import { Icon } from './displayComponents';
import { getPrimary } from '../styles/colors';


class SignUpPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            page: 1
        };
    }

    render(){
        const primary = getPrimary();
        return(
            <div style = {{backgroundColor: primary, display: 'flex', flexDirection: 'column', height:'100vh', width: '100%', alignItems: 'center', justifyContent: 'flex'}} >
                <Header />
                <h3 style={{color: 'white'}}>Bienvenido/a</h3>
                <Card style={{width: '30%', height: '70%', padding: 0, paddingBottom: '4em', borderRadius: '0.3em', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}} containerStyle={{padding: 0}}>
                    <CardText style={{padding: 0}}>
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height:'50%'}}>
                            <h3>Alta Completa</h3>
                            <Icon className="material-icons" style={{fontSize: '10em', color: 'green'}}>verified_user</Icon>
                            <div style={{fontSize: '1.2em', width: '60%', margin: '2em'}}>Para poder entrar hemos enviado un enlace a tu email con el que podrás activar tu cuenta CouncilBox</div>
                        </div>
                    </CardText>
                    <CardActions style={{alignItems: 'center', justifyContent: 'center', display: 'flex', width: '100%'}}>
                        <Link to='/'>
                            <RaisedButton
                                label="Comenzar"
                                backgroundColor={primary}
                                style={{width: '70%', margin: '2em'}}
                                labelStyle={{color: 'white', fontWeight: '700', marginRight: '0.2em'}}
                                labelPosition="before"
                                icon={<Icon className="material-icons" style={{color: 'white'}}>arrow_forward</Icon>}
                            />
                        </Link>
                    </CardActions>  
                </Card>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(mainActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(SignUpPage);