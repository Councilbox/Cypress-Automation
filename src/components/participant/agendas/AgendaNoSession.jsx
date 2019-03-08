import React from "react";
import { Steps } from 'antd';
import { Paper, Typography, Divider, IconButton, Card } from "material-ui";
import Scrollbar from '../../../displayComponents/Scrollbar';
import { AgendaNumber, LoadingSection, LiveToast } from '../../../displayComponents';
import { getPrimary, getSecondary } from "../../../styles/colors";
import AgendaMenu from './AgendaMenu';
import AgendaDescription from './AgendaDescription';
import { agendaPointOpened, agendaVotingsOpened, getAgendaTypeLabel, councilStarted, councilHasSession } from '../../../utils/CBX';
import CouncilInfoMenu from '../menus/CouncilInfoMenu';
import { toast } from 'react-toastify';


const styles = {
    container: {
        width: "100%",
        height: "100%",
        overflow: 'hidden'
    },
    agendasHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        justifyContent: 'space-between'
    }
};

class AgendaNoSession extends React.Component {
    state = {
        selected: 0
    }

    updated = 0;


    render() {
        const { translate, council, agendasAnchor, toggleAgendasAnchor, anchorToggle } = this.props;
        const { selected } = this.state;
        const secondary = getSecondary();
        const primary = getPrimary();
        let agendas = [];

        if (this.props.data.agendas) {
            agendas = this.props.data.agendas.map(agenda => {
                return {
                    ...agenda,
                    votings: this.props.data.participantVotings.filter(voting => voting.agendaId === agenda.id)
                }
            });
        }

        return (
            <Paper style={styles.container} elevation={4}>
                <Scrollbar>
                    <div>
                        <div style={styles.agendasHeader}>
                            <div style={{ width: '3em' }}>
                                {agendasAnchor === 'right' ?
                                    anchorToggle &&
                                    <IconButton
                                        size={'small'}
                                        onClick={toggleAgendasAnchor}
                                        style={{ outline: 0 }}
                                    >
                                        <i className="fa fa-caret-left"></i>
                                    </IconButton>
                                    :
                                    <CouncilInfoMenu
                                        translate={translate}
                                        participant={this.props.participant}
                                        council={council}
                                    />
                                }
                            </div>
                            <Typography variant="title" style={{ fontWeight: '700' }}>{translate.agenda}</Typography>
                            <div style={{ width: '3em' }}>
                                {agendasAnchor === 'left' ?
                                    anchorToggle &&
                                    <IconButton
                                        size={'small'}
                                        onClick={toggleAgendasAnchor}
                                        style={{ outline: 0 }}
                                    >
                                        <i className="fa fa-caret-right"></i>
                                    </IconButton>
                                    :
                                    <CouncilInfoMenu
                                        translate={translate}
                                        participant={this.props.participant}
                                        council={council}
                                    />
                                }
                            </div>
                        </div>
                        <Divider />
                        {!councilStarted(council) &&
                            <div style={{ backgroundColor: primary, width: '100%', padding: '1em', color: 'white', fontWeight: '700' }}>
                                {this.props.translate.council_not_started_yet}
                            </div>
                        }
                        <div style={{ padding: '0.8em', paddingLeft: '1.2em', marginTop: '10px', }}>
                            {this.props.data.agendas ?
                                agendas.map((agenda, index) => {
                                    return (
                                        <div style={{marginBottom: "15px", width: "98%",  }} key={agenda.id}>
                                            <Card style={{padding: "1em"}}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        marginRight: "10px",
                                                        marginBottom: "1.5em"
                                                    }}
                                                >
                                                    <div style={{
                                                        marginRight: "10px",
                                                        color: "#000000de",
                                                        fontWeight: '700',
                                                        fontSize: '16px'
                                                    }}
                                                    >
                                                        {index + 1}. </div>
                                                    <div>

                                                        <div style={{
                                                            color: "#000000de",
                                                            fontWeight: '700',
                                                            fontSize: '16px',
                                                            display: "flex"
                                                        }}>
                                                            <div style={{ width: "55px" }}>{translate.title}:</div> {agenda.agendaSubject}
                                                        </div>
                                                        <Typography variant="body1" style={{ color: secondary, fontWeight: '700', display: "flex" }}>
                                                            <span style={{ width: "38px" }}>{translate.type}:</span> {translate[getAgendaTypeLabel(agenda)]}
                                                        </Typography>
                                                        <div style={{ display: "flex", minHeight: '25px', display: "flex" }}>
                                                            <AgendaDescription agenda={agenda} translate={translate} />
                                                        </div>
                                                        <AgendaMenu
                                                            horizontal={true}
                                                            agenda={agenda}
                                                            council={council}
                                                            participant={this.props.participant}
                                                            translate={translate}
                                                            refetch={this.props.data.refetch}
                                                        />
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    )
                                })
                                :
                                <LoadingSection />
                            }
                        </div>
                    </div>
                </Scrollbar>
            </Paper>
        );
    }
}

//<div style={{ width: "90px" }}>{translate.description}:</div>  <div dangerouslySetInnerHTML={{ __html: agenda.description }}></div>




export default AgendaNoSession;