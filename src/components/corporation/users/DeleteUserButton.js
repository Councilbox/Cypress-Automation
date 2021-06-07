import gql from 'graphql-tag';
import React from 'react';
import { withApollo } from 'react-apollo';
import { BasicButton, AlertConfirm } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';


const DeleteUserButton = ({ translate, user, client, refetch }) => {
	const [modal, setModal] = React.useState(false);
	const primary = getPrimary();

	const deleteUser = async () => {
		await client.mutate({
			mutation: gql`
				mutation DeleteUser($userId: ID!){
					deleteUser(userId: $userId) {
						success
						message
					}
				}
			`,
			variables: {
				userId: user.id
			}
		});

		refetch();
		setModal(false);
	};

	return (
		<>
			<AlertConfirm
				requestClose={() => setModal(false)}
				open={modal}
				acceptAction={deleteUser}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				title={translate.delete_user}
				bodyText={
					<>
						{translate.delete_user_warning
							.replace(/{{name}}/, user.name)
							.replace(/{{surname}}/, user.surname || '')
						}
					</>
				}
			/>
			<BasicButton
				onClick={() => setModal(true)}
				backgroundColor={{
					background: 'white',
					color: primary,
				}}
				text={translate.delete}>
			</BasicButton>
		</>
	);
};

export default withApollo(DeleteUserButton);
