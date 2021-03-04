import React from 'react';
import { graphql } from 'react-apollo';
import { Tooltip } from 'material-ui';
import FontAwesome from 'react-fontawesome';
import { downloadFile } from '../../../utils/CBX';
import { LoadingSection } from '../../../displayComponents/index';
import { downloadCBXData as downloadCBXDataQuery } from '../../../queries';
import { getSecondary } from '../../../styles/colors';

const DownloadCBXDataButton = props => {
	const [loading, setLoading] = React.useState(false);

	const downloadCBXData = async id => {
		setLoading(true);
		if (props.updateState) {
			props.updateState({ loading: true });
		}
		const response = await props.downloadCBXData({
			variables: {
				participantId: id
			}
		});

		if (response) {
			if (response.data.cbxData) {
				downloadFile(
					response.data.cbxData,
					'application/pdf',
					`CbxData_${id}`
				);
				setLoading(false);
				if (props.updateState) {
					props.updateState({ loading: false });
				}
			}
		}
	};

	const secondary = getSecondary();

	return (
		<Tooltip title={props.translate.download_cbxdata}>
			<div
				onClick={event => {
					event.stopPropagation();
					downloadCBXData(props.participantId);
				}}
				style={{
					height: '1.8em',
					width: '3em',
					marginLeft: '1.5em',
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

export default graphql(downloadCBXDataQuery, { name: 'downloadCBXData' })(
	DownloadCBXDataButton
);
