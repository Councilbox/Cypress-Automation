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
import { isMobile } from "react-device-detect";



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

    selectAgenda = (index) => {
        this.setState({ selected: index });
    }

    agendaStateToastId = null;
    agendaVotingsToastId = null;

    componentWillUnmount() {
        toast.dismiss(this.agendaStateToastId);
        toast.dismiss(this.agendaVotingsToastId);
    }

    componentDidUpdate(prevProps) {
        const { translate } = this.props;

        if (prevProps.data.agendas) {
            const { agendas: actualAgendas } = this.props.data;
            prevProps.data.agendas.forEach((agenda, index) => {
                let agendaToCheck = agenda.id === actualAgendas[index].id ?
                    actualAgendas[index]
                    :
                    actualAgendas.find(item => item.id === agenda.id)
                    ;

                if (!agendaPointOpened(agenda) && agendaPointOpened(agendaToCheck)) {
                    if (this.agendaStateToastId) {
                        toast.dismiss(this.agendaStateToastId);
                    }
                    this.agendaStateToastId = this.toastChanges(
                        `${translate.point_of_day_opened_number} ${agendaToCheck.orderIndex}`,
                        () => this.agendaStateToastId = null
                    );
                }

                if (agendaPointOpened(agenda) && !agendaPointOpened(agendaToCheck)) {
                    if (this.agendaStateToastId) {
                        toast.dismiss(this.agendaStateToastId);
                    }
                    this.agendaStateToastId = this.toastChanges(
                        `${translate.point_closed_num} ${agendaToCheck.orderIndex}`,
                        () => this.agendaStateToastId = null
                    );
                }

                if (!agendaVotingsOpened(agenda) && agendaVotingsOpened(agendaToCheck)) {
                    if (this.agendaVotingsToastId) {
                        toast.dismiss(this.agendaVotingsToastId);
                    }
                    this.agendaVotingsToastId = this.toastChanges(
                        `${translate.point_num_votings_open} ${agendaToCheck.orderIndex}`,
                        () => this.agendaVotingsToastId = null
                    );
                }

                if (agendaVotingsOpened(agenda) && !agendaVotingsOpened(agendaToCheck)) {
                    if (this.agendaVotingsToastId) {
                        toast.dismiss(this.agendaVotingsToastId);
                    }
                    this.agendaVotingsToastId = this.toastChanges(
                        `${translate.point_num_votings_closed} ${agendaToCheck.orderIndex}`,
                        () => this.agendaVotingsToastId = null
                    )
                }
            });
        }
    }

    toastChanges = (message, onClose) => (
        toast(
            <LiveToast
                message={message}
                action={() => this.selectAgenda}
            />, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: false,
                onClose: onClose,
                className: "liveToast"
            }
        )
    )

    render() {
        const { translate, council, } = this.props;
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
        if (this.props.inPc) {
            return (
                <Paper style={styles.container} elevation={4}>
                    <div style={{ height: "100%" }}>
                        {!this.props.sinCabecera &&
                            <React.Fragment>
                                <div style={styles.agendasHeader}>
                                    <div style={{ width: '3em' }}>

                                    </div>
                                    {this.props.timeline ?
                                        (
                                            <React.Fragment>
                                                <Typography variant="title" style={{ fontWeight: '700' }}>Resumen</Typography>{/*TRADUCCION*/}

                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <Typography variant="title" style={{ fontWeight: '700' }}>{translate.agenda}</Typography>

                                            </React.Fragment>
                                        )
                                    }
                                    <div style={{ width: '3em' }}>

                                        <CouncilInfoMenu
                                            {...this.props}
                                            translate={translate}
                                            participant={this.props.participant}
                                            council={council}
                                            agendaNoSession={true}
                                        />

                                    </div>
                                </div>
                                <Divider />
                            </React.Fragment>
                        }
                        {this.props.sinCabecera &&
                            <div style={{ position: "fixed", top: '50px', right: "15px", background: "gainsboro", width: "47px", height: "32px", borderRadius: "25px" }}>
                                <CouncilInfoMenu
                                    {...this.props}
                                    translate={translate}
                                    participant={this.props.participant}
                                    council={council}
                                />
                            </div>
                        }
                        <Scrollbar>
                            {!councilStarted(council) &&
                                <div style={{ backgroundColor: primary, width: '100%', padding: '1em', color: 'white', fontWeight: '700' }}>
                                    {this.props.translate.council_not_started_yet}
                                </div>
                            }
                            <div style={{ paddingLeft: '1.2em', marginTop: '20px', marginBottom: '5rem', }}>
                                {this.props.data.agendas ?
                                    this.props.timeline ? (
                                        this.props.timeline
                                    ) : (
                                            agendas.map((agenda, index) => {
                                                return (
                                                    <div style={{ marginBottom: "15px", width: "98%", }} key={agenda.id}>
                                                        <Card style={{ padding: "1em" }}>
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
                                        )
                                    :
                                    <LoadingSection />
                                }
                            </div>
                        </Scrollbar>
                    </div>
                </Paper>
            );
        } else {
            return (
                <Paper style={styles.container} elevation={4}>
                    <Scrollbar>
                        <div>
                            {!this.props.sinCabecera &&
                                <React.Fragment>
                                    <div style={styles.agendasHeader}>
                                        <Typography variant="title" style={{ fontWeight: '700' }}>{translate.agenda}</Typography>
                                        <div style={{ width: '3em' }}>
                                            <CouncilInfoMenu
                                                {...this.props}
                                                translate={translate}
                                                participant={this.props.participant}
                                                council={council}
                                            />
                                        </div>
                                    </div>
                                    <Divider />
                                </React.Fragment>
                            }
                            {this.props.sinCabecera &&
                                <div style={{ position: "fixed", top: '50px', right: "15px", background: "gainsboro", width: "47px", height: "32px", borderRadius: "25px" }}>
                                    <CouncilInfoMenu
                                        {...this.props}
                                        translate={translate}
                                        participant={this.props.participant}
                                        council={council}
                                    />
                                </div>
                            }
                            {!councilStarted(council) &&
                                <div style={{ backgroundColor: primary, width: '100%', padding: '1em', color: 'white', fontWeight: '700' }}>
                                    {this.props.translate.council_not_started_yet}
                                </div>
                            }
                            <div style={{ padding: '0.8em', paddingLeft: '1.2em', marginTop: '10px', }}>
                                {this.props.data.agendas ?
                                    agendas.map((agenda, index) => {
                                        return (
                                            <div style={{ marginBottom: "15px", width: "98%", }} key={agenda.id}>
                                                <Card style={{ padding: "1em" }}>
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
}


export default AgendaNoSession;