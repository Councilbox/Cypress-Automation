import React from 'react';
import { DropDownMenu, Icon } from '../../../../displayComponents';
import { MenuItem, Divider } from 'material-ui';
import { getSecondary } from '../../../../styles/colors';
import { downloadFile } from '../../../../utils/CBX';
import { downloadAct } from '../../../../queries';
import { withApollo } from 'react-apollo';


class ExportActToMenu extends React.Component {

    state = {
        loading: false
    }

    downloadPDF = async () => {
		this.setState({
			loading: true
		})
		const response = await this.props.client.query({
			query: downloadAct,
			variables: {
				councilId: this.props.council.id
			}
        });

		if (response) {
			if (response.data.downloadAct) {
				this.setState({
					loading: false
				});
				downloadFile(
					response.data.downloadAct,
					"application/pdf",
					`${this.props.translate.act.replace(/ /g, '_')}-${
				    this.props.council.name.replace(/ /g, '_').replace(/\./g, '_')
					}`
				);
			}
		}
    };

    export2Doc = (element, filename = '') => {
        console.log(this.props.html);
        const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
        const postHtml = "</body></html>";
        const body = this.props.html.replace(/[\u0080-\u024F]/g,
            function(a) {
              return '&#'+a.charCodeAt(0)+';';
        }).replace(/<!--[\s\S]*?-->/g, '');
        const html = preHtml+body+postHtml;
        const css = ('\
            <style>\
            body {font-family: Arial, Georgia, Serif; font-size: 14pt;}\
            </style>\
       ');

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