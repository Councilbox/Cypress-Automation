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

const sections = [
    {
        name: "Mis reuniones",
        icon: "import_contacts",
        submenus: [
            { name: "Nueva reunión", link: '/councils/new/' },
            { name: "Borradores", link: '/councils/drafts' },
            { name: "En celebración", link: '/councils/live' },
            { name: "Redactando Acta", link: '/councils/writing' },
            { name: "Papelera", link: '/councils/trash' },
        ]
    },
    {
        name: "conferencias",
        icon: "question_answer",
        submenus: [
            { name: 'Nueva conferencia', link: '/meetings/new' },
            { name: 'Borradores', link: '/meetings/drafts' },
            { name: 'En celebración', link: '/meetings/live' },
            { name: 'Redactando Acta', link: '/meetings/writing' },
            { name: 'Papelera', link: '/meetings/trash'}
        ]
    },
    {name: "firmas", icon: "border_color", submenus: []},
    {name: "libro de socios", icon: "account_balance", submenus: []},
    {name: "censo", icon: "person", submenus: []},
    {name: "estatutos", icon: "gavel", submenus: []},
    {name: "borradores", icon: "class", submenus: []},
    {name: "datos básicos", icon: "work", submenus: []}
];

class CompanyMenu extends React.Component {

    _renderMenuIcon(text, icon){
        return(
            <MenuItem style={{color: 'white'}}>
                {this.props.toggled && text.toUpperCase()}
                <FontIcon 
                    className="material-icons"
                    color={'white'}
                    style={{fontSize: '2em', color: 'white'}}
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
                style={{width: this.props.toggled? "80%" : "50%", height: '100%', backgroundColor: darkGrey, color: 'white', overflow: 'auto'}}
            >
                Company Icon
                {this.props.toggled && <FontIcon 
                    className="material-icons"
                    color={'white'}
                    onClick={this.props.toggle}
                    style={{fontSize: '2em', color: 'white'}}
                >keyboard_backspace</FontIcon>
                }
                {sections.map((section, index) => {
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