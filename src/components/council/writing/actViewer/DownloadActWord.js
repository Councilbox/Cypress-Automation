import React from 'react';
import { BasicButton } from '../../../../displayComponents';
import { downloadFile } from '../../../../utils/CBX';
import FontAwesome from "react-fontawesome";
import { getSecondary } from '../../../../styles/colors';


class DownloadActWord extends React.Component {

    state = {
        downloadingPDF: false
    }

    export2Doc = (element, filename = '') => {
        console.log(this.props.html)
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

        
        // Specify link url
        const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURI(value);
        
        // Specify file name
        filename = filename?filename+'.docx':'document.docx';
        
        // Create download link element
        const downloadLink = document.createElement("a");
    
        document.body.appendChild(downloadLink);
        
        if(navigator.msSaveOrOpenBlob ){
            const blob = new Blob(['\ufeff', css+html], {
                type: 'application/msword'
            });
            navigator.msSaveOrOpenBlob(blob, filename);
        }else{
            // Create a link to the file
            downloadLink.href = url;
            
            // Setting the file name
            downloadLink.download = filename;
            
            //triggering the function
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
                buttonStyle={{ marginTop: "0.5em" }}
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