import React from 'react';
import { TextInput, Grid, GridItem } from '../../../displayComponents';


const TranslationForm = ({ data, errors, translate, updateState }) => {

    return (
        <Grid>
            <GridItem xs={12} md={12} lg={12}>
                <TextInput
                    value={data.label}
                    floatingText="Nombre"
                    errorText={errors.label}
                    onChange={event => updateState({ label: event.target.value })}
                />
            </GridItem>
            <GridItem xs={12} md={12} lg={12}>
                <TextInput
                    value={data.es}
                    errorText={errors.es}
                    floatingText="Español"
                    onChange={event => updateState({ es: event.target.value })}
                />
            </GridItem>
            <GridItem xs={12} md={12} lg={12}>
                <TextInput
                    value={data.en}
                    errorText={errors.en}
                    floatingText="Inglés"
                    onChange={event => updateState({ en: event.target.value })}
                />
            </GridItem>
            <GridItem xs={12} md={12} lg={12}>
                <TextInput
                    value={data.gal}
                    errorText={errors.gal}
                    floatingText="Gallego"
                    onChange={event => updateState({ gal: event.target.value })}
                />
            </GridItem>
            <GridItem xs={12} md={12} lg={12}>
                <TextInput
                    value={data.pt}
                    errorText={errors.pt}
                    floatingText="Portugués"
                    onChange={event => updateState({ pt: event.target.value })}
                />
            </GridItem>
            <GridItem xs={12} md={12} lg={12}>
                <TextInput
                    value={data.cat}
                    errorText={errors.cat}
                    floatingText="Catalan"
                    onChange={event => updateState({ cat: event.target.value })}
                />
            </GridItem>
        </Grid>
    )
}

export default TranslationForm