import React from 'react';
import { CardPageLayout, TabsScreen, Scrollbar } from "../../../../displayComponents";
import ActConvenedParticipants from './ActConvenedParticipants';
import ActAttendantsTable from "./ActAttendantsTable";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ActEditor from "./ActEditor";
import withSharedProps from '../../../../HOCs/withSharedProps';
import Convene from '../../convene/Convene';
//import Scrollbar from 'react-perfect-scrollbar';
import SendActPage from './SendActPage';
import ActAttachments from './ActAttachments';
import AgendaTab from './AgendaTab';
import RecordingsSection from '../recordings/RecordingsSection';
import ActHTMLTab from '../actViewer/ActHTMLTab';

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
                                <div style={{ height: '100%'}}>
                                    <div style={{ height: "calc(100%)", overflow: 'hidden', position: 'relative', }}>
                                        <Scrollbar>
                                            <div style={{padding: '1.5em', overflow: 'hidden', position: 'relative'}}>
                                                <ActHTMLTab council={council} translate={translate} />
                                            </div>
                                        </Scrollbar>
                                    </div>
                                    {/*<div
                                        style={{
                                            height: '3.5em',
                                            display: 'flex',
                                            alignItems: 'center',
                                            borderTop: '1px solid gainsboro',
                                            borderBottom: '1px solid gainsboro',
                                            justifyContent: 'flex-end'
                                        }}
                                    >
                                        <BasicButton
                                            text={translate.export_act_to_pdf}
                                        />
                                    </div>*/}
                                </div>
                            :
                                <div style={{height: '100%'}}>
                                    <ActEditor
                                        councilID={council.id}
                                        companyID={this.props.company.id}
                                        company={this.props.company}
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
                                totalVotes={this.props.totalVotes}
                                socialCapital={this.props.socialCapital}
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

        tabs.push({
            text: translate.recordings_tab,
            component: () => {
                return (
                    <TabContainer>
                        <Scrollbar>
                            <RecordingsSection
                                data={this.props.data}
                                council={council}
                                translate={translate}
                            />
                        </Scrollbar>
                    </TabContainer>
                );
            }
        });

        return(
            <CardPageLayout title={council.name} disableScroll={true}>
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


const recordingsIframe = gql`
    query RecordingsIframe($councilId: Int!){
        recordingsIframe(councilId: $councilId)
    }
`;

export default graphql(recordingsIframe, {
    options: props => ({
        variables: {
            councilId: props.council.id
        }
    })
})(withSharedProps()(ActEditorPage));