import React, { Component } from 'react';
import { Grid, GridItem, Icon, TextInput, LoadingSection } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import { Card, Typography, MenuItem, Tooltip } from 'material-ui';
import { liveParticipants } from '../../../queries';
import { graphql } from 'react-apollo';
import * as CBX from '../../../utils/CBX';
import ParticipantStateIcon from './ParticipantStateIcon';


class ParticipantsManager extends Component {

    constructor(props){
        super(props);
        this.state = {
            filterText: ''
        }
    }

    componentDidMount() {
        this.props.data.refetch();
    }

    updateFilterText = async (value) => {
        const { refetch } = this.props.data;
        this.setState({
            filterText: value
        });

        let variables = {
            filters: [ {
                field: 'fullName',
                text: value
            } ]
        };
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => refetch(variables), 450);
    };

    render(){
        const { translate } = this.props;



        return(
            <Grid style={{height: '100%', paddingTop: '2.2em'}}>
                <GridItem xs={9} md={9} lg={9} style={{minHeight: '100%', padding: '3em', paddingTop: 0}}>
                    <Card style={{height: '90%'}}>
                        <Grid style={{paddingTop: '2em'}}>
                            <GridItem xs={12} md={12} lg={12} style={{height: '2.8em', backgroundColor: 'WhiteSmoke', marginBottom: '3em'}}>

                            </GridItem>
                            {this.props.data.loading?
                                <LoadingSection />
                            :
                                this.props.data.liveParticipants.list.map((participant) => (
                                    <GridItem xs={4} md={4} lg={4} style={{display: 'flex', alignItem: 'center', justifyContent: 'center', marginBottom: '1.2em', cursor: 'pointer'}}>
                                        <MenuItem style={{width: '70%'}}>
                                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                                {<ParticipantStateIcon participant={participant} translate={translate} />}
                                                <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1.3em'}}>
                                                    <div style={{fontSize: '0.95em'}}>
                                                        {`${participant.name} ${participant.surname}`}
                                                    </div>
                                                    <div style={{color: 'grey', fontSize: '0.8em'}}>
                                                        {`${participant.position}`}
                                                    </div>
                                                </div>
                                                <div style={{display: 'flex', alignItem: 'center', justifyContent: 'center'}}>
                                                    {participant.notifications.length > 0?
                                                        <Tooltip title={translate[CBX.getTranslationReqCode(participant.notifications[0].reqCode)]}>
                                                            <img 
                                                                style={{height: '2.1em', width: 'auto'}}
                                                                src={CBX.getEmailIconByReqCode(participant.notifications[0].reqCode)}
                                                                alt="email-state-icon"
                                                            />
                                                        </Tooltip>
                                                    :
                                                        '-'
                                                    }
                                                </div>
                            
                                            </div>
                                        </MenuItem>
                                    </GridItem>
                                ))
                            }
                        </Grid>
                    </Card>
                </GridItem>
                <GridItem xs={3} md={3} lg={3} style={{height: '100%', padding: '2em'}}>
                    <TextInput
                        adornment={
                            <Icon>search</Icon>
                        }
                        floatingText={' '}
                        type="text"
                        value={this.state.filterText}
                        onChange={(event) => {
                            this.updateFilterText(event.target.value)
                        }}
                    />

                    <Typography variant="heading" style={{textTransform: 'uppercase', color: 'grey', marginTop: '1.2em', fontWeight: '700'}}>
                        {translate.current_state}
                    </Typography>
                </GridItem>
                
            </Grid>
        );
    }
}

export default graphql(liveParticipants, {
    options: (props) => ({
        variables: {
            councilId: props.council.id
        }
    })
})(ParticipantsManager);