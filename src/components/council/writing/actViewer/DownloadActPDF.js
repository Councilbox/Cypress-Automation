import React from 'react';
import { BasicButton } from '../../../../displayComponents';
import { downloadFile } from '../../../../utils/CBX';
import { downloadAct } from '../../../../queries';
import { withApollo } from 'react-apollo';
import FontAwesome from "react-fontawesome";
import { getSecondary } from '../../../../styles/colors';


class DownloadActPDF extends React.Component {

    state = {
        downloadingPDF: false
    }

    downloadPDF = async () => {
		this.setState({
			downloadingPDF: true
		})
		const response = await this.props.client.query({
			query: downloadAct,
			variables: {
				councilId: this.props.council.id
			}
        });
        
        const fraseConPuntos = 'este.nombre.casca'

		if (response) {
			if (response.data.downloadAct) {
				this.setState({
					downloadingPDF: false
				});
				downloadFile(
					response.data.downloadAct,
					"application/pdf",
					`${this.props.translate.act.replace(/ /g, '_')}-${
				    fraseConPuntos.replace(/ /g, '_').replace(/\./g, '_')
					}`
				);
			}
		}
	};

    render(){
        const secondary = getSecondary();
        const { translate } = this.props;
        
        return (
            <BasicButton
                text={translate.export_original_act}
                color={secondary}
                loading={this.state.downloadingPDF}
                buttonStyle={{ marginTop: "0.5em" }}
                textStyle={{
                    color: "white",
                    fontWeight: "700",
                    fontSize: "0.9em",
                    textTransform: "none"
                }}
                icon={
                    <FontAwesome
                        name={"file-pdf-o"}
                        style={{
                            fontSize: "1em",
                            color: "white",
                            marginLeft: "0.3em"
                        }}
                    />
                }
                textPosition="after"
                onClick={this.downloadPDF}
            />
        )
    }
}

export default withApollo(DownloadActPDF);