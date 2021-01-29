import React from 'react';
import { withApollo } from 'react-apollo';
import { MenuItem, Divider } from 'material-ui';
import FontAwesome from "react-fontawesome";
import { BasicButton, DropDownMenu } from '../../../../displayComponents';
import { downloadFile } from '../../../../utils/CBX';
import { downloadAct } from '../../../../queries';
import { getSecondary } from '../../../../styles/colors';


const DownloadActPDF = ({ client, council, translate }) => {
    const [downloading, setDownloading] = React.useState(false);
    const secondary = getSecondary();

    const downloadPDF = async () => {
        setDownloading(true);
		const response = await client.query({
			query: downloadAct,
			variables: {
                councilId: council.id,
                clean: false
			}
        });

		if (response) {
			if (response.data.downloadAct) {
				setDownloading(false);
				downloadFile(
					response.data.downloadAct,
					"application/pdf",
					`${translate.act.replace(/ /g, '_')}-${council.name.replace(/ /g, '_').replace(/\./g, '_')
					}`
				);
			}
		}
    };

    return (
        <BasicButton
            text={translate.export_original_act}
            color={'white'}
            loading={downloading}
            type="flat"
            loadingColor={secondary}
            buttonStyle={{ marginTop: "0.5em", border: `1px solid ${secondary}` }}
            textStyle={{
                color: secondary,
                fontWeight: "700",
                fontSize: "0.9em",
                textTransform: "none"
            }}
            icon={
                <FontAwesome
                    name={"file-pdf-o"}
                    style={{
                        fontSize: "1em",
                        color: secondary,
                        marginLeft: "0.3em"
                    }}
                />
            }
            textPosition="after"
            onClick={downloadPDF}
        />
    )
}

/*
<BasicButton
    text={translate.export_original_act}
    color={secondary}
    loading={downloading}
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
    onClick={downloadPDF}
/>

*/

export default withApollo(DownloadActPDF);
