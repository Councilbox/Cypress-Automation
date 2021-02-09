import React from 'react';
import { Typography } from 'material-ui';
import { graphql } from 'react-apollo';
import {
	AlertConfirm,
	Icon,
	Radio
} from '../../../../displayComponents/index';
import { sendReminder } from '../../../../queries/council';


class ReminderModal extends React.Component {
	state = {
		success: '',
		error: '',
		sending: false,
		sendAgenda: false,
		group: 'all'
	};

	close = () => {
		this.props.requestClose();
		this.setState({
			success: false,
			sending: false,
			error: false,
			sendAgenda: false
		});
	};

	sendReminder = async () => {
		this.setState({
			sending: true
		});
		const response = await this.props.sendReminder({
			variables: {
				councilId: this.props.council.id,
				group: this.state.group
			}
		});
		if (response.data.sendReminder.success) {
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

	renderReminderBody() {
		const { translate } = this.props;

		if (this.state.sending) {
			return <div>{translate.sending_convene_reminder}</div>;
		}

		if (this.state.success) {
			return <SuccessMessage message={translate.sent} />;
		}

		return (
			<div>
				<Radio
					value={'all'}
					checked={this.state.group === 'all'}
					onChange={() => this.setState({
							group: 'all'
						})
					}
					name="group"
					label={translate.all_plural}
				/>
				<Radio
					value={'unopened'}
					checked={this.state.group === 'unopened'}
					onChange={() => this.setState({
							group: 'unopened'
						})
					}
					name="group"
					label={translate.people_not_read_mail}
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
				loadingAction={this.state.sending}
				acceptAction={
					this.state.success ? () => this.close() : this.sendReminder
				}
				buttonAccept={
					this.state.success ? translate.accept : translate.send
				}
				buttonCancel={translate.close}
				bodyText={this.renderReminderBody()}
				title={translate.send_convene_reminder}
			/>
		);
	}
}

export default graphql(sendReminder, {
	name: 'sendReminder'
})(ReminderModal);

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
