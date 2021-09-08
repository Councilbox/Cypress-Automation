import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, AlertConfirm } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';

const RemoveDelegationButton = ({
	participant, delegatedVote, translate, client, refetch
}) => {
	const [modal, setModal] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const secondary = getSecondary();

	const removeDelegatedVote = async id => {
		setLoading(true);
		const response = await client.mutate({
			mutation: gql`
				mutation RemoveDelegation($participantId: Int!){
					removeDelegation(participantId: $participantId){
						success
						message
					}
				}
			`,
			variables: {
				participantId: id
			}
		});

		if (response) {
			setLoading(false);
			setModal(false);
			refetch();
		}
	};

	const renderModalBody = () => translate.remove_delegation_warning.replace('delegatedName', delegatedVote.name)
		.replace('delegatedSurname', delegatedVote.surname || '')
		.replace('name', participant.name)
		.replace('surname', participant.surname || '');

	return (
		<React.Fragment>
			<AlertConfirm
				open={modal}
				acceptAction={() => removeDelegatedVote(delegatedVote.id)}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				loadingAction={loading}
				requestClose={() => setModal(false)}
				title={translate.warning}
				bodyText={renderModalBody()}
			/>
			<BasicButton
				text={translate.remove_delegation}
				onClick={() => setModal(true)}
				type="flat"
				color="white"
				textStyle={{ color: secondary }}
				buttonStyle={{ border: `1px solid ${secondary}` }}
			/>

		</React.Fragment>
	);
};

export default withApollo(RemoveDelegationButton);
