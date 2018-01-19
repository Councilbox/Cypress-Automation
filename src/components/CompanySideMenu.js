import React from 'react';
import * as mainActions from '../actions/mainActions';
import * as companyActions from '../actions/companyActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col} from "react-bootstrap";
import Header from './Header';
import CompanyMenu from './CompanyMenu';

class CompanySideMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            company: false,
            companies: false
        }
    }

    openCompany = () => {
        this.setState({
            companies: false,
            company: true
        });
        this.props.toggleMenu();
    }

    render() {
        return(
            <div style={{width: `${this.props.width}%`, height: '100%', display: 'flex', overflow: 'hidden'}}>
                <div style={{width: this.props.width === 10? "50%" : "20%", height: '100%', backgroundColor: 'black', color: 'white'}} > SIDE MENU </div>
                <CompanyMenu company={this.props.company} toggleCompany={this.openCompany} open={this.state.company} toggled={this.props.open} />
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

export default connect(null, mapDispatchToProps)(CompanySideMenu);