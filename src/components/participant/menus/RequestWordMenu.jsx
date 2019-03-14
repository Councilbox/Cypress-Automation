import React from 'react';
import { Paper, IconButton, Tooltip, Button } from "material-ui";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withTranslations from '../../../HOCs/withTranslations';
import { getPrimary, getSecondary } from '../../../styles/colors';
import * as CBX from '../../../utils/CBX';
import AdminPrivateMessage from './AdminPrivateMessage';
import DetectRTC from 'detectrtc';
import { AlertConfirm, BasicButton } from '../../../displayComponents';
import { ConfigContext } from '../../../containers/AppControl';
import { isSafari } from 'react-device-detect';
import FontAwesome from "react-fontawesome";



class RequestWordMenu extends React.Component {

    state = {
        alertCantRequestWord: false,
        safariModal: false,
        confirmWordModal: false
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
                    requestWord: 1
                }
            });
            await this.props.refetchParticipant();
            this.setState({
                loading: false
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
                    width: "20%", textAlign: "center", paddingTop: '0.35rem',
                    color: grantedWord ? 'grey' : secondary,
                    // backgroundColor: grantedWord ? secondary : 'inherit',
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
                                {/* <i className="material-icons" style={{
                                    fontSize: '24px', padding: '0', margin: "0",
                                    width: '1em',
                                    height: '1em',
                                    overflow: 'hidden',
                                    userSelect: 'none',
                                    color: grantedWord ? primary : secondary,
                                }}>
                                    pan_tool
                                </i> */}
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
                                                top: "-8px",
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
                                    // <FontAwesome
                                    //     name={"hand-paper-o"}
                                    //     style={{
                                    //         color: primary ,
                                    //         // color: grantedWord ? primary : secondary,
                                    //         fontSize: '24px',
                                    //         width: '1em',
                                    //         height: '1em',
                                    //         overflow: 'hidden',
                                    //         userSelect: 'none'
                                    //     }}
                                    // />

                                }
                                {/* <FontAwesome
                                    name={"hand-paper-o"}
                                    style={{
                                        color: grantedWord ? primary : secondary,
                                        fontSize: '24px',
                                        width: '1em',
                                        height: '1em',
                                        overflow: 'hidden',
                                        userSelect: 'none'
                                    }}
                                /> */}
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
            <div style={{ width: "20%", textAlign: "center", paddingTop: '0.35rem', color: isSafari ? 'grey' : secondary, }}>
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
                            {/* <i className="material-icons" style={{
                                fontSize: '24px', padding: '0', margin: "0",
                                width: '1em',
                                height: '1em',
                                overflow: 'hidden',
                                userSelect: 'none',
                                color: isSafari ? 'grey' : "#ffffffcc",
                            }}>
                                pan_tool
                            </i> */}
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

        if (this.props.isSidebar) {
            return (
                <ConfigContext.Consumer>
                    {value => (
                        <React.Fragment>

                            {!fixedURLMode &&
                                this._renderWordButtonIconMobil()
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
                        </React.Fragment>
                    )}
                </ConfigContext.Consumer>
            )
        } else {
            return (
                <ConfigContext.Consumer>
                    {value => (
                        <React.Fragment>
                            <Paper
                                style={{
                                    width: fixedURLMode ? '5.5em' : '8em',
                                    height: '2.2em',
                                    position: 'absolute',
                                    backgroundColor: 'white',
                                    color: grantedWord ? 'white' : primary,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    overflow: 'hidden',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bottom: '0px'
                                }}
                            >
                                {!fixedURLMode &&
                                    this._renderWordButtonIcon()
                                }
                                {fixedURLMode ?
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                        {this._renderPrivateMessageIcon()}
                                    </div>
                                    :
                                    this._renderPrivateMessageIcon()
                                }
                            </Paper>
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
                        </React.Fragment>
                    )}
                </ConfigContext.Consumer>
            )
        }
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