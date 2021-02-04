import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingSection, CardPageLayout, BasicButton, ButtonIcon, Grid, GridItem } from '../../../../displayComponents';
import SignersList from './SignersList';
import SignersStatusRecount from './SignersStatusRecount';
import { SIGNATURE_STATES } from '../../../../constants';
import { getPrimary } from '../../../../styles/colors';
import { SERVER_URL } from '../../../../config';

class SignatureConfirmed extends React.Component {
    state = {
        downloading: false
    }


    downloadSignedDocument = async () => {
        this.setState({
            downloading: true
        });
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${SERVER_URL}/signedDocument/${this.props.data.signature.id}`, {
            headers: new Headers({
                "x-jwt-token": token
            })
        });

        if(response.status === 200){
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.props.data.signature.title + ".pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
        this.setState({
            downloading: false
        })
    }

    render(){
        const primary = getPrimary();
        let title = this.props.translate.dashboard_new_signature;
        const { signature } = this.props.data;
        if(!this.props.data.loading){
            if(this.props.data.signature.title){
                title = this.props.data.signature.title;
            }
        }

        return(
            <CardPageLayout title={title}>
                <Grid style={{ width: '100%' }}>
                    <GridItem xs={12} md={3} lg={3}>

                    </GridItem>
                    <GridItem xs={12} md={6} lg={6}>
                        <SignersStatusRecount
                            data={this.props.recount}
                            signature={signature}
                            translate={this.props.translate}
                        />
                    </GridItem>
                    <GridItem xs={12} md={3} lg={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {signature.state === SIGNATURE_STATES.COMPLETED &&
                            <div>
                                <BasicButton
                                    text={this.props.translate.download_signed_document}
                                    color={'white'}
                                    loading={this.state.downloading}
                                    loadingColor={primary}
                                    textStyle={{ color: primary, fontWeight: '700', textTransform: 'none' }}
                                    onClick={() => this.downloadSignedDocument()}
                                    buttonStyle={{ border: `2px solid ${primary}` }}
                                    icon={<ButtonIcon type={'save_alt'} color={primary} />}
                                />
                            </div>
                        }
                    </GridItem>
                </Grid>
                <div
                    style={{
                        height: 'calc(100% - 3em)'
                    }}
                >
                    {!signature ?
                        <div
                            style={{
                                height: '400px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <LoadingSection />
                        </div>
                    :
                        <div style={{ width: '100%', height: '100%' }}>
                            <SignersList
                                ref={ref => this.signers = ref}
                                refetch={this.props.data.refetch}
                                signature={signature}
                                translate={this.props.translate}
                                refreshStates={this.refreshStates}
                            />
                        </div>
                    }
                </div>
            </CardPageLayout>
        )
    }
}

const updateSignatureStatus = gql`
    mutation UpdateSignatureStatus($id: Int!){
        updateSignatureStatus(id: $id){
            success
        }
    }
`;

const downloadSignedDocument = gql`
    mutation DownloadSignedDocument($signatureId: Int!){
        downloadSignedDocument(id: $signatureId)
    }
`;

export default compose(
    graphql(updateSignatureStatus, {
        name: 'updateSignatureStatus',
    }),
    graphql(downloadSignedDocument, {
        name: 'downloadSignedDocument',
    })
)(SignatureConfirmed);
