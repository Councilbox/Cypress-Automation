import React from 'react';
import { Grid, GridItem } from '../../displayComponents';
import ToggleRecordings from './featureControl/ToggleRecordings';
import ToggleVideo from './featureControl/ToggleVideo';
import LogoutUser from './featureControl/LogoutUser';
import RefreshUser from './featureControl/RefreshUser';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Switch, FormControlLabel } from 'material-ui';


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
                </Grid>
            </div>
        )
}


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