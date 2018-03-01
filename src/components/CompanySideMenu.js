import React from 'react';
import * as mainActions from '../actions/mainActions';
import * as companyActions from '../actions/companyActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CompanyMenu from './CompanyMenu';
import { LoadingMainApp } from './displayComponents';
import { bHistory } from '../containers/App';


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
                <div style={{width: this.props.width === 10? "50%" : "20%", height: '100%', alignItems: 'center', display: 'flex', flexDirection: 'column', backgroundColor: 'black', color: 'white'}} >
                    {this.props.companies.map((company, index) => {
                        return (
                            <img
                                key={`logo_${company.id}`}
                                src={company.logo}
                                onClick={() => this.changeCompany(index)}
                                style={{width: '100%', height: 'auto', maxWidth: '3em', borderRadius: '2.5em', marginTop: '1em'}}
                                alt={this.props.translate.company_logotype}
                            />
                        )             
                    })}
                </div>
                <CompanyMenu
                    company={this.props.company}
                    toggleCompany={this.openCompany}
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

export default connect(null, mapDispatchToProps)(CompanySideMenu);