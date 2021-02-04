import React from 'react';
import FontAwesome from "react-fontawesome";
import { BasicButton } from '../../../../displayComponents';
import { downloadFile } from '../../../../utils/CBX';
import { getSecondary } from '../../../../styles/colors';


class DownloadActWord extends React.Component {
    state = {
        downloadingPDF: false
    }

    export2Doc = (element, filename = '') => {
        const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
        const postHtml = "</body></html>";
        const body = this.props.html.replace(/[\u0080-\u024F]/g,
            function (a) {
              return '&#' + a.charCodeAt(0) + ';';
        }).replace(/<!--[\s\S]*?-->/g, '');
        const html = preHtml + body + postHtml;
        const css = ('\
            <style>\
            body {font-family: Arial, Georgia, Serif; font-size: 14pt;}\
            </style>\
       ');

       const value = css + html;
        const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURI(value);
        filename = filename ? filename + '.docx' : 'document.docx';
        const downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        if(navigator.msSaveOrOpenBlob){
            const blob = new Blob(['\ufeff', css + html], {
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
        const { translate } = this.props;

        return (
            <BasicButton
                text={translate.export_original_act}
                color={secondary}
                loading={this.state.downloadingPDF}
                buttonStyle={{ marginTop: "0.5em", marginLeft: "0.5em" }}
                textStyle={{
                    color: "white",
                    fontWeight: "700",
                    fontSize: "0.9em",
                    textTransform: "none"
                }}
                icon={
                    <FontAwesome
                        name={"file-word-o"}
                        style={{
                            fontSize: "1em",
                            color: "white",
                            marginLeft: "0.3em"
                        }}
                    />
                }
                textPosition="after"
                onClick={this.export2Doc}
            />
        )
    }
}

export default DownloadActWord;
