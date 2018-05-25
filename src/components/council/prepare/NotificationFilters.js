import React, { Component } from 'react';
import { Grid, GridItem } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import { Tooltip } from 'material-ui';
import { EMAIL_STATES_FILTERS } from '../../../constants';
import * as CBX from '../../../utils/CBX';


class NotificationFilters extends Component {

    changeFilter = (code) => {
        const { refetch } = this.props;
        const { selectedFilter } = this.state;

        if (selectedFilter === code) {
            this.setState({
                selectedFilter: ''
            });
            refetch({
                notificationStatus: null
            });
        } else {
            refetch({
                notificationStatus: code
            });
            this.setState({
                selectedFilter: code
            })
        }
    };
    _renderFilterIcon = (value) => {
        const { selectedFilter } = this.state;
        const { translate } = this.props;

        return (<div
            key={`emailFilter_${value}`}
            onClick={() => this.changeFilter(value)}
            style={{
                cursor: 'pointer',
                border: `1px solid ${getSecondary()}`,
                backgroundColor: selectedFilter === value ? '#dfeef1' : 'transparent',
                padding: '0.2em 0.3em',
                margin: '0.1em',
                borderRadius: '3px'
            }}
        >
            <Tooltip title={translate[ CBX.getTranslationReqCode(value) ]} placement="top">
                <img
                    src={CBX.getEmailIconByReqCode(value)}
                    alt={value}
                    style={{
                        width: '25px',
                        height: 'auto'
                    }}
                />
            </Tooltip>
        </div>)
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedFilter: ''
        }
    }

    render() {
        const { translate } = this.props;

        return (<Grid>
            <GridItem xs={4} md={9} lg={3}
                      style={{ paddingTop: '0.6em' }}>
                {`${translate.filter_by}: `}
            </GridItem>
            <GridItem xs={8} md={9} lg={9} style={{
                display: 'flex',
                flexDirection: 'row'
            }}>
                {Object.keys(EMAIL_STATES_FILTERS).map((code) => (this._renderFilterIcon(EMAIL_STATES_FILTERS[ code ])))}
            </GridItem>
        </Grid>);
    }
}

export default NotificationFilters;