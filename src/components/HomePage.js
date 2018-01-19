import React from 'react';
import * as mainActions from '../actions/mainActions';
import * as companyActions from '../actions/companyActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, CardActions, CardHeader, CardText, TextField, RaisedButton, FontIcon } from 'material-ui';
import { Grid, Row, Col } from "react-bootstrap";
import Header from './Header';
import CompanySideMenu from './CompanySideMenu';
import Dashboard from './Dashboard';
import Drawer from 'material-ui/Drawer';

class HomePage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            sideWidth: 10,
            open: false
        }    
    }

    componentDidMount() {
        this.props.companyActions.getCompanyInfo();
    }

    logout = () => {
        this.props.actions.logout();
    }

    toggleMenu = () => {
        if(this.state.sideWidth === 25){
            this.setState({
                sideWidth: 10,
                open: false
            });
        }else{
            this.setState({
                sideWidth: 25,
                open: true
            });
        }

    }

    render(){
         return(
            <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'row'}}>
                <CompanySideMenu
                    width={this.state.sideWidth}
                    company={this.props.company}
                    toggleMenu={this.toggleMenu}
                    open={this.state.open}
                />
                <div style={{width: `${100 - this.state.sideWidth}%`, height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <Header user={this.props.user.name} />
                    <Dashboard user={this.props.user} company={this.props.company} />
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(mainActions, dispatch),
        companyActions: bindActionCreators(companyActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(HomePage);