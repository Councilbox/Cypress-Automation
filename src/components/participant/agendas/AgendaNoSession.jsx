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
import TimelineSection from "../timeline/TimelineSection";

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

const AgendaNoSession = ({ translate, council, participant, data, ...props }) => {
    const secondary = getSecondary();
    const primary = getPrimary();
    let agendas = [];

    if (data.agendas) {
        agendas = data.agendas.map(agenda => {
            return {
                ...agenda,
                votings: data.participantVotings.filter(voting => voting.agendaId === agenda.id)
            }
        });
    }


    if (props.inPc) {
        return (
            <Paper style={styles.container} elevation={4}>
                <div style={{ height: "100%" }}>
                    {!props.sinCabecera &&
                        <React.Fragment>
                            <div style={styles.agendasHeader}>
                                <div style={{ width: '3em' }}>

                                </div>
                                {props.timeline ?
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
                                        {...props}
                                        translate={translate}
                                        participant={participant}
                                        council={council}
                                        agendaNoSession={true}
                                    />

                                </div>
                            </div>
                            <Divider />
                        </React.Fragment>
                    }
                    {props.sinCabecera &&
                        <div style={{ position: "fixed", top: '50px', right: "15px", background: "gainsboro", width: "47px", height: "32px", borderRadius: "25px" }}>
                            <CouncilInfoMenu
                                {...props}
                                translate={translate}
                                participant={participant}
                                council={council}
                            />
                        </div>
                    }
                    <Scrollbar>
                        {!councilStarted(council) &&
                            <div style={{ backgroundColor: primary, width: '100%', padding: '1em', color: 'white', fontWeight: '700' }}>
                                {translate.council_not_started_yet}
                            </div>
                        }
                        <div style={{ paddingLeft: '1.2em', marginTop: '20px', marginBottom: '5rem', }}>
                            {data.agendas ?
                                props.timeline ? (
                                    <TimelineSection
                                        council={council}
                                        councilTimeline={data.councilTimeline}
                                        isMobile={isMobile}
                                    />
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
                                                                    participant={participant}
                                                                    translate={translate}
                                                                    refetch={data.refetch}
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
    }

    return (
        <Paper style={styles.container} elevation={4}>
            <Scrollbar>
                <div>
                    {!props.sinCabecera &&
                        <React.Fragment>
                            <div style={styles.agendasHeader}>
                                <Typography variant="title" style={{ fontWeight: '700' }}>{translate.agenda}</Typography>
                                <div style={{ width: '3em' }}>
                                    <CouncilInfoMenu
                                        {...props}
                                        translate={translate}
                                        participant={participant}
                                        council={council}
                                    />
                                </div>
                            </div>
                            <Divider />
                        </React.Fragment>
                    }
                    {props.sinCabecera &&
                        <div style={{ position: "fixed", top: '50px', right: "15px", background: "gainsboro", width: "47px", height: "32px", borderRadius: "25px" }}>
                            <CouncilInfoMenu
                                {...props}
                                translate={translate}
                                participant={participant}
                                council={council}
                            />
                        </div>
                    }
                    {!councilStarted(council) &&
                        <div style={{ backgroundColor: primary, width: '100%', padding: '1em', color: 'white', fontWeight: '700' }}>
                            {translate.council_not_started_yet}
                        </div>
                    }
                    <div style={{ padding: '0.8em', paddingLeft: '1.2em', marginTop: '10px', }}>
                        {data.agendas ?
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
                                                        participant={participant}
                                                        translate={translate}
                                                        refetch={data.refetch}
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


export default AgendaNoSession;