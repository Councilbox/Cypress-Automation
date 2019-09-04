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
        marginTop: ".5em"
    },
    divisionM: {
        display: 'flex',
        alignItems: 'center',
        height: '50px',
    }
}

const VotingMenu = ({ translate, singleVoteMode, agenda, ...props }) => {
    const [loading, setLoading] = React.useState(false);
    const [modal, setModal] = React.useState(false);
    const [vote, setVote] = React.useState(-1);
    const primary = getPrimary();

    const showModal = vote => {
        setModal(true);
        setVote(vote);
    }

    const closeModal = () => {
        setModal(false);
        setVote(-1);
    }

    const updateAgendaVoting = async vote => {
        setLoading(vote);
        const response = await Promise.all(agenda.votings.map(voting =>
            props.updateAgendaVoting({
                variables: {
                    agendaVoting: {
                        id: voting.id,
                        vote: vote,
                    }
                }
            })
        ));

        if (response) {
            setModal(false);
            setLoading(false);
            await props.refetch();
            props.close();
        }
    }

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
                text={translate.in_favor_btn}
                loading={loading === 1}
                selected={agenda.votings[0].vote === 1}
                icon={<i className="fa fa-check" aria-hidden="true" style={{ marginLeft: '0.2em', color: agenda.votings[0].vote === 1? primary : 'silver' }}></i>}
                onClick={() => {
                    if (singleVoteMode) {
                        showModal(1)
                    } else {
                        updateAgendaVoting(1)
                    }
                }}
            />
            <VotingButton
                text={translate.against_btn}
                loading={loading === 0}
                selected={agenda.votings[0].vote === 0}
                icon={<i className="fa fa-times" aria-hidden="true" style={{ marginLeft: '0.2em', color: agenda.votings[0].vote === 0? primary : 'silver' }}></i>}
                onClick={() => {
                    if (singleVoteMode) {
                        showModal(0)
                    } else {
                        updateAgendaVoting(0)
                    }
                }}
            />

            <VotingButton
                text={translate.abstention_btn}
                loading={loading === 2}
                icon={<i className="fa fa-circle-o" aria-hidden="true" style={{ marginLeft: '0.2em', color: agenda.votings[0].vote === 2? primary : 'silver' }}></i>}
                selected={agenda.votings[0].vote === 2}
                onClick={() => {
                    if (singleVoteMode) {
                        showModal(2)
                    } else {
                        updateAgendaVoting(2)
                    }
                }}
            />
            <VotingButton
                text={translate.dont_vote}
                selected={agenda.votings[0].vote === -1}
                onClick={() => {
                    if (singleVoteMode) {
                        showModal(-1)
                    } else {
                        updateAgendaVoting(-1)
                    }
                }}
            />
            {singleVoteMode &&
                <VoteConfirmationModal
                    open={modal}
                    requestClose={closeModal}
                    translate={translate}
                    acceptAction={() => updateAgendaVoting(vote)}
                />
            }
        </Grid>
    )

}

export const VotingButton = ({ onClick, text, selected, icon, loading, onChange, disabled, styleButton, selectCheckBox, color }) => {

    const primary = getPrimary();

    return (
        <GridItem xs={12} md={12} lg={12} style={isMobile ? styles.divisionM : styles.division}>
            <BasicButton
                text={text}
                color={color ? color : "white"}
                disabled={disabled || selected}
                loading={loading}
                loadingColor={primary}
                icon={icon}
                textStyle={{
                    color: '#000000de',
                    fontWeight: '700'
                }}
                buttonStyle={{
                    width: '100%',
                    border: (selected || selectCheckBox) && `2px solid ${primary}`,
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