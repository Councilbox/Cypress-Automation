import React from 'react';
import { getSecondary } from '../../../styles/colors';
import { Tooltip, IconButton } from 'material-ui';
import { TextInput, BasicButton } from '../../../displayComponents';
import Popover from 'antd/lib/popover';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';


class AdminPrivateMessage extends React.Component {
    state = {
        visible: false,
        tooltip: false,
        text: ''
    };

    onVisibleChange = visible => {
        this.setState({
            visible
        });
    }

    toggleVisible = () => {
        this.setState({
            visible: !this.state.visible,
            tooltip: this.state.visible
        });
    }

    sendCouncilRoomMessage = async () => {
        if (this.state.text) {
            this.setState({
                loading: true
            })
            const response = await this.props.addCouncilRoomMessage({
                variables: {
                    message: {
                        councilId: this.props.council.id,
                        participantId: this.props.participant.id,
                        text: this.state.text
                    }
                }
            });

            if (response.data) {
                if (response.data.addCouncilRoomMessage.success) {
                    this.setState({
                        success: true,
                        loading: false,
                        text: ''
                    })
                }
            }
        } else {
            this.setState({
                errorText: this.props.translate.required_field
            })
        }
    }

    resetButtonStates = () => {
        this.setState({
            success: false,
            loading: false,
            error: false
        })
    }

    renderMenu = () => {

        return (
            <div>
                <TextInput
                    floatingText={this.props.translate.message}
                    value={this.state.text}
                    multiline={true}
                    onChange={event => this.setState({ text: event.target.value, success: false })}
                    onClick={this.props.activeInput}
                    onBlur={this.props.onblur}
                />
                <BasicButton
                    text={this.state.success ? this.props.translate.tooltip_sent : this.props.translate.send}
                    onClick={this.sendCouncilRoomMessage}
                    loading={this.state.loading}
                    success={this.state.success}
                    reset={this.resetButtonStates}
                    color={getSecondary()}
                    textStyle={{
                        color: 'white',
                        fontWeight: '700'
                    }}
                />
            </div>
        )
    }
    renderMenuMobil = () => {

        return (
            <div>   
                {/*Crear forma redonda rollo watsapp y cambiar un poco de tamaño para hacer rollo chat*/}
                <TextInput
                    floatingText={this.props.translate.message}
                    value={this.state.text}
                    multiline={true}
                    onChange={event => this.setState({ text: event.target.value, success: false })}
                    onClick={this.props.activeInput}
                    onBlur={this.props.onblur}
                />
                <BasicButton
                    text={this.state.success ? this.props.translate.tooltip_sent : this.props.translate.send}
                    onClick={this.sendCouncilRoomMessage}
                    loading={this.state.loading}
                    success={this.state.success}
                    reset={this.resetButtonStates}
                    color={getSecondary()}
                    textStyle={{
                        color: 'white',
                        fontWeight: '700'
                    }}
                />
            </div>
        )
    }


    render() {
        const secondary = getSecondary();
        const { menuRender } = this.props


        if (menuRender) {
            return (
                this.renderMenuMobil()
            )
        } else {
            return (
                <Popover
                    title={this.props.translate.private_comment_for_room_admin}
                    content={this.renderMenu()}
                    visible={this.state.visible}
                    onVisibleChange={this.onVisibleChange}
                    trigger={'click'}
                >
                    <Tooltip
                        title={this.props.translate.private_comment_for_room_admin}
                        placement="top"
                        open={this.state.tooltip}
                    >
                        <IconButton
                            size={'small'}
                            onMouseOver={() => this.setState({ tooltip: true })}
                            onMouseLeave={() => this.setState({ tooltip: false })}
                            style={{
                                outline: 0,
                                color: this.state.visible ? 'white' : secondary,
                                backgroundColor: this.state.visible ? secondary : 'inherit',
                                width: '50%',
                                borderRadius: 0,
                                height: '100%'
                            }}
                            onClick={this.toggleVisible}
                        >
                            <i className="material-icons" style={{ width: '1em' }}>
                                chat_buble_outline
                        </i>
                        </IconButton>
                    </Tooltip>
                </Popover>
            )
        }
        // )
    }
}

const addCouncilRoomMessage = gql`
    mutation AddCouncilRoomMessage($message: RoomMessageInput!){
        addCouncilRoomMessage(message: $message){
            success
            message
        }
    }
`;

export default graphql(addCouncilRoomMessage, {
    name: 'addCouncilRoomMessage'
})(AdminPrivateMessage);