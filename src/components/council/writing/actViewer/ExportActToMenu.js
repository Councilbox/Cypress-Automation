import React from 'react';
import { MenuItem, Divider } from 'material-ui';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import FileSaver from 'file-saver';
import { DropDownMenu } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';
import { downloadFile } from '../../../../utils/CBX';
import { councilActEmail } from '../../../../queries';


const exportActPDF = gql`
    query exportActPDF($councilId: Int!){
        exportActPDF(councilId: $councilId)
    }
`;

const ExportActToMenu = ({ translate, council, client }) => {
    const [loading, setLoading] = React.useState(false);
    const secondary = getSecondary();

    const downloadPDF = async () => {
		setLoading(true);
		const response = await client.query({
			query: exportActPDF,
			variables: {
				councilId: council.id
			}
        });

		if (response) {
			if (response.data.exportActPDF) {
				downloadFile(
					response.data.exportActPDF,
					'application/pdf',
					`${translate.act.replace(/ /g, '_')}-${council.name.replace(/ /g, '_').replace(/\./g, '_')}`
                );
                setLoading(false);
			}
		}
    };

    const export2Doc = async () => {
        const response = await client.query({
			query: councilActEmail,
			variables: {
				councilId: +council.id
			}
        });
        const preHtml = "<!DOCTYPE html type=\"text/html\"><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta http-equiv='Content-Type' content='text/html;charset=UTF-8'><title>Export HTML To Doc</title></head><body style='font-family: Arial;'>";
        const postHtml = '</body></html>';
        const body = response.data.councilAct.emailAct.replace(/#BFBFBF/g, 'rgb(191, 191, 191)').replace(/<!--[\s\S]*?-->/g, '').replace(/style="page-break-before: always"/g, '').replace(/solid 1px rgb(217, 237, 247)/g, 'solid 2px rgb(217, 237, 247)')
.replace(/font-size: 11px/g, 'font-size: 12.5px');
        const html = preHtml + body + postHtml;
        const css = (`\
            <style>\
            body {font-family: Arial; font-size: 12pt;}\
            html {font-family: Arial; font-size: 12pt;}
            div {font-family: Arial; font-size: 12pt;}
            h3 {font-family: Arial; font-size: 12pt;}
            h4 {font-family: Arial; font-size: 12pt;}
            b {font-family: Arial; font-size: 12pt;}
            </style>\
        `);

        const filename = `${translate.act} - ${council.name}.doc`;
        const blob = new Blob(['\ufeff', css + html], {
            type: 'application/msword'
        });
        FileSaver.saveAs(blob, filename);
    };

    return (
        <DropDownMenu
            color="transparent"
            id={'user-menu-trigger'}
            loading={loading}
            loadingColor={secondary}
            text={translate.export_act_to}
            textStyle={{ color: secondary }}
            type="flat"
            buttonStyle={{ border: `1px solid ${secondary}` }}
            icon={
                <i className="fa fa-download" style={{
                        fontSize: '1em',
                        color: secondary,
                        marginLeft: '0.3em'
                    }}
                />
            }
            items={
                <React.Fragment>
                    <MenuItem onClick={downloadPDF}>
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            <i className="fa fa-file-pdf-o" style={{
                                    fontSize: '1em',
                                    color: secondary,
                                    marginLeft: '0.3em'
                                }}
                            />
                            <span style={{ marginLeft: '2.5em', marginRight: '0.8em' }}>
                                PDF
                            </span>
                        </div>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={export2Doc}>
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            <i className="fa fa-file-word-o" style={{
                                    fontSize: '1em',
                                    color: secondary,
                                    marginLeft: '0.3em'
                                }}
                            />
                            <span style={{ marginLeft: '2.5em', marginRight: '0.8em' }}>
                                Word
                            </span>
                        </div>
                    </MenuItem>
                </React.Fragment>
            }
        />
    );
};

export default withApollo(ExportActToMenu);
