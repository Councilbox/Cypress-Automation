import React from 'react';
import withSharedProps from '../../../HOCs/withSharedProps';
import { graphql, compose } from 'react-apollo';
import { councilCertificates, downloadCertificate } from '../../../queries';
import { getSecondary } from '../../../styles/colors';
import { withRouter } from 'react-router-dom';
import { LoadingSection, CardPageLayout, ButtonIcon, BasicButton, Table, DateWrapper } from '../../../displayComponents';
import { TableRow, TableCell, Typography } from 'material-ui';
import { downloadFile } from '../../../utils/CBX';
import CertificateForm from './CertificateForm';

class CouncilCertificates extends React.PureComponent {

    state = {
        downloading: false,
        editor: false
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

        this.setState({
            downloading: false
        })

        if(!!response){
            if(!response.errors){
                downloadFile(
                    response.data.downloadCertificate,
                    "application/pdf",
                    `${certificate.title}`
                );
            }
        }

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
                <div
                    style={{
                        padding: '1em',
                        ...(councilCertificates.length === 0? {
                            display: 'flex',
                            width: '100%',
                            flexDirection: 'column',
                            height: '15em',
                            alignItems: 'center',
                            justifyContent: 'center'
                        } : {})
                    }}
                >
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
                                    { name: translate.certificate_title_of},
                                    { name: ''}
                                ]}
                            >
                                {this.props.data.councilCertificates.map(certificate => (
                                    <HoverableRow
                                        key={`certificate_${certificate.id}`}
                                        certificate={certificate}
                                        translate={translate}
                                    />
                                ))}
                            </Table>
                        :
                            <Typography variant="subheading" style={{fontWeight: '700', marginTop: '0.8em'}} /*TRADUCCION*/>
                                NO HAY CERTIFICADOS GENERADOS
                            </Typography>
                        }
                    </div>
                </div>
            </CardPageLayout>
        )
    }
}

class HoverableRow extends React.Component {
    state = {
        showActions: false
    }

    mouseEnterHandler = () => {
        this.setState({
            showActions: true
        });
    }

    mouseLeaveHandler = () => {
        this.setState({
            showActions: false
        });
    }

    render(){
        const { certificate } = this.props;

        return(
            <TableRow
                key={`certificate_${certificate.id}`}
                onMouseOver={this.mouseEnterHandler}
                onMouseLeave={this.mouseLeaveHandler}
            >
                <TableCell>
                    <DateWrapper format="DD/MM/YYYY HH:mm" date={certificate.date} />
                </TableCell>
                <TableCell>
                    {certificate.title}
                </TableCell>
                <TableCell>
                    <div style={{width: '10em'}}>
                        {this.state.showActions &&
                            <BasicButton
                                text={this.props.translate.download}
                                color='white'
                                loading={this.state.downloading === certificate.id}
                                loadingColor="white"
                                buttonStyle={{border: `1px solid ${getSecondary()}`}}
                                textStyle={{textTransform: 'none', fontWeight: '700', color: getSecondary()}}
                                onClick={() => this.downloadCertificate(certificate)}
                            />
                        }
                    </div>
                </TableCell>
            </TableRow>
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