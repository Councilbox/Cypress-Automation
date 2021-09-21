import React from 'react';
import { Tooltip, IconButton } from 'material-ui';
import Popover from 'antd/lib/popover';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { toast } from 'react-toastify';
import TextInputChat from '../../../displayComponents/TextInputChat';
import { TextInput, BasicButton, LiveToast, AlertConfirm } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import { commentWallDisabled } from '../../../utils/CBX';

class AdminPrivateMessage extends React.Component {
	state = {
		visible: false,
		tooltip: false,
		disabledModal: false,
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
			});
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
					});
					if (this.props.setAdminMessage) {
						this.props.setAdminMessage(false);
					}
					toast(
						<LiveToast
							id="success-toast"
							message={this.props.translate.tooltip_sent}
						/>, {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: true,
							className: 'successToast'
						}
					);
				}
			}
		} else {
			this.setState({
				errorText: this.props.translate.required_field
			});
		}
	}

	resetButtonStates = () => {
		this.setState({
			success: false,
			loading: false,
			error: false
		});
	}

	renderMenu = () => {
		const disabled = commentWallDisabled(this.props.council);
		return (
			<div>
				<TextInput
					floatingText={this.props.translate.message}
					value={this.state.text}
					disabled={disabled}
					multiline={true}
					onChange={event => this.setState({ text: event.target.value, success: false })}
					onClick={this.props.activeInput}
					onBlur={this.props.onblur}
				/>
				<BasicButton
					text={this.state.success ? this.props.translate.tooltip_sent : this.props.translate.send}
					onClick={disabled ? () => this.setState({ disabledModal: true }) : this.sendCouncilRoomMessage}
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
		);
	}

	renderMenuMobil = () => {
		const disabled = commentWallDisabled(this.props.council);

		return (
			<div style={{
				display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: '130px', minHeight: '50px', width: '95%'
			}}>
				<AlertConfirm
					open={this.state.disabledModal}
					title={this.props.translate.warning}
					requestClose={() => this.setState({ disabledModal: false })}
					buttonCancel={this.props.translate.close}
					bodyText={this.props.translate.wall_inactive}
				/>
				<TextInputChat
					key={'adminPivate'}
					floatingText={this.props.translate.message}
					value={this.state.text}
					multiline={true}
					disabled={disabled}
					onChange={event => this.setState({ text: event.target.value, success: false })}
					onClick={this.props.activeInput}
					onBlur={this.props.onblur}
					onFocus={this.props.onFocus}
					style={{
						margin: '2.5px 0 2.5px 0 ',
						border: '1px solid gainsboro',
						paddingLeft: '16px',
						paddingRight: '16px',
						overflow: 'hidden',
						minHeight: '32px',
						maxHeight: '120px',
						borderRadius: '25px',
						backgroundColor: 'white'
					}}
				/>
				<BasicButton
					text={
						<i className="material-icons"
							style={{
								fontSize: '15px',
								padding: '0',
								margin: '0',
								width: '1em',
								height: '1em',
								overflow: 'hidden',
								userSelect: 'none',
								color: 'white',
							}}
						>
							send
						</i>
					}
					// text={this.state.success ? this.props.translate.tooltip_sent : this.props.translate.send}
					onClick={disabled ? () => this.setState({ disabledModal: true }) : this.sendCouncilRoomMessage}
					loading={this.state.loading}
					success={this.state.success}
					reset={this.resetButtonStates}
					successSoloColor={true}
					color={getSecondary()}
					textStyle={{
						color: 'white',
						fontSize: '15px'
					}}
					buttonStyle={{
						width: '32px',
						height: '28px',
						borderRadius: '1em',
						padding: '0px',
						margin: '0px',
						minHeight: '0px',
						minWidth: '0px',
						marginLeft: '10px',
					}}
				/>
			</div>
		);
	};

	render() {
		const secondary = getSecondary();
		const { menuRender } = this.props;


		if (menuRender) {
			return (
				this.renderMenuMobil()
			);
		}
		return (
			<>
				<AlertConfirm
					open={this.state.disabledModal}
					requestClose={() => this.setState({ disabledModal: false })}
					buttonCancel={this.props.translate.close}
					bodyText={this.props.translate.wall_inactive}
				/>
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
			</>
		);

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
