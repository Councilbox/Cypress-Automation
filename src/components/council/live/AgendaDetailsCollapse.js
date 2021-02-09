import React from 'react';
import RecountSection from './RecountSection';
import Votings from './Votings';
import ActAgreements from './ActAgreements';
import AgendaAttachmentsManager from './AgendaAttachmentsManager';
import Comments from './Comments';

class AgendaDetailsCollapse extends React.Component {
    render(){
        return (
            <React.Fragment>
                <div
                    style={{
                        width: '100%',
                    }}
                    className="withShadow"
                >
                    <ActAgreements
                        agenda={agenda}
                        key={`agendaAgreements_${agenda.id}`}
                        translate={translate}
                        council={this.props.council}
                        refetch={this.props.refetch}
                        data={this.props.data}
                    />
                </div>
                {CBX.councilStarted(council) &&
                    <React.Fragment>
                        {CBX.councilHasComments(council.statute) && CBX.showAgendaVotingsTable(agenda) && (
                            <div
                                style={{
                                    width: '100%',
                                    marginTop: '0.4em'
                                }}
                                className="withShadow"
                            >
                                <Comments
                                    agenda={agenda}
                                    council={council}
                                    translate={translate}
                                />
                            </div>
                        )}
                        {CBX.showAgendaVotingsTable(agenda) && (
                            <React.Fragment>
                                <div
                                    style={{
                                        width: '100%',
                                        marginTop: '0.4em'
                                    }}
                                    className="withShadow"
                                >
                                    <RecountSection
                                        agenda={agenda}
                                        key={`agendaRecount_${agenda.id}`}
                                        council={council}
                                        translate={translate}
                                        recount={this.props.recount}
                                        refetch={this.props.refetch}
                                        majorityTypes={this.props.majorityTypes}
                                    />
                                </div>

                                <div
                                    style={{
                                        width: '100%',
                                        marginTop: '0.4em'
                                    }}
                                    className="withShadow"
                                >
                                    <Votings
                                        key={`agendaVotings_${agenda.id}`}
                                        ref={votings => (this.votings = votings)}
                                        refetch={this.props.refetch}
                                        agenda={agenda}
                                        translate={translate}
                                    />
                                </div>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                }
                <div
                    style={{
                        width: '100%',
                        marginTop: '0.4em'
                    }}
                    className="withShadow"
                >
                    <AgendaAttachmentsManager
                        attachments={agenda.attachments}
                        translate={translate}
                        key={`agendaAttachments_${agenda.id}`}
                        councilID={this.props.council.id}
                        refetch={this.props.refetch}
                        agendaID={agenda.id}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default AgendaDetailsCollapse;
