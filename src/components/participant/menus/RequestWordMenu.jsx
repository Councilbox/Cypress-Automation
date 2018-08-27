import React from 'react';
import { Paper, IconButton, Tooltip } from "material-ui";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getPrimary, getSecondary } from '../../../styles/colors';

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


    render(){
        const primary = getPrimary();

        return(
            <Paper
                style={{
                    width: '6em',
                    height: '3em',
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bottom: '10px'
                }}
            >
                <Tooltip title="Pedir palabra"/*TRADUCCION*/ placement="top">
                    <IconButton
                        size={'small'}
                        style={{outline: 0, color: primary}}
                        onClick={this.askForWord}
                    >
                        <i className="material-icons">
                            pan_tool
                        </i>
                    </IconButton>
                </Tooltip>
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
})(RequestWordMenu);