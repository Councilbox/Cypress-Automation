import React from 'react';
import { Paper, IconButton, Tooltip, Button, Grid } from "material-ui";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withTranslations from '../../../HOCs/withTranslations';
import { getPrimary, getSecondary } from '../../../styles/colors';
import * as CBX from '../../../utils/CBX';
import AdminPrivateMessage from './AdminPrivateMessage';
import DetectRTC from 'detectrtc';
import { AlertConfirm, BasicButton, LiveToast } from '../../../displayComponents';
import { ConfigContext } from '../../../containers/AppControl';
import { isSafari } from 'react-device-detect';
import FontAwesome from "react-fontawesome";
import { toast } from 'react-toastify';
import { RvHookup } from 'material-ui-icons';


class RequestWordMenu extends React.Component {

    state = {
        alertCantRequestWord: false,
        safariModal: false,
        confirmWordModal: false,
    }

    askForWord = async () => {
        if (await this.checkWordRequisites()) {
            this.setState({
                loading: true,
                confirmWordModal: false
            });
            await this.props.changeRequestWord({
                variables: {
                    participantId: this.props.participant.id,
                    requestWord: 1,
                }
            });
            await this.props.refetchParticipant();
            this.setState({
                loading: false,
            });
        } else {
            this.setState({
                alertCantRequestWord: true
            });
        }
    }

    updateRTC = () => {
        return new Promise((resolve) => {
            DetectRTC.load(() => resolve());
        })
    }

    checkWordRequisites = async () => {
        await this.updateRTC();
        return DetectRTC.audioInputDevices.length > 0;
    }

    cancelAskForWord = async () => {
        await this.props.changeRequestWord({
            variables: {
                participantId: this.props.participant.id,
                requestWord: 0
            }
        });
        await this.props.refetchParticipant();

    }

    closeAlertCantRequest = () => {
        this.setState({
            alertCantRequestWord: false
        });
    }

    _renderAlertBody = () => {
        return (
            <div
                style={{
                    maxWidth: '500px'
                }}
            >
                {this.props.translate.sorry_cant_ask_word}
            </div>
        )
    }

    _renderWordButtonIcon = () => {
        const secondary = getSecondary();
        const primary = getPrimary();

        const grantedWord = CBX.haveGrantedWord(this.props.participant);
        if (grantedWord || CBX.isAskingForWord(this.props.participant)) {
            return (
                <Tooltip title={this.props.translate.cancel_ask_word} placement="top">
                    <IconButton
                        size={'small'}
                        style={{
                            outline: 0,
                            color: grantedWord ? 'white' : primary,
                            backgroundColor: grantedWord ? primary : 'inherit',
                            width: '50%',
                            height: '100%',
                            borderRadius: 0
                        }}
                        onClick={this.cancelAskForWord}
                    >
                        <i className="material-icons">
                            pan_tool
                        </i>
                    </IconButton>
                </Tooltip>
            )
        }

        return (
            <Tooltip title={this.props.translate.ask_to_speak} placement="top">
                <IconButton
                    size={'small'}
                    style={{
                        outline: 0,
                        color: isSafari ? 'grey' : secondary,
                        borderRadius: 0,
                        width: '50%',
                        height: '100%',
                    }}
                    onClick={isSafari ? this.showSafariAskingModal : this.askForWord}
                >
                    <i className="material-icons">
                        pan_tool
                    </i>
                </IconButton>
            </Tooltip>
        )
    }

    _renderWordButtonIconMobil = () => {
        const secondary = getSecondary();
        const primary = getPrimary();

        const grantedWord = CBX.haveGrantedWord(this.props.participant);
        if (grantedWord || CBX.isAskingForWord(this.props.participant)) {
            return (
                <div style={{
                    width: this.props.isPc ? "50%" : "20%",
                    textAlign: "center",
                    paddingTop: '0.35rem',
                    color: grantedWord ? 'grey' : secondary,
                    borderLeft: this.props.isPc ? "1px solid dimgrey" : "",
                    borderTop: this.props.isPc ? "1px solid dimgrey" : "",
                }}>
                    <Button
                        className={"NoOutline"}
                        style={{
                            width: '100%', height: "100%", minWidth: "0", padding: '0', margin: "0", fontSize: '10px',
                            color: grantedWord ? 'grey' : secondary,
                        }}
                        onClick={this.cancelAskForWord}
                    >
                        <div style={{ display: "unset" }}>
                            <div style={{ position: "relative" }}>
                                {grantedWord ? (
                                    <i className="material-icons" style={{
                                        fontSize: '24px', padding: '0', margin: "0",
                                        width: '1em',
                                        height: '1em',
                                        overflow: 'hidden',
                                        userSelect: 'none',
                                        color: primary,
                                    }}>
                                        pan_tool
                                    </i>
                                ) :
                                    <React.Fragment>
                                        <FontAwesome
                                            name={"hourglass-start "}
                                            style={{
                                                top: "-6px",
                                                fontWeight: "bold",
                                                right: "-10px",
                                                position: "absolute",
                                                fontSize: "1rem",
                                                marginRight: '0.3em',
                                                color: primary
                                            }}
                                        />
                                        <i className="material-icons" style={{
                                            fontSize: '24px', padding: '0', margin: "0",
                                            width: '1em',
                                            height: '1em',
                                            overflow: 'hidden',
                                            userSelect: 'none',
                                            color: primary,
                                        }}>
                                            pan_tool
                                        </i>
                                    </React.Fragment>
                                }
                            </div>
                            <div style={{
                                color: 'white',
                                fontSize: '0.55rem',
                                textTransform: "none"
                            }}>
                                Palabra {/*TRADUCCION*/}
                            </div>
                        </div>
                    </Button>
                </div>
            )
        }

        return (
            <div style={{ width: this.props.isPc ? "50%" : "20%", textAlign: "center", paddingTop: '0.35rem', color: isSafari ? 'grey' : secondary, borderTop: this.props.isPc ? "1px solid dimgrey" : "", borderLeft: this.props.isPc ? "1px solid dimgrey" : "" }}>
                <Button
                    className={"NoOutline"}
                    style={{ width: '100%', height: "100%", minWidth: "0", padding: '0', margin: "0", fontSize: '10px', }}
                    onClick={isSafari ? this.showSafariAskingModal : () => this.setState({ confirmWordModal: true })}
                // onClick={isSafari ? this.showSafariAskingModal : this.askForWord}
                >
                    <div style={{ display: "unset" }}>
                        <div style={{ position: "relative" }}>
                            {this.state.loading &&
                                <FontAwesome
                                    name={"circle-o-notch fa-spin"}
                                    style={{
                                        top: "-8px",
                                        fontWeight: "bold",
                                        right: "-10px",
                                        position: "absolute",
                                        fontSize: "1rem",
                                        marginRight: '0.3em',
                                        color: secondary
                                    }}
                                />
                            }
                            <FontAwesome
                                name={"hand-paper-o"}
                                style={{
                                    color: isSafari ? 'grey' : "#ffffffcc",
                                    fontSize: '24px',
                                    width: '1em',
                                    height: '1em',
                                    overflow: 'hidden',
                                    userSelect: 'none'
                                }}
                            />
                        </div>
                        <div style={{
                            // color: 'white',
                            fontSize: '0.55rem',
                            textTransform: "none",
                            color: isSafari ? 'grey' : "#ffffffcc",
                        }}>
                            Palabra {/*TRADUCCION*/}
                        </div>
                    </div>
                </Button>
            </div>
        )
    }

    showSafariAskingModal = () => {
        this.setState({
            safariModal: true
        });
    }

    closeSafariModal = () => {
        this.setState({
            safariModal: false
        });
    }

    closeWordModal = () => {
        this.setState({
            confirmWordModal: false
        });
    }

    _renderPrivateMessageIcon = () => {
        return (
            <AdminPrivateMessage
                translate={this.props.translate}
                council={this.props.council}
                participant={this.props.participant}
            />
        )
    }

    _renderSafariAlertBody = () => {
        //TRADUCCION
        return (
            <div>
                En estos momentos no está permitido que los usuarios que accedan a través de safari participen en la reunión. Disculpe las molestias
            </div>
        )
    }


    render() {
        const primary = getPrimary();
        const grantedWord = CBX.haveGrantedWord(this.props.participant);
        const fixedURLMode = this.props.videoURL && !this.props.videoURL.includes('councilbox');

        return (
            <ConfigContext.Consumer>
                {value => (
                    <React.Fragment>

                        {!fixedURLMode ?
                            this._renderWordButtonIconMobil()
                            :
                            <div style={{
                                width: this.props.isPc ? "50%" : "20%",
                                borderLeft: this.props.isPc ? "1px solid dimgrey" : "",
                                borderTop: this.props.isPc ? "1px solid dimgrey" : "",
                            }}
                            >
                            </div>
                        }


                        <AlertConfirm
                            requestClose={() => this.setState({ alertCantRequestWord: false })}
                            open={this.state.alertCantRequestWord}
                            fullWidth={false}
                            acceptAction={this.closeAlertCantRequest}
                            buttonAccept={this.props.translate.accept}
                            bodyText={this._renderAlertBody()}
                            title={this.props.translate.error}
                        />
                        <AlertConfirm
                            requestClose={this.closeSafariModal}
                            open={this.state.safariModal}
                            fullWidth={false}
                            acceptAction={this.closeSafariModal}
                            buttonAccept={this.props.translate.accept}
                            bodyText={this._renderSafariAlertBody()}
                            title={this.props.translate.warning}
                        />
                        <AlertConfirm
                            requestClose={this.closeWordModal}
                            open={this.state.confirmWordModal}
                            acceptAction={this.askForWord}
                            cancelAction={this.closeWordModal}
                            title={this.props.translate.warning}
                            bodyText={"Va a pedir palabra."}/*TRADUCCION*/
                            buttonAccept={this.props.translate.accept}
                            buttonCancel={this.props.translate.cancel}
                        />

                        {grantedWord && this.props.avisoVideoState &&
                            <Grid item xs={12} md={8} style={{
                                transition: "top 0.7s",
                                display: "flex",
                                position: "fixed",
                                minHeight: '50px',
                                top: "3.7rem",
                                left: "0",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: '1010',
                            }}
                            >
                                <div style={{
                                    width: '100vw',
                                    marginLeft: "10px",
                                    paddingRight: "6px",
                                    height: '50px',
                                }}
                                >
                                    <div style={{
                                        borderTop: "1px solid gainsboro",
                                        borderRadiusTopLeft: "5px",
                                        position: "relative",
                                        width: "100%", height: "100%",
                                        background: "white",
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", height: "100%", fontSize: "15px", color: getSecondary(), paddingLeft: '10px' }}>
                                            <div style={{ marginRight: "10px", marginTop: "4px" }}>
                                                < FontAwesome
                                                    name={"info-circle"}
                                                    style={{
                                                        fontSize: "1.4em",
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                Le han concedido la palabra
                                            </div>
                                            <div>
                                                < FontAwesome
                                                    name={"close"}
                                                    style={{
                                                        cursor: "pointer",
                                                        fontSize: "1.5em",
                                                        color: getSecondary(),
                                                        position: "absolute",
                                                        right: "12px",
                                                        top: "8px"
                                                    }}
                                                    onClick={this.props.avisoVideoStateCerrar}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        }
                    </React.Fragment>
                )}
            </ConfigContext.Consumer>
        )
    }
}

const changeRequestWord = gql`
    mutation ChangeRequestWord($participantId: Int!, $requestWord: Int!){
                    changeRequestWord(participantId: $participantId, requestWord: $requestWord){
                    success
            message
                }
            }
        `;

export default graphql(changeRequestWord, {
    name: 'changeRequestWord'
})(withTranslations()(RequestWordMenu));