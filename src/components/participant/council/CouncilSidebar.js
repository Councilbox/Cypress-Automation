import React from 'react';
import FontAwesome from "react-fontawesome";
import FloatGroup from 'react-float-button';
import { Grid, Button } from "material-ui";
import { withApollo } from 'react-apollo';
import TimelineSection from '../timeline/TimelineSection';
import gql from 'graphql-tag';
import { darkGrey, secondary, primary } from '../../../styles/colors';
import { AlertConfirm, Badge, Scrollbar } from '../../../displayComponents';


const styles = {
    button: {
        width: '100%',
        height: "100%",
        minWidth: "0",
        color: '#ffffffcc',
        padding: '0',
        margin: "0",
        fontSize: '10px'
    }
}


const CouncilSidebar = ({ translate, council, participant, ...props }) => {
    const scrollbar = React.useRef();
    const closeAll = () => {
        props.setContent(null);
        // props.toggl;
    }

    const renderVideoButton = () => {
        return (
            <Button
                className={"NoOutline prueba"}
                style={styles.button}
                onClick={closeAll}
            >
                <div style={{ display: "unset" }}>
                    <div>
                        <i
                            className="fa fa-video-camera"
                            style={{
                                color: !props.modalContent ? secondary : "",
                                fontSize: '24px', padding: '0', margin: "0",
                                marginTop: "4px",
                                width: '1em',
                                height: '1em',
                                overflow: 'hidden',
                                userSelect: 'none',
                            }}
                        />
                    </div>
                    <div style={{
                        color: 'white',
                        fontSize: '0.55rem',
                        textTransform: "none"
                    }}>
                        {translate.video}
                    </div>
                </div>
            </Button>
        )
    }

    const renderAgendaButton = () => (
        <Button
            className={"NoOutline"}
            style={styles.button}
            onClick={() => props.setContent('agenda')}
        >
            <div style={{ display: "unset" }}>
                <Badge badgeContent={8} dot color="primary" styleDot={{ color: primary }} hide={!props.agendaBadge} /*className={'fadeToggle'}*/>
                    <div>
                        <i className="material-icons" style={{
                            color: props.modalContent === "agenda" ? secondary : "",
                            fontSize: '24px', padding: '0', margin: "0",
                            width: '1em',
                            height: '1em',
                            overflow: 'hidden',
                            userSelect: 'none',
                        }}>
                            calendar_today
                        </i>
                    </div>
                </Badge>
                <div style={{
                    color: 'white',
                    fontSize: '0.55rem',
                    textTransform: "none"
                }}>
                    Agenda {/*TRADUCCION*/}
                </div>
            </div>
        </Button>
    )

    const renderPrivateMessageButton = () => (
        <Button
            className={"NoOutline"}
            title={"sendMessage"}
            style={styles.button}
            onClick={() => props.setAdminMessage(!props.adminMessage)}>
            <div style={{ display: "unset" }}>
                <div>
                    <i className="material-icons" style={{
                        fontSize: '24px', padding: '0', margin: "0",
                        width: '1em',
                        height: '1em',
                        overflow: 'hidden',
                        userSelect: 'none',
                        color: props.adminMessage ? primary : "#ffffffcc",
                    }}>
                        chat_bubble_outline
                        </i>
                </div>
                <div style={{
                    color: "white",
                    fontSize: '0.55rem',
                    textTransform: "none"
                }}>
                    {props.isMobile ?
                        'Mensaje' /*TRADUCCION*/
                        :
                        'Mensaje al admin'/*TRADUCCION*/
                    }
                </div>
            </div>
        </Button>
    )

    if (!props.noSession && props.isMobile) {
        return (
            <AlertConfirm
                open={true}
                classNameDialog={'modal100SinMenu'}
                PaperProps={{
                    style: { margin: 0, width: '100%', borderRadius: '0', maxHeight: '100vh', height: '100%  ', boxShadow: 'none', top: "0px" }
                }}
                bodyStyle={{ maxWidth: '100vw', width: "100%", padding: '0', }}
                bodyText={
                    <div style={{ height: '100%' }}>
                        {props.agenda}
                    </div>
                }
            />
        )
    }
    const scrollToBottom = () => {
        scrollbar.current.scrollToBottom();
    }
    if (props.isMobile) {
        return (
            <div style={{
                float: 'left',
                zIndex: '0'
            }}>
                <div style={{
                    borderTop: "1px solid dimgrey",
                    backgroundColor: darkGrey,
                    height: 'calc( 3.5rem + 1px )',
                    zIndex: '1000',
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'row',
                    left: '0px',
                    width: '100vw',
                    alignItems: 'center',
                    bottom: '0px',
                    // overflow: 'hidden',
                    fontSize: "0.55em"
                }}>
                    <div style={{ height: '3.5rem', width: "100vw", display: 'flex', color: '#ffffffcc', }}>

                        <div style={{ width: "20%", textAlign: "center", paddingTop: '0.35rem', }}>
                            {!props.modalContent ?
                                <FloatGroup
                                    delay={0.02}
                                    style={{
                                        width: '100%',
                                        height: "100%",
                                        minWidth: "0",
                                        color: '#ffffffcc',
                                        padding: '0',
                                        margin: "0",
                                        fontSize: '10px'
                                    }}
                                >
                                    {renderVideoButton()}
                                    <Button style={{
                                        left: '0.9em',
                                        bottom: '20px',
                                        background: "white",
                                        width: "45px",
                                        borderRadius: "45px",
                                        height: "45px",
                                        padding: '0',
                                        margin: "0px",
                                        minWidth: "0",
                                        boxShadow: "0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)"
                                    }}
                                        onClick={props.middle}>
                                        <div>
                                            <i
                                                className="fa fa-compress"
                                                style={{
                                                    color: 'grey',
                                                    padding: '0', margin: "0",
                                                    fontSize: '24px',
                                                    overflow: 'hidden',
                                                    userSelect: 'none'
                                                }}
                                            />
                                        </div>
                                    </Button>
                                    <Button style={{
                                        left: '0.9em',
                                        bottom: '20px',
                                        background: "white",
                                        width: "45px",
                                        borderRadius: "45px",
                                        height: "45px"
                                        , padding: '0',
                                        margin: "0",
                                        minWidth: "0",
                                        boxShadow: "0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)"
                                    }}
                                        onClick={props.full}>
                                        <div>
                                            <i
                                                className={"fa fa-expand"}
                                                style={{
                                                    color: 'grey',
                                                    padding: '0', margin: "0",
                                                    fontSize: '24px',
                                                    width: '1em',
                                                    height: '1em',
                                                    overflow: 'hidden',
                                                    userSelect: 'none'
                                                }}
                                            />
                                        </div>
                                    </Button>
                                </FloatGroup>
                                :
                                renderVideoButton()
                            }
                        </div>
                        <div style={{ width: "20%", textAlign: "center", paddingTop: '0.35rem', }}>
                            {renderAgendaButton()}
                        </div>
                        {props.pedirPalabra}
                        <div style={{ width: "20%", textAlign: "center", paddingTop: '0.35rem', }}>
                            {renderPrivateMessageButton()}
                        </div>
                        <div style={{ width: "20%", textAlign: "center", paddingTop: '0.35rem', }}>
                            <TimelineButton
                                council={council}
                                onClick={() => props.setContent('timeline')}
                                actived={props.modalContent === "timeline"}
                                participant={participant}
                            />
                        </div>
                    </div>
                </div>
                <AlertConfirm
                    // open={!!props.modalContent}
                    open={true}
                    classNameDialog={!!props.modalContent ? 'modal100block' : 'modal100none'}
                    PaperProps={{
                        // style: { margin: 0, width: '100%', borderRadius: '0', maxHeight: '100vh', height: '100%  ', boxShadow: 'none', top: "0px" }
                        style: { margin: 0, width: '100%', borderRadius: '0', maxHeight: '100vh', height: '100%  ', boxShadow: 'none', top: "0px", display: !!props.modalContent ? "block" : "none" }
                    }}
                    bodyStyle={{ maxWidth: '100vw', width: "100%", padding: '0', height: '100%  ' }}
                    bodyText={
                        <div style={{ height: '100%' }}>
                            {props.modalContent === 'agenda' &&
                                props.agenda
                            }
                            {props.modalContent === 'timeline' &&
                                <Scrollbar ref={scrollbar}>
                                    <TimelineSection
                                        council={council}
                                        translate={translate}
                                        participant={participant}
                                        scrollToBottom={scrollToBottom}
                                    />
                                </Scrollbar>
                            }
                        </div>
                    }
                />
                <AlertConfirm
                    open={props.adminMessage}
                    classNameDialog={'modal100Comentario'}
                    bodyStyle={{ maxWidth: '100vw', width: "100%", padding: '0' }}
                    PaperProps={{
                        style: { width:"100%", margin:"0",
                        transition: "bottom 0.4s",
                        display: "flex",
                        position: "fixed",
                        minHeight: '50px',
                        width: "100vw",
                        bottom: props.click ? "0" : "3.7rem",
                        left: "0",
                        alignItems: "center",
                        justifyContent: "center",
                        // zIndex: '1050',
                        borderTop: "1px solid gainsboro" }
                    }}
                    bodyText={
                        // <div style={{
                            // transition: "bottom 0.4s",
                            // display: "flex",
                            // position: "fixed",
                            // minHeight: '50px',
                            // width: "100vw",
                            // bottom: props.click ? "0" : "3.7rem",
                            // left: "0",
                            // alignItems: "center",
                            // justifyContent: "center",
                            // // zIndex: '1050',
                            // borderTop: "1px solid gainsboro"
                        // }}>
                            <div style={{
                                borderRadiusTopLeft: "5px",
                                position: "relative",
                                width: "100%",
                                height: "100%",
                                background: "#f1f1f1"
                            }}>
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                    {props.comentario}
                                </div>
                         </div>
                        // </div>
                    }
                />
            </div>
        );
    } else {
        return (
            <div style={{
                float: 'left',
                zIndex: '0'
            }}>
                <div style={{
                    backgroundColor: darkGrey,
                    height: 'calc( 3.5rem + 1px )',
                    zIndex: '1000',
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'row',
                    left: '0px',
                    width: 'calc( 100vw - 20px )',
                    alignItems: 'center',
                    bottom: '0px',
                    fontSize: "0.55em",
                    marginLeft: "10px",
                    marginRight: "10px"
                }}>
                    <Grid
                        item xs={6}
                        md={8}
                        style={{
                            height: '3.5rem',
                            width: "100vw",
                            display: 'flex',
                            color: '#ffffffcc',
                            paddingRight: "3px"
                        }}
                    >
                        {props.pedirPalabra}
                        <div
                            style={{
                                width: "50%",
                                textAlign: "center",
                                paddingTop: '0.35rem',
                                borderTop: "1px solid dimgrey",
                                borderRight: "1px solid dimgrey"
                            }}
                        >
                            {renderPrivateMessageButton()}
                        </div>
                    </Grid>
                    <Grid
                        item xs={6}
                        md={4}
                        style={{
                            height: '3.5rem',
                            width: "100vw",
                            display: 'flex',
                            color: '#ffffffcc',
                            paddingLeft: "6px"
                        }}
                    >
                        <div
                            style={{
                                width: "50%",
                                textAlign: "center",
                                paddingTop: '0.35rem',
                                borderTop: "1px solid dimgrey",
                                borderLeft: "1px solid dimgrey"
                            }}
                        >
                            {renderAgendaButton()}
                        </div>
                        <div style={{ width: "50%", textAlign: "center", paddingTop: '0.35rem', borderTop: "1px solid dimgrey", borderRight: "1px solid dimgrey", }}>
                            <TimelineButton
                                council={council}
                                onClick={() => props.setContent('timeline')}
                                actived={props.modalContent === "timeline"}
                                participant={participant}
                            />
                        </div>
                    </Grid>
                </div>

                {props.adminMessage &&
                    <Grid item xs={6} md={8} style={{
                        transition: "bottom 0.7s",
                        display: "flex",
                        position: "fixed",
                        minHeight: '50px',
                        bottom: "3.7rem",
                        left: "0",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: '1010',
                    }}>
                        <div style={{
                            width: '100vw',
                            marginLeft: "10px",
                            paddingRight: "6px"
                        }}
                        >
                            <div style={{
                                borderTop: "1px solid gainsboro",
                                borderRadiusTopLeft: "5px",
                                position: "relative",
                                width: "100%",
                                height: "100%",
                                background: "#f1f1f1"
                            }}
                            >
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                    {props.comentario}
                                </div>
                            </div>
                        </div>
                    </Grid>
                }
            </div>
        );
    }
}


const TimelineButton = withApollo(({ onClick, actived, council, client, participant }) => {
    const [total, setTotal] = React.useState(0);
    const [lastEvidenceId, setlastEvidenceId] = React.useState(0);
    const [readed, setReaded] = React.useState(0);
    const [timelineLastRead, setTimelineLastRead] = React.useState(0);
    const [arrayTimeline, setArrayTimeline] = React.useState(null);


    React.useEffect(() => {
        const getTimeline = async () => {
            const response = await client.query({
                query: councilTimelineQuery,
                variables: {
                    councilId: council.id,
                }
            });

            if (response.data && response.data.councilTimeline) {
                setTotal(response.data.councilTimeline.length);
                setArrayTimeline(response.data.councilTimeline)
                if (response.data.councilTimeline[response.data.councilTimeline.length - 1] !== undefined) {
                    setlastEvidenceId(response.data.councilTimeline[response.data.councilTimeline.length - 1].id)
                }
            }
        }
        const readTimelines = async () => {
            const response = await client.query({
                query: readTimeline,
                variables: {
                    councilId: council.id,
                }
            });

            if (response.data && response.data.readTimeline.length > 0) {
                setTimelineLastRead(JSON.parse(response.data.readTimeline[response.data.readTimeline.length - 1].content).data.participant.timeline)
            }
        }

        getTimeline();
        readTimelines();
        const interval = setInterval(() => {
            getTimeline();
            readTimelines();
        }, 5000);
        return () => clearInterval(interval);
    }, [council.id, client, councilTimelineQuery]);


    const evidenceRead = async () => {
        await client.mutate({
            mutation: createEvidenceRead,
            variables: {
                evidenceId: lastEvidenceId,
                councilId: council.id,
                participantId: participant.id,
            }
        });
    }


    const enterTimeline = () => {
        setReaded(total);
        onClick();
        evidenceRead()
    }


    let resultado
    let unread = 0
    if (arrayTimeline != null) {
        resultado = arrayTimeline.findIndex(item => item.id === timelineLastRead);
        unread = total - (resultado + 1);
    } else {
        unread = 0;
    }

    return (
        <Button
            className={"NoOutline"}
            style={styles.button}
            onClick={enterTimeline}
        >
            <div style={{ display: "unset" }}>
                <Badge badgeContent={unread} hide={unread === 0} color="primary">
                    <div>
                        <FontAwesome
                            name={"file-text-o"}
                            style={{
                                color: actived ? secondary : "",
                                fontSize: '24px',
                                width: '1em',
                                height: '1em',
                                overflow: 'hidden',
                                userSelect: 'none'
                            }}
                        />
                    </div>
                </Badge>
                <div style={{
                    color: 'white',
                    fontSize: '0.55rem',
                    textTransform: "none"
                }}>
                    Resumen {/*TRADUCCION*/}
                </div>
            </div>
        </Button>
    )
})

const councilTimelineQuery = gql`
    query CouncilTimeline($councilId: Int!, ){
        councilTimeline(councilId: $councilId){
            id
        }
    }
`;

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

const createEvidenceRead = gql`
    mutation CreateEvidenceRead($evidenceId: Int!, $councilId: Int!, $participantId: Int! ){
        createEvidenceRead(evidenceId: $evidenceId, councilId: $councilId, participantId: $participantId){
            success
        }
    }
`;


export default CouncilSidebar