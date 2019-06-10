import React from 'react';
import { Tabs, Tab, } from 'material-ui';
import * as CBX from "../../../utils/CBX";
import { Scrollbar } from '../../../displayComponents';
import ActAgreements from './ActAgreements';
import Comments from './Comments';
import RecountSection from './RecountSection';
import Votings from "./Votings";
import { AGENDA_TYPES } from '../../../constants';
import { isMobile } from 'react-device-detect';
import AgendaAttachmentsManager from "./AgendaAttachmentsManager";
import CustomPointVotingsLive from './voting/CustomPointVotingsLive';
import { withStyles } from '@material-ui/core';



const styles = theme => ({
    scrollable: {
        overflow: "hidden"
    }
});

class AgendaDetailsTabs extends React.Component {

    state = {
        selectedTab: 0
    }

    handleChange = (event, index) => {
        const cb = () => {
            this.setState({
                selectedTab: index
            })
        }

        if (this.props.editedVotings) {
            this.props.showVotingsAlert(cb);
        } else {
            cb();
        }

    }


    render() {
        const { agenda, translate, council, classes } = this.props;

        return (
            <div style={{
                width: '100%',
                height: isMobile ? `calc(100% - ${window.screen.availHeight - window.innerHeight}px)` : '100%',
                backgroundColor: 'white',
                borderTop: '1px solid gainsboro',
                paddingBottom: '10px',
                display: 'flex',
                flexDirection: 'column',
                overflow: "hidden"
            }}
            >
                <Tabs
                    value={this.state.selectedTab}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons={"on"}
                    scroller={true}
                    scrollable={true}
                    classes={{ scrollable: classes.scrollable }}
                >
                    <Tab label={isMobile ? translate.agreements : translate.comments_and_agreements} />
                    <Tab label={isMobile ? translate.comments : translate.act_comments} disabled={!CBX.councilStarted(council)} />
                    {agenda.subjectType !== AGENDA_TYPES.INFORMATIVE &&
                        <Tab label={translate.voting} disabled={!CBX.councilStarted(council) || !CBX.showAgendaVotingsTable(agenda)} />
                    }
                    <Tab label={isMobile ? translate.attachments : translate.attachment_files} />
                </Tabs>
                <div style={{ borderTop: '1px solid gainsboro', height: isMobile ? 'calc(100% - 5em)' : 'calc(100% - 4em)' }}>
                    <Scrollbar>
                        {this.state.selectedTab === 0 &&
                            <div style={{ padding: '1em' }}>
                                <ActAgreements
                                    agenda={agenda}
                                    key={`agendaAgreements_${agenda.id}`}
                                    translate={translate}
                                    recount={this.props.recount}
                                    council={this.props.council}
                                    refetch={this.props.refetch}
                                    data={this.props.data}
                                />
                            </div>
                        }
                        {this.state.selectedTab === 1 &&
                            <div style={{ marginTop: '6px' }}>
                                <Comments
                                    agenda={agenda}
                                    council={council}
                                    translate={translate}
                                />
                            </div>
                        }
                        {agenda.subjectType !== AGENDA_TYPES.INFORMATIVE ?
                            <React.Fragment>
                                {this.state.selectedTab === 2 &&
                                    <div style={{ padding: '1em' }}>
                                        {CBX.isCustomPoint(agenda.subjectType) ?
                                            <CustomPointVotingsLive
                                                agenda={agenda}
                                                key={`agendaVotings_${agenda.id}`}
                                                refetch={this.props.refetch}
                                                changeEditedVotings={this.props.changeEditedVotings}
                                                editedVotings={this.props.editedVotings}
                                                agenda={agenda}
                                                council={this.props.council}
                                                recount={this.props.recount}
                                                translate={translate}
                                            />
                                            :
                                            <React.Fragment>

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
                                                    changeEditedVotings={this.props.changeEditedVotings}
                                                    editedVotings={this.props.editedVotings}
                                                    agenda={agenda}
                                                    council={this.props.council}
                                                    recount={this.props.recount}
                                                    translate={translate}
                                                />
                                            </React.Fragment>
                                        }
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
            </div >
        )
    }
}

export default withStyles(styles)(AgendaDetailsTabs);