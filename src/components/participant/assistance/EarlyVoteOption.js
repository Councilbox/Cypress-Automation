import React from 'react';
import gql from 'graphql-tag';
import { AlertConfirm, LoadingSection, BasicButton } from '../../../displayComponents';
import { PARTICIPANT_STATES, VOTE_VALUES, AGENDA_TYPES, PARTICIPANT_TYPE } from '../../../constants';
import AssistanceOption from './AssistanceOption';
import { withApollo } from 'react-apollo';
import { useCouncilAgendas } from '../../../hooks';
import { getSecondary } from '../../../styles/colors';
import { CircularProgress, MenuItem } from 'material-ui';
import VotingValueIcon from '../../council/live/voting/VotingValueIcon';


const EarlyVoteOption = ({ setState, state, participant, council, translate, client, ...props }) => {
    const [modal, setModal] = React.useState(false);
    const [selected, setSelected] = React.useState(new Map());
    
    const { data, loading } = useCouncilAgendas({
        councilId: council.id,
        participantId: participant.id,
        client
    })

    /*
        setState({
            ...state,
            assistanceIntention: PARTICIPANT_STATES.REMOTE,
            locked: false,
            delegateId: null
        })
    */

    const isActive = (agendaId, value) => {
        const point = selected.get(agendaId);

        if(!point){
            return false;
        }

        return point.value === value;
    }

    const earlyVoteMenu = participant => {
        return (
            data.agendas.filter(point => point.subjectType !== AGENDA_TYPES.INFORMATIVE).map(point => {
                return (
                    <div key={`point_${point.id}`}>
                        Punto: {point.agendaSubject}
                        <div style={{display: 'flex'}}>
                            {[VOTE_VALUES.POSITIVE, VOTE_VALUES.NEGATIVE, VOTE_VALUES.ABSTENTION].map(vote => {
                                const active = isActive(point.id, vote);
                                return (
                                    <div
                                        key={`vote_${vote}`}
                                        style={{
                                            height: "1.75em",
                                            width: "1.75em",
                                            marginRight: "0.2em",
                                            border: `2px solid ${"grey"}`,
                                            borderRadius: "3px",
                                            display: "flex",
                                            cursor: "pointer",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                        onClick={() => {
                                            setSelected(new Map(selected.set(point.id, {
                                                value: vote,
                                                agendaId: point.id,
                                                participantId: participant.id
                                            })));
                                            //setEarlyVote(point.id, vote)
                                        }}
                                    >
                                        <MenuItem
                                            selected={active}
                                            style={{
                                                display: "flex",
                                                fontSize: "0.9em",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                height: '100%',
                                                width: '100%',
                                                padding: 0,
                                                margin: 0
                                            }}
                                        >
                                            <VotingValueIcon
                                                vote={vote}
                                                color={active ? undefined : "grey"}
                                            />
                                        </MenuItem>
                                    </div>
                                )
                            })}
                        </div>
                        
                    </div>
                )
            })
        )
    }

    console.log(data);

    console.log(participant);

    return (
        <>
            <AssistanceOption
                translate={translate}
                title={translate.anticipate_vote}
                select={() => setModal(true)}
                value={PARTICIPANT_STATES.EARLY_VOTE}
                selected={state.assistanceIntention}
            />
            <AlertConfirm
                title={translate.anticipate_vote}
                buttonAccept={translate.accept}
                acceptAction={() => {
                    setState({
                        ...state,
                        assistanceIntention: PARTICIPANT_STATES.EARLY_VOTE,
                        requireDoc: false,
                        earlyVotes: Array.from(selected.values())
                    })
                    setModal(false)
                }}
                open={modal}
                bodyText={
                    <>
                        {loading?
                            <LoadingSection />
                        :
                            participant.type === PARTICIPANT_TYPE.REPRESENTATIVE?
                                participant.represented.map(item => {
                                    return (
                                        <>
                                            <div>
                                                {`${item.name} ${item.surname}`}
                                            </div>
                                            {earlyVoteMenu(item)}
                                        </>
                                    )
                                })
                            :
                                earlyVoteMenu(participant)
                        }
                    </>
                }
                requestClose={() => setModal(false)}
            />
        </>
    )
}


export default withApollo(EarlyVoteOption);