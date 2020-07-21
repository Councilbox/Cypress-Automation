import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { downloadAttendPDF } from "../../../../queries";
import { BasicButton } from "../../../../displayComponents";
import FontAwesome from 'react-fontawesome';
import { moment } from '../../../../containers/App';
import { downloadFile } from '../../../../utils/CBX';


class DownloadAttendantsPDF extends React.Component {

    state = {
        loading: false
    }

    downloadPDF = async () => {
        this.setState({
            loading: true
        })
        const response = await this.props.client.query({
            query: downloadAttendPDF,
            variables: {
                councilId: this.props.council.id,
                timezone: moment().utcOffset().toString(),
            }
        });

        if (response) {
            if (response.data.downloadAttendPDF) {
                this.setState({
                    loading: false
                });
                downloadFile(
                    response.data.downloadAttendPDF,
                    "application/pdf",
                    `${this.props.translate.convene.replace(/ /g, '_')}-${
                    this.props.council.name.replace(/ /g, '_').replace(/\./, '')
                    }`
                );
            }
        }
    };

    render(){
        const { translate, color } = this.props;


        return (
            <BasicButton
                text={translate.export_participants}
                color={color}
                loading={this.state.loading}
                buttonStyle={{ marginTop: "0.5em", marginBottom: '1.4em' }}
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



export default withApollo(DownloadAttendantsPDF);