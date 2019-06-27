import React from "react";
import { Paper, Typography, Divider, Card, Avatar, CardHeader, CardContent, Collapse, CardActions, Tooltip, Button } from "material-ui";
import { LoadingSection, Scrollbar } from '../../../displayComponents';
import { getPrimary, getSecondary } from "../../../styles/colors";
import AgendaMenu from './AgendaMenu';
import AgendaDescription from './AgendaDescription';
import { getAgendaTypeLabel, councilStarted } from '../../../utils/CBX';
import CouncilInfoMenu from '../menus/CouncilInfoMenu';
import { isMobile } from "react-device-detect";
import TimelineSection from "../timeline/TimelineSection";
import * as CBX from '../../../utils/CBX';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import CommentModal from "./CommentModal";
import { moment } from "../../../containers/App";
import { logoutParticipant } from "../../../actions/mainActions";



const styles = {
    container: {
        width: "100%",
        height: "calc( 100% - 2em )",
        overflow: 'hidden'
    },
    container100: {
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

const AgendaNoSession = ({ translate, council, participant, data, noSession, client, updateComment, ...props }) => {
    const primary = getPrimary();
    const scrollbar = React.useRef();
    let agendas = [];
    const [timelineSeeId, settimelineSeeId] = React.useState(0);

    const renderAgendaCard = agenda => {
        return (
            <AgendaCard
                agenda={agenda}
                council={council}
                translate={translate}
                participant={participant}
                refetch={data.refetch}
            />
        )
    }

    const scrollToBottom = () => {
        scrollbar.current.scrollToBottom();
    }

    React.useEffect(() => {
        const readTimelines = async () => {
            const response = await client.query({
                query: readTimeline,
                variables: {
                    councilId: council.id,
                }
            });

            if (response.data && response.data.readTimeline && response.data.readTimeline > 0) {
                settimelineSeeId(JSON.parse(response.data.readTimeline[response.data.readTimeline.length - 1].content).data.participant.timeline)
            }
        }

        readTimelines();
    }, [council.id]);

    const logout = () => {
        console.log("ENTRO AKI")
        console.log(props)
        console.log(logoutParticipant)
        // logout()
        logout();
        // logoutParticipant(participant, council);
    };


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
            <React.Fragment>
                <Paper style={!noSession ? styles.container : styles.container100} elevation={4}>
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
                        <Scrollbar ref={scrollbar}>
                            {!councilStarted(council) &&
                                <div style={{ backgroundColor: primary, width: '100%', padding: '1em', color: 'white', fontWeight: '700' }}>
                                    {translate.council_not_started_yet}
                                </div>
                            }
                            <div style={{ marginTop: '20px', marginBottom: '5rem', }}>
                                {data.agendas ?
                                    props.timeline ? (
                                        <TimelineSection
                                            timelineSeeId={timelineSeeId}
                                            council={council}
                                            scrollToBottom={scrollToBottom}
                                            councilTimeline={data.councilTimeline}
                                            isMobile={isMobile}
                                        />
                                    ) : (
                                            agendas.map((agenda, index) => {
                                                // agenda.options =  {
                                                //     maxSelections: 2,
                                                //     id: 140
                                                // }
                                                return (
                                                    <React.Fragment key={`agenda_card_${index}`}>
                                                        {renderAgendaCard(agenda)}
                                                    </React.Fragment>
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
                {!noSession &&
                    <div style={{ marginTop: "0.5em", display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            onClick={() => logout}
                            style={{
                                borderRadius: "25px",
                                background: "white",
                                color: getPrimary(),
                                height: "25px",
                                fontSize: "13px",
                                textTransform: "none",
                                minHeight: "0px",
                                lineHeight: '0.8'
                            }}
                        >
                            <b> Salir </b>
                        </Button>
                    </div>
                }
            </React.Fragment>
        );
    }

    return (
        <div style={{ height: !noSession ? "calc( 100% - 3em )" : "100%" }}>
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
                <div style={{ position: "relative", top: '5px', left: "80%", background: "gainsboro", width: "47px", height: "32px", borderRadius: "25px" }}>
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
            <div style={{ padding: '0.6em', height: "100%" }}> {/*marginTop: '10px',*/}
                {data.agendas ?
                    agendas.map((agenda, index) => {
                        return (
                            <React.Fragment key={`agenda_card_${index}`}>
                                {renderAgendaCard(agenda)}
                            </React.Fragment>
                        )

                    })
                    :
                    <LoadingSection />
                }
            </div>
            {!noSession &&
                <div style={{ marginTop: "0.5em", display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        onClick={() => logout}
                        style={{
                            borderRadius: "25px",
                            background: "white",
                            color: getPrimary(),
                            height: "25px",
                            fontSize: "13px",
                            textTransform: "none",
                            minHeight: "0px",
                            lineHeight: '0.8'
                        }}
                    >
                        <b> Salir </b>
                    </Button>
                </div>
            }
        </div>
    );
}

const AgendaCard = ({ agenda, translate, participant, refetch, council, ...props }) => {
    const ownVote = agenda.votings.find(voting => (
        voting.participantId === participant.id
        || voting.delegateId === participant.id ||
        voting.author.representative.id === participant.id
    ));
    const primary = getPrimary();


    const agendaStateIcon = agenda => {
        let title = '';
        if (council.councilType >= 2) {
            return <span />;
        }

        let icon = 'fa fa-lock';
        let color = ""
        if (CBX.agendaPointNotOpened(agenda) || CBX.agendaClosed(agenda)) {
            icon = "fa fa-lock colorGrey";
            title = translate.closed;
        }
        if (CBX.agendaPointOpened(agenda)) {
            icon = "fa fa-unlock-alt colorGren";
            color = "#278289";
            title = translate.in_discussion;
        }
        return (
            <Tooltip title={title}>
                <i
                    className={icon}
                    aria-label={icon === "fa fa-lock colorGrey" ? "punto cerrado" : "punto abierto"}
                    style={{ marginRight: '0.6em', cursor: 'auto', fontSize: "18px", color: color }}
                ></i>
            </Tooltip>
        );
    }


    const agendaVotingIcon = agenda => {
        let mostrar = agenda.subjectType !== 0;
        if (mostrar) {
            let title = translate.closed_votings;
            let color = 'default';
            if (CBX.agendaVotingsOpened(agenda)) {
                title = translate.opened_votings;
                color = "#278289";
            }
            return (
                <Tooltip title={title}>
                    <i
                        className={"material-icons"}
                        aria-label={title}
                        style={{ marginRight: '0.6em', fontSize: "20px", color, cursor: 'context-menu', }}
                    >
                        how_to_vote
                    </i>
                </Tooltip>
            );
        }
        return <span />;
    }


    return (
        <div style={{ margin: "0 auto", marginBottom: "15px", width: isMobile ? "100%" : '93%', }} key={agenda.id}>
            <Card aria-label={"punto" + (agenda.orderIndex + 1) + " " + translate[getAgendaTypeLabel(agenda)] + " título " + agenda.agendaSubject}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="Recipe" style={{ background: "white", border: CBX.agendaPointOpened(agenda) ? "2px solid purple" : "1px solid grey", color: CBX.agendaPointOpened(agenda) ? "purple" : 'grey' }}>
                            {agenda.orderIndex}
                        </Avatar>
                    }
                    action={
                        <div style={{ display: "flex" }}>
                            <div>
                                {agendaStateIcon(agenda)}
                            </div>
                            <div>
                                {agendaVotingIcon(agenda)}
                            </div>
                        </div>
                    }
                    title={agenda.agendaSubject}
                    subheader={translate[getAgendaTypeLabel(agenda)]}
                />
                <Collapse in={true} timeout="auto" unmountOnExit>
                    <CardContent>
                        <AgendaDescription agenda={agenda} translate={translate} />

                        <AgendaMenu
                            horizontal={true}
                            agenda={agenda}
                            council={council}
                            participant={participant}
                            translate={translate}
                            refetch={refetch}
                        />
                    </CardContent>
                </Collapse>

                <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <CommentModal
                        translate={translate}
                        agenda={agenda}
                        participant={participant}
                        council={council}
                        refetch={refetch}
                    />
                    {(ownVote && ownVote.vote !== -1) &&
                        <Button
                            disableRipple
                            disabled
                            disableFocusRipple
                            style={{
                                textTransform: 'none',
                                fontStyle: 'italic',
                                fontSize: '12px',
                                color: primary,
                                fontWeight: '700'
                            }}
                        >
                            {`Voto registrado (${moment(ownVote.date).format('LLL')})`}
                        </Button>
                    }
                </CardActions>
            </Card>
        </div>
    )
}

const readTimeline = gql`
    query ReadTimeline($councilId: Int!){
        readTimeline(councilId: $councilId){
            id
            type
            date
            content
        }
    }
`;

export default withApollo(AgendaNoSession);