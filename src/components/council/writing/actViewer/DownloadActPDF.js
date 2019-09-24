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

        if (response) {
            if (response.data.downloadAct) {
                this.setState({
                    downloadingPDF: false
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

    render() {
        const secondary = getSecondary();
        const { translate, inEditorActa, text } = this.props;
        if (inEditorActa) {
            return (
                <BasicButton
                    text={text}
                    color={"white"}
                    textStyle={{
                        color: "black",
                        fontSize: "0.9em",
                        textTransform: "none",
                        whiteSpace: "nowrap"
                    }}
                    loading={this.state.downloadingPDF}
                    textPosition="after"
                    iconInit={<i style={{ marginRight: "0.3em", fontSize: "18px" }} className="fa fa-file-pdf-o" aria-hidden="true"></i>}
                    onClick={this.downloadPDF}
                    buttonStyle={{
                        marginRight: "1em",
                        boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                        borderRadius: '3px'
                    }}
                />
            )
        } else {
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
}

export default withApollo(DownloadActPDF);