import React from 'react';
import { LoadingSection, BasicButton, CollapsibleSection, AlertConfirm } from '../../../../displayComponents';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import NotificationsTable from '../../../notifications/NotificationsTable';
import { liveParticipant, updateParticipantSends } from "../../../../queries";
import ParticipantContactEditor from './ParticipantContactEditor';

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
        console.log(this.props.council);
        if(this.props.data.loading){
            return <LoadingSection />
        }

        return (
            <div>
                {this.props.data.liveParticipants.list.map(participant => (
                    <CollapsibleSection
                        trigger={() => (
                            <div style={{width: '100%', padding: '1em', border: '2px solid gainsboro'}} onClick={() => this.refreshSends(participant.id)}>
                                {`${participant.name} ${participant.surname} - tlf: ${participant.phone} - @: ${participant.email}`}
                            </div>
                        )}
                        collapse={() => (
                            <div>
                                <ParticipantContactEditor

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
    query CredsParticipants($councilId: Int!){
        liveParticipants(councilId: $councilId){
            list {
                name
                surname
                phone
                email
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
                councilId: props.council.id
            }
        })
    }),
    graphql(updateParticipantSends, {
		name: "updateParticipantSends"
	})
)(CredentialsManager);

