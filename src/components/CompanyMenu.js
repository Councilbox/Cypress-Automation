import React from 'react';
import * as mainActions from '../actions/mainActions';
import * as companyActions from '../actions/companyActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col} from "react-bootstrap";
import Header from './Header';
import { darkGrey } from '../styles/colors';
import Collapsible from 'react-collapsible';
import FontIcon from 'material-ui/FontIcon';
import MenuItem from 'material-ui/MenuItem';

const sections = [
    {
        name: "reuniones",
        icon: "import_contacts",
        submenus: [
            {name: "borradores"}
        ]
    },
    {name: "conferencias", icon: "question_answer", submenus: []},
    {name: "firmas", icon: "border_color", submenus: []},
    {name: "libro de socios", icon: "account_balance", submenus: []},
    {name: "censo", icon: "person", submenus: []},
    {name: "estatutos", icon: "gavel", submenus: []},
    {name: "borradores", icon: "class", submenus: []},
    {name: "datos básicos", icon: "work", submenus: []}
];

class CompanyMenu extends React.Component {

    constructor(props) {
        super(props);
    }

    _renderMenuIcon(text, icon){
        return(
            <MenuItem style={{color: 'white'}}>
                {text.toUpperCase()}
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
            <div onClick={!this.props.toggled && this.props.toggleCompany} style={{width: this.props.toggled? "80%" : "50%", height: '100%', backgroundColor: darkGrey, color: 'white'}}>
                Company Icon
                {sections.map((section) => {
                    return (
                        <Collapsible 
                            trigger={this._renderMenuIcon(section.name, section.icon)}
                            transitionTime={200}
                        >
                            {section.submenus.map((menu) => {
                                return(<MenuItem style={{color: 'white'}}>{menu.name}</MenuItem>)
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