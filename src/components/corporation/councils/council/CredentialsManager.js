import React from 'react';
import { LoadingSection, BasicButton, CollapsibleSection, AlertConfirm, TextInput } from '../../../../displayComponents';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import NotificationsTable from '../../../notifications/NotificationsTable';
import { liveParticipant, updateParticipantSends } from "../../../../queries";
import ParticipantContactEditor from './ParticipantContactEditor';
import { PARTICIPANT_STATES } from '../../../../constants';
import StateIcon from '../../../council/live/participants/StateIcon';

class CredentialsManager extends React.Component {

    state = {
        page: 1,
        limit: 10,
        filterText: '',
        visible: false
    }

    refreshSends = async id => {
        const response = await this.props.updateParticipantSends({
            variables: {
                participantId: id
            }
        });

        this.props.data.refetch();
    }

    toggleVisible = () => {
        const visible = !this.state.visible;
        this.setState({
            visible
        })
    }

    updatePage = page => {
        this.setState({
            page: page
        });
    }


    render(){
        if(this.props.data.loading){
            return <LoadingSection />
        }

        const filteredParticipants = filter(this.props.data.liveParticipants.list, this.state.filterText);
        const slicedParticipants = filteredParticipants.slice((this.state.page - 1 ) * this.state.limit, ((this.state.page  - 1 ) * this.state.limit) + this.state.limit);

        return (
            <div>
                <TextInput
                    value={this.state.filterText}
                    onChange={event => this.setState({filterText: event.target.value})}
                />
                {slicedParticipants.map(participant => (
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
                                    handleToggleVisib={this.toggleVisible}
                                    visib={this.state.visible}
                                    translate={this.props.translate}
                                    notifications={participant.notifications}
                                />
                            </div>
                        )}
                        key={`participant_${participant.id}`}
                    />

                ))}
                <div style={{display: 'flex', fontWeight: '700', alignItems: 'center', paddingTop: '0.5em'}}>
                    {this.state.page > 1 &&
                        <div onClick={() => this.updatePage(this.state.page - 1)} style={{ userSelect: 'none', fontSize: '1em', border: '1px solid white', padding: '0 0.2em', cursor: 'pointer'}}>{'<'}</div>
                    }
                    <div style={{margin: '0 0.3em'}}>{this.state.page}</div>
                    {(this.state.page < (this.props.data.liveParticipants.total / this.state.limit)) &&
                        <div onClick={() => this.updatePage(this.state.page + 1)} style={{ userSelect: 'none', fontSize: '1em', border: '1px solid white', padding: '0 0.2em', cursor: 'pointer'}}>{'>'}</div>
                    }

                </div>
            </div>
        )
    }
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

