import React from 'react';
import { BasicButton, Grid, GridItem } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import VoteConfirmationModal from './VoteConfirmationModal';
import { isMobile } from 'react-device-detect';


const styles = {
    division: {
        display: 'flex',
        alignItems: 'center',
        // justifyContent: 'center',
        // height: '5em',
        marginTop: ".5em"
    },
    divisionM: {
        display: 'flex',
        alignItems: 'center',
        height: '50px',
    }
}

class VotingMenu extends React.Component {

    state = {
        loading: true,
        modal: false,
        vote: -1,
    }

    showModal = vote => {
        this.setState({
            modal: true,
            vote: vote
        });
    }

    closeModal = () => {
        this.setState({
            modal: false,
            vote: -1
        });
    }

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
                        vote: vote,
                    }
                }
            })
        ));

        if (response) {
            this.setState({
                modal: false,
                loading: false
            });
            await this.props.refetch();
            this.props.close();
        }
    }

    render() {
        const { agenda, singleVoteMode } = this.props;
        const primary = getPrimary();

        return (
            <Grid
                style={{
                    width: '100%',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'row'
                }}
            >
                <VotingButton
                    text={this.props.translate.in_favor_btn}
                    loading={this.state.loading === 1}
                    selected={agenda.votings[0].vote === 1}
                    icon={<i className="fa fa-check" aria-hidden="true" style={{ marginLeft: '0.2em', color: primary }}></i>}
                    onClick={() => {
                        if (singleVoteMode) {
                            this.showModal(1)
                        } else {
                            this.updateAgendaVoting(1)
                        }
                    }}
                />
                <VotingButton
                    text={this.props.translate.against_btn}
                    loading={this.state.loading === 0}
                    selected={agenda.votings[0].vote === 0}
                    icon={<i className="fa fa-times" aria-hidden="true" style={{ marginLeft: '0.2em', color: primary }}></i>}
                    onClick={() => {
                        if (singleVoteMode) {
                            this.showModal(0)
                        } else {
                            this.updateAgendaVoting(0)
                        }
                    }}
                />

                <VotingButton
                    text={this.props.translate.abstention_btn}
                    loading={this.state.loading === 2}
                    icon={<i className="fa fa-circle-o" aria-hidden="true" style={{ marginLeft: '0.2em', color: primary }}></i>}
                    selected={agenda.votings[0].vote === 2}
                    onClick={() => {
                        if (singleVoteMode) {
                            this.showModal(2)
                        } else {
                            this.updateAgendaVoting(2)
                        }
                    }}
                />
                <VotingButton
                    text={"Quitar Voto"} //TRADUCCION
                    onClick={() => { 
                        if (singleVoteMode) {
                            this.showModal(-1)
                        } else {
                            this.updateAgendaVoting(-1)
                        }
                    }}
                />
                {singleVoteMode &&
                    <VoteConfirmationModal
                        open={this.state.modal}
                        requestClose={this.closeModal}
                        translate={this.props.translate}
                        acceptAction={() => this.updateAgendaVoting(this.state.vote)}
                    />
                }
            </Grid>
        )
    }
}

export const VotingButton = ({ onClick, text, selected, icon, loading, onChange, disabled, styleButton, selectCheckBox, color }) => {

    const primary = getPrimary();
   
    return (
        <GridItem xs={12} md={12} lg={12} style={isMobile ? styles.divisionM : styles.division}>
            <BasicButton
                text={text}
                color={color ? color : "white"}
                disabled={selected || disabled}
                loading={loading}
                loadingColor={primary}
                icon={icon}
                textStyle={{
                    color: '#000000de',
                    fontWeight: '700'
                }}
                buttonStyle={{
                    width: '200px',
                    border: selected || selectCheckBox && `2px solid ${primary}`,
                    ...styleButton
                }}
                onClick={onClick}
                onChange={onChange}
            />
        </GridItem>
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