import React from 'react';
import { SERVER_URL } from '../../../../config';
import { getSecondary } from '../../../../styles/colors';
import { LoadingSection } from '../../../../displayComponents';



const DownloadCompanyDocument = ({ file, companyId, translate, trigger, color = getSecondary() }) => {
    const [downloading, setDownloading] = React.useState(false);

    const download = async () => {
        setDownloading(true);
		const token = sessionStorage.getItem("token");
		const apiToken = sessionStorage.getItem('apiToken');
		const participantToken = sessionStorage.getItem("participantToken");
		const response = await fetch(`${SERVER_URL}/companyDocument/${file.id}`, {
			headers: new Headers({
				"x-jwt-token": token ? token : apiToken? apiToken : participantToken,
			})
		});

		if(response.status === 200){
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            a.remove();
		}
		setDownloading(false);
    }

    return (
        <>
            {trigger?
                <>
                    {trigger}
                </>
            :
                <>
                    {downloading?
                        <div>
                            <LoadingSection color={'secondary'} size={12} />
                        </div>
                        :
                        <i className="fa fa-download" aria-hidden="true" onClick={download} style={{
                            color,
                            cursor: 'pointer'
                        }}></i>
                    }
                </>
            }
        </>
    )
}

export default DownloadCompanyDocument;