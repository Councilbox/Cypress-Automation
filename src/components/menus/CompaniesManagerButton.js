import React from 'react';
import { BasicButton, ButtonIcon, Link, AlertConfirm } from '../../displayComponents';
import { getSecondary } from '../../styles/colors';
import withSharedProps from '../../HOCs/withSharedProps';
import { userCanCreateCompany } from '../../utils/CBX';
import CBXContactButton from '../noCompany/CBXContactButton';

class CompaniesManagerButton extends React.Component {

    state = {
        cantCreateModal: false
    }

    showCantCreateModal = () => {
        this.setState({
            cantCreateModal: true
        });
    }

    hideCantCreateModal = () => {
        this.setState({
            cantCreateModal: false
        });
    }

    render(){
        return(
            <div style={{width: '100%', padding: '1em', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div>
                    {userCanCreateCompany(this.props.user, this.props.companies.list) || true?
                        <Link to={`/company/${this.props.company.id}/create`}>
                            <BasicButton
                                text={this.props.translate.companies_add}
                                color={getSecondary()}
                                icon={<ButtonIcon type="add" color="white" />}
                                textStyle={{textTransform: 'none', fontWeight: '700', fontSize: '0.9em',  color: 'white'}}
                            />
                        </Link>
                    :
                        <BasicButton
                            text={this.props.translate.companies_add}
                            color={'#A0A0A0'}
                            onClick={this.showCantCreateModal}
                            icon={<ButtonIcon type="add" color="white" />}
                            textStyle={{textTransform: 'none', fontWeight: '700', fontSize: '0.9em',  color: 'white'}}
                        />
                    }
                </div>

                <Link to={`/company/${this.props.company.id}/link`}>
                    <div>
                        <BasicButton
                            text={this.props.translate.companies_link}
                            color={getSecondary()}
                            icon={<ButtonIcon type="link" color="white" />}
                            textStyle={{textTransform: 'none', fontWeight: '700', fontSize: '0.9em', color: 'white'}}
                        />
                    </div>
                </Link>

                <AlertConfirm
                    title="Aviso"
                    open={this.state.cantCreateModal}
                    hideAccept
                    buttonCancel={this.props.translate.close}
                    requestClose={this.hideCantCreateModal}
                    bodyText={
                        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
                            <div style={{marginBottom: '0.8em'}}>
                                Para crear más compañías debe dar de alta su cuenta premium
                            </div>
                            <CBXContactButton
                                translate={this.props.translate}
                            />
                        </div>
                    }
                />
            </div>
        )
    }
}

export default withSharedProps()(CompaniesManagerButton);


/*
            <DropDownMenu
                color="transparent"
                textStyle={{
                    margin: 0,
                    width: "100%",
                    padding: 0
                }}
                Component={
                    () => <BasicButton
                        text="Gestionar entidades"//TRADUCCION
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
                                Añadir entidad/*TRADUCCION
                            </Link>
                        </MenuItem>
                        <MenuItem>
                            <Link to={`/company/${this.props.company.id}/link`}>
                                {translate.companies_link}
                            </Link>
                        </MenuItem>
                    </React.Fragment>
                }
            />
*/