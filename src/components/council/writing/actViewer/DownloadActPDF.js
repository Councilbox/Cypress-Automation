import React from 'react';
import { BasicButton, DropDownMenu } from '../../../../displayComponents';
import { downloadFile } from '../../../../utils/CBX';
import { downloadAct } from '../../../../queries';
import { withApollo } from 'react-apollo';
import { MenuItem, Divider } from 'material-ui';
import FontAwesome from "react-fontawesome";
import { getSecondary } from '../../../../styles/colors';


const DownloadActPDF = ({ client, council, translate }) => {
    const [downloading, setDownloading] = React.useState(false);
    const secondary = getSecondary();

    const downloadPDF = async clean => {
        setDownloading(true);
		const response = await client.query({
			query: downloadAct,
			variables: {
                councilId: council.id,
                clean
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
        <DropDownMenu
            color="transparent"
            id={'user-menu-trigger'}
            loading={downloading}
            loadingColor={secondary}
            text={translate.export_act_to}
            textStyle={{ color: secondary }}
            type="flat"
            buttonStyle={{border: `1px solid ${secondary}`}}
            icon={
                <i className="fa fa-download" style={{
                        fontSize: "1em",
                        color: secondary,
                        marginLeft: "0.3em"
                    }}
                />
            }
            items={
                <React.Fragment>
                    <MenuItem onClick={() => downloadPDF(false)}>
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            <i className="fa fa-file-pdf-o" style={{
                                    fontSize: "1em",
                                    color: secondary,
                                    marginLeft: "0.3em"
                                }}
                            />
                            <span style={{marginLeft: '2.5em', marginRight: '0.8em'}}>
                                Acta Councilbox
                            </span>
                        </div>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => downloadPDF(true)}>
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            <i className="fa fa-file-pdf-o" style={{
                                    fontSize: "1em",
                                    color: secondary,
                                    marginLeft: "0.3em"
                                }}
                            />
                            <span style={{marginLeft: '2.5em', marginRight: '0.8em'}}>
                                Acta en limpio
                            </span>
                        </div>
                    </MenuItem>
                </React.Fragment>
            }
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