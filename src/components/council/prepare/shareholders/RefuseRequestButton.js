import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, AlertConfirm } from '../../../../displayComponents';


const RefuseRequestButton = ({
	request, client, refetch, translate
}) => {
	const [modal, setModal] = React.useState(null);
	const buttonColor = request.participantCreated ? 'grey' : 'red';

	const refuseRequest = async () => {
		await client.mutate({
			mutation: gql`
				mutation RefuseShareholderRequest($requestId: Int!){
					refuseShareholderRequest(requestId: $requestId){
						success
					}
				}
			`,
			variables: {
				requestId: request.id
			}
		});

		setModal(false);
		refetch();
	};

	return (
		<>
			<BasicButton
				disabled={request.participantCreated}
				text={translate.refuse}
				onClick={() => setModal(request)}
				buttonStyle={{
					border: `1px solid ${buttonColor}`,
					marginLeft: '0.3em'
				}}
				color="white"
				textStyle={{ color: buttonColor }}
			// onClick={approveRequest}
			/>
			<AlertConfirm
				open={modal}
				requestClose={() => setModal(false)}
				title={translate.warning}
				bodyText={`${translate.will_reject_the_request} ${request.data.name}`}
				buttonAccept={translate.accept}
				acceptAction={refuseRequest}
			/>
		</>
	);
};

export default withApollo(RefuseRequestButton);
