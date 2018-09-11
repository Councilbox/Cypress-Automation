import React from 'react';
import { BasicButton, Grid, GridItem } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const styles = {
    division: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '5em'
    }
}

class VotingMenu extends React.Component {
    
    state = {
        loading: true
    }

    votingOptions = [
        {
            label: this.props.translate.in_favor_btn,
            value: 1,
            icon: 'thumb_up'
        },
        {
            label: this.props.translate.in_favor_btn,
            value: 1,
            icon: 'thumb_down'
        },
        {
            label: this.props.translate.in_favor_btn,
            value: 1,
            icon: 'thumb_up'
        },
    ]

    updateAgendaVoting = async vote => {
        this.setState({
            loading: vote
        });

        const updateAgendaVoting = this.props.updateAgendaVoting;

        const response = await Promise.all(this.props.agenda.votings.map(voting => 
            updateAgendaVoting({
                variables: {
                    agendaVoting: {
                        id: voting.id,
                        vote: vote
                    }
                }
            })
        ));

        console.log(response)

/*         const response = await this.props.updateAgendaVoting({
            variables: {
                agendaVoting: {
                    id: this.props.agenda.voting.id,
                    vote: vote
                }
            }
        }); */

/*         if(response){
            if(response.data.updateAgendaVoting.success){
                await this.props.refetch();
                this.setState({
                    loading: false
                });
            }
        } */
    }

    render(){
        const { agenda } = this.props;
        const primary = getPrimary();

        return(
            <Grid
                style={{
                    width: '100%',
                    backgroundColor: 'white',
                    height: '6em',
                    paddingTop: '1em',
                    display: 'flex',
                    flexDirection: 'row'
                }}
            >
                <GridItem xs={4} md={4} lg={4} style={styles.division}>
                    <VotingButton
                        text={this.props.translate.in_favor_btn}
                        loading={this.state.loading === 1}
                        selected={agenda.votings[0].vote === 1}
                        icon={<i className="fa fa-check" aria-hidden="true" style={{marginLeft: '0.2em', color: agenda.votings[0].vote === 1? 'white': primary}}></i>}
                        onClick={() => {this.updateAgendaVoting(1)}}
                    />
                </GridItem>
                <GridItem xs={4} md={4} lg={4} style={styles.division}>
                    <VotingButton
                        text={this.props.translate.against_btn}
                        loading={this.state.loading === 0}
                        selected={agenda.votings[0].vote === 0}
                        icon={<i className="fa fa-times" aria-hidden="true" style={{marginLeft: '0.2em', color: agenda.votings[0].vote === 0? 'white': primary}}></i>}
                        onClick={() => {this.updateAgendaVoting(0)}}
                    />
                </GridItem>
                <GridItem xs={4} md={4} lg={4} style={styles.division}>
                    <VotingButton
                        text={this.props.translate.abstention_btn}
                        loading={this.state.loading === 2}
                        icon={<i className="fa fa-circle-o" aria-hidden="true" style={{marginLeft: '0.2em', color: agenda.votings[0].vote === 2? 'white': primary}}></i>}
                        selected={agenda.votings[0].vote === 2}
                        onClick={() => {this.updateAgendaVoting(2)}}
                    />
                </GridItem>
            </Grid>
        )
    }
}

const VotingButton = ({ onClick, text, selected, icon, loading }) => {

    const primary = getPrimary();

    return(
        <BasicButton
            text={text}
            color={selected? primary: 'white'}
            disabled={selected}
            loading={loading}
            loadingColor={primary}
            icon={icon}
            textStyle={{
                color: selected? 'white' : primary,
                fontWeight: '700'
            }}
            buttonStyle={{
                border: `2px solid ${primary}`
            }}
            onClick={onClick}
        />
    )
}

const updateAgendaVoting = gql`
    mutation UpdateAgendaVoting($agendaVoting: AgendaVotingInput!){
        updateAgendaVoting(agendaVoting: $agendaVoting){
            success
            message
        }
    }
`;

export default graphql(updateAgendaVoting, {
    name: 'updateAgendaVoting'
})(VotingMenu);