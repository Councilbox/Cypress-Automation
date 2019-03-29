import React from 'react';
import FontAwesome from "react-fontawesome";
import FloatGroup from 'react-float-button';
import { Grid, Button } from "material-ui";
import { withApollo } from 'react-apollo';
import TimelineSection from '../timeline/TimelineSection';
import gql from 'graphql-tag';
import { darkGrey, secondary, primary } from '../../../styles/colors';
import { AlertConfirm, BasicButton, Badge } from '../../../displayComponents';

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
    const [state, setState] = React.useState({
        showModalComentario: false,
        modalContent: false,
    })

    const toggle = type => {
        setState({
            ...state,
            modalContent: state.modalContent === type ? false : type,
            showModalComentario: false
        });
    }

    const closeAll = () => {
        setState({
            ...state,
            modalContent: false,
            showModalComentario: false,
        });
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
                            {!state.modalContent ?
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
                                    <Button
                                        className={"NoOutline prueba"}
                                        style={styles.button}
                                        onClick={closeAll}
                                    >
                                        <div style={{ display: "unset" }}>
                                            <div>
                                                <FontAwesome
                                                    name={"video-camera"}
                                                    style={{
                                                        color: !state.modalContent ? secondary : "",
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
                                                Video {/*TRADUCCION*/}
                                            </div>
                                        </div>
                                    </Button>
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
                                            <FontAwesome
                                                name={"compress"}
                                                style={{
                                                    color: 'grey',
                                                    padding: '0', margin: "0",
                                                    fontSize: '24px',
                                                    // width: '1em',
                                                    // height: '1em',
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
                                            <FontAwesome
                                                name={"expand"}
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
                                <Button
                                    className={"NoOutline prueba"}
                                    style={styles.button}
                                    onClick={closeAll}
                                >
                                    <div style={{ display: "unset" }}>
                                        <div>
                                            <FontAwesome
                                                name={"video-camera"}
                                                style={{
                                                    color: !state.modalContent ? secondary : "",
                                                    fontSize: '24px', padding: '0', margin: "0",
                                                    marginTop: "0px",
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
                                            Video {/*TRADUCCION*/}
                                        </div>
                                    </div>
                                </Button>}
                        </div>
                        <div style={{ width: "20%", textAlign: "center", paddingTop: '0.35rem', }}>
                            <Button
                                className={"NoOutline"}
                                style={styles.button}
                                onClick={() => toggle('agenda')}
                            >
                                <div style={{ display: "unset" }}>
                                    <Badge badgeContent={8} color="primary" /*className={'fadeToggle'}*/>
                                        <div>
                                            <i className="material-icons" style={{
                                                color: state.modalContent === "agenda" ? secondary : "",
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
                        </div>
                        {props.pedirPalabra}
                        <div style={{ width: "20%", textAlign: "center", paddingTop: '0.35rem', }}>
                            <Button
                                className={"NoOutline"}
                                style={styles.button}
                                onClick={() => setState({ ...state, showModalComentario: !state.showModalComentario, modalContent: false, })}>
                                <div style={{ display: "unset" }}>
                                    <div>
                                        <i className="material-icons" style={{
                                            fontSize: '24px', padding: '0', margin: "0",
                                            width: '1em',
                                            height: '1em',
                                            overflow: 'hidden',
                                            userSelect: 'none',
                                            color: state.showModalComentario ? primary : "#ffffffcc",
                                        }}>
                                            chat_bubble_outline
                                            </i>
                                    </div>
                                    <div style={{
                                        color: "white",
                                        fontSize: '0.55rem',
                                        textTransform: "none"
                                    }}>
                                        Mensaje al admin {/*TRADUCCION*/}
                                    </div>
                                </div>
                            </Button>
                        </div>
                        <div style={{ width: "20%", textAlign: "center", paddingTop: '0.35rem', }}>
                            <TimelineButton
                                council={council}
                                onClick={() => toggle('timeline')}
                                actived={props.modalContent === "timeline"}
                            />
                        </div>
                    </div>
                </div>
                <AlertConfirm
                    open={!!state.modalContent}
                    classNameDialog={'modal100'}
                    PaperProps={{
                        style: { margin: 0, width: '100%', borderRadius: '0', maxHeight: '100vh', height: '100%  ', boxShadow: 'none', top: "0px" }
                    }}
                    bodyStyle={{ maxWidth: '100vw', width: "100%", padding: '0', }}
                    bodyText={
                        <div style={{ height: '100%' }}>
                            {state.modalContent === 'agenda' &&
                                props.agenda
                            }
                            {state.modalContent === 'timeline' &&
                                <TimelineSection
                                    council={council}
                                    translate={translate}
                                    participant={participant}
                                />
                            }
                        </div>
                    }
                />
                {state.showModalComentario &&
                    <div style={{
                        transition: "bottom 0.7s",
                        display: "flex",
                        position: "fixed",
                        minHeight: '50px',
                        width: "100vw",
                        bottom: props.click ? "0" : "3.7rem",
                        left: "0",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: '1010',
                        borderTop: "1px solid gainsboro"
                    }}>
                        <div style={{ borderRadiusTopLeft: "5px", position: "relative", width: "100%", background: "white", height: "100%", background: "#f1f1f1" }}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                {props.comentario}
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    } else {
        return(
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
                            <Button
                                className={"NoOutline"}
                                style={styles.button}
                                onClick={() => setState({ ...state, showModalComentario: !state.showModalComentario, modalContent: false })}>
                                <div style={{ display: "unset" }}>
                                    <div>
                                        <i className="material-icons" style={{
                                            fontSize: '24px', padding: '0', margin: "0",
                                            width: '1em',
                                            height: '1em',
                                            overflow: 'hidden',
                                            userSelect: 'none',
                                            color: state.showModalComentario ? primary : "#ffffffcc",
                                        }}>
                                            chat_bubble_outline
                                            </i>
                                    </div>
                                    <div style={{
                                        color: "white",
                                        fontSize: '0.55rem',
                                        textTransform: "none"
                                    }}>
                                        Mensaje al admin {/*TRADUCCION*/}
                                    </div>
                                </div>
                            </Button>
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
                            <Button
                                className={"NoOutline"}
                                style={styles.button}
                                onClick={() => props.toggle('agenda')}
                            >
                                <div style={{ display: "unset" }}>
                                    <Badge badgeContent={8} color="primary" dot={true} /*className={'fadeToggle'}*/>
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
                        </div>
                        <div style={{ width: "50%", textAlign: "center", paddingTop: '0.35rem', borderTop: "1px solid dimgrey", borderRight: "1px solid dimgrey", }}>
                            <TimelineButton
                                council={council}
                                onClick={() => props.toggle('timeline')}
                                actived={props.modalContent === "timeline"}
                            />
                        </div>
                    </Grid>
                </div>

                {state.showModalComentario &&
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
                            <div style={{ borderTop: "1px solid gainsboro", borderRadiusTopLeft: "5px", position: "relative", width: "100%", background: "white", height: "100%", background: "#f1f1f1" }}>
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


const TimelineButton = withApollo(({ onClick, actived, council, client }) => {
    const [total , setTotal] = React.useState(0);
    const [readed, setReaded] = React.useState(0);

    React.useEffect(() => {
        const getTimeline = async () => {
            const response = await client.query({
                query: councilTimelineQuery,
                variables: {
                    councilId: council.id
                }
            });

            if(response.data && response.data.councilTimeline){
                setTotal(response.data.councilTimeline.length);
            }
        }
        getTimeline();
        const interval = setInterval(getTimeline, 10000);
        return () => clearInterval(interval);
    }, [council.id, client, councilTimelineQuery]);

    const enterTimeline = () => {
        setReaded(total);
        onClick();
    }

    const unread = total - readed;


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
                                color: actived? secondary : "",
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
    query CouncilTimeline($councilId: Int!){
        councilTimeline(councilId: $councilId){
            id
        }
    }
`;


export default CouncilSidebar