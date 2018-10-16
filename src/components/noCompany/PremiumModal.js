import React from 'react';
import { AlertConfirm, BasicButton, Grid, GridItem } from '../../displayComponents';
import { primary } from '../../styles/colors';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { store } from '../../containers/App';
import { setUserData } from '../../actions/mainActions';
import CBXContactButton from './CBXContactButton';

class PremiumModal extends React.Component {

    state = {
        step: 1,
        success: false
    }

    activateTrial = async () => {
        this.setState({
            loading: true,
        })
        const response = await this.props.activateTrial({
            variables: {
                userId: this.props.user.id
            }
        })

        console.log(response);
        if(!response.error){
            this.setState({
                success: true,
                loading: false,
                step: 3
            });
            store.dispatch(setUserData(response.data.activateUserFreeTrial));
        }
    }

    showActivateTrialPage = () => {
        this.setState({
            step: 2
        })
    }

    render(){
        const { translate } = this.props;

        //TRADUCCION TODO
        return (
            <AlertConfirm
                open={this.props.open}
                hideAccept
                buttonCancel={translate.close}
                requestClose={this.props.requestClose}
                title={'Función premium'}
                bodyText={
                    <React.Fragment>
                        {this.state.step === 1 &&
                            <React.Fragment>
                                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                                    <div>
                                        Para poder realizar esta acción necesita <strong>suscribirse a Councilbox.</strong>
                                    </div>
                                    <div>
                                        Descubra como hacerlo:
                                    </div>
                                    <div style={{marginBottom: '0.6em'}}>
                                        <CBXContactButton
                                            translate={translate}
                                        />
                                    </div>
                                    <BasicButton
                                        text='Prueba gratuita'
                                        color={primary}
                                        textStyle={{fontWeight: '700', color: 'white', fontSize: '18px',}}
                                        onClick={this.showActivateTrialPage}
                                    />
                                </div>
                            </React.Fragment>
                        }
                        {this.state.step === 2 &&
                            <React.Fragment>
                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    Este periodo de prueba comenzará en el momento que crees tu primera compañía e incluye:
                                </div>
                                <Grid style={{width: '100%', display: 'flex'}}>
                                    <GridItem xs={5} lg={5} md={5} style={{fontWeight: '700', padding: '0.6em'}}>
                                        Máximo de compañías propias:
                                    </GridItem>
                                    <GridItem xs={7} lg={7} md={7} style={{padding: '0.6em'}}>
                                        1
                                    </GridItem>
                                    <GridItem xs={5} lg={5} md={5} style={{fontWeight: '700', padding: '0.6em'}}>
                                        Funcionalidades CBX:
                                    </GridItem>
                                    <GridItem xs={7} lg={7} md={7} style={{padding: '0.6em'}}>
                                        Acceso completo
                                    </GridItem>
                                    <GridItem xs={5} lg={5} md={5} style={{fontWeight: '700', padding: '0.6em'}}>
                                        Duración:
                                    </GridItem>
                                    <GridItem xs={7} lg={7} md={7} style={{padding: '0.6em'}}>
                                        5 días
                                    </GridItem>
                                    <GridItem xs={12} lg={12} md={12} style={{padding: '0.6em'}}>
                                        Una vez finalizados los 5 días no podrá seguir usando las funciones de pago, pero se mantendrán guardadas todas su acciones, las cuales podrá retomar una vez active su cuenta premium.
                                    </GridItem>
                                </Grid>
                                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                                    <div>
                                        <BasicButton
                                            text='Empezar'
                                            loading={this.state.loading}
                                            success={this.state.success}
                                            color={primary}
                                            textStyle={{fontWeight: '700', color: 'white', fontSize: '18px',}}
                                            onClick={this.activateTrial}
                                        />
                                    </div>
                                </div>
                            </React.Fragment>
                        }
                        {this.state.step === 3 &&
                            <div>
                                Prueba gratuita activada correctamente, ya puedes crear tu primera compañía.
                            </div>
                        }
                    </React.Fragment>
                }
            />
        )
    }
}

const activateTrial = gql`
    mutation ActivateTrial($userId: Int!){
        activateUserFreeTrial(userId: $userId){
            name
			surname
			id
			type
			actived
			roles
			phone
			email
			preferredLanguage
        }
    }
`;

export default graphql(activateTrial, {
    name: 'activateTrial'
})(PremiumModal);
