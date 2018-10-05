import React from 'react';
import { AlertConfirm, BasicButton } from '../../displayComponents';
import { primary } from '../../styles/colors';

class PremiumModal extends React.Component {

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
                    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                        <div>
                            Para poder realizar esta acción necesita subscribirse a Councilbox.
                        </div>
                        <div>
                            Descubra como hacerlo en <a href="https://www.councilbox.com/contactar/" target="_blank" rel="noopener noreferrer">Councilbox - Contacto</a>
                        </div>
                        o
                        <BasicButton
                            text='Empiece su prueba gratuita de 5 días'
                            color={primary}
                            textStyle={{fontWeight: '700', color: 'white', fontSize: '18px'}}
                        />
                    </div>
                }
            />
        )
    }
}

export default PremiumModal;
