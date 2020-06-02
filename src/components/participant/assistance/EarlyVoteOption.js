import React from 'react';
import gql from 'graphql-tag';
import { AlertConfirm, LoadingSection, BasicButton } from '../../../displayComponents';
import { PARTICIPANT_STATES, VOTE_VALUES, AGENDA_TYPES, PARTICIPANT_TYPE } from '../../../constants';
import AssistanceOption from './AssistanceOption';
import { withApollo } from 'react-apollo';
import { useCouncilAgendas } from '../../../hooks';
import { getSecondary, getPrimary } from '../../../styles/colors';
import { CircularProgress, MenuItem } from 'material-ui';
import VotingValueIcon from '../../council/live/voting/VotingValueIcon';
import { isCustomPoint } from '../../../utils/CBX';
import { VotingButton } from '../agendas/VotingMenu';


const EarlyVoteOption = ({ setState, state, participant, council, translate, client, ...props }) => {
    const [modal, setModal] = React.useState(false);
    const [selected, setSelected] = React.useState(new Map());
    
    const { data, loading } = useCouncilAgendas({
        councilId: council.id,
        participantId: participant.id,
        client
    })

    console.log(data);

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

                if(!isCustomPoint(point.subjectType)){
                    return (
                        <div key={`point_${point.id}`}>
                            Punto: {point.agendaSubject}
                            <div style={{display: 'flex'}}>
                                {[VOTE_VALUES.POSITIVE, VOTE_VALUES.NEGATIVE, VOTE_VALUES.ABSTENTION].map(vote => {
                                    const active = isActive(`${point.id}_${participant.id}`, vote);
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
                                                setSelected(new Map(selected.set(`${point.id}_${participant.id}`, {
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
                }

                const selections = point.items.reduce((acc, curr) => {
                    const key = `${point.id}_${curr.id}_${participant.id}`;
                    if(isActive(key, curr.id)){
                        acc++;
                        return acc;
                    }
                    return acc;
                }, 0)

                const disabled = selections >= point.options.maxSelections;
                return (
                    <div key={`point_${point.id}`} style={{marginTop: '1.3em'}}>
                        Punto: {point.agendaSubject}
                        <div>
                            {point.items.map(item => {
                                const key = `${point.id}_${item.id}_${participant.id}`;
                                const active = isActive(key, item.id);
                                return (
                                    <VotingButton
                                        disabled={disabled && !active}
                                        disabledColor={disabled && !active}
                                        styleButton={{ padding: '0', width: '100%' }}
                                        selectCheckBox={active}
                                        onClick={() => {
                                            if(active){
                                                selected.delete(key)
                                                setSelected(new Map(selected))
                                            } else {
                                                setSelected(new Map(selected.set(key, {
                                                    value: item.id,
                                                    agendaId: point.id,
                                                    participantId: participant.id
                                                })))
                                            }
                                        }}
                                        text={item.value}
                                    />
                                )
                            })}
                        </div>
                    </div>
                )
                
            })
        )
    }

    console.log(selected);
    
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