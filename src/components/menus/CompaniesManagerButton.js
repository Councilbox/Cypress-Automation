import React from 'react';
import { BasicButton, ButtonIcon, Link, Grid, GridItem } from '../../displayComponents';
import { getSecondary } from '../../styles/colors';


class CompaniesManagerButton extends React.Component {

    render(){
        return(
            <Grid>
                <GridItem xs={5} md={5} lg={5}>
                    <Link to={`/company/${this.props.company.id}/create`}>
                        <BasicButton
                            text="Crear"/*TRADUCCION*/
                            color={getSecondary()}
                            icon={<ButtonIcon type="add" color="white" />}
                            textStyle={{textTransform: 'none', fontWeight: '700', color: 'white'}}
                        />
                    </Link>
                </GridItem>
                <GridItem lg={2} />
                <GridItem xs={5} md={5} lg={5}>
                    <Link to={`/company/${this.props.company.id}/link`}>
                        <BasicButton
                            text="Vincular"/*TRADUCCION*/
                            color={getSecondary()}
                            icon={<ButtonIcon type="link" color="white" />}
                            textStyle={{textTransform: 'none', fontWeight: '700', color: 'white'}}
                        />
                    </Link>
                </GridItem>
            </Grid>
        )
    }
}

export default CompaniesManagerButton;


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
                                Vincular entidad{/*TRADUCCION
                            </Link>
                        </MenuItem>
                    </React.Fragment>
                }
            />
*/