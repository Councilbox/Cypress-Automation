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
import CouncilSideMenu from './CouncilSideMenu';
import EvidencesPage from '../evindences/EvidencesPage';
import { ConfigContext } from '../../../../containers/AppControl';


const ActEditorPage = ({ council, translate, withoutAct, ...props }) => {
    const [state, setState] = React.useState({
        participants: false,
        sendReminder: false,
        sendConvene: false,
        cancel: false,
        rescheduleCouncil: false,
        infoMenu: false
    });

    const config = React.useContext(ConfigContext);

    const toggleInfoMenu = () => {
        const menu = state.infoMenu;

        setState({
            ...state,
            infoMenu: !menu
        });
    }

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
                                data={{...props}}
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
                        {props.confirmed?
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
                                    toggleInfoMenu={toggleInfoMenu}
                                    councilID={council.id}
                                    companyID={props.company.id}
                                    company={props.company}
                                    translate={translate}
                                    {...props}
                                    refetch={props.refetch}
                                />
                            </div>
                        }
                    </TabContainer>
                );
            }
        })
        if(props.confirmed){
            tabs.push({
                text: translate.sending_the_minutes,
                component: () => {
                    return (
                        <TabContainer>
                            <Scrollbar>
                                <SendActPage
                                    council={council}
                                    translate={translate}
                                    refetch={props.refetch}
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
                            totalVotes={props.totalVotes}
                            socialCapital={props.socialCapital}
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


    if(config.blockchain){
        tabs.push({
            text: 'Evidencias',//TRADUCCION
            component: () => {
                return (
                    <TabContainer>
                        <Scrollbar>
                            <EvidencesPage
                                council={council}
                                totalVotes={props.totalVotes}
                                socialCapital={props.socialCapital}
                                translate={translate}
                            />
                        </Scrollbar>
                    </TabContainer>
                );
            }
        })
    }


    tabs.push({
        text: translate.recordings_tab,
        component: () => {
            return (
                <TabContainer>
                    <RecordingsSection
                        data={props.data}
                        council={council}
                        translate={translate}
                    />
                </TabContainer>
            );
        }
    });

    return(
        <div style={{width: '100%', height: '100%', display: 'flex'}}>
            <div style={{width: state.infoMenu? '65%' : '100%', height: '100%', transition: 'width 0.6s'}}>
                <CardPageLayout title={council.name} disableScroll={true}>
                    <div style={{width: '100%', padding: '1.7em', paddingBottom: '0.5em', height: '100%'}}>
                        <TabsScreen
                            uncontrolled={true}
                            tabsInfo={tabs}
                        />
                    </div>
                </CardPageLayout>
            </div>
            <div style={{backgroundColor: 'white', width: state.infoMenu? '35%' : '0', transition: 'width 0.6s', height: '100%'}}>
                <CouncilSideMenu
                    council={council}
                    open={state.infoMenu}
                    translate={translate}
                    company={props.company}
                    agendas={props.agendas}
                    participantsWithDelegatedVote={props.participantsWithDelegatedVote}
                    councilAttendants={props.councilAttendants}
                    councilRecount={props.councilRecount}
                />
            </div>
        </div>

    )
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