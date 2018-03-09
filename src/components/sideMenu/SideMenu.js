import React from 'react';
import * as mainActions from '../../actions/mainActions';
import * as companyActions from '../../actions/companyActions';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import CompanyMenu from './CompanyMenu';
import { LoadingMainApp } from '../displayComponents';
import { bHistory } from '../../containers/App';


class SideMenu extends React.Component {

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

    changeCompany = (index) => {
        const { companies } = this.props;
        this.props.companyActions.changeCompany(index);
        bHistory.push(`/company/${companies[index].id}`);
    }

    render() {
        if(!this.props.companies){
            return <LoadingMainApp />
        }
        
        return(
            <div style={{width: `${this.props.width}%`, height: '100%', display: 'flex', overflow: 'hidden'}}>
                <CompanyMenu
                    company={this.props.company}
                    companies={this.props.companies}
                    changeCompany={this.changeCompany}
                    toggle={this.props.toggleMenu}
                    open={this.state.company}
                    toggled={this.props.open}
                    translate={this.props.translate}
                />
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

export default connect(null, mapDispatchToProps)(SideMenu);