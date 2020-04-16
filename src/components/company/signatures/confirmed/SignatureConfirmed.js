import React from 'react';
import { LoadingSection, CardPageLayout, BasicButton, ButtonIcon, Grid, GridItem } from '../../../../displayComponents';
import SignersList from './SignersList';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import SignersStatusRecount from './SignersStatusRecount';
import { SIGNATURE_STATES } from '../../../../constants';
import { getPrimary } from '../../../../styles/colors';
import { downloadFile } from '../../../../utils/CBX';

class SignatureConfirmed extends React.Component {

    state = {
        downloading: false
    }

    signes = null;

    componentDidMount(){
        //this.refreshStates();
    }

    downloadSignedDocument = async () => {
        this.setState({
            downloading: true
        });
        const response = await this.props.downloadSignedDocument({
            variables: {
                signatureId: this.props.data.signature.id
            }
        });
        if(response.data.downloadSignedDocument){
            downloadFile(
                response.data.downloadSignedDocument,
                "application/pdf",
                `${this.props.data.signature.title.split(' ').join('_').replace(/\./, '')}`
            );
            this.setState({
                downloading: false
            });
        }
    }

    refreshStates = async () => {
        await this.props.updateSignatureStatus({
            variables: {
                id: this.props.data.signature.id
            }
        });
        await this.props.data.refetch();
        if(this.signers){
            if(this.signers.wrappedInstance){
                if(this.signers.wrappedInstance.wrappedInstance){
                    this.signers.wrappedInstance.wrappedInstance.reloadParticipants();
                }
            }
        }
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
                <Grid style={{width: '100%'}}>
                    <GridItem xs={12} md={3} lg={3}>

                    </GridItem>
                    <GridItem xs={12} md={6} lg={6}>
                        <SignersStatusRecount
                            data={this.props.recount}
                            signature={signature}
                            translate={this.props.translate}
                        />
                    </GridItem>
                    <GridItem xs={12} md={3} lg={3} style={{display: 'flex', justifyContent: 'flex-end'}}>
                        {signature.state === SIGNATURE_STATES.COMPLETED &&
                            <div>
                                <BasicButton
                                    text={this.props.translate.download_signed_document}
                                    color={'white'}
                                    loading={this.state.downloading}
                                    loadingColor={primary}
                                    textStyle={{color: primary, fontWeight: '700', textTransform: 'none'}}
                                    onClick={() => this.downloadSignedDocument()}
                                    buttonStyle={{border: `2px solid ${primary}`}}
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
                    {this.props.data.loading?
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
                        <div style={{width: '100%', height: '100%'}}>
                            <SignersList
                                ref={ref => this.signers = ref}
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