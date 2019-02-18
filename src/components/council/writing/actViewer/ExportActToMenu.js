import React from 'react';
import { DropDownMenu, Icon } from '../../../../displayComponents';
import { MenuItem, Divider } from 'material-ui';
import { getSecondary } from '../../../../styles/colors';
import { downloadFile } from '../../../../utils/CBX';
import { downloadAct } from '../../../../queries';
import { withApollo } from 'react-apollo';
import { councilActEmail } from '../../../../queries';
import gql from 'graphql-tag';


const exportActPDF = gql`
    query exportActPDF($councilId: Int!){
        exportActPDF(councilId: $councilId)
    }
`;


class ExportActToMenu extends React.Component {

    state = {
        loading: false
    }

    downloadPDF = async () => {
		this.setState({
			loading: true
		})
		const response = await this.props.client.query({
			query: exportActPDF,
			variables: {
				councilId: this.props.council.id
			}
        });

		if (response) {
			if (response.data.exportActPDF) {
				this.setState({
					loading: false
				});
				downloadFile(
					response.data.exportActPDF,
					"application/pdf",
					`${this.props.translate.act.replace(/ /g, '_')}-${
				    this.props.council.name.replace(/ /g, '_').replace(/\./g, '_')
					}`
				);
			}
		}
    };

    export2Doc = async (element, filename = `${this.props.translate.act} - ${this.props.council.name}`) => {
        const response = await this.props.client.query({
			query: councilActEmail,
			variables: {
				councilId: this.props.council.id
			}
        });
        const preHtml = "<!DOCTYPE html type=\"text/html\"><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta http-equiv='Content-Type' content='text/html;charset=UTF-8'><title>Export HTML To Doc</title></head><body style='font-family: Arial;'>";
        const postHtml = "</body></html>";
        const body = response.data.councilAct.emailAct.replace(/<!--[\s\S]*?-->/g, '').replace(/style="page-break-before: always"/g, '').replace(/solid 1px rgb(217, 237, 247)/g, 'solid 2px rgb(217, 237, 247)').replace(/font-size: 11px/g, 'font-size: 12.5px');
        const html = preHtml+body+postHtml;
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

       const value = css + html;
        const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURI(value);
        filename = filename?filename+'.doc':'document.doc';
        const downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        if(navigator.msSaveOrOpenBlob ){
            const blob = new Blob(['\ufeff', css+html], {
                type: 'application/msword'
            });
            navigator.msSaveOrOpenBlob(blob, filename);
        }else{
            downloadLink.href = url;
            downloadLink.download = filename;
            downloadLink.click();
        }
        document.body.removeChild(downloadLink);
    }


    render(){
        const secondary = getSecondary();
        return (
            <DropDownMenu
                color="transparent"
                id={'user-menu-trigger'}
                loading={this.state.loading}
                text={this.props.translate.export_act_to}
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
                        <MenuItem onClick={this.downloadPDF}>
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
                                    PDF
                                </span>
                            </div>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={this.export2Doc}>
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
                                        color: secondary,
                                        marginLeft: "0.3em"
                                    }}
                                />
                                <span style={{marginLeft: '2.5em', marginRight: '0.8em'}}>
                                    Word
                                </span>
                            </div>
                        </MenuItem>
                    </React.Fragment>
                }
            />
        )
    }
}

export default withApollo(ExportActToMenu);