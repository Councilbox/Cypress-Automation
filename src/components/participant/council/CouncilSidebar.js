import React from 'react';
import FontAwesome from "react-fontawesome";
import FloatGroup from 'react-float-button';
import { Grid, Button, Badge } from "material-ui";
import TimelineSection from '../timeline/TimelineSection';
import { darkGrey, secondary, primary } from '../../../styles/colors';
import { AlertConfirm, BasicButton } from '../../../displayComponents';



class CouncilSidebar extends React.Component {

    state = {
        showModalComentario: false,
        modalContent: false,
    };

    toggle(type) {
        this.setState({
            modalContent: this.state.modalContent === type ? false : type,
            showModalComentario: false
        });
    }

    cerrarTodo() {
        this.setState({
            modalContent: false,
            showModalComentario: false,
        });
    }

    render() {
        if (this.props.isMobile) {
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
                                {!this.state.modalContent ?
                                    <FloatGroup delay={0.02} style={{ width: '100%', height: "100%", minWidth: "0", color: '#ffffffcc', padding: '0', margin: "0", fontSize: '10px', }}  >
                                        <Button className={"NoOutline prueba"} style={{ width: '100%', height: "100%", minWidth: "0", color: '#ffffffcc', padding: '0', margin: "0", fontSize: '10px', overflow: "hidden", }} onClick={() => this.cerrarTodo()}>
                                            <div style={{ display: "unset" }}>
                                                <div>
                                                    <FontAwesome
                                                        name={"video-camera"}
                                                        style={{
                                                            color: !this.state.modalContent ? secondary : "",
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
                                            onClick={this.props.middle}>
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
                                            onClick={this.props.full}>
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
                                    <Button className={"NoOutline prueba"} style={{ width: '100%', height: "100%", minWidth: "0", color: '#ffffffcc', padding: '0', margin: "0", fontSize: '10px', overflow: "hidden", }} onClick={() => this.cerrarTodo()}>
                                        <div style={{ display: "unset" }}>
                                            <div>
                                                <FontAwesome
                                                    name={"video-camera"}
                                                    style={{
                                                        color: !this.state.modalContent ? secondary : "",
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
                                    className={"NoOutline"} style={{ width: '100%', height: "100%", minWidth: "0", color: '#ffffffcc', padding: '0', margin: "0", fontSize: '10px', }}
                                    onClick={() => this.toggle('agenda')}
                                >
                                    <div style={{ display: "unset" }}>
                                        <Badge badgeContent={8} color="primary" /*className={'fadeToggle'}*/>
                                            <div>
                                                <i className="material-icons" style={{
                                                    color: this.state.modalContent === "agenda" ? secondary : "",
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
                            {this.props.pedirPalabra }
                            <div style={{ width: "20%", textAlign: "center", paddingTop: '0.35rem', }}>
                                <Button className={"NoOutline"} style={{ width: '100%', height: "100%", minWidth: "0", color: '#ffffffcc', padding: '0', fontSize: '10px', }}
                                    onClick={() => this.setState({ showModalComentario: !this.state.showModalComentario, modalContent: false, })}  >
                                    <div style={{ display: "unset" }}>
                                        <div>
                                            <i className="material-icons" style={{
                                                fontSize: '24px', padding: '0', margin: "0",
                                                width: '1em',
                                                height: '1em',
                                                overflow: 'hidden',
                                                userSelect: 'none',
                                                color: this.state.showModalComentario ? primary : "#ffffffcc",
                                            }}>
                                                chat_bubble_outline
                                                </i>
                                        </div>
                                        <div style={{
                                            color: "white",
                                            fontSize: '0.55rem',
                                            textTransform: "none"
                                        }}>
                                            Comentario {/*TRADUCCION*/}
                                        </div>
                                    </div>
                                </Button>
                            </div>
                            <div style={{ width: "20%", textAlign: "center", paddingTop: '0.35rem', }}>
                                <Button
                                    className={"NoOutline"} style={{ width: '100%', height: "100%", minWidth: "0", color: '#ffffffcc', padding: '0', fontSize: '10px', }}
                                    onClick={() => this.toggle('timeline')}
                                >
                                    <div style={{ display: "unset" }}>
                                        <Badge badgeContent={8} color="primary" /*className={'fadeToggle'}*/>
                                            <div>
                                                <FontAwesome
                                                    // name={"list-ul"}
                                                    name={"file-text-o"}
                                                    style={{
                                                        color: this.state.modalContent === "timeline" ? secondary : "",
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
                            </div>
                        </div>
                    </div >
                    <AlertConfirm
                        open={!!this.state.modalContent}
                        classNameDialog={'modal100'}
                        PaperProps={{
                            style: { margin: 0, width: '100%', borderRadius: '0', maxHeight: '100vh', height: '100%  ', boxShadow: 'none', top: "0px" }
                        }}
                        bodyStyle={{ maxWidth: '100vw', width: "100%", padding: '0', }}
                        bodyText={
                            <div style={{ height: '100%' }}>
                                {this.state.modalContent === 'agenda' &&
                                    this.props.agenda
                                }
                                {this.state.modalContent === 'timeline' &&
                                    <TimelineSection
                                        council={this.props.council}
                                    />
                                }
                            </div>
                        }
                    />
                    {this.state.showModalComentario &&
                        <div style={{
                            transition: "bottom 0.7s",
                            display: "flex",
                            position: "fixed",
                            minHeight: '50px',
                            width: "100vw",
                            bottom: this.props.click ? "0" : "3.7rem",
                            left: "0",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: '1010',
                            borderTop: "1px solid gainsboro"
                        }}>
                            <div style={{ borderRadiusTopLeft: "5px", position: "relative", width: "100%", background: "white", height: "100%", background: "#f1f1f1" }}>
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                                    {this.props.comentario}
                                </div>
                            </div>
                        </div>
                    }
                </div >
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
                        <Grid item xs={6} md={8} style={{ height: '3.5rem', width: "100vw", display: 'flex', color: '#ffffffcc', paddingRight: "3px" }}>
                            {/* <div style={{ height: '3.5rem', width: "100vw", display: 'flex', color: '#ffffffcc', }}> */}

                            {this.props.pedirPalabra}
                            <div style={{ width: "50%", textAlign: "center", paddingTop: '0.35rem', borderTop: "1px solid dimgrey", borderRight: "1px solid dimgrey", }}>
                                <Button className={"NoOutline"} style={{ width: '100%', height: "100%", minWidth: "0", color: '#ffffffcc', padding: '0', fontSize: '10px', }}
                                    onClick={() => this.setState({ showModalComentario: !this.state.showModalComentario, modalContent: false, })}  >
                                    <div style={{ display: "unset" }}>
                                        <div>
                                            <i className="material-icons" style={{
                                                fontSize: '24px', padding: '0', margin: "0",
                                                width: '1em',
                                                height: '1em',
                                                overflow: 'hidden',
                                                userSelect: 'none',
                                                color: this.state.showModalComentario ? primary : "#ffffffcc",
                                            }}>
                                                chat_bubble_outline
                                                </i>
                                        </div>
                                        <div style={{
                                            color: "white",
                                            fontSize: '0.55rem',
                                            textTransform: "none"
                                        }}>
                                            Comentario {/*TRADUCCION*/}
                                        </div>
                                    </div>
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={6} md={4} style={{ height: '3.5rem', width: "100vw", display: 'flex', color: '#ffffffcc', paddingLeft: "6px" }}>
                            <div style={{ width: "50%", textAlign: "center", paddingTop: '0.35rem', borderTop: "1px solid dimgrey", borderLeft: "1px solid dimgrey", }}>
                                <Button
                                    className={"NoOutline"} style={{ width: '100%', height: "100%", minWidth: "0", color: '#ffffffcc', padding: '0', margin: "0", fontSize: '10px', }}
                                    onClick={this.props.toogleAgenda}
                                >
                                    <div style={{ display: "unset" }}>
                                        <Badge badgeContent={8} color="primary" /*className={'fadeToggle'}*/>
                                            <div>
                                                <i className="material-icons" style={{
                                                    color: this.props.modalContent === "agenda" ? secondary : "",
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
                            </div >
                            <div style={{ width: "50%", textAlign: "center", paddingTop: '0.35rem', borderTop: "1px solid dimgrey", borderRight: "1px solid dimgrey", }}>
                                <Button
                                    className={"NoOutline"} style={{ width: '100%', height: "100%", minWidth: "0", color: '#ffffffcc', padding: '0', fontSize: '10px', }}
                                    onClick={this.props.toogleResumen}
                                >
                                    <div style={{ display: "unset" }}>
                                        <Badge badgeContent={8} color="primary" /*className={'fadeToggle'}*/>
                                            <div>
                                                <FontAwesome
                                                    name={"file-text-o"}
                                                    style={{
                                                        color: this.props.modalContent === "timeline" ? secondary : "",
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
                            </div>
                        </Grid>
                    </div >

                    {
                        this.state.showModalComentario &&
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
                                        {this.props.comentario}
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    }
                </div >
            );

        }
    }
}

export default CouncilSidebar