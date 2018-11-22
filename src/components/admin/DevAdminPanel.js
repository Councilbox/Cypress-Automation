import React from 'react';
import { Grid, GridItem } from '../../displayComponents';
import ToggleRecordings from './featureControl/ToggleRecordings';
import ToggleVideo from './featureControl/ToggleVideo';
import LogoutUser from './featureControl/LogoutUser';
import RefreshUser from './featureControl/RefreshUser';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { ConfigContext } from '../../containers/AppControl';
import { Switch, FormControlLabel } from 'material-ui';

class DevAdminPage extends React.Component {

    toggleFeature = async name => {
        const response = await this.props.toggleFeature({
            variables: {
                name: name
            }
        });

        console.log(response);
    }

    render(){
        return (
            <div style={{width: '100%', height: '100%', padding: '1em'}}>
                <ConfigContext.Consumer>
                    {value => (
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
                                <Features value={value} toggleFeature={this.toggleFeature} />
                            </GridItem>
                        </Grid>
                    )}
                </ConfigContext.Consumer>
            </div>
        )
    }
}

const Features = ({ value, toggleFeature }) => {
    console.log(value);
    const array = Object.keys(value).map(key => ({ name: key, active: value[key] }));
    console.log(array);

    return (
        <React.Fragment>
            {array.map(feature  => (
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

export default graphql(toggleFeature, { name: 'toggleFeature' })(DevAdminPage);