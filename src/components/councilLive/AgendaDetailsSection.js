import React, { Component, Fragment } from 'react';
import AgendaAttachmentsManager from './AgendaAttachmentsManager';
import ActAgreements from './ActAgreements';
import OpenRoomButton from './OpenRoomButton';
import StartCouncilButton from './StartCouncilButton';
import EndCouncilButton from './EndCouncilButton';
import ToggleAgendaButton from './ToggleAgendaButton';
import ToggleVotingsButton from './ToggleVotingsButton';
import RecountSection from './RecountSection';
import CommentsSection from './CommentsSection';
import VotingsSection from './VotingsSection';


class AgendaDetailsSection extends Component {

    constructor(props){
        super(props);
        this.state = {
            openIndex: 0
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.agendas){
            const openAgenda = nextProps.agendas.find((agenda, index) => agenda.point_state === 1 || (agenda.point_state === 0 && nextProps.agendas[index - 1].point_state === 2));
            if(openAgenda){
                this.setState({
                    openIndex: openAgenda.order_index
                })
            }else{
                this.setState({
                    openIndex: 0
                })
            }
        }
    }

    getAttachmentByID = (id) => {
        const attachment = this.props.attachments.filter(attachment => {
			return attachment.agenda_id === id;
        });
        return attachment;
    }
    
    render(){
        const { translate, council, agendas, participants, refetch } = this.props;
        if(!this.props.council.agendas){
            return(
                <div>Nada hay puntos del día</div>
            )
        }
        const agenda = agendas[this.props.selectedPoint];
        
        return(
            <div style={{width: '100%', height: '100%', margin: 0, overflow: 'auto'}}>
                <div className="row" style={{width: '100%', padding: '2em'}}>
                    <div className="col-lg-6 col-md-5 col-xs-5">
                        {agenda.agenda_subject}<br />
                        <div
                            style={{fontSize: '0.9em', marginTop: '1em'}}
                            dangerouslySetInnerHTML={{__html: agenda.description}}
                        />
                    </div>
                    <div className="col-lg-6 col-md-5 col-xs-5">
                        <div className="row">
                            {council.council_started === 1 && agenda.point_state !== 2 &&
                                <div className="col-lg-6 col-md-12 col-xs-12" style={{marginTop: '0.6em'}}>
                                    <ToggleAgendaButton
                                        agenda={agenda}
                                        translate={translate}
                                        refetch={refetch}
                                        active={agenda.order_index === this.state.openIndex}
                                    />
                                </div>
                            }
                            {council.state === 20?
                                council.council_started === 0?
                                    <div className="col-lg-6 col-md-12 col-xs-12" style={{marginTop: '0.6em'}}>
                                        <StartCouncilButton 
                                            council={council}
                                            translate={translate}
                                            participants={participants}
                                            refetch={refetch}
                                        />
                                    </div>
                                :
                                    <div className="col-lg-6 col-md-12 col-xs-12" style={{marginTop: '0.6em'}}>
                                        <EndCouncilButton
                                            council={council}
                                            translate={translate}
                                        />
                                    </div>
                            :
                                <OpenRoomButton
                                    translate={translate}
                                    council={council}
                                    refetch={refetch}
                                />

                            }
                            {council.council_started === 1 && agenda.subject_type !== 0 && agenda.voting_state !== 2 &&
                                <div className="col-lg-6 col-md-12 col-xs-12" style={{marginTop: '0.6em'}}>
                                    <ToggleVotingsButton 
                                        council={council}
                                        agenda={agenda}
                                        translate={translate}
                                        refetch={refetch}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div style={{width: '100%', marginTop: '2em'}} className="withShadow">
                    <ActAgreements
                        agenda={agenda}
                        translate={translate}
                        councilID={this.props.council.id}
                        refetch={this.props.refetch}
                        agendaID={agenda.id}
                    />
                </div>
                {council.council_started !== 0 && agenda.voting_state !== 0 && 
                    <Fragment>
                        <div style={{width: '100%', marginTop: '0.4em'}} className="withShadow">
                            <RecountSection
                                agenda={agenda}
                                council={council}
                                majorities={this.props.majorities}
                                translate={translate}
                                councilID={this.props.council.id}
                                refetch={this.props.refetch}
                                agendaID={agenda.id}
                            />
                        </div>
                        {council.statutes[0].exists_comments &&
                            <div style={{width: '100%', marginTop: '0.4em'}} className="withShadow">
                                <CommentsSection
                                    agenda={agenda}
                                    council={council}
                                    translate={translate}
                                    councilID={this.props.council.id}
                                    refetch={this.props.refetch}
                                    agendaID={agenda.id}
                                />
                            </div>
                        }
                        <div style={{width: '100%', marginTop: '0.4em'}} className="withShadow">
                            <VotingsSection
                                agenda={agenda}
                                council={council}
                                majorities={this.props.majorities}
                                translate={translate}
                                councilID={this.props.council.id}
                                refetch={this.props.refetch}
                                agendaID={agenda.id}
                            />
                        </div>
                    </Fragment>
                }
                <div style={{width: '100%', marginTop: '0.4em'}} className="withShadow">
                    <AgendaAttachmentsManager
                        attachments={this.getAttachmentByID(agenda.id)}
                        translate={translate}
                        councilID={this.props.council.id}
                        refetch={this.props.refetch}
                        agendaID={agenda.id}
                    />
                </div>
            </div>
        );
    }

}

export default AgendaDetailsSection;