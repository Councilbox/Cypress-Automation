import React from 'react';
import { BasicButton, Grid, GridItem } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import VoteConfirmationModal from './VoteConfirmationModal';
import { isMobile } from 'react-device-detect';
import { VotingContext } from './AgendaNoSession';
import { voteAllAtOnce } from '../../../utils/CBX';
import { ConfigContext } from '../../../containers/AppControl';


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

const VotingMenu = ({ translate, singleVoteMode, agenda, council, ...props }) => {
    const [loading, setLoading] = React.useState(false);
    const config = React.useContext(ConfigContext);
    const [modal, setModal] = React.useState(false);
    const [vote, setVote] = React.useState(-1);
    const primary = getPrimary();
    const votingContext = React.useContext(VotingContext);
    const voteAtTheEnd = voteAllAtOnce({ council });

    const setAgendaVoting = vote => {
        votingContext.responses.set(props.ownVote.id, vote);
        votingContext.setResponses(new Map(votingContext.responses));
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

    const getSelected = value => {
        return voteAtTheEnd? votingContext.responses.get(props.ownVote.id) === value : props.ownVote.vote === value;
    }

    let voteDenied = false;
    let denied = [];


    if(config.denyVote && agenda.votings.length > 0){
        denied = agenda.votings.filter(voting => voting.author.voteDenied);


        if(denied.length === agenda.votings.length){
            voteDenied = true;
        }
    }

    if(voteDenied){
        return (
            <DeniedDisplay translate={translate} denied={denied} />
        )

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
            {denied.length > 0 &&
                'Dentro de los votos depositados en usted, tiene votos denegados' //TRADUCCION
            }
            <VotingButton
                text={translate.in_favor_btn}
                loading={loading === 1}
                selected={getSelected(1)}
                icon={<i className="fa fa-check" aria-hidden="true" style={{ marginLeft: '0.2em', color: getSelected(1)? primary : 'silver' }}></i>}
                onClick={() => {
                    if (voteAtTheEnd) {
                        setAgendaVoting(1)
                    } else {
                        updateAgendaVoting(1)
                    }
                }}
            />
            <VotingButton
                text={translate.against_btn}
                loading={loading === 0}
                selected={getSelected(0)}
                icon={<i className="fa fa-times" aria-hidden="true" style={{ marginLeft: '0.2em', color: getSelected(0)? primary : 'silver' }}></i>}
                onClick={() => {0
                    if (voteAtTheEnd) {
                        setAgendaVoting(0)
                    } else {
                        updateAgendaVoting(0)
                    }
                }}
            />

            <VotingButton
                text={translate.abstention_btn}
                loading={loading === 2}
                icon={<i className="fa fa-circle-o" aria-hidden="true" style={{ marginLeft: '0.2em', color: getSelected(2)? primary : 'silver' }}></i>}
                selected={getSelected(2)}
                onClick={() => {
                    if (voteAtTheEnd) {
                        setAgendaVoting(2)
                    } else {
                        updateAgendaVoting(2)
                    }
                }}
            />
            <VotingButton
                text={translate.dont_vote}
                selected={getSelected(-1)}
                onClick={() => {
                    if (voteAtTheEnd) {
                        setAgendaVoting(-1)
                    } else {
                        updateAgendaVoting(-1)
                    }
                }}
            />
            {voteAtTheEnd &&
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

export const DeniedDisplay = ({ translate, denied }) => {
    //TRADUCCION
    return (
        <div>
            No puede ejercer su derecho a voto
            <br/>
            {denied.map(deniedVote => (
                <React.Fragment>
                    <br/>
                    {`${deniedVote.author.name} ${deniedVote.author.surname} ${deniedVote.author.voteDeniedReason? `: ${deniedVote.author.voteDeniedReason}` : ''}`}
                </React.Fragment>
            ))}

        </div>
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
                    whiteSpace: 'pre-wrap',
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