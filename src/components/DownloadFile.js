import React from 'react';
import FileSaver from 'file-saver';
import { SERVER_URL } from '../config';


const DownloadFile = ({ match }) => {
	React.useEffect(() => {
		const downloadFile = async () => {
			const response = await fetch(`${SERVER_URL}/api/getAttachment/${match.params.token}`);
			const blob = await response.blob();
			FileSaver.saveAs(blob, response.headers.get('filename'));
			setTimeout(() => {
				window.close();
			}, 1000);
		};

		downloadFile();
	}, [match.params.token]);

	return null;
};

export default DownloadFile;
