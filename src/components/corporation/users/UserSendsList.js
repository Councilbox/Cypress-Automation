import React from 'react';
import { Typography } from 'material-ui';
import gql from 'graphql-tag';
import { graphql, withApollo } from 'react-apollo';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { RefreshButton, BasicButton } from '../../../displayComponents';
import NotificationsTable from '../../notifications/NotificationsTable';
import { usePolling } from '../../../hooks';


const UserSendsList = ({
	translate, enRoot, client, ...props
}) => {
	const [sending, setSending] = React.useState(false);
	const secondary = getSecondary();
	const [sends, setSends] = React.useState(null);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query UserSends($userId: Int!){
					userSends(userId: $userId){
						id
						userId
						sendDate
						refreshDate
						reqCode
						sendType
						email
					}
				}
			`,
			variables: {
				userId: props.user.id
			}
		});
		setSends(response.data.userSends);
	}, [props.user.id]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	const refreshUserSends = async () => {
		const response = await props.refreshUserSends({
			variables: {
				userId: props.user.id
			}
		});

		if (!response.errors) {
			getData();
		}
	};

	usePolling(refreshUserSends, 60000);

	const resend = async () => {
		setSending(true);
		await client.mutate({
			mutation: gql`
				mutation SendEmailNoConfirmed($userId: Int!){
					sendEmailNoConfirmed(userId: $userId){
						success
					}
				}
			`,
			variables: {
				userId: props.user.id
			}
		});
		getData();
		setSending(false);
	};

	if (!sends) {
		return null;
	}

	return (
		<div style={{ marginBottom: '3em' }}>
			<div style={{
				width: '100%', display: 'flex', flexDirection: 'row', marginTop: '0.8em', alignItems: 'center'
			}}>
				<Typography variant="subheading" style={{ color: getPrimary(), marginRight: '0.6em' }}>
					{translate.sends}
				</Typography>
				{props.user.actived === 0
&& <BasicButton
	text={translate.resend}
	color={secondary}
	loading={sending}
	textStyle={{
		color: 'white'
	}}
	onClick={resend}
/>
				}
				<RefreshButton
					tooltip={`${translate.refresh_convened}`}
					onClick={refreshUserSends}
				/>
			</div>
			<div style={{ width: '100%', display: 'flex' }}>
				<NotificationsTable notifications={sends} translate={translate} visib={true} />
			</div>
		</div>
	);
};


const refreshUserSends = gql`
	mutation RefreshUserSends($userId: Int!){
		refreshUserSends(userId: $userId){
			id
			reqCode
		}
	}
`;

export default graphql(refreshUserSends, {
	name: 'refreshUserSends'
})(withApollo(UserSendsList));
