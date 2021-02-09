import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { MenuItem, Divider } from 'material-ui';
import FileSaver from 'file-saver';
import { DropDownMenu } from '../../displayComponents';
import { downloadFile, prepareTextForFilename } from '../../utils/CBX';
import { buildDocVariable } from './utils';

const DownloadDoc = ({ client, doc, council, options, translate, filename }) => {
    const [loading, setLoading] = React.useState(false);

    const getLanguageView = () => {
        const texts = {
            es: {
                'view': 'Vista previa sin validez legal',
                'preview': 'Vista previa del documento',
            },
            en: {
                'view': 'Preview without legal validity',
                'preview': 'Document preview',
            },
            cat: {
                'view': 'Vista prèvia sense validesa legal',
                'preview': 'Vista prèvia de el document',
            },
            gal: {
                'view': 'Vista previa sen validez legal',
                'preview': 'Vista previa do documento',
            },
            pt: {
                'view': 'Visualização sem validade legal',
                'preview': 'Antevisão do Documento',
            }
        }
        return texts[options.language];
    }

    const downloadPDF = async () => {
        const response = await client.mutate({
            mutation: gql`
                mutation ACTHTML($doc: Document, $councilId: Int!){
                    generateDocPDF(document: $doc, councilId: $councilId)
                }
            `,
            variables: {
                doc: buildDocVariable([{
                    type: 'text',
                    text: `<h3 style="padding: 10px; border: 1px solid black;">${getLanguageView().view}</h3>`,
                    secondaryText: `<h3 style="padding: 10px; border: 1px solid black;">${getLanguageView().preview}</h3>`,
                }, ...doc], options),
                councilId: council.id
            }
        });

        if (response) {
            if (response.data.generateDocPDF) {
                downloadFile(
                    response.data.generateDocPDF,
                    "application/pdf",
                    filename || `${translate.act.replace(/ /g, '_')}_${prepareTextForFilename(council.name)}`
                );
            }
        }
    }

    const export2Doc = async () => {
        const response = await client.mutate({
            mutation: gql`
                mutation ACTHTML($doc: Document, $councilId: Int!){
                    generateDocumentHTML(document: $doc, councilId: $councilId)
                }
            `,
            variables: {
                doc: buildDocVariable(doc, options),
                councilId: council.id
            }
        });
        const preHtml = "<!DOCTYPE html type=\"text/html\"><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta http-equiv='Content-Type' content='text/html;charset=UTF-8'><title>Export HTML To Doc</title></head><body style='font-family: Arial;'>";
        const postHtml = "</body></html>";

        const body = response.data.generateDocumentHTML
            .replace(/#BFBFBF/g, 'rgb(191, 191, 191)').replace(/<!--[\s\S]*?-->/g, '')
            .replace(/style="page-break-before: always"/g, '')
            .replace(/solid 1px rgb(217, 237, 247)/g, 'solid 2px rgb(217, 237, 247)')
            .replace(/<\/br>/g, '<br>')
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

        const docFilename = `${translate.act} - ${council.name}.doc`;
        const blob = new Blob(['\ufeff', css + html], {
            type: 'application/msword'
        });
        FileSaver.saveAs(blob, docFilename);
    }

    return (
        <DropDownMenu
            color="transparent"
            id={'user-menu-trigger'}
            loading={loading}
            loadingColor={'black'}
            text={translate.export_doc}
            textStyle={{ color: '#464646' }}
            buttonStyle={{ border: `1px solid ${'#969696'}`, marginRight: '1em' }}
            icon={
                <i className="fa fa-download" style={{
                    fontSize: "1em",
                    color: 'black',
                    marginLeft: "0.3em"
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
                                fontSize: "1em",
                                color: 'black',
                                marginLeft: "0.3em"
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
                                fontSize: "1em",
                                color: 'black',
                                marginLeft: "0.3em"
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
    )
}

export default withApollo(DownloadDoc);
