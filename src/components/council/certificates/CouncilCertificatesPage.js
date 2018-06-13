import React from 'react';
import withSharedProps from '../../../HOCs/withSharedProps';
import { graphql, compose } from 'react-apollo';
import { councilCertificates, downloadCertificate } from '../../../queries';
import { getSecondary } from '../../../styles/colors';
import { withRouter } from 'react-router-dom';
import { LoadingSection, CardPageLayout, ButtonIcon, BasicButton, Table, DateWrapper } from '../../../displayComponents';
import { TableRow, TableCell } from 'material-ui';
import { downloadFile } from '../../../utils/CBX';
import CertificateForm from './CertificateForm';

class CouncilCertificates extends React.PureComponent {

    state = {
        downloading: false
    }

    downloadCertificate = async (certificate) => {
        this.setState({
            downloading: certificate.id
        })

        const response = await this.props.downloadCertificate({
            variables: {
                id: certificate.id
            }
        });

        if(response){
            if(!response.errors){
                this.setState({
                    downloading: false
                })
            }
        }

        downloadFile(
            response.data.downloadCertificate,
            "application/pdf",
            `${certificate.title}`
        );

    }

    closeEditor = () =>  {
        this.props.data.refetch();
        this.setState({
            editor: false
        });
    }

    render(){
        const { translate } = this.props;

        if(this.props.data.loading){
            return <LoadingSection />
        }

        const { councilCertificates } = this.props.data;

        if(this.state.editor === true){
            return(
                <CertificateForm
                    council={this.props.data.council}
                    translate={translate}
                    requestClose={this.closeEditor}
                />
            )
        }
        
        return(
            <CardPageLayout title={translate.certificates}>
                <BasicButton
                    text={translate.certificates_new}
                    textStyle={{textTransform: 'none', fontWeight: '700', color: 'white'}}
                    color={getSecondary()}
                    onClick={() => this.setState({
                        editor: true
                    })}
                    icon={<ButtonIcon type="add" color="white"/>}
                />
                <div>
                    {councilCertificates.length > 0? 
                        <Table
                            headers={[
                                { name: translate.field_date},
                                { name: translate.certificate_title_of}
                            ]}
                        >
                            {this.props.data.councilCertificates.map(certificate => (
                                <TableRow key={`certificate_${certificate.id}`}>
                                    <TableCell>
                                        <DateWrapper format="DD/MM/YYYY HH:mm" date={certificate.date} />
                                    </TableCell>
                                    <TableCell>
                                        {certificate.title}
                                    </TableCell>
                                    <TableCell>
                                        <BasicButton
                                            text={translate.download}
                                            color="white"
                                            loading={this.state.downloading === certificate.id}
                                            loadingColor={getSecondary()}
                                            textStyle={{textTransform: 'none'}}
                                            buttonStyle={{border: `2px solid ${getSecondary()}`}}
                                            onClick={() => this.downloadCertificate(certificate)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </Table>
                    :
                        'NO HAY CERTIFICADOS GENERADOS'
                    }
                </div>
                
            </CardPageLayout>
        )
    }
}

export default compose(
    graphql(councilCertificates, {
        options: props => ({
            variables: {
                councilId: props.match.params.council
            }
        })
    }),
    graphql(downloadCertificate, {
        name: 'downloadCertificate'
    })
)(withSharedProps()(withRouter(CouncilCertificates)));


/* 
&&data%5Btitle%5D=Titulo%20-%20alpha&data%5Bheader%5D=%3Cp%3ECabecera%20-%20alpha%3C%2Fp%3E&data%5Bfooter%5D=%3Cp%3EPie%20-%20alpha%3C%2Fp%3E&data%5Bcouncil_id%5D=5581&data%5Bdate%5D=2018-06-12T07%3A35%3A46.830Z
*/