import React from 'react';
import { withApollo } from 'react-apollo';
import { Tooltip } from 'material-ui';
import FontAwesome from 'react-fontawesome';
import gql from 'graphql-tag';
import { downloadFile } from '../../../utils/CBX';
import { LoadingSection } from '../../../displayComponents/index';
import { getSecondary } from '../../../styles/colors';
import { moment } from '../../../containers/App';

const DownloadCBXDataButton = props => {
	const [loading, setLoading] = React.useState(false);

	const downloadCBXData = async id => {
		setLoading(true);
		if (props.updateState) {
			props.updateState({ loading: true });
		}
		const response = await props.client.query({
			query: gql`
				query voteLetterPDF($participantId: Int!){
					voteLetterPDF(participantId: $participantId)
				}
			`,
			variables: {
				participantId: id,
				timezone: moment().utcOffset().toString()
			}
		});

		if (response) {
			if (response.data.voteLetterPDF) {
				downloadFile(
					response.data.voteLetterPDF,
					'application/pdf',
					`${props.translate.vote_letter}_${props.participant.name}${props.participant.surname ? `_${props.participant.surname || ''}` : ''}.pdf`.replace(' ', '_') // TRADUCCION
				);
				setLoading(false);
				if (props.updateState) {
					props.updateState({ loading: false });
				}
			}
		}
	};

	const secondary = getSecondary();

	if (props.trigger) {
		return (
			loading ? (
				<LoadingSection size={14} color={'secondary'} />
			) : (
				<div
					onClick={event => {
						event.stopPropagation();
						downloadCBXData(props.participantId);
					}}>
					{props.trigger}
				</div>
			));
	}

	return (
		<Tooltip title={props.translate.download_vote_letter}>
			<div
				onClick={event => {
					event.stopPropagation();
					downloadCBXData(props.participantId);
				}}
				style={{
					height: '1.8em',
					width: '3em',
					marginLeft: '1em',
					backgroundColor: 'white',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					border: `1px solid ${secondary}`,
					borderRadius: '3px',
					...props.style
				}}
			>
				{loading ? (
					<LoadingSection size={14} color={'secondary'} />
				) : (
					<FontAwesome
						name={'download'}
						style={{
							cursor: 'pointer',
							fontSize: '1.1em',
							color: secondary
						}}
					/>
				)}
			</div>
		</Tooltip>
	);
};

export default withApollo(DownloadCBXDataButton);
