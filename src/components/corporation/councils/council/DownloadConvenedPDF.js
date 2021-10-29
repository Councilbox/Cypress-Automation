import React from 'react';
import { withApollo } from 'react-apollo';
import FontAwesome from 'react-fontawesome';
import { SERVER_URL } from '../../../../config';
import { BasicButton } from '../../../../displayComponents';


const DownloadConvenedPDF = ({ color, council, nonStylesButton, translate }) => {
	const [loading, setLoading] = React.useState(false);

	const downloadAttachment = async () => {
		setLoading(true);
		const token = sessionStorage.getItem('token');
		const apiToken = sessionStorage.getItem('apiToken');
		const participantToken = sessionStorage.getItem('participantToken');
		const response = await fetch(`${SERVER_URL}/councilCensus`, {
			method: 'POST',
			headers: new Headers({
				'x-jwt-token': token || (apiToken || participantToken),
				'Content-type': 'application/json'
			}),
			body: JSON.stringify({
				councilId: council.id,
			})
		});

		if (response.status === 200) {
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${translate.new_list_called} ${council.id}.xlsx`;
			document.body.appendChild(a);
			a.click();
			a.remove();
		}
		setLoading(false);
	};


	return (
		nonStylesButton ?
			<BasicButton
				text={'Excel'}
				color={'white'}
				type="flat"
				id="download-participants-pdf"
				buttonStyle={{
					width: '100%',
					display: 'flex',
					justifyContent: 'space-between'
				}}
				loading={loading}
				onClick={downloadAttachment}
			/>
			:
			<BasicButton
				text={'Descargar lista convocados'}
				color={color}
				loading={loading}
				buttonStyle={{ marginTop: '0.5em', marginBottom: '1.4em', marginRight: '0.6em' }}
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
				onClick={downloadAttachment}
			/>
	);
};


export default withApollo(DownloadConvenedPDF);
