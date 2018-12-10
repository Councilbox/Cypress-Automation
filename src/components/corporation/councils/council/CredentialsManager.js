import React from 'react';
import { LoadingSection, BasicButton, CollapsibleSection, AlertConfirm } from '../../../../displayComponents';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import NotificationsTable from '../../../notifications/NotificationsTable';
import { liveParticipant, updateParticipantSends } from "../../../../queries";
import ParticipantContactEditor from './ParticipantContactEditor';
import { PARTICIPANT_STATES } from '../../../../constants';
import StateIcon from '../../../council/live/participants/StateIcon';

class CredentialsManager extends React.Component {

    refreshSends = async id => {
        const response = await this.props.updateParticipantSends({
            variables: {
                participantId: id
            }
        });

        this.props.data.refetch();
    }

    render(){
        if(this.props.data.loading){
            return <LoadingSection />
        }

        return (
            <div>
                {this.props.data.liveParticipants.list
                    .filter(participant => participant.state !== PARTICIPANT_STATES.REPRESENTATED && participant.state !== PARTICIPANT_STATES.DELEGATED)
                    .map(participant => (
                    <CollapsibleSection
                        trigger={() => (
                            <div style={{width: '100%', padding: '1em', border: '2px solid gainsboro', display: 'flex', alignItems: 'center'}} onClick={() => this.refreshSends(participant.id)}>
                                <StateIcon state={participant.state} translate={this.props.translate} />
                                <span style={{marginLeft: '0.6em'}}>{`${participant.name} ${participant.surname} - tlf: ${participant.phone} - @: ${participant.email}`}</span>
                            </div>
                        )}
                        collapse={() => (
                            <div style={{border: '2px solid gainsboro', borderTop: '0px', marginBottom: '1.4em', padding: '1em'}}>
                                <ParticipantContactEditor
                                    participant={participant}
                                    translate={this.props.translate}
                                    refetch={this.props.data.refetch}
                                    key={participant.id}
                                    council={this.props.council}
                                />
                                <NotificationsTable
                                    translate={this.props.translate}
                                    notifications={participant.notifications}
                                />
                            </div>
                        )}
                        key={`participant_${participant.id}`}
                    />

                ))}
            </div>
        )
    }
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

