import React from 'react';
import { TextInput, Grid, GridItem, BasicButton } from '../../../../displayComponents';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getSecondary } from '../../../../styles/colors';
import { updateAgenda } from "../../../../queries/agenda";

class ManualVotingsMenu extends React.Component {

    state = {
        positiveManual: this.props.agenda.positiveManual,
        negativeManual: this.props.agenda.negativeManual,
        abstentionManual: this.props.agenda.abstentionManual,
        noVoteManual: this.props.agenda.noVoteManual,
    }

    saveManualVotings = async () => {
        const { attachments, __typename, ...toSend } = this.props.agenda;
        this.setState({
            loading: true
        });
        const response = await this.props.updateAgenda({
            variables: {
                agenda: {
                    ...toSend,
                    positiveManual: this.state.positiveManual || 0,
                    negativeManual: this.state.negativeManual  || 0,
                    abstentionManual: this.state.abstentionManual || 0,
                    noVoteManual: this.state.noVoteManual || 0, 
                }
            }
        });

        if(!response.errors){
            this.setState({
                loading: false,
                success: true
            });
            this.props.refetch();
        }
    }

    resetButtonStates = () => {
        this.setState({
            loading: false,
            success: false
        });
    }

    render(){
        const { translate, agenda } = this.props;
        console.log('Present census', agenda.presentCensus);
        const votesLeft = (agenda.presentCensus - this.state.noVoteManual - this.state.abstentionManual - this.state.negativeManual - this.state.positiveManual);
        const maxVoteManual = votesLeft <= 0? 0 : votesLeft;
        console.log(votesLeft, maxVoteManual);

        return(
            <div style={{width: '100%', backgroundColor: 'white', padding: '0 1em'}}>
                <div 
                    style={{
                        backgroundColor: 'white',
                        width: '100%',
                        marginBottom: '1em',
                        padding: '0.6em',
                        border: '1px solid gainsboro',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Grid>
                        <GridItem xs={12} md={2} lg={2} style={{display: 'flex', alignItems: 'center'}}>
                            Votos manuales
                        </GridItem>
                        <GridItem xs={12} md={2} lg={2}>
                            <TextInput
                                value={this.state.positiveManual || 0}
                                type="number"
                                min={0}
                                max={maxVoteManual + this.state.positiveManual}
                                floatingText={translate.in_favor}
                                onChange={event => this.setState({
                                    positiveManual: maxVoteManual + this.state.positiveManual >= event.target.value? event.target.value : (+maxVoteManual + +this.state.positiveManual)
                                })}
                            />
                        </GridItem>
                        <GridItem xs={12} md={2} lg={2}>
                            <TextInput
                                value={this.state.negativeManual || 0}
                                type="number"
                                min={0}
                                max={maxVoteManual + this.state.negativeManual}
                                floatingText={translate.against}
                                onChange={event => this.setState({
                                    negativeManual: maxVoteManual + this.state.negativeManual >= event.target.value? event.target.value : (+maxVoteManual + +this.state.negativeManual)
                                })}
                            />
                        </GridItem>
                        <GridItem xs={12} md={2} lg={2}>
                            <TextInput
                                value={this.state.abstentionManual || 0}
                                type="number"
                                min={0}
                                max={maxVoteManual + this.state.abstentionManual}
                                floatingText={translate.abstentions}
                                onChange={event => this.setState({
                                    abstentionManual: maxVoteManual + this.state.abstentionManual >= event.target.value? event.target.value : (+maxVoteManual + +this.state.abstentionManual)
                                })}
                            />
                        </GridItem>
                        <GridItem xs={12} md={2} lg={2}>
                            <TextInput
                                value={this.state.noVoteManual || 0}
                                type="number"
                                min={0}
                                max={maxVoteManual + this.state.noVoteManual}
                                floatingText={translate.no_vote}
                                onChange={event => this.setState({
                                    noVoteManual: maxVoteManual + this.state.noVoteManual >= event.target.value? event.target.value : (+maxVoteManual + +this.state.noVoteManual)
                                })}
                            />
                        </GridItem>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <BasicButton
                                loading={this.state.loading}
                                success={this.state.success}
                                reset={this.resetButtonStates}
                                text={translate.save}
                                textStyle={{color: 'white', fontWeight: '700'}}
                                color={getSecondary()}
                                onClick={this.saveManualVotings}
                            />
                        </div>
                    </Grid>
                </div>
            </div>
        )
    }
}

export default graphql(updateAgenda, {
    name: 'updateAgenda'
})(ManualVotingsMenu);