import React from 'react';
import { CardPageLayout, TabsScreen, Scrollbar } from "../../../../displayComponents";
import ActConvenedParticipants from './ActConvenedParticipants';
import ActAttendantsTable from "./ActAttendantsTable";
import ActEditor from "./ActEditor";
import Convene from '../../convene/Convene';
import ActHTML from '../actViewer/ActHTML';
//import Scrollbar from 'react-perfect-scrollbar';
import SendActPage from './SendActPage';
import ActAttachments from './ActAttachments';
import AgendaTab from './AgendaTab';
import RecordingsSection from '../recordings/RecordingsSection';

class ActEditorPage extends React.Component {
    state = {
        participants: false,
        sendReminder: false,
        sendConvene: false,
        cancel: false,
        rescheduleCouncil: false
    };

    render(){
        const { translate, council, withoutAct } = this.props;
        let tabs = [];
        if(withoutAct){
            tabs = [
                {
                    text: translate.wizard_agenda,
                    component: () => {
                        return (
                            <TabContainer>
                                <AgendaTab
                                    council={council}
                                    translate={translate}
                                />
                            </TabContainer>
                        );
                    }
                }
            ];
        }else {
            tabs.push({
                text: translate.act,
                component: () => {
                    return (
                        <TabContainer>
                            {this.props.confirmed?
                                <div style={{ height: "100%", overflow: 'hidden', position: 'relative', paddingBottom: '2em' }}>
                                    <Scrollbar>
                                        <div style={{padding: '1.5em', overflow: 'hidden', position: 'relative'}}>
                                            <ActHTML council={council} />
                                        </div>
                                    </Scrollbar>
                                </div>
                            :
                                <div style={{height: '100%'}}>
                                    <ActEditor
                                        councilID={council.id}
                                        companyID={this.props.companyID}
                                        translate={translate}
                                        refetch={this.props.refetch}
                                    />
                                </div>
                            }
                        </TabContainer>
                    );
                }
            })
            if(this.props.confirmed){
                tabs.push({
                    text: translate.sending_the_minutes,
                    component: () => {
                        return (
                            <TabContainer>
                                <Scrollbar>
                                    <SendActPage
                                        council={council}
                                        translate={translate}
                                        refetch={this.props.refetch}
                                    />
                                </Scrollbar>
                            </TabContainer>
                        );
                    }
                });
            }
        }

        tabs = [...tabs,
            {
                text: translate.new_list_called,
                component: () => {
                    return (
                        <TabContainer>
                            <ActConvenedParticipants
                                council={council}
                                translate={translate}
                            />
                        </TabContainer>   
                    );
                }
            },
            {
                text: translate.show_assistants_list,
                component: () => {
                    return (
                        <TabContainer>
                            <ActAttendantsTable
                                council={council}
                                translate={translate}
                            />
                        </TabContainer>
                    );
                }
            },
            {
                text: translate.attachment_files,
                component: () => {
                    return (
                        <TabContainer>
                            <Scrollbar>
                                <ActAttachments
                                    council={council}
                                    translate={translate}
                                />
                            </Scrollbar>
                        </TabContainer>
                    );
                }
            },
            {
                text: 'Grabaciones',
                component: () => {
                    return (
                        <TabContainer>
                            <Scrollbar>
                                <RecordingsSection
                                    council={council}
                                    translate={translate}
                                />
                            </Scrollbar>
                        </TabContainer>
                    );
                }
            },
            {
                text: translate.convene,
                component: () => {
                    return (
                        <TabContainer style={{position: 'relative', width: '100%', padding: '1.2em'}}>
                            <Scrollbar>
                                <div style={{paddingBottom: '2em'}}>
                                    <Convene
                                        council={council}
                                        hideAttachments
                                        translate={translate}
                                    />
                                </div>
                            </Scrollbar>
                        </TabContainer>
                    );
                }
            }
        ];

        return(
            <CardPageLayout title={translate.video_meeting_finished} disableScroll={true}>
                <div style={{width: '100%', padding: '1.7em', height: '100%'}}>
                    <TabsScreen
                        uncontrolled={true}
                        tabsInfo={tabs}
                    />
                </div>
            </CardPageLayout>
        )
    }
}

const TabContainer = ({ children, style }) => (
    <div style={{height: 'calc(100% - 40px)', ...style}}>
        {children}
    </div>
)

export default ActEditorPage;