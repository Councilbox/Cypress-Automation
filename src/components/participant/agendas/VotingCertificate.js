import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton } from '../../../displayComponents';
import { downloadFile } from '../../../utils/CBX';
import { getPrimary } from '../../../styles/colors';

const VotingCertificate = ({ translate, vote, client, Trigger }) => {
	const [loading, setLoading] = React.useState(false);

	const downloadDocument = async () => {
		setLoading(true);
		const response = await client.mutate({
			mutation: gql`
				mutation downloadVotePDF($id: Int!) {
					downloadVotePDF(id: $id)
				}
			`,
			variables: {
				id: vote.id
			}
		});

		if (response) {
			if (response.data.downloadVotePDF) {
				downloadFile(
					response.data.downloadVotePDF,
					'application/pdf',
					`${vote.id} - ${translate.vote}.pdf`
				);
				setLoading(false);
			}
		}
	};

	if (vote && vote.vote !== -1) {
		if (Trigger) {
			return (
				<div>
					<Trigger
						onClick={downloadDocument}
						loading={loading}
					/>
				</div>
			);
		}

		return (
			<BasicButton
				text={translate.download_vote_certificate.toUpperCase()}
				type="flat"
				color="white"
				textStyle={{
					color: getPrimary()
				}}
				loadingColor={getPrimary()}
				onClick={downloadDocument}
				loading={loading}
			/>
		);
	}

	return null;
};

export default withApollo(VotingCertificate);
