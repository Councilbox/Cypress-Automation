import React from 'react';
import { withApollo } from 'react-apollo';
import FontAwesome from 'react-fontawesome';
import { downloadAttendPDF } from '../../../../queries';
import { BasicButton } from '../../../../displayComponents';
import { moment } from '../../../../containers/App';
import { downloadFile } from '../../../../utils/CBX';
import { SERVER_URL } from '../../../../config';

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
				downloadFile(
					response.data.downloadAttendPDF,
					'application/pdf',
					filename
				);
			}
		}
		setLoading(false);
	};

	const downloadAttedantsExcel = async (council, filename) => {
		setLoading(true);

		const token = sessionStorage.getItem('token');
		const apiToken = sessionStorage.getItem('apiToken');
		const participantToken = sessionStorage.getItem('participantToken');
		const response = await fetch(`${SERVER_URL}/council/${council.id}/attendantsExcel`, {
			method: 'GET',
			headers: new Headers({
				'x-jwt-token': token || (apiToken || participantToken),
				'Content-type': 'application/json'
			})
		});

		if (response.status === 200) {
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${filename}.xlsx`;
			document.body.appendChild(a);
			a.click();
			a.remove();
		}
		setLoading(false);
	};

	return { loading, downloadPDF, downloadAttedantsExcel };
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
