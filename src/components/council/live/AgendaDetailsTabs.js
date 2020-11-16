import React from 'react';
import { Tabs, Tab, withStyles } from 'material-ui';
import * as CBX from "../../../utils/CBX";
import { Scrollbar } from '../../../displayComponents';
import ActAgreements from './ActAgreements';
import Comments from './Comments';
import RecountSection from './RecountSection';
import Votings from "./Votings";
import { AGENDA_TYPES } from '../../../constants';
import AgendaAttachmentsManager from "./AgendaAttachmentsManager";
import PrivateRecountMessage from './voting/PrivateRecountMessage';
import CustomPointVotingsLive from './voting/CustomPointVotingsLive';
import { isLandscape, isMobile } from '../../../utils/screen';
import EarlyVotes from './voting/EarlyVotes';
import ConfirmationRequestRecount from '../agendas/ConfirmationRequestRecount';

const styles = theme => ({
    scrollable: {
        overflow: "hidden"
    }
});
const AgendaDetailsTabs = ({ agenda, translate, council, refetch, classes, ...props }) => {
    const [selected, setSelected] = React.useState(0);

    const showEarlyVotings = !council.statute.canEarlyVote === 1 && (!CBX.councilStarted(council) || !CBX.showAgendaVotingsTable(agenda));

    const handleChange = (event, index) => {
        const cb = () => {
            setSelected(index);
        }

        if(props.editedVotings){
            props.showVotingsAlert(cb);
        } else {
            cb();
        }
    }

    return (
        <div style={{
                width: '100%',
                height: isMobile?  isLandscape() ? `calc( 100% - 7em )` : `calc(100% - ${window.screen.availHeight -window.innerHeight}px)` : '100%',
                backgroundColor: 'white',
                borderTop: '1px solid gainsboro',
                paddingBottom: '10px',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Tabs
                variant="scrollable"
                scrollButtons={"on"}
                scrollable={true}
                classes={{ scrollable: classes.scrollable }}
                value={selected}
                indicatorColor="secondary"
                textColor="secondary"
                onChange={handleChange}
            >
                {CBX.isConfirmationRequest(agenda.subjectType) ?
                    [
                        <Tab label={translate.voting} disabled={showEarlyVotings}/>,
                        <Tab label={isMobile? translate.comments : translate.act_comments} disabled={!CBX.councilStarted(council)} />,
                        <Tab label={isMobile? translate.attachments : translate.attachment_files} />
                    ]

                :
                    [
                        <Tab label={isMobile? translate.agreements : translate.comments_and_agreements} />,
                        <Tab label={isMobile? translate.comments : translate.act_comments} disabled={!CBX.councilStarted(council)} />,
                        agenda.subjectType !== AGENDA_TYPES.INFORMATIVE && <Tab label={translate.voting} disabled={showEarlyVotings}/>,
                        <Tab label={isMobile? translate.attachments : translate.attachment_files} />
                    ]
                }

            </Tabs>
            <div style={{borderTop: '1px solid gainsboro', height: isMobile ? isLandscape() ? '100%' : 'calc(100% - 5em)' : 'calc(100% - 4em)'}}> {/**height: isMobile ? 'calc(100% - 5em)' : 'calc(100% - 4em)' */}
                <Scrollbar>
                    {CBX.isConfirmationRequest(agenda.subjectType) ?
                        <>
                            {selected === 0 &&
                                <div style={{padding: '1em'}}>
                                    <ConfirmationRequestRecount
                                        agenda={agenda}
                                        translate={translate}
                                        recount={props.recount}
                                    />
                                    <Votings
                                        key={`agendaVotings_${agenda.id}`}
                                        refetch={refetch}
                                        changeEditedVotings={props.changeEditedVotings}
                                        editedVotings={props.editedVotings}
                                        agenda={agenda}
                                        council={council}
                                        recount={props.recount}
                                        translate={translate}
                                    />
                                </div>
                            }
                            {selected === 1 &&
                                <div style={{marginTop: '6px'}}>
                                    <Comments
                                        agenda={agenda}
                                        council={council}
                                        translate={translate}
                                    />
                                </div>
                            }
                            {selected === 2 &&
                                <div style={{marginTop: '6px'}}>
                                    <AgendaAttachmentsManager
                                        attachments={agenda.attachments}
                                        translate={translate}
                                        key={`agendaAttachments_${agenda.id}`}
                                        councilID={council.id}
                                        refetch={refetch}
                                        agendaID={agenda.id}
                                    />
                                </div>
                            }
                        </>
                    :
                        <>
                            {selected === 0 &&
                                <div style={{padding: '1em'}}>
                                    <ActAgreements
                                        agenda={agenda}
                                        key={`agendaAgreements_${agenda.id}`}
                                        translate={translate}
                                        recount={props.recount}
                                        council={council}
                                        refetch={refetch}
                                        data={props.data}
                                    />
                                </div>
                            }
                            {selected === 1 &&
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
                                    {selected === 2 &&
                                        <div style={{padding: '1em'}}>
                                            {CBX.isCustomPoint(agenda.subjectType)?
                                                <CustomPointVotingsLive
                                                    agenda={agenda}
                                                    key={`agendaVotings_${agenda.id}`}
                                                    refetch={refetch}
                                                    changeEditedVotings={props.changeEditedVotings}
                                                    editedVotings={props.editedVotings}
                                                    council={council}
                                                    recount={props.recount}
                                                    translate={translate}
                                                />
                                            :
                                                <React.Fragment>
                                                    {(council.statute.canEarlyVote === 1 && (!CBX.councilStarted(council)))?
                                                        <EarlyVotes
                                                            translate={translate}
                                                            agenda={agenda}
                                                            council={council}
                                                            recount={props.recount}
                                                        />
                                                    :
                                                        <>
                                                            {agenda.votingState !== 2 && agenda.subjectType === AGENDA_TYPES.PRIVATE_VOTING ?
                                                                <PrivateRecountMessage translate={translate} />
                                                            :
                                                                <RecountSection
                                                                    agenda={agenda}
                                                                    key={`agendaRecount_${agenda.id}`}
                                                                    council={council}
                                                                    translate={translate}
                                                                    recount={props.recount}
                                                                    refetch={refetch}
                                                                    majorityTypes={props.majorityTypes}
                                                                />
                                                            }
                                                            <Votings
                                                                key={`agendaVotings_${agenda.id}`}
                                                                refetch={refetch}
                                                                changeEditedVotings={props.changeEditedVotings}
                                                                editedVotings={props.editedVotings}
                                                                agenda={agenda}
                                                                council={council}
                                                                recount={props.recount}
                                                                translate={translate}
                                                            />
                                                        </>
                                                    }
                                                </React.Fragment>
                                            }
                                        </div>
                                    }
                                </React.Fragment>
                            :
                                <React.Fragment>
                                    {selected === 2 &&
                                        <AgendaAttachmentsManager
                                            attachments={agenda.attachments}
                                            translate={translate}
                                            key={`agendaAttachments_${agenda.id}`}
                                            councilID={council.id}
                                            refetch={refetch}
                                            agendaID={agenda.id}
                                        />
                                    }
                                </React.Fragment>
                            }
                            {selected === 3 &&
                                <AgendaAttachmentsManager
                                    attachments={agenda.attachments}
                                    translate={translate}
                                    key={`agendaAttachments_${agenda.id}`}
                                    councilID={council.id}
                                    refetch={refetch}
                                    agendaID={agenda.id}
                                />
                            }
                        </>
                    }
                </Scrollbar>
            </div>
        </div>
    )
}

export default withStyles(styles)(AgendaDetailsTabs);