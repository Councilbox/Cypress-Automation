import React from "react";
import { withApollo } from "react-apollo";
import { CircularProgress } from "material-ui";
import { getSecondary } from "../../styles/colors";
import FontAwesome from "react-fontawesome";
import { printPrettyFilesize } from "../../utils/CBX";

const API_URL =
	process.env.REACT_APP_MODE === "dev"
		? `http://${process.env.REACT_APP_LOCAL_API}`
		: `https://${process.env.REACT_APP_API_URL}`;

const AttachmentDownload = ({ agenda, translate, attachment, ...props }) => {
	const [downloading, setDownloading] = React.useState(false);
	const secondary = getSecondary();

	const downloadAttachment = async id => {
		setDownloading(true);
		const token = sessionStorage.getItem("token");
		const apiToken = sessionStorage.getItem('apiToken');
		const participantToken = sessionStorage.getItem("participantToken");
		const endpoint = agenda ? 'agendaAttachment' : 'councilAttachment'
		const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
			headers: new Headers({
				"x-jwt-token": token ? token : apiToken? apiToken : participantToken,
			})
		});

		if(response.status === 200){
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = attachment.filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
		}
		setDownloading(false);
	}

	return (
		<div
			style={{
				cursor: "pointer",
				padding: "0.2em 0.5em",
				border: `1px solid ${secondary}`,
				borderRadius: "3px",
				marginTop: '5px',
				color: secondary
			}}
			onClick={() => downloadAttachment(attachment.id)}
			className="truncate"
		>
			{downloading ? (
				<CircularProgress
					size={14}
					color={"secondary"}
					style={{ marginRight: "0.8em" }}
				/>
			) : (
				<FontAwesome
					name={"download"}
					style={{
						fontSize: "0.9em",
						marginRight: '0.3em',
						color: secondary
					}}
				/>
			)}
			<div style={{ float: 'left', maxWidth: '100%' }} className="truncate">
				{attachment.filename}
			</div>
			<div style={{ float: 'left' }}>
				{`(${printPrettyFilesize(attachment.filesize)})`}
			</div>
		</div>
	);
}

export default withApollo(AttachmentDownload);
