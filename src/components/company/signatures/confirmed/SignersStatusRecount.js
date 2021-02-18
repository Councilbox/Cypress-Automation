import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Grid, GridItem } from '../../../../displayComponents';
import { SIGNATURE_STATES } from '../../../../constants';

const SignersStatusRecount = ({ translate, signature, client }) => {
	const [count, setRecount] = React.useState(null);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query SignersRecount($signatureId: Int!){
					signatureParticipantsStatusRecount(signatureId: $signatureId){
						signed
						unsigned
					}
				}
			`,
			variables: {
				signatureId: signature.id
			}

		});

		setRecount(response.data.signatureParticipantsStatusRecount);
	}, [signature.id]);

	React.useEffect(() => {
		let interval;
		getData();

		if (signature.state !== SIGNATURE_STATES.COMPLETED) {
			interval = setInterval(getData, 8000);
		}
		return () => clearInterval(interval);
	}, [getData]);

	if (!count) {
		return <span />;
	}

	return (
		<Grid
			style={{
				width: '100%',
				minHeight: '3em',
				border: '1px solid gainsboro',
				padding: '0.4em',
				marginBottom: '0.6em',
				fontWeight: '700'
			}}
		>
			{signature.state === SIGNATURE_STATES.COMPLETED ?
				<div
					style={{
						width: '100%',
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					{translate.signature_of_documents_completed}
				</div>
				: <React.Fragment>
					<GridItem xs={4} md={4} lg={4}>
						{`${translate.required_signatures}: ${count.signed + count.unsigned}`}
					</GridItem>
					<GridItem xs={4} md={4} lg={4} style={{ display: 'flex', justifyContent: 'center' }}>
						{`${translate.signatures_done}: ${count.signed}`}
					</GridItem>
					<GridItem xs={4} md={4} lg={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
						{`${translate.unrealized_signatures}: ${count.unsigned}`}
					</GridItem>

				</React.Fragment>
			}

		</Grid>
	);
};

export default withApollo(SignersStatusRecount);
