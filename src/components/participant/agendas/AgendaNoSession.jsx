import React from "react";
import { Paper, Typography, Divider, Card, Avatar, CardHeader, CardContent, Collapse, CardActions, Button, Tooltip } from "material-ui";
import { LoadingSection, AlertConfirm, Scrollbar } from '../../../displayComponents';
import { getPrimary, getSecondary } from "../../../styles/colors";
import AgendaMenu from './AgendaMenu';
import AgendaDescription from './AgendaDescription';
import { getAgendaTypeLabel, councilStarted } from '../../../utils/CBX';
import CouncilInfoMenu from '../menus/CouncilInfoMenu';
import { isMobile } from "react-device-detect";
import TimelineSection from "../timeline/TimelineSection";
import * as CBX from '../../../utils/CBX';
import RichTextInput from "../../../displayComponents/RichTextInput";
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { client } from "../../../containers/App";




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

const AgendaNoSession = ({ translate, council, participant, data, noSession, client, updateComment, ...props }) => {
    const secondary = getSecondary();
    const primary = getPrimary();
    const scrollbar = React.useRef();
    let agendas = [];
    const [state, setState] = React.useState({
        open: false
    })
    const [timelineSeeId, settimelineSeeId] = React.useState(0);

    const toggle = () => {
        setState({
            ...state,
            open: !state.open
        })
    }

    const agendaVotingIcon = (agenda) => {
        let mostrar = agenda.subjectType !== 0;
        if (mostrar) {
            if (CBX.agendaVotingsOpened(agenda)) {
                return <i className={"material-icons"} aria-label="votación abierta" /*TRADUCCION*/ style={{ marginRight: '0.6em', fontSize: "20px", color: "#278289" }}>how_to_vote</i>;
            } else {
                return <i className={"material-icons colorGrey"} aria-label="votación cerrada" /*TRADUCCION*/ style={{ marginRight: '0.6em', fontSize: "20px", }}>how_to_vote</i>;
            }
        } else {
            return <div></div>;
        }
    }

    const scrollToBottom = () => {
        scrollbar.current.scrollToBottom();
    }

    React.useEffect(() => {
        const readTimelines = async () => {
            const response2 = await client.query({
                query: readTimeline,
                variables: {
                    councilId: council.id,
                }
            });

            if (response2.data && response2.data.readTimeline && response2.data.readTimeline > 0) {
                settimelineSeeId(JSON.parse(response2.data.readTimeline[response2.data.readTimeline.length - 1].content).data.participant.timeline)
            }
        }

        readTimelines();
    }, [council.id]);


    const agendaStateIcon = (agenda) => {
        // const { agenda } = this.props;
        let icon = 'fa fa-lock';
        let color = ""
        if (CBX.agendaPointNotOpened(agenda)) icon = "fa fa-lock colorGrey";
        if (CBX.agendaPointOpened(agenda)) icon = "fa fa-unlock-alt colorGren";
        if (CBX.agendaPointOpened(agenda)) color = "#278289";
        if (CBX.agendaClosed(agenda)) icon = "fa fa-lock colorGrey";
        return <i className={icon} aria-label={icon === "fa fa-lock colorGrey" ? "punto cerrado" : "punto abierto"} style={{ marginRight: '0.6em', fontSize: "18px", color: color }}></i>;
    }

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
                    {/* <ScrollbarStartBottom   > */}
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
                                                <div style={{ margin: "0 auto", marginBottom: "15px", width: "93%", }} key={agenda.id}>
                                                    <Card aria-label={"punto" + (index + 1) + " " + translate[getAgendaTypeLabel(agenda)] + " título " + agenda.agendaSubject}>
                                                        <CardHeader
                                                            avatar={
                                                                <Avatar aria-label={`punto ${index + 1}`} style={{ background: "white", border: CBX.agendaPointOpened(agenda) ? "2px solid purple" : "1px solid #474747", color: CBX.agendaPointOpened(agenda) ? "purple" : '#474747' }}>
                                                                    {index + 1}
                                                                </Avatar>
                                                            }
                                                            action={
                                                                <div style={{ display: "flex" }}>
                                                                    <div>
                                                                        <Tooltip title={"Agenda"}>
                                                                            {agendaStateIcon(agenda)}
                                                                        </Tooltip>
                                                                    </div>
                                                                    <div>
                                                                        <Tooltip title={"Voto"}>
                                                                            {agendaVotingIcon(agenda)}
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
                                                            }
                                                            title={agenda.agendaSubject}
                                                            subheader={translate[getAgendaTypeLabel(agenda)] + " - Max " /*+ agenda.options.maxSelections */}
                                                        />
                                                        <Collapse in={true} timeout="auto" unmountOnExit>
                                                            <CardContent style={{ paddingTop: "0" }}>
                                                                <AgendaDescription agenda={agenda} translate={translate} />

                                                                <AgendaMenu
                                                                    horizontal={true}
                                                                    agenda={agenda}
                                                                    council={council}
                                                                    participant={participant}
                                                                    translate={translate}
                                                                    refetch={data.refetch}
                                                                />
                                                            </CardContent>
                                                        </Collapse>

                                                        <CardActions>
                                                            {/* <Button size="small" color="primary" onClick={toggle}>
                                                                Enviar comentario
                                                            </Button> */}
                                                            <ModalEnvioComentario
                                                                translate={translate}
                                                                agenda={agenda}
                                                                open={state.open}

                                                            />
                                                        </CardActions>
                                                    </Card>
                                                    {/* <AlertConfirm
                                                        open={state.open}
                                                        requestClose={() => setState({
                                                            ...state,
                                                            open: !state.open
                                                        })}
                                                        bodyText={
                                                            <RichTextInput
                                                                value={state.comment || ""} //TODO hacer que funcione
                                                                translate={translate}
                                                                onChange={value =>
                                                                    setState({
                                                                        ...state,
                                                                        comment: value

                                                                        // vote: {
                                                                        //     id: agenda.id,
                                                                        // }
                                                                    })
                                                                }
                                                            />
                                                        }
                                                        title={"Enviar comentario"}
                                                        acceptAction={() => updateComments(agenda.id)}
                                                        buttonAccept={translate.send}
                                                        buttonCancel={translate.cancel}
                                                    >
                                                    </AlertConfirm> */}
                                                </div>
                                            )
                                        })
                                    )
                                :
                                <LoadingSection />
                            }
                        </div>
                        {/* </ScrollbarStartBottom> */}
                    </Scrollbar>
                </div>
            </Paper>
        );
    }

    return (
        <div style={{ height: "100%" }}>
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
            <div style={{ padding: '0.8em', paddingLeft: '1.2em', height: "100%" }}> {/*marginTop: '10px',*/}

                {data.agendas ?
                    agendas.map((agenda, index) => {
                        return (
                            <div style={{ margin: "0 auto", marginBottom: "15px", width: "93%", }} key={agenda.id}>
                                <Card >
                                    <CardHeader
                                        avatar={
                                            <Avatar aria-label="Recipe" style={{ background: "white", border: CBX.agendaPointOpened(agenda) ? "2px solid purple" : "1px solid grey", color: CBX.agendaPointOpened(agenda) ? "purple" : 'grey' }}>
                                                {index + 1}
                                            </Avatar>
                                        }
                                        action={
                                            <div style={{ display: "flex" }}>
                                                <div>
                                                    <Tooltip title={"Agenda"}>
                                                        {agendaStateIcon(agenda)}
                                                    </Tooltip>
                                                </div>
                                                <div>
                                                    <Tooltip title={"Voto"}>
                                                        {agendaVotingIcon(agenda)}
                                                    </Tooltip>
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
                                                refetch={data.refetch}
                                            />
                                        </CardContent>
                                    </Collapse>

                                    <CardActions>
                                        <Button size="small" color="primary" onClick={toggle}>
                                            Enviar comentario
                                        </Button>
                                    </CardActions>
                                </Card>
                            </div>
                        )

                    })
                    :
                    <LoadingSection />
                }
            </div>
            <AlertConfirm
                open={state.open}
                requestClose={() => setState({
                    ...state,
                    open: !state.open
                })}
                bodyText={
                    <RichTextInput 
                        value={state.comentario}
                        translate={translate}
                        onChange={value =>
                            console.log(value)
                            // setState({
                            //     vote: {
                            //         ...state.vote,
                            //         comment: value
                            //     }
                            // })
                        }
                    />
                }
                title={"Enviar comentario"}
            >
            </AlertConfirm>
        </div>
    );
}

const ModalEnvioComentario = ({translate, agenda, } ) => {
    const [state, setState] = React.useState({
        open: false,
        comment: null
    })

    const toggle = () => {
        setState({
            ...state,
            open: !state.open
        })
    }

    const updateComments = async (id) => {
        
        let response = await client.mutate({
            mutation: updateComment,
            variables: {
                id: id,
                text: state.comment
            }
        });

        console.log(response);
    }   
    
    return (
        <React.Fragment>
            <Button size="small" color="primary" onClick={toggle}>
                Enviar comentario
            </Button>
            <AlertConfirm
                open={state.open}
                requestClose={toggle}
                bodyText={
                    <RichTextInput
                        value={state.comment || ""} //TODO hacer que funcione
                        translate={translate}
                        onChange={value =>
                            setState({
                                ...state,
                                comment: value

                                // vote: {
                                //     id: agenda.id,
                                // }
                            })
                        }
                    />
                }
                title={"Enviar comentario"}
                acceptAction={()=>updateComments(agenda.id)}
                buttonAccept={translate.send}
                buttonCancel={translate.cancel}
            />
        </React.Fragment>
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

const updateComment = gql`
    mutation UpdateComment($text: String!, $id: Int!){
        updateComment(text: $text, id: $id){
            success
            message
        }
    }
`;

export default withApollo(AgendaNoSession);

///////////////////////////////////////////////
// <Card style={{ padding: "1em" }}>
//     <div
//         style={{
//             display: "flex",
//             marginRight: "10px",
//             marginBottom: "1.5em"
//         }}
//     >
//         <div style={{
//             marginRight: "10px",
//             color: "#000000de",
//             fontWeight: '700',
//             fontSize: '16px'
//         }}
//         >
//             {index + 1}. </div>
//         <div>

//             <div style={{
//                 color: "#000000de",
//                 fontWeight: '700',
//                 fontSize: '16px',
//                 display: "flex"
//             }}>
//                 <div style={{ width: "55px" }}>{translate.title}:</div> {agenda.agendaSubject}
//             </div>
//             <Typography variant="body1" style={{ color: secondary, fontWeight: '700', display: "flex" }}>
//                 <span style={{ width: "38px" }}>{translate.type}:</span> {translate[getAgendaTypeLabel(agenda)]}
//             </Typography>
//             <div style={{ display: "flex", minHeight: '25px', display: "flex" }}>
//                 <AgendaDescription agenda={agenda} translate={translate} />
//             </div>
//             <AgendaMenu
//                 horizontal={true}
//                 agenda={agenda}
//                 council={council}
//                 participant={participant}
//                 translate={translate}
//                 refetch={data.refetch}
//             />
//         </div>
//     </div>
// </Card>