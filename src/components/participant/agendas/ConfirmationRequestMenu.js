import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, Grid, GridItem } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import VoteConfirmationModal from './VoteConfirmationModal';
import { VotingContext } from './AgendaNoSession';
import { voteAllAtOnce } from '../../../utils/CBX';
import { ConfigContext } from '../../../containers/AppControl';
import { isMobile } from '../../../utils/screen';
import * as CBX from '../../../utils/CBX';
import { AGENDA_STATES } from '../../../constants';
import { agendaRecountQuery } from '../../council/live/ActAgreements';


const styles = {
    division: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '.5em'
    },
    divisionM: {
        display: 'flex',
        alignItems: 'center',
        height: '50px',
    }
};

const ConfirmationRequestMenu = ({
 translate, singleVoteMode, agenda, council, votings, client, disabledColor, hasVideo, ...props
}) => {
    const [loading, setLoading] = React.useState(false);
    const config = React.useContext(ConfigContext);
    const [modal, setModal] = React.useState(false);
    const [recount, setRecount] = React.useState(false);
    const [vote, setVote] = React.useState(-1);
    const primary = getPrimary();
    const votingContext = React.useContext(VotingContext);
    const voteAtTheEnd = voteAllAtOnce({ council });
    let fixed;

    if (props.ownVote) {
        fixed = props.ownVote.fixed;
    }

    const getAgendaRecount = async () => {
        const response = await client.query({
            query: agendaRecountQuery,
            variables: {
                agendaId: agenda.id,
            }
        });
        setRecount(response.data.agendaRecount);
    };

    React.useEffect(() => {
        getAgendaRecount();
    }, []);

    const setAgendaVoting = voteData => {
        if (props.ownVote) {
            votingContext.responses.set(props.ownVote.id, voteData);
            votingContext.setResponses(new Map(votingContext.responses));
        }
    };

    const closeModal = () => {
        setModal(false);
        setVote(-1);
    };


    const buildRecountText = recountData => {
        const showRecount = ((CBX.getAgendaTypeLabel(agenda) !== 'private_votation'
            && council.statute.hideVotingsRecountFinished === 0) || agenda.votingState === AGENDA_STATES.CLOSED) && !config.hideRecount;

        return (
            showRecount ?
                ` (${translate.recount}: ${recountData}%)`
            : ''
        );
    };

    const updateAgendaVoting = async voteData => {
        setLoading(voteData);

        const response = await Promise.all(agenda.votings.map(voting => props.updateAgendaVoting({
                variables: {
                    agendaVoting: {
                        id: voting.id,
                        vote: voteData,
                    }
                }
            })));

        if (response) {
            setModal(false);
            setLoading(false);
            await props.refetch();
            getAgendaRecount();
            if (props.close) {
                props.close();
            }
        }
    };

    const getSelected = value => {
        if (props.ownVote) {
            return voteAtTheEnd ? votingContext.responses.get(props.ownVote.id) === value : props.ownVote.vote === value;
        }
    };

    let voteDenied = false;
    let denied = [];


    if (config.denyVote && agenda.votings.length > 0) {
        denied = agenda.votings.filter(voting => voting.author.voteDenied);


        if (denied.length === agenda.votings.length) {
            voteDenied = true;
        }
    }

    if (voteDenied) {
        return (
            <DeniedDisplay translate={translate} denied={denied} />
        );
    }

    const disabled = fixed || !props.ownVote;

    return (
        <Grid
            style={{
                width: '100%',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'row'
            }}
        >
            {denied.length > 0
                && 'Dentro de los votos depositados en usted, tiene votos denegados' // TRADUCCION
            }
            {fixed
                && translate.participant_vote_fixed
            }
            <VotingButton
                text={
                    hasVideo ?
                        translate.accept
                        : translate.accept + buildRecountText(CBX.getPercentage(recount.numPositive, recount.numTotal, 2))
                }
                loading={loading === 1}
                disabledColor={disabledColor}
                disabled={disabled}
                selected={getSelected(1)}
                icon={<i className="fa fa-check" aria-hidden="true" style={{ marginLeft: '0.2em', color: getSelected(1) ? primary : 'silver' }}></i>}
                onClick={() => {
                    if (voteAtTheEnd) {
                        setAgendaVoting(1);
                    } else {
                        updateAgendaVoting(1);
                    }
                }}
            />
            <VotingButton
                text={
                    hasVideo ?
                        translate.refuse
                        : translate.refuse + buildRecountText(CBX.getPercentage(recount.numNegative, recount.numTotal, 2))
                }
                loading={loading === 0}
                disabledColor={disabledColor}
                disabled={disabled}
                selected={getSelected(0)}
                icon={<i className="fa fa-times" aria-hidden="true" style={{ marginLeft: '0.2em', color: getSelected(0) ? primary : 'silver' }}></i>}
                onClick={() => {
                    if (voteAtTheEnd) {
                        setAgendaVoting(0);
                    } else {
                        updateAgendaVoting(0);
                    }
                }}
            />
            {voteAtTheEnd
                && <VoteConfirmationModal
                    open={modal}
                    requestClose={closeModal}
                    translate={translate}
                    acceptAction={() => updateAgendaVoting(vote)}
                />
            }
        </Grid>
    );
};

export const DeniedDisplay = ({ denied }) => (
    <div>
        No puede ejercer su derecho a voto
        <br />
        {denied.map(deniedVote => (
            <React.Fragment key={`${deniedVote.author.name}`}>
                <br />
                {`${deniedVote.author.name} ${deniedVote.author.surname || ''} ${deniedVote.author.voteDeniedReason ? `: ${deniedVote.author.voteDeniedReason}` : ''}`}
            </React.Fragment>
        ))}

    </div>
);


export const VotingButton = ({
 onClick, text, selected, icon, loading, onChange, disabled, styleButton, selectCheckBox, color, disabledColor
}) => {
    const primary = getPrimary();
    return (
        <GridItem xs={12} md={12} lg={12} style={isMobile ? styles.divisionM : styles.division}>
            <BasicButton
                text={text}
                color={color || (disabledColor ? 'gainsboro' : 'white')}
                disabled={disabled || selected || disabledColor}
                loading={loading}
                loadingColor={primary}
                icon={icon}
                textStyle={{
                    color: '#000000de',
                    fontWeight: '700',
                }}
                buttonStyle={{
                    width: '100%',
                    whiteSpace: 'pre-wrap',
                    border: (selected || selectCheckBox) && `2px solid ${primary}`,
                    ...styleButton,
                }}
                onClick={onClick}
                onChange={onChange}
            />
        </GridItem>
    );
};

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
})(withApollo(ConfirmationRequestMenu));
