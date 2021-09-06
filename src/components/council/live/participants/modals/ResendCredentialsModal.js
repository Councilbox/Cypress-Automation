import React from 'react';
import FontAwesome from 'react-fontawesome';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { MenuItem } from 'material-ui';
import gql from 'graphql-tag';
import { resendRoomEmails } from '../../../../../queries/liveParticipant';
import {
	CustomDialog,
	BasicButton,
	DropDownMenu
} from '../../../../../displayComponents';
import { getPrimary, getSecondary } from '../../../../../styles/colors';
import { moment } from '../../../../../containers/App';
import { isMobile } from '../../../../../utils/screen';

const ResendCredentialsModal = ({
	translate, participant, sendAccessKey, council, ...props
}) => {
	const [modal, setModal] = React.useState(false);
	const primary = getPrimary();
	const translation = translate.sure_send_video.replace(
		'{{name}}',
		`${participant.name} ${participant.surname || ''}`
	);

	const close = () => {
		setModal(false);
	};

	const resend = async onlyAccessLink => {
		const response = await props.resendRoomEmails({
			variables: {
				councilId: council.id,
				timezone: moment().utcOffset().toString(),
				participantsIds: [participant.id],
				onlyAccessLink
			}
		});
		if (!response.errors) {
			props.refetch();
			close();
		}
	};

	const sendKey = async type => {
		await sendAccessKey({
			variables: {
				councilId: council.id,
				participantIds: [participant.id],
				type,
				timezone: moment().utcOffset().toString()
			}
		});

		props.refetch();
	};

	const openModal = () => {
		setModal(true);
	};

	return (
		<React.Fragment>
			{props.security ?
				<DropDownMenu
					color="transparent"
					Component={() => <ResendButton
						translate={translate}
						active={participant.signed === 1}
					/>
					}
					textStyle={{ color: primary }}
					type="flat"
					items={
						<React.Fragment>
							<MenuItem onClick={() => resend(true)}>
								{translate.send_access_mail}
							</MenuItem>
							<MenuItem onClick={() => sendKey('SECURITY_EMAIL')}>
								{translate.key_by_email}
							</MenuItem>
							<MenuItem onClick={() => sendKey('SECURITY_SMS')}>
								{translate.key_by_sms}
							</MenuItem>
							<MenuItem onClick={() => resend(false)}>
								{translate.send_both}
							</MenuItem>
						</React.Fragment>
					}
				/>
				: <ResendButton
					action={openModal}
					translate={translate}
					active={participant.signed === 1}
				/>
			}
			<CustomDialog
				title={translate.attention}
				requestClose={close}
				open={modal}
				actions={
					<React.Fragment>
						<BasicButton
							text={translate.cancel}
							type="flat"
							textStyle={{
								textTransform: 'none',
								fontWeight: '700'
							}}
							onClick={close}
						/>
						<BasicButton
							text={translate.continue}
							textStyle={{
								color: 'white',
								textTransform: 'none',
								fontWeight: '700'
							}}
							buttonStyle={{ marginLeft: '1em' }}
							color={primary}
							onClick={() => {
								resend();
							}}
						/>
					</React.Fragment>
				}
			>
				<div style={{ width: '400px' }}>{translation}</div>
			</CustomDialog>
		</React.Fragment>
	);
};


const ResendButton = ({ active, action, translate }) => (
// <Tooltip title={translate.send_video_credentials}>
	<BasicButton
		buttonStyle={{
			border: `1px solid ${getSecondary()}`,
			marginRight: '0.5em',
			borderRadius: '4px',
			padding: '1em',
			width: isMobile && '150px',
		}}
		color={'white'}
		elevation={active ? 0 : 1}
		tabIndex="0"
		type="flat"
		onClick={action}
		text={
			<React.Fragment>
				<FontAwesome
					name={'share-square'}
					style={{
						cursor: 'pointer',
						fontSize: '1.2em',
						marginRight: '0.2em',
						color: getSecondary()
					}}
				/>
				<span style={{ color: getSecondary() }}>{isMobile ? translate.resend : translate.send_video_credentials}</span>
			</React.Fragment>
		}
	>
	</BasicButton>
// </Tooltip>
);

const sendParticipantRoomKey = gql`
	mutation SendParticipantRoomKey($participantIds: [Int]!, $councilId: Int!, $timezone: String!, $type: String){
		sendParticipantRoomKey(participantsIds: $participantIds, councilId: $councilId, timezone: $timezone, type: $type){
			success
		}
	}
`;

export default compose(
	graphql(resendRoomEmails, {
		name: 'resendRoomEmails',
		options: {
			errorPolicy: 'all'
		}
	}),
	graphql(sendParticipantRoomKey, {
		name: 'sendAccessKey'
	})
)(ResendCredentialsModal);
