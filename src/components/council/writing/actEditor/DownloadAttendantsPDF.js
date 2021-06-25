import React from 'react';
import { withApollo } from 'react-apollo';
import FontAwesome from 'react-fontawesome';
import { downloadAttendPDF } from '../../../../queries';
import { BasicButton } from '../../../../displayComponents';
import { moment } from '../../../../containers/App';
import { downloadFile } from '../../../../utils/CBX';

export const useDownloadCouncilAttendants = client => {
	const [loading, setLoading] = React.useState(false);

	const downloadPDF = async (council, filename) => {
		setLoading(true);
		const response = await client.query({
			query: downloadAttendPDF,
			variables: {
				councilId: council.id,
				timezone: moment(council.startDate).utcOffset().toString(),
			}
		});

		if (response) {
			if (response.data.downloadAttendPDF) {
				setLoading(false);
				downloadFile(
					response.data.downloadAttendPDF,
					'application/pdf',
					filename
				);
			}
		}
	};

	return { loading, downloadPDF };
};

const DownloadAttendantsPDF = ({
	translate, color, council, client
}) => {
	const { loading, downloadPDF } = useDownloadCouncilAttendants(client);

	return (
		<BasicButton
			text={translate.export_participants}
			color={color}
			loading={loading}
			buttonStyle={{ marginTop: '0.5em', marginBottom: '1.4em' }}
			textStyle={{
				color: 'white',
				fontWeight: '700',
				fontSize: '0.9em',
				textTransform: 'none'
			}}
			icon={
				<FontAwesome
					name={'file-pdf-o'}
					style={{
						fontSize: '1em',
						color: 'white',
						marginLeft: '0.3em'
					}}
				/>
			}
			textPosition="after"
			onClick={() => downloadPDF(council, `${translate.assistants_list.replace(/ /g, '_')}-${council.name.replace(/ /g, '_').replace(/\./g, '')}`)}
		/>
	);
};


export default withApollo(DownloadAttendantsPDF);
