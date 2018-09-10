import React from 'react';
import { BasicButton, ButtonIcon, Link } from '../../displayComponents';
import { getSecondary } from '../../styles/colors';
import withTranslations from '../../HOCs/withTranslations';



class CompaniesManagerButton extends React.Component {

    render(){
        return(
            <div style={{width: '100%', padding: '1em', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Link to={`/company/${this.props.company.id}/create`}>
                    <div>
                        <BasicButton
                            text={this.props.translate.companies_add}
                            color={getSecondary()}
                            icon={<ButtonIcon type="add" color="white" />}
                            textStyle={{textTransform: 'none', fontWeight: '700', fontSize: '0.9em',  color: 'white'}}
                        />
                    </div>
                </Link>
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
            </div>
        )
    }
}

export default withTranslations()(CompaniesManagerButton);


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