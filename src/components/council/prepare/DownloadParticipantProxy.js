import React from "react";
import { withApollo } from "react-apollo";
import { downloadFile } from "../../../utils/CBX";
import { LoadingSection } from "../../../displayComponents/index";
import { Tooltip } from "material-ui";
import FontAwesome from "react-fontawesome";
import { getSecondary } from "../../../styles/colors";
import { moment } from "../../../containers/App";
import gql from "graphql-tag";

const DownloadCBXDataButton = props => {
	const [loading, setLoading] = React.useState(false);

	const downloadCBXData = async id => {
		setLoading(true);
		if(props.updateState){
			props.updateState({loading: true});
		}
		const response = await props.client.query({
            query: gql`
                query proxyPDF($participantId: Int!){
                    proxyPDF(participantId: $participantId)
                }
            `,
			variables: {
				participantId: id,
				timezone: moment().utcOffset().toString()
			}
		});

		if (response) {
			if (response.data.proxyPDF) {
				downloadFile(
					response.data.proxyPDF,
					"application/pdf",
					`Proxy_${props.participant.name}${props.participant.surname? `_${props.participant.surname || ''}` : ''}.pdf`.replace(' ', '_')
				);
				setLoading(false);
				if(props.updateState){
					props.updateState({loading: false});
				}
			}
		}
	}

	const secondary = getSecondary();
	return (
		<Tooltip title={props.translate.download_proxy}>
			<div
				onClick={event => {
					event.stopPropagation();
					downloadCBXData(props.participantId);
				}}
				style={{
					height: "1.8em",
					width: "3em",
					marginLeft: "1em",
					backgroundColor: 'white',
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					border: `1px solid ${secondary}`,
					borderRadius: "3px",
					...props.style
				}}
			>
				{loading ? (
					<LoadingSection size={14} color={"secondary"} />
				) : (
					<FontAwesome
						name={"download"}
						style={{
							cursor: "pointer",
							fontSize: "1.1em",
							color: secondary
						}}
					/>
				)}
			</div>
		</Tooltip>
	)
}

export default withApollo(DownloadCBXDataButton)
