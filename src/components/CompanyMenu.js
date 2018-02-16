import React from 'react';
import * as mainActions from '../actions/mainActions';
import * as companyActions from '../actions/companyActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { darkGrey } from '../styles/colors';
import Collapsible from 'react-collapsible';
import FontIcon from 'material-ui/FontIcon';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router-dom';


class CompanyMenu extends React.Component {

    constructor(props){
        super(props);

        const { translate } = props;

        this.sections = [
            {
                name: "Mis reuniones",
                icon: "import_contacts",
                submenus: [
                    { name: translate.dashboard_new, link: `/company/${props.company.id}/council/new` },
                    { name: translate.drafts, link: `/company/${props.company.id}/councils/drafts` },
                    { name: translate.companies_calendar, link: `/company/${props.company.id}/councils/calendar` },                    
                    { name: translate.companies_live, link: `/company/${props.company.id}/councils/live` },
                    { name: translate.companies_writing, link: `/company/${props.company.id}/councils/writing` },
                    { name: translate.signature_trash, link: `/company/${props.company.id}/councils/trash` },
                ]
            },
            {
                name: "conferencias",
                icon: "question_answer",
                submenus: [
                    { name: translate.dashboard_new_meeting, link: `/company/${props.company.id}/meeting/new` },
                    { name: translate.drafts, link: `/company/${props.company.id}/meetings/drafts` },                    
                    { name: translate.companies_live, link: `/company/${props.company.id}/meetings/live` },                    
                    { name: translate.signature_trash, link: `/company/${props.company.id}/meetings/trash` }
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
            <MenuItem style={{color: 'white', border: '1px solid black', fontSize: '1em'}}>
                {this.props.toggled && text.toUpperCase()}
                <FontIcon 
                    className="material-icons"
                    color={'white'}
                    style={{fontSize: '2em', color: 'white', float: 'right', marginVertical: 'auto'}}
                >
                    {icon}
                </FontIcon>
            </MenuItem>
        );
    }

    render() {
        return(
            <div
                onClick={!this.props.toggled? this.props.toggle : () => {}}
                style={{width: this.props.toggled? "80%" : "50%", height: '100%', backgroundColor: darkGrey, color: 'white', overflowY : 'auto', overflowX: 'hidden'}}
            >
                <img
                    src={this.props.company.logo}
                    style={{width: '100%', height: 'auto', maxWidth: '5em'}}
                    alt={this.props.translate.company_logotype}
                />
                {this.props.toggled && 
                    <FontIcon 
                        className="material-icons"
                        color={'white'}
                        onClick={this.props.toggle}
                        style={{fontSize: '2em', color: 'white'}}
                    >
                        keyboard_backspace
                    </FontIcon>
                }
                {this.sections.map((section, index) => {
                    return (
                        <Collapsible 
                            trigger={this._renderMenuIcon(section.name, section.icon)}
                            transitionTime={200}
                            key={`section${index}`}
                        >
                            {this.props.toggled && section.submenus.map((menu) => {
                                return(<Link to={menu.link} key={`${menu.name}${index}`}><MenuItem style={{color: 'white'}}>{menu.name}</MenuItem></Link>)
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