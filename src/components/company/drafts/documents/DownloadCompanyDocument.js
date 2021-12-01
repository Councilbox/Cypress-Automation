import React from 'react';
import { SERVER_URL } from '../../../../config';
import { getSecondary } from '../../../../styles/colors';
import { LoadingSection } from '../../../../displayComponents';


const DownloadCompanyDocument = ({ file, trigger, color = getSecondary(), id }) => {
	const [downloading, setDownloading] = React.useState(false);

	const download = async () => {
		setDownloading(true);
		const token = sessionStorage.getItem('token');
		const apiToken = sessionStorage.getItem('apiToken');
		const participantToken = sessionStorage.getItem('participantToken');
		const response = await fetch(`${SERVER_URL}/companyDocument/${file.id}`, {
			headers: new Headers({
				'x-jwt-token': token || (apiToken || participantToken),
			})
		});

		if (response.status === 200) {
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = file.name;
			document.body.appendChild(a);
			a.click();
			a.remove();
		}
		setDownloading(false);
	};

	return (
		<>
			{trigger ?
				<>
					{trigger}
				</>
				: <>
					{downloading ?
						<div>
							<LoadingSection color={'secondary'} size={12} />
						</div>
						: <i
							className="fa fa-download"
							aria-hidden="true"
							id={`download-file-${id}`}
							onClick={download}
							style={{
								color,
								cursor: 'pointer',
								padding: '0px 10px'
							}}
						></i>
					}
				</>
			}
		</>
	);
};

export default DownloadCompanyDocument;
