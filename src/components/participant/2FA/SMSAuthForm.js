import React from 'react';
import { Card } from 'material-ui';
import { BasicButton, TextInput } from '../../../displayComponents';


const SMSAuthForm = ({ value, updateValue, send, translate }) => {
    
    return (
        <Card>
            Le hemos enviado una clave a su teléfono para que pueda acceder a su panel de participante
            <TextInput
                floatingText={'Clave SMS'}
                value={value}
                onChange={event => updateValue(event.target.value)}
            />
            <BasicButton
                onClick={send}
                text={translate.send}
            />
        </Card>

    )
}

export default SMSAuthForm;