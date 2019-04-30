import React from 'react';
import { LoadingSection,  CollapsibleSection, TextInput } from '../../../../displayComponents';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import NotificationsTable from '../../../notifications/NotificationsTable';
import {  updateParticipantSends } from "../../../../queries";
import ParticipantContactEditor from './ParticipantContactEditor';
import StateIcon from '../../../council/live/participants/StateIcon';
import { useOldState } from '../../../../hooks';

const CredentialsManager = ({ translate, ...props }) => {
    const [state, setState] = useOldState({
        page: 1,
        limit: 10,
        filterText: '',
        visible: false
    });

    const refreshSends = async id => {
        await props.updateParticipantSends({
            variables: {
                participantId: id
            }
        });

        props.data.refetch();
    }

    const toggleVisible = () => {
        const visible = !state.visible;
        setState({
            visible
        });
    }

    const updatePage = page => {
        setState({
            page
        });
    }

    if(props.data.loading){
        return <LoadingSection />
    }

    const filteredParticipants = filter(props.data.liveParticipants.list, state.filterText);
    const slicedParticipants = filteredParticipants.slice((state.page - 1 ) * state.limit, ((state.page  - 1 ) * state.limit) + state.limit);

    return (
        <div>
            <TextInput
                value={state.filterText}
                onChange={event => setState({filterText: event.target.value})}
            />
            {slicedParticipants.map(participant => (
                <CollapsibleSection
                    trigger={() => (
                        <div style={{width: '100%', padding: '1em', border: '2px solid gainsboro', display: 'flex', alignItems: 'center'}} onClick={() => refreshSends(participant.id)}>
                            <StateIcon state={participant.state} translate={translate} />
                            <span style={{marginLeft: '0.6em'}}>{`${participant.name} ${participant.surname} - tlf: ${participant.phone} - @: ${participant.email}`}</span>
                        </div>
                    )}
                    collapse={() => (
                        <div style={{border: '2px solid gainsboro', borderTop: '0px', marginBottom: '1.4em', padding: '1em'}}>
                            <ParticipantContactEditor
                                participant={participant}
                                translate={translate}
                                refetch={props.data.refetch}
                                key={participant.id}
                                council={props.council}
                            />
                            <NotificationsTable
                                handleToggleVisib={toggleVisible}
                                visib={state.visible}
                                translate={translate}
                                notifications={participant.notifications}
                            />
                        </div>
                    )}
                    key={`participant_${participant.id}`}
                />

            ))}
            <div style={{display: 'flex', fontWeight: '700', alignItems: 'center', paddingTop: '0.5em'}}>
                {state.page > 1 &&
                    <div onClick={() => updatePage(state.page - 1)} style={{ userSelect: 'none', fontSize: '1em', border: '1px solid white', padding: '0 0.2em', cursor: 'pointer'}}>{'<'}</div>
                }
                <div style={{margin: '0 0.3em'}}>{state.page}</div>
                {(state.page < (props.data.liveParticipants.total / state.limit)) &&
                    <div onClick={() => updatePage(state.page + 1)} style={{ userSelect: 'none', fontSize: '1em', border: '1px solid white', padding: '0 0.2em', cursor: 'pointer'}}>{'>'}</div>
                }

            </div>
        </div>
    )
}

const filter = (participants, text) => {
    if(!text){
        return participants;
    }
    const lText = text.toLowerCase();
    return participants.filter(participant => {
        return `${participant.name} ${participant.surname}`.toLowerCase().includes(lText) || participant.email.toLowerCase().includes(lText) || participant.phone.includes(lText)
    });
}

const participants = gql`
    query CredsParticipants($councilId: Int!, $options: OptionsInput){
        liveParticipants(councilId: $councilId, options: $options){
            list {
                name
                surname
                phone
                email
                state
                id
                notifications {
                    participantId
                    email
                    reqCode
                    refreshDate
                    sendDate
                    sendType
                }
            }
            total
        }
    }
`;

export default compose(
    graphql(participants, {
        options: props => ({
            variables: {
                councilId: props.council.id,
                options: {
                    orderBy: 'fullName',
                    orderDirection: 'asc'
                }
            }
        })
    }),
    graphql(updateParticipantSends, {
		name: "updateParticipantSends"
	})
)(CredentialsManager);

