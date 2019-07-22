import React from 'react';
import { Grid, GridItem, LoadingSection, BasicButton, TextInput, SelectInput } from '../../displayComponents';
import ToggleRecordings from './featureControl/ToggleRecordings';
import ToggleVideo from './featureControl/ToggleVideo';
import LogoutUser from './featureControl/LogoutUser';
import RefreshUser from './featureControl/RefreshUser';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Switch, FormControlLabel, MenuItem } from 'material-ui';


const DevAdminPage = ({ data, toggleFeature }) => {

    const toggle = async name => {
        await toggleFeature({
            variables: {
                name: name
            }
        });
        data.refetch();
    }

    let config = {};

        if(!data.loading){
            for(let field of data.adminFeatures.features){
                config[field.name] = field.active;
            }
        }

        if(data.loading){
            return <LoadingSection />
        }

        return (
            <div style={{width: '100%', height: '100%', padding: '1em'}}>
                <Grid>
                    <GridItem xs={12} md={12} lg={12}>
                        <ToggleRecordings />
                    </GridItem>
                    <GridItem xs={12} md={12} lg={12}>
                        <ToggleVideo />
                    </GridItem>
                    <GridItem xs={12} md={12} lg={12}>
                        <LogoutUser />
                    </GridItem>
                    <GridItem xs={12} md={12} lg={12}>
                        <RefreshUser />
                    </GridItem>
                    <GridItem xs={12} md={12} lg={12}>
                        <Features value={config} toggleFeature={toggle} />
                    </GridItem>
                    <GridItem xs={12} md={12} lg={12}>
                        <Exceptions exceptions={data.adminFeatures.exceptions} features={data.adminFeatures.features} refetch={data.refetch} />
                    </GridItem>
                </Grid>
            </div>
        )
}

const removeException = gql`
    mutation removeException($id: Int!){
        removeException(id: $id){
            success
        }
    }
`;

const addExceptionMutation = gql`
    mutation AddException($companyId: Int!, $active: Boolean!, $featureName: String!){
        addFeatureException(companyId: $companyId, active: $active, featureName: $featureName){
            success
            message
        }
    }
`;

const createCouncil = gql`
    mutation createAndConveneCouncil($council: CouncilInput, $agenda: [AgendaPointInput]){
        createAndConveneCouncil(council: $council, agenda: $agenda){
            id
        }
    }
`;

const sendConvene = gql`
    mutation sendConvene($councilId: Int!){
        sendConvene(councilId: $councilId){
            success
        }
    }
`;

const createCensus = gql`
    mutation createCensus($census: CensusInput!, $participantList: [ImportInput]){
        createCensus(census: $census, participantList: $participantList){
            id
        }
    }
`;

const Exceptions = withApollo(({ exceptions, features, refetch, client }) => {
    const [data, setData] = React.useState({
        companyId: '',
        featureName: features[0].name,
        active: true
    });

    const deleteException = async id => {
        await client.mutate({
            mutation: removeException,
            variables: {
                id
            }
        })
        refetch();
    }


    const addException = async () => {
        const response = await client.mutate({
            mutation: addExceptionMutation,
            variables: data
        });
        refetch();
    }

    const create = async () => {
        const response = await client.mutate({
            mutation: createCouncil,
            variables: {
                council: {
                    name: 'Prueba desde create and convene',
                    autoClose: 0,
                    councilType: 0,
                    language: 'es',
                    confirmAttendance: 1,
                    dateStart: new Date(2019,11,17, 14, 30, 0).toISOString(),
                    dateStart2NdCall: new Date(2019,11,17, 14, 50, 0).toISOString(),
                    companyId: 375,
                    selectedCensusId: 754
                },
                agenda: [{
                    type: 0,
                    name: 'Prueba'
                },
                {
                    type: 3,
                    name: 'Prueba'
                }]
            }
        });

        console.log(response);
    }

    const createCe = async () => {
        const response = await client.mutate({
            mutation: createCensus,
            variables: {
                census: {
                    censusName: 'Prueba completa desde api',
                    companyId: 375
                },
                participantList: [
                    {
                        participant: {
                            name: 'Participante1',
                            surname: '1',
                            email: 'aaron.fuentes.cocodin+1@gmail.com',
                            dni: '1231231J',
                            phone: '+34deded'
                        },
                        representative: {
                            name: 'Repre',
                            surname: 'de participant 1',
                            email: 'aaron.fuentes.cocodin+11@gmail.com',
                            dni: '1231231J',
                            phone: '+34deded'
                        },
                    },
                    {
                        participant: {
                            name: 'Participante2',
                            surname: '2',
                            email: 'aaron.fuentes.cocodin+2@gmail.com',
                            dni: '1231231J',
                            phone: '+34deded'
                        },
                        representative: {
                            name: 'Repre',
                            surname: 'de participant 2',
                            email: 'aaron.fuentes.cocodin+22@gmail.com',
                            dni: '1231231J',
                            phone: '+34deded'
                        },
                    },
                    {
                        participant: {
                            name: 'Participante3',
                            surname: '3',
                            email: 'aaron.fuentes.cocodin+3@gmail.com',
                            dni: '1231231J',
                            phone: '+34deded'
                        },
                    },
                    {
                        participant: {
                            name: 'Participante4',
                            surname: '4',
                            numParticipations: 5,
                            email: 'aaron.fuentes.cocodin+4@gmail.com',
                            dni: '1231231J',
                            phone: '+34deded'
                        },
                    },
                    {
                        participant: {
                            name: 'Participante5',
                            surname: '5',
                            votes: 1,
                            email: 'aaron.fuentes.cocodin+5@gmail.com',
                            dni: '1231231J',
                            phone: '+34deded'
                        },
                    }
                ]
            }
        });

        console.log(response);
    }

    const convene = async () => {
        const response = await client.mutate({
            mutation: sendConvene,
            variables: {
               councilId: 7058
            }
        });

        console.log(response);
    }

    return (
        <div>
            Exceptions
            <div style={{maxWidth: '300px'}}>
                <TextInput
                    value={data.companyId}
                    floatingText={'Company ID'}
                    onChange={event => setData({
                        ...data,
                        companyId: +event.target.value
                    })}
                />
            </div>
            <div style={{maxWidth: '300px'}}>
                <SelectInput
                    value={data.featureName}
                    floatingText={'Feature'}
                    onChange={event => setData({
                        ...data,
                        featureName: event.target.value
                    })}
                >
                    {features.map(feature => (
                        <MenuItem value={feature.name} key={feature.name}>{feature.name}</MenuItem>
                    ))}
                </SelectInput>
            </div>
            <div style={{maxWidth: '300px'}}>
                <SelectInput
                    value={data.active? 1 : 0}
                    floatingText={'Active'}
                    onChange={event => setData({
                        ...data,
                        active: event.target.value === 1? true : false
                    })}
                >
                    <MenuItem value={1}>Activar</MenuItem>
                    <MenuItem value={0}>Desactivar</MenuItem>
                </SelectInput>
            </div>
            <BasicButton
                text="añadir"
                onClick={addException}
            />
            <BasicButton
                text="Probar creacion"
                onClick={create}
            />
            <BasicButton
                text="Enviar convocatoria"
                onClick={convene}
            />
            <BasicButton
                text="Crear censos"
                onClick={createCe}
            />
            {exceptions.map(exception => (
                <div key={`exception_${exception.id}`}>
                    {`${exception.featureName} - ${exception.companyId} - ${exception.active}`}
                    <BasicButton
                        text="eliminar"
                        onClick={() => deleteException(exception.id)}
                    />
                </div>
            ))}
        </div>
    )
});


const Features = ({ value, toggleFeature }) => {
    const array = Object.keys(value).map(key => ({ name: key, active: value[key] }));

    return (
        <React.Fragment>
            {array.filter(feature => feature.name !== 'exceptions').map(feature  => (
                <FormControlLabel
                    key={`feature_${feature.name}`}
                    control={
                        <Switch
                            checked={feature.active}
                            onChange={() => toggleFeature(feature.name)}
                            value='true'
                            color="primary"
                        />
                    }
                    label={feature.name}
                />
            ))}
        </React.Fragment>
    )
}

const toggleFeature = gql`
    mutation ToggleFeature($name: String!){
        toggleFeature(name: $name){
            success
            message
        }
    }
`;

const appConfig = gql`
    query AppConfig{
        adminFeatures{
            features {
                name
                active
            }
            exceptions {
                id
                featureName
                companyId
                active
            }
        }
    }
`;


export default compose(
    graphql(toggleFeature, { name: 'toggleFeature' }),
    graphql(appConfig)
)(DevAdminPage);