import React from 'react';
import { CardPageLayout, TabsScreen, ScrollHTMLFixer } from "../../../../displayComponents";
import ActConvenedParticipants from './ActConvenedParticipants';
import ActAttendantsTable from "./ActAttendantsTable";
import ActEditor from "./ActEditor";
import Convene from '../../convene/Convene';
import ActHTML from '../actViewer/ActHTML';
import Scrollbar from 'react-perfect-scrollbar';
import SendActPage from './SendActPage';
import ActAttachments from './ActAttachments';
import AgendaTab from './AgendaTab';

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
                            <AgendaTab
                                council={council}
                                translate={translate}
                            />
                        );
                    }
                }
            ];
        }else {
            tabs.push({
                text: translate.act,
                component: () => {
                    return (
                        this.props.confirmed?
                            <div style={{ height: "100%", overflow: 'hidden', position: 'relative', paddingBottom: '2em' }}>
                                <Scrollbar option={{ suppressScrollX: true }}>
                                    <div style={{padding: '1.5em', overflow: 'hidden', position: 'relative'}}>
                                        <ActHTML council={council} />
                                    </div>
                                </Scrollbar>
                                <ScrollHTMLFixer />
                            </div>
                        :
                            <ActEditor
                                councilID={council.id}
                                companyID={this.props.companyID}
                                translate={translate}
                                refetch={this.props.refetch}
                            />
                    );
                }
            })
        }

        if(this.props.confirmed){
            tabs.push({
                text: translate.sending_the_minutes,
                component: () => {
                    return (
                        <SendActPage
                            council={council}
                            translate={translate}
                            refetch={this.props.refetch}
                        />
                    );
                }
            });
        }

        tabs = [...tabs, 
            {
                text: translate.new_list_called,
                component: () => {
                    return (
                        <ActConvenedParticipants
                            council={council}
                            translate={translate}
                        />
                    );
                }
            },
            {
                text: translate.show_assistants_list,
                component: () => {
                    return (
                        <ActAttendantsTable
                            council={council}
                            translate={translate}
                        />
                    );
                }
            },
            {
                text: translate.attachment_files,
                component: () => {
                    return (
                        <ActAttachments
                            council={council}
                            translate={translate}
                        />
                    );
                }
            },
            {
                text: translate.convene,
                component: () => {
                    return (
                        <div style={{position: 'relative', width: '100%', height: '100%'}}>
                            <Convene
                                council={council}
                                translate={translate}
                            />
                        </div>
                    );
                }
            }
        ];

        return(
            <CardPageLayout title={translate.video_meeting_finished}>
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

export default ActEditorPage;