import React from 'react';
import * as mainActions from '../../actions/mainActions';
import * as companyActions from '../../actions/companyActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Link, Tooltip } from '../displayComponents';
import { darkGrey } from '../../styles/colors';
import Collapsible from 'react-collapsible';
import { MenuItem } from 'material-ui';
import CompanySelector from '../menus/CompanySelector';

class CompanyMenu extends React.Component {

    getSections = () => {
        const { translate, company } = this.props;

        return [
            {
                name: translate.councils,
                icon: "import_contacts",
                submenus: [
                    { name: translate.dashboard_new, link: `/company/${company.id}/council/new` },
                    { name: translate.drafts, link: `/company/${company.id}/councils/drafts` },
                    { name: translate.companies_calendar, link: `/company/${company.id}/councils/calendar` },                    
                    { name: translate.companies_live, link: `/company/${company.id}/councils/live` },
                    { name: translate.companies_writing, link: `/company/${company.id}/councils/writing` },
                    { name: translate.signature_trash, link: `/company/${company.id}/councils/trash` },
                ]
            },
            {
                name: translate.meetings,
                icon: "question_answer",
                submenus: [
                    { name: translate.dashboard_new_meeting, link: `/company/${company.id}/meeting/new` },
                    { name: translate.drafts, link: `/company/${company.id}/meetings/drafts` },                    
                    { name: translate.companies_live, link: `/company/${company.id}/meetings/live` },                    
                    { name: translate.signature_trash, link: `/company/${company.id}/meetings/trash` }
                ]
            },
            {name: "firmas", icon: "border_color", submenus: []},
            {name: "libro de socios", icon: "account_balance", submenus: []},
            {name: "censo", icon: "person", submenus: []},
            {name: "estatutos", icon: "gavel", submenus: []},
            {name: "borradores", icon: "class", submenus: []},
            {name: "datos básicos", icon: "work", submenus: []}
        ];
    }


    _renderMenuIcon(text, icon){
        return(
            <MenuItem style={{color: 'white', border: '1px solid black', fontSize: '0.85em', display: 'flex', justifyContent: 'space-between'}}>
                {this.props.toggled && text}
                <Tooltip text={text} position="right">
                    <Icon 
                        className="material-icons"
                        style={{fontSize: '2em', color: 'white', float: 'right', marginVertical: 'auto'}}
                    >
                        {icon}
                    </Icon>
                </Tooltip>
            </MenuItem>
        );
    }

    changeCompany = (index) => {
        this.setState({
            popover: false
        });
        this.props.changeCompany(index);
    }

    render() {
        const sections = this.getSections();
        const { company, companies } = this.props;

        return(
            <div
                onClick={!this.props.toggled? this.props.toggle : () => {}}
                style={{width: "100%", height: '100%', backgroundColor: darkGrey, color: 'white', overflowY : 'auto', overflowX: 'hidden'}}
            >
                <CompanySelector
                    companies={companies}
                    company={company}
                />                
                {this.props.toggled && 
                    <Icon 
                        className="material-icons"
                        onClick={this.props.toggle}
                        style={{fontSize: '2em', color: 'white'}}
                    >
                        keyboard_backspace
                    </Icon>
                }
                {sections.map((section, index) => {
                    return (
                        <Collapsible 
                            trigger={this._renderMenuIcon(section.name, section.icon)}
                            transitionTime={200}
                            key={`section${index}`}
                        >
                            {this.props.toggled && section.submenus.map((menu) => {
                                return(<Link to={menu.link} key={`${menu.name}${index}`}><MenuItem style={{color: 'white', fontSize: '0.8em'}}>{menu.name}</MenuItem></Link>)
                            })}
                        </Collapsible>
                    );
                })}
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

export default connect(null, mapDispatchToProps)(CompanyMenu);