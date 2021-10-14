import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';


const ApproveRequestButton = ({
	request, client, refetch, translate
}) => {
	const secondary = getSecondary();
	const approveRequest = async () => {
		await client.mutate({
			mutation: gql`
				mutation ArchiveShareholderRequest($requestId: Int!, $shareholder: ParticipantInput){
					archiveShareholderRequest(requestId: $requestId, shareholder: $shareholder){
						success
					}
				}
			`,
			variables: {
				requestId: request.id,
				shareholder: null
			}
		});
		refetch();
	};

	return (
		<>
			<BasicButton
				text={translate.archived_request}
				onClick={approveRequest}
				buttonStyle={{
					border: `1px solid ${secondary}`,
					marginLeft: '0.4em'
				}}
				color="white"
				textStyle={{ color: secondary }}
			/>
		</>
	);
};

export default withApollo(ApproveRequestButton);
