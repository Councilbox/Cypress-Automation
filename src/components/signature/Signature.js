import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { signatures, deleteSignature } from '../../queries/signature';
import { graphql, compose } from 'react-apollo';
import {
    LoadingSection, AlertConfirm, SectionTitle, Table, ErrorWrapper, CloseIcon
} from '../displayComponents/index';
import { getPrimary } from '../../styles/colors';
import { TableRow, TableCell } from 'material-ui/Table';
import Scrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { bHistory } from '../../containers/App';
import { MAX_FILE_SIZE } from "../../constants";



class Signatures extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            signature: {
                expirationDateToSign: new Date().toISOString(),
            }
        }
    }

    componentDidMount() {
        if (this.props.id !== 'new'){
            this.props.data.refetch();
        }
    }

    handleFile = (event) => {
        const file = event.nativeEvent.target.files[0];
        if(!file){
            return;
        }
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            let fileInfo = {
                filename: file.name,
                filetype: file.type,
                filesize: Math.round(file.size / 1000),
                base64: reader.result,
                councilId: this.props.councilID
            };

            this.setState({
                uploading: true
            });
            const response = await this.props.addAttachment({
                variables: {
                    attachment: fileInfo
                }
            })
            if(response){
                this.props.data.refetch();
                this.setState({
                    uploading: false
                });
            }
        }
    }

    render() {
        const { translate } = this.props;
        const { loading, signatures, error } = this.props.data;
        return (<div style={{
            height: '100%',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <Scrollbar>
                <div style={{ padding: '2em' }}>
                    <SectionTitle
                        icon="pencil-square-o"
                        title={translate.document_signature_drafts}
                        subtitle={translate.signature_of_documents_drafts_desc}
                    />
                    {loading ? <LoadingSection/> : <Fragment>
                        {error ? <div>
                            {error.graphQLErrors.map((error) => {
                                return <ErrorWrapper error={error} translate={translate}/>
                            })}
                        </div> : signatures.length > 0 ? <Table
                            headers={[ { name: translate.name }, { name: translate.delete } ]}
                            action={this._renderDeleteIcon}
                            companyID={this.props.company.id}
                        >
                            {signatures.map((signature) => {
                                return (
                                    <TableRow style={{cursor: 'pointer'}}
                                        onClick={()=> {
                                        bHistory.push(`/company/${this.props.company.id}/signature/${signature.id}`)
                                    }}
                                        key={`signature${signature.id}`}>
                                        <TableCell>
                                            {signature.title}
                                        </TableCell>
                                        <TableCell>
                                            {this._renderDeleteIcon(signature.id)}
                                        </TableCell>
                                    </TableRow>)
                            })}
                        </Table> : <span>{translate.no_results}</span>}
                        <AlertConfirm
                            title={translate.send_to_trash}
                            bodyText={translate.send_to_trash_desc}
                            open={this.state.deleteModal}
                            buttonAccept={translate.send_to_trash}
                            buttonCancel={translate.cancel}
                            modal={true}
                            acceptAction={this.delete}
                            requestClose={() => this.setState({ deleteModal: false })}
                        />
                    </Fragment>}
                </div>
            </Scrollbar>
        </div>);
    }
}


export default compose(graphql(signature, {
    name: "data",
    options: (props) => ({
        variables: {
            id: props.id,
            companyId: props.company.id,
            active: 1
        }
    })
}))(Signatures);