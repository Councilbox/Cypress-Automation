import React from 'react';
import { Tabs, Tab } from 'material-ui';
import * as CBX from "../../../utils/CBX";
import { Scrollbar } from '../../../displayComponents';
import ActAgreements from './ActAgreements';
import Comments from './Comments';
import RecountSection from './RecountSection';
import Votings from "./Votings";
import { AGENDA_TYPES } from '../../../constants';
import AgendaAttachmentsManager from "./AgendaAttachmentsManager";


class AgendaDetailsTabs extends React.Component {

    state = {
        selectedTab: 0
    }

    handleChange = (event, index) => {
        this.setState({
            selectedTab: index
        })
    }


    render() {
        const { agenda, translate, council } = this.props;

        return (
            <div style={{width: '100%', height: '100%', backgroundColor: 'white', borderTop: '1px solid gainsboro', display: 'flex', flexDirection: 'column'}}>
                <Tabs
                    value={this.state.selectedTab}
                    indicatorColor="secondary"
                    textColor="secondary"
                    onChange={this.handleChange}
                >
                    <Tab label={translate.comments_and_agreements} />
                    <Tab label={translate.act_comments} disabled={!CBX.councilStarted(council)}/>
                    {agenda.subjectType !== AGENDA_TYPES.INFORMATIVE &&
                        <Tab label={translate.voting} disabled={!CBX.councilStarted(council) || !CBX.showAgendaVotingsTable(agenda)}/>
                    }
                    <Tab label={translate.attachment_files} />
                </Tabs>
                <div style={{borderTop: '1px solid gainsboro', height: 'calc(100% - 48px)'}}>
                    <Scrollbar>
                        {this.state.selectedTab === 0 &&
                            <div style={{padding: '1em'}}>
                                <ActAgreements
                                    agenda={agenda}
                                    key={`agendaAgreements_${agenda.id}`}
                                    translate={translate}
                                    council={this.props.council}
                                    refetch={this.props.refetch}
                                    data={this.props.data}
                                />
                            </div>
                        }
                        {this.state.selectedTab === 1 &&
                            <div style={{marginTop: '6px'}}>
                                <Comments
                                    agenda={agenda}
                                    council={council}
                                    translate={translate}
                                />
                            </div>
                        }
                        {agenda.subjectType !== AGENDA_TYPES.INFORMATIVE?
                            <React.Fragment>
                                {this.state.selectedTab === 2 &&
                                    <div style={{padding: '1.5em'}}>
                                        <RecountSection
                                            agenda={agenda}
                                            key={`agendaRecount_${agenda.id}`}
                                            council={council}
                                            translate={translate}
                                            recount={this.props.recount}
                                            refetch={this.props.refetch}
                                            majorityTypes={this.props.majorityTypes}
                                        />
                                        <Votings
                                            key={`agendaVotings_${agenda.id}`}
                                            ref={votings => (this.votings = votings)}
                                            refetch={this.props.refetch}
                                            agenda={agenda}
                                            recount={this.props.recount}
                                            translate={translate}
                                        />
                                    </div>
                                }
                            </React.Fragment>
                        :
                            <React.Fragment>
                                {this.state.selectedTab === 2 &&
                                    <AgendaAttachmentsManager
                                        attachments={agenda.attachments}
                                        translate={translate}
                                        key={`agendaAttachments_${agenda.id}`}
                                        councilID={this.props.council.id}
                                        refetch={this.props.refetch}
                                        agendaID={agenda.id}
                                    />
                                }
                            </React.Fragment>
                        }
                        {this.state.selectedTab === 3 &&
                            <AgendaAttachmentsManager
                                attachments={agenda.attachments}
                                translate={translate}
                                key={`agendaAttachments_${agenda.id}`}
                                councilID={this.props.council.id}
                                refetch={this.props.refetch}
                                agendaID={agenda.id}
                            />
                        }
                    </Scrollbar>
                </div>
            </div>
        )
    }
}

export default AgendaDetailsTabs;