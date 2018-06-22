import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { CardPageLayout } from "../../../../displayComponents";
import ActConvenedParticipants from './ActConvenedParticipants';
import ActAttendantsTable from "./ActAttendantsTable";
import ActEditor from "./ActEditor";
import Convene from '../../convene/Convene';
import ActHTML from '../actViewer/ActHTML';
import Scrollbar from 'react-perfect-scrollbar';
import SendActPage from './SendActPage';
import ActAttachments from './ActAttachments';
import AgendaTab from './AgendaTab';

const panelStyle = {
	height: "100%",
	overflow: "hidden",
	boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)",
	borderRadius: "0px 5px 5px 5px",
    padding: "0",
    paddingTop: '0.6em'
};

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

        return(
            <CardPageLayout title={translate.companies_writing} disableScroll={true}>
                <Tabs
                    selectedIndex={this.state.selectedTab}
                    style={{
                        padding: "0",
                        width: "calc(100% - 2em)",
                        margin: 'auto',
                        height: '100%'
                    }}
                >
                    <TabList>
                        {withoutAct? 
                            <Tab>
                                {translate.wizard_agenda}
                            </Tab>
                        :
                            <React.Fragment>
                                <Tab>
                                    {translate.act}
                                </Tab>
                                {this.props.confirmed &&
                                    <Tab>
                                        {translate.sending_the_minutes}
                                    </Tab>
                                }
                            </React.Fragment>
                        }
                        <Tab>
                            {translate.new_list_called}
                        </Tab>
                        <Tab>
                            {translate.show_assistants_list}
                        </Tab>
                        <Tab>
                            {translate.attachment_files}
                        </Tab>
                        <Tab>
                            {translate.convene}
                        </Tab>
                    </TabList>
                        {withoutAct? 
                            <TabPanel style={panelStyle}>
                                <AgendaTab
                                    council={council}
                                    translate={translate}
                                />
                            </TabPanel>
                        :
                            <React.Fragment>
                                <TabPanel style={panelStyle}>
                                    {this.props.confirmed? 
                                        <div style={{ height: "100%", overflow: 'hidden', position: 'relative', paddingBottom: '2em' }}>
                                            <Scrollbar option={{ suppressScrollX: true }}>
                                                <div style={{padding: '1.5em', overflow: 'hidden'}}>
                                                    <ActHTML council={council} />
                                                </div>
                                            </Scrollbar>
                                        </div>
                                    :
                                        <ActEditor
                                            councilID={council.id}
                                            companyID={this.props.companyID}
                                            translate={translate}
                                            refetch={this.props.refetch}
                                        />
                                    }
                                
                                </TabPanel>
                                {this.props.confirmed &&
                                    <TabPanel style={panelStyle}>
                                        <SendActPage
                                            council={council}
                                            translate={translate}
                                            refetch={this.props.refetch}
                                        />
                                    </TabPanel>
                                }
                            </React.Fragment>
                        }
                    <TabPanel style={panelStyle}>
                        <ActConvenedParticipants
                            council={council}
                            translate={translate}
                        />
                    </TabPanel>
                    <TabPanel style={panelStyle}>
                        <ActAttendantsTable
                            council={council}
                            translate={translate}
                        />
                    </TabPanel>
                    <TabPanel style={panelStyle}>
                        <ActAttachments
                            council={council}
                            translate={translate}
                        />
                    </TabPanel>
                    <TabPanel style={panelStyle}>
                        <div style={{ height: "100%", overflow: 'hidden', position: 'relative', paddingBottom: '2em' }}>
                            <Convene
                                council={council}
                                translate={translate}
                            />
                        </div>
                    </TabPanel>
                </Tabs>
            </CardPageLayout>
        )
    }
}
 
export default ActEditorPage;