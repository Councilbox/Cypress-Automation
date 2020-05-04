import React from 'react';
import { TextInput, DateTimePicker, BasicButton, FileUploadButton, ButtonIcon, LiveToast, SelectInput } from '../../../../displayComponents';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import EditorStepLayout from '../../../council/editor/EditorStepLayout';
import RichTextInput from '../../../../displayComponents/RichTextInput';
import { Typography, MenuItem } from 'material-ui';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import AttachmentItem from '../../../attachments/AttachmentItem';
import DocumentNameEditor from './DocumentNameEditor';
import { checkForUnclosedBraces } from '../../../../utils/CBX';
import { toast } from 'react-toastify';

const SignatureStepOneIvnosys = ({ translate, signature, refetch, nextStep, client, ...props }) => {
    const [state, setState] = React.useState({
        data: {
            ...signature,
        },
        editDocument: false,
        errors: {},
        errorState: false
    })

    const { data } = state;

    const removeDocument = async () => {
        const response = await client.mutate({
            mutation: removeSignatureDocument,
            variables: {
                id: state.data.attachment.id
            }
        });

        if (response.data.removeSignatureDocument.success) {
            setState({
                ...state,
                data: {
                    ...state.data,
                    attachment: null
                }
            });
        }
    }

    const handleFile = async event => {
        const file = event.nativeEvent.target.files[0];
        if (!file) {
            return;
        }
        if (
            file.size / 1000 + parseInt(state.totalSize, 10) >
            10000
        ) {
            setState({
                alert: true
            });
            return;
        }
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = async event => {
            let fileInfo = {
                filename: file.name,
                filetype: file.type,
                filesize: event.loaded,
                base64: btoa(event.target.result),
                signatureId: state.data.id
            };

            if (fileInfo.filetype === 'application/pdf') {
                setState({
                    ...state,
                    uploading: true
                });

                const response = await client.mutate({
                    mutation: saveSignatureDocument,
                    variables: {
                        document: fileInfo
                    }
                });
                
                if (response.data) {
                    if (response.data.saveSignatureDocument.id) {
                        setState({
                            ...state,
                            uploading: false,
                            data: {
                                ...state.data,
                                attachment: {
                                    ...response.data.saveSignatureDocument
                                }
                            }
                        })
                    }
                    refetch();
                }
            } else {
                setState({
                    ...state,
                    errors: {
                        ...state.errors,
                        file: props.translate.majority_percentage
                    }
                })
            }
        };
    };

    const saveSignaturefunc = async () => {
        const { __typename, attachment, ...signature } = state.data;
        const response = await client.mutate({
            mutation: saveSignature,
            variables: {
                signature: {
                    ...signature
                }
            }
        });
        return response;
    }

    const nextStepIn = async () => {
        if (!checkRequiredFields()) {
            const result = await saveSignaturefunc();
            if (!result.errors) {
                nextStep();
            }
        }
    }
    
    let toastId = null;

    const checkRequiredFields = () => {
        const errors = {
            expirationDateToSign: '',
            title: '',
            description: '',
            file: ''
        }

        const { data } = state;

        let hasError = false;

        // if (!data.expirationDateToSign) {
        //     errors.expirationDateToSign = translate.required_field;
        //     hasError = true;
        // }

        if (!data.title) {
            errors.title = translate.required_field;
            hasError = true;
        }

        if (!data.description) {
            errors.description = translate.required_field;
            hasError = true;
        } else {
            if (checkForUnclosedBraces(data.description)) {
                errors.description = true;
                hasError = true;
                if (toastId) {
                    toast.dismiss(toastId);
                }
                toastId = toast(
                    <LiveToast
                        message={translate.revise_text}
                    />, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: true,
                    onClose: () => toastId = null,
                    className: "errorToast"
                }
                );
            }
        }

        if (!data.attachment) {
            errors.file = translate.must_add_attachment_file_to_sign;
            hasError = true;
        }
        setState({
            ...state,
            errors,
            errorState: true
        });

        return hasError;
    }

    return (
        <EditorStepLayout
            body={
                <div>
                    <Typography variant="title" style={{ color: getPrimary() }}>
                        {translate.signature_header}
                    </Typography>
                    {/* <div
                        style={{
                            maxWidth: '20em',
                            marginTop: '0.8em'
                        }}
                    >
                        <DateTimePicker
                            required
                            // minDate={new Date()}
                            // errorText={state.errors.expirationDateToSign}
                            onChange={date => {
                                const newDate = new Date(date);
                                const dateString = newDate.toISOString();
                                setState({
                                    ...state,
                                    data: {
                                        ...state.data,
                                        expirationDateToSign: dateString
                                    }
                                })
                            }}
                            minDateMessage={""}
                            acceptText={translate.accept}
                            cancelText={translate.cancel}
                            label={translate.signature_expiration_date}
                            value={state.data.expirationDateToSign ? state.data.expirationDateToSign : null}
                            // value={data.expirationDateToSign}
                        />
                    </div> */}
                    <div
                        style={{
                            maxWidth: '20em',
                            marginTop: '0.8em'
                        }}
                    >
                        <TextInput
                            floatingText={translate.signature_title}
                            errorText={state.errors.title}
                            onChange={event => setState({
                                ...state,
                                data: {
                                    ...state.data,
                                    title: event.target.value
                                }
                            })}
                            value={data.title}
                        />
                    </div>
                    <div>
                        <SelectInput
                            floatingText={translate.type}
                            value={data.type}
                            onChange={event => setState({
                                ...state,
                                data: {
                                    ...state.data,
                                    type: event.target.value
                                }
                            })}
                        >
                            <MenuItem value="ACEP">Firma simple</MenuItem>
                            <MenuItem value="SIGBIO">Firma biométrica</MenuItem>
                            <MenuItem value="SIGAUT">Firma automática con certificado</MenuItem>
                        </SelectInput>
                    </div>
                    <div
                        style={{
                            maxWidth: '100%',
                            marginTop: '0.8em'
                        }}
                    >
                        <RichTextInput
                            value={data.description || ''}
                            translate={translate}
                            errorText={state.errors.description}
                            floatingText={translate.description}
                            onChange={value => setState({
                                ...state,
                                data: {
                                    ...state.data,
                                    description: value
                                }
                            })}
                        />
                    </div>
                    <div
                        style={{
                            maxWidth: '100%',
                            marginTop: '0.8em'
                        }}
                    >
                        <Typography variant="title" style={{ color: getPrimary() }}>
                            {translate.new_file_to_sign_title}
                        </Typography>

                        {state.data.attachment ?
                            <div>
                                <AttachmentItem
                                    attachment={state.data.attachment}
                                    translate={translate}
                                    edit
                                    editName={() => setState({ ...state, editDocument: true })}
                                    removeAttachment={removeDocument}
                                />
                                <DocumentNameEditor
                                    key={state.data.attachment.id}
                                    attachment={state.data.attachment}
                                    updateAttachment={(event) =>
                                        setState({
                                            ...state,
                                            data: {
                                                ...state.data,
                                                attachment: {
                                                    ...state.data.attachment,
                                                    ...event
                                                }
                                            }
                                        })
                                    }
                                    translate={translate}
                                    open={state.editDocument}
                                    requestClose={() => setState({ ...state, editDocument: false })}
                                />
                            </div>
                            :
                            <div>
                                <div style={{ maxWidth: '10em' }}>
                                    <FileUploadButton
                                        text={translate.new_add}
                                        accept='application/pdf'
                                        style={{
                                            marginTop: "2em",
                                            width: "100%"
                                        }}
                                        buttonStyle={{ width: "100%" }}
                                        color={getPrimary()}
                                        textStyle={{
                                            color: "white",
                                            fontWeight: "700",
                                            fontSize: "0.9em",
                                            textTransform: "none"
                                        }}
                                        loading={state.uploading}
                                        icon={
                                            <ButtonIcon type="publish" color="white" />
                                        }
                                        onChange={handleFile}
                                    />
                                </div>
                                {!!state.errors.file &&
                                    <p style={{ color: 'red', fontWeight: '700' }}>
                                        {state.errors.file}
                                    </p>
                                }
                            </div>
                        }
                    </div>
                </div>
            }
            buttons={
                <div>
                    <BasicButton
                        text={translate.save}
                        color={getSecondary()}
                        textStyle={{ color: 'white', textTransform: 'none', fontWeight: '700' }}
                        onClick={saveSignaturefunc}
                    />
                    <BasicButton
                        text={translate.next}
                        color={getPrimary()}
                        textStyle={{ color: 'white', textTransform: 'none', fontWeight: '700' }}
                        buttonStyle={{ marginLeft: '0.8em' }}
                        onClick={nextStepIn}
                    />
                </div>
            }
        />
    )
}


const saveSignatureDocument = gql`
    mutation SaveSignatureDocument($document: SignatureDocumentInput){
        saveSignatureDocument(document: $document){
            id
            signatureId
            title
            description
            filename
            base64
            filesize
            filetype
        }
    }
`;

const removeSignatureDocument = gql`
    mutation RemoveSignatureDocument($id: Int!){
        removeSignatureDocument(id: $id){
            success
            message
        }
    }
`;

const saveSignature = gql`
    mutation UpdateSignature($signature: SignatureInput){
        saveSignature(signature: $signature){
            id
            title
        }
    }
`;

export default (withApollo(SignatureStepOneIvnosys));