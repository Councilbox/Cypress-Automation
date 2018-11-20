import React from 'react';
import { Grid, GridItem } from '../../displayComponents';
import ToggleRecordings from './ToggleRecordings';
import ToggleVideo from './ToggleVideo';
import LogoutUser from './LogoutUser';
import RefreshUser from './RefreshUser';
import { ConfigContext } from '../../containers/AppControl';
import { Switch, FormControlLabel } from 'material-ui';

class DevAdminPage extends React.Component {


    render(){
        return (
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
                            <Prueba value={value} />
                        </GridItem>
                    </Grid>
                )}
            </ConfigContext.Consumer>
        )
    }
}

const Prueba = ({ value }) => {
    console.log(value);
    const array = Object.keys(value).map(key => ({ name: key, active: value[key] }));
    console.log(array);

    return (
        <React.Fragment>
            {array.map(feature  => (
                <FormControlLabel
                    control={
                        <Switch
                            checked={feature.active}
                            onChange={() => {}}
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

export default DevAdminPage;