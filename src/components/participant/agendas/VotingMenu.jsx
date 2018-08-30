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
        const response = await this.props.updateAgendaVoting({
            variables: {
                agendaVoting: {
                    id: this.props.agenda.voting.id,
                    vote: vote
                }
            }
        });

        if(response.data.updateAgendaVoting){
            if(response.data.updateAgendaVoting.success){
                this.props.refetch();
            }
        }
    }

    render(){
        const { agenda } = this.props;

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
                        selected={agenda.voting.vote === 1}
                        onClick={() => {this.updateAgendaVoting(1)}}
                    />
                </GridItem>
                <GridItem xs={4} md={4} lg={4} style={styles.division}>
                    <VotingButton
                        text={this.props.translate.against_btn}
                        selected={agenda.voting.vote === 0}
                        onClick={() => {this.updateAgendaVoting(0)}}
                    />
                </GridItem>
                <GridItem xs={4} md={4} lg={4} style={styles.division}>
                    <VotingButton
                        text={this.props.translate.abstention_btn}
                        selected={agenda.voting.vote === 2}
                        onClick={() => {this.updateAgendaVoting(2)}}
                    />
                </GridItem>
            </Grid>
        )
    }
}

const VotingButton = ({ onClick, text, selected }) => {

    const primary = getPrimary();

    return(
        <BasicButton
            text={text}
            color={selected? primary: 'white'}
            disabled={selected}
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