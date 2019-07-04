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

    console.log(data);

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

const Exceptions = withApollo(({ exceptions, features, refetch, client }) => {
    const [data, setData] = React.useState({
        companyId: '',
        feature: features[0].name
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

    const addException = () => {
        console.log(data);
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
                    value={data.feature}
                    floatingText={'Feature'}
                    onChange={event => setData({
                        ...data,
                        feature: event.target.value
                    })}
                >
                    {features.map(feature => (
                        <MenuItem value={feature.name} key={feature.name}>{feature.name}</MenuItem>
                    ))}
                </SelectInput>
            </div>
            <div style={{maxWidth: '300px'}}>
                <SelectInput
                    value={data.companyId}
                    floatingText={'Active'}
                    onChange={event => setData({
                        ...data,
                        active: event.target.value
                    })}
                >
                    <MenuItem value={true}>Activar</MenuItem>
                    <MenuItem value={false}>Desactivar</MenuItem>
                </SelectInput>
            </div>
            <BasicButton
                text="añadir"
                onClick={addException}
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