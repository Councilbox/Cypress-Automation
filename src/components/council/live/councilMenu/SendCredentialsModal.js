import React from 'react';
import { Typography } from 'material-ui';
import { graphql } from 'react-apollo';
import { AlertConfirm, Icon, Radio } from '../../../../displayComponents';
import { sendVideoEmails } from '../../../../queries';
import { moment } from '../../../../containers/App';
import { useOldState } from '../../../../hooks';
import FailedSMSMessage from './FailedSMSMessage';
import LiveSMS from './LiveSMS';


const SendCredentialsModal = ({ translate, council, requestClose, ...props }) => {
	const [state, setState] = useOldState({
		success: '',
		error: '',
		sendAgenda: false,
		sendType: 'all',
		showSMS: false
	});

	const close = () => {
		requestClose();
		setState({
			success: false,
			error: null,
			showSMS: false,
			sending: false,
			sendAgenda: false
		});
	};

	const sendAll = () => {
		setState({
			sendType: 'all'
		});
	};

	const sendNoEnter = () => {
		setState({
			sendType: 'noEnter'
		});
	};

	const sendVideoEmails = async () => {
		setState({
			sending: true
		});
		const response = await props.sendVideoEmails({
			variables: {
				councilId: council.id,
				timezone: moment().utcOffset().toString(),
				type: state.sendType
			}
		});
		if (response.data.sendRoomEmails.success) {
			setState({
				error: response.data.sendRoomEmails.message,
				sending: false,
				success: true
			});
		} else {
			setState({
				sending: false,
				error: true
			});
		}
	};

	function _renderBody() {
		if (state.sending) {
			return <div>{translate.sending}</div>;
		}

		if(state.showSMS){
			return (
				<LiveSMS
					translate={translate}
					council={council}
				/>
			);
		}

		if(state.error === 'Failed SMS'){
			return <FailedSMSMessage translate={translate} onClick={() => setState({ showSMS: true })} />;
		}

		if (state.success) {
			return (
				<div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<SuccessMessage message={translate.sent} />
				</div>
			);
		}
		return (
			<div>
				{translate.send_to}
				<br/>
				<Radio
					value={'all'}
					checked={state.sendType === 'all'}
					onChange={sendAll}
					name="sendType"
					label={translate.all_plural}
				/><br/>
				<Radio
					value={'noEnter'}
					checked={state.sendType === 'noEnter'}
					onChange={sendNoEnter}
					name="sendType"
					label={translate.didnt_enter}
				/>
			</div>
		);
	}

	return (
		<AlertConfirm
			requestClose={close}
			open={props.show}
			loadingAction={state.sending}
			acceptAction={state.success ? () => close() : sendVideoEmails}
			buttonAccept={state.success ? translate.accept : translate.send}
			hideAccept={state.error || state.showSMS}
			buttonCancel={translate.close}
			bodyText={_renderBody()}
			title={translate.send_video_credentials}
		/>
	);
};


export default graphql(sendVideoEmails, {
	name: 'sendVideoEmails'
})(SendCredentialsModal);

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
