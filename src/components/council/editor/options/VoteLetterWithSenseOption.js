import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Checkbox, SectionTitle } from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';


const VoteLetterWithSenseOption = ({ council, client, translate }) => {
	const [canEarlyVote, setCanEarlyVote] = React.useState(council.statute.canEarlyVote);
	const primary = getPrimary();

	const send = async value => {
		setCanEarlyVote(value);
		await client.mutate({
			mutation: gql`
                mutation UpdateCouncilStatute($councilId: Int!, $statute: CouncilOptions!){
                    updateCouncilStatute(councilId: $councilId, statute: $statute){
                        id
                        canEarlyVote
                    }
                }
            `,
			variables: {
				councilId: council.id,
				statute: {
					canEarlyVote: value
				}
			}
		});
	};

	return (
		<>
			<SectionTitle
				text={translate.voting_options}
				color={primary}
				style={{
					marginTop: '1.6em'
				}}
			/>
			<Checkbox
				label={translate.allows_indicate_direction_voting_letter}
				id="council-options-proxy-with-vote-sense"
				value={canEarlyVote}
				onChange={(event, isInputChecked) => {
					send(isInputChecked ? 1 : 0);
				}}
			/>
		</>

	);
};

export default withApollo(VoteLetterWithSenseOption);
