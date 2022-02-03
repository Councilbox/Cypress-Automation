import React from 'react';
import { Typography } from 'material-ui';
import { graphql } from 'react-apollo';
import { AlertConfirm, Icon, TextInput } from '../../../../displayComponents';
import { sendVideoEmailTest } from '../../../../queries';
import { checkValidEmail } from '../../../../utils/validation';
import { moment } from '../../../../containers/App';

class SendCredentialsTestModal extends React.Component {
	state = {
		success: '',
		emailError: '',
		email: ''
	};

	close = () => {
		this.props.requestClose();
		this.setState({
			success: false,
			sending: false,
			emailError: '',
			error: false,
			sendAgenda: false
		});
	};

	sendVideoEmailTest = async () => {
		this.setState({
			sending: true
		});
		const response = await this.props.sendVideoEmailTest({
			variables: {
				councilId: this.props.council.id,
				email: this.state.email,
				phone: '',
				timezone: moment().utcOffset().toString()

			}
		});

		if (response.data.sendRoomEmailTest.success) {
			this.setState({
				sending: false,
				success: true
			});
		} else {
			this.setState({
				sending: false,
				error: true
			});
		}
	};

	onKeyUp = event => {
		if (!checkValidEmail(this.state.email)) {
			this.setState({
				emailError: this.props.translate.email_not_valid
			});
		} else {
			this.setState({
				emailError: ''
			});
		}
		if (event.nativeEvent.keyCode === 13) {
			this.sendVideoEmailTest();
		}
	};

	renderBody() {
		const { translate } = this.props;

		if (this.state.success) {
			return <SuccessMessage message={translate.sent} />;
		}

		return (
			<div style={{ width: '500px' }}>
				<TextInput
					required
					floatingText={translate.email}
					onKeyUp={this.onKeyUp}
					type="text"
					errorText={this.state.emailError}
					value={this.state.email}
					onChange={event => this.setState({
						email: event.nativeEvent.target.value
					})
					}
				/>
			</div>
		);
	}

	render() {
		const { translate } = this.props;

		return (
			<AlertConfirm
				requestClose={this.close}
				open={this.props.show}
				acceptAction={
					this.state.success ?
						() => this.close()
						: this.sendVideoEmailTest
				}
				buttonAccept={
					this.state.success ? translate.accept : translate.send
				}
				buttonCancel={translate.close}
				bodyText={this.renderBody()}
				title={translate.send_video_test}
			/>
		);
	}
}

export default graphql(sendVideoEmailTest, {
	name: 'sendVideoEmailTest'
})(SendCredentialsTestModal);

const SuccessMessage = ({ message }) => (
	<div
		style={{
			width: '500px',
			display: 'flex',
			alignItems: 'center',
			alignContent: 'center',
			flexDirection: 'column'
		}}
	>
		<Icon
			className="material-icons"
			style={{
				fontSize: '6em',
				color: 'green'
			}}
		>
			check_circle
		</Icon>
		<Typography variant="subheading">{message}</Typography>
	</div>
);
