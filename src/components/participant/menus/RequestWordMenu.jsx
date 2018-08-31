import React from 'react';
import { Paper, IconButton, Tooltip } from "material-ui";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withTranslations from '../../../HOCs/withTranslations';
import { getPrimary, getSecondary } from '../../../styles/colors';
import * as CBX from '../../../utils/CBX';
import AdminPrivateMessage from './AdminPrivateMessage';

class RequestWordMenu extends React.Component {

    askForWord = async () => {
        const response = await this.props.changeRequestWord({
            variables: {
                participantId: this.props.participant.id,
                requestWord: 1
            }
        });

        console.log(response);
    }

    cancelAskForWord = async () => {
        const response = await this.props.changeRequestWord({
            variables: {
                participantId: this.props.participant.id,
                requestWord: 0
            }
        });

        console.log(response);
    }

    renderWordButtonIcon = () => {
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

    renderPrivateMessageIcon = () => {
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
                    alignItems: 'center',
                    justifyContent: 'center',
                    bottom: '10px'
                }}
            >
                <div>
                    {this.renderWordButtonIcon()}
                    {this.renderPrivateMessageIcon()}
                </div>
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