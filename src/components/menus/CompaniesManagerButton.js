import React from 'react';
import { BasicButton, DropDownMenu, ButtonIcon, Link } from '../../displayComponents';
import { getSecondary } from '../../styles/colors';
import { MenuItem } from 'material-ui';


class CompaniesManagerButton extends React.Component {

    render(){
        return(
            <DropDownMenu
                color="transparent"
                textStyle={{
                    margin: 0,
                    width: "100%",
                    padding: 0
                }}
                Component={
                    () => <BasicButton
                        text={this.props.translate.link_companies}
                        fullWidth={true}
                        color={getSecondary()}
                        textStyle={{
                            color: "white",
                            fontWeight: "500",
                            textTransform: "none"
                        }}
                        textPosition="after"
                        icon={<ButtonIcon type="control_point" color="white" />}
                    />
                }
                type="flat"
                items={
                    <React.Fragment>
                        <MenuItem>
                            <Link to={`/company/${this.props.company.id}/create`}>
                                {this.props.translate.companies_add}
                            </Link>
                        </MenuItem>
                        <MenuItem>
                            <Link to={`/company/${this.props.company.id}/link`}>
                                {this.props.translate.companies_link}
                            </Link>
                        </MenuItem>
                    </React.Fragment>
                }
            />
        )
    }
}

export default CompaniesManagerButton;