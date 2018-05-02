import React, { Component } from 'react';
import { Grid, GridItem } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import { Tooltip } from 'material-ui';
import { EMAIL_STATES_FILTERS } from '../../../constants';
import * as CBX from '../../../utils/CBX';


class NotificationFilters extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedFilter: ''
        }
    }

    changeFilter = (code) => {
        const { refetch } = this.props;
        const { selectedFilter } = this.state;

        if(selectedFilter === code){
            this.setState({
                selectedFilter: ''
            })
            refetch({
                notificationStatus: null
            });
        }else{
            refetch({
                notificationStatus: code
            });
            this.setState({
                selectedFilter: code
            })
        }

    }

    _renderFilterIcon = (value) => {
        const { selectedFilter } = this.state;
        const { translate } = this.props;

        return(
            <GridItem
                xs={1} lg={1} md={1}
                key={`emailFilter_${value}`}
                onClick={() => this.changeFilter(value)}
                style={{
                    cursor: 'pointer',
                    border: `1px solid ${getSecondary()}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: selectedFilter === value? '#dfeef1' : 'transparent'
                }}
            >
                <Tooltip title={translate[CBX.getTranslationReqCode(value)]} placement="top">
                    <img
                        src={CBX.getEmailIconByReqCode(value)}
                        alt="icon-email-dropped"
                        style={{
                            width: '80%',
                            height: 'auto'
                        }}
                    />
                </Tooltip>
            </GridItem>
        )
    }

    render(){
        const { translate } = this.props;

        return(
            <Grid style={{marginTop: '0.6em'}} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {`${translate.filter_by}: `}
                <GridItem xs={10} lg={10} md={10} style={{display: 'flex', flexDirection: 'row', marginLeft: '0.7em'}}>
                    {Object.keys(EMAIL_STATES_FILTERS).map((code, index) => (
                        this._renderFilterIcon(EMAIL_STATES_FILTERS[code])
                    ))}
                </GridItem>
            </Grid>
        );
    }
}

export default NotificationFilters;