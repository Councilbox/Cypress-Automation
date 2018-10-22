import React from 'react';
import { Paper, IconButton, Tooltip } from "material-ui";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withTranslations from '../../../HOCs/withTranslations';
import { getPrimary, getSecondary } from '../../../styles/colors';
import * as CBX from '../../../utils/CBX';
import AdminPrivateMessage from './AdminPrivateMessage';
import DetectRTC from 'detectrtc';
import { AlertConfirm } from '../../../displayComponents';


class RequestWordMenu extends React.Component {

    state = {
        alertCantRequestWord: false
    }

    askForWord = async () => {
        if(await this.checkWordRequisites()){
            this.setState({
                loading: true
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
        if(grantedWord || CBX.isAskingForWord(this.props.participant)){
            return(
                <Tooltip title={this.props.translate.cancel_ask_word} placement="top">
                    <IconButton
                        size={'small'}
                        style={{
                            outline: 0,
                            color: grantedWord? 'white' : primary,
                            backgroundColor: grantedWord? primary : 'inherit',
                            width: '2em',
                            height: '100%',
                            borderRadius: '0.5em'
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

        return(
            <Tooltip title={this.props.translate.ask_to_speak} placement="top">
                <IconButton
                    size={'small'}
                    style={{outline: 0, color: secondary}}
                    onClick={this.askForWord}
                >
                    <i className="material-icons">
                        pan_tool
                    </i>                    
                </IconButton>
            </Tooltip>
        )
    }

    _renderPrivateMessageIcon = () => {
        return(
            <AdminPrivateMessage
                translate={this.props.translate}
                council={this.props.council}
                participant={this.props.participant}
            />
        )
    }


    render(){
        const primary = getPrimary();
        const grantedWord = CBX.haveGrantedWord(this.props.participant);

        return(
            <Paper
                style={{
                    width: '8em',
                    height: '3em',
                    position: 'absolute',
                    backgroundColor: 'white',
                    color: grantedWord? 'white' : primary,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bottom: '10px'
                }}
            >
                <div>
                    {this._renderWordButtonIcon()}
                    {this._renderPrivateMessageIcon()}
                </div>
                <AlertConfirm
					requestClose={() => this.setState({ alertCantRequestWord: false })}
					open={this.state.alertCantRequestWord}
					fullWidth={false}
					acceptAction={this.closeAlertCantRequest}
					buttonAccept={this.props.translate.accept}
					bodyText={this._renderAlertBody()}
					title={this.props.translate.error}
				/>
            </Paper>
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