import React from 'react';
import { TextInput } from '../../../../displayComponents';

const CompanyTagForm = ({ tag, translate, setTag, errors }) => {

    //TRADUCCION
    return (
            <React.Fragment>
                <TextInput
                    value={tag.key}
                    errorText={errors.key}
                    floatingText={'Clave'}
                    onChange={event => setTag({key: event.target.value})}
                />

                <TextInput
                    value={tag.value}
                    errorText={errors.value}
                    floatingText={'Valor'}
                    onChange={event => setTag({value: event.target.value})}
                />
            </React.Fragment>
    )
}

export default CompanyTagForm;
