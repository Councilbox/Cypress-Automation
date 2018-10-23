import React from 'react';
import { TextInput, DateTimePicker, BasicButton, FileUploadButton, ButtonIcon, LiveToast } from '../../../../displayComponents';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import EditorStepLayout from '../../../council/editor/EditorStepLayout';
import RichTextInput from '../../../../displayComponents/RichTextInput';
import { Typography } from 'material-ui';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import AttachmentItem from '../../../attachments/AttachmentItem';
import DocumentNameEditor from './DocumentNameEditor';
import { checkForUnclosedBraces } from '../../../../utils/CBX';
import { toast } from 'react-toastify';

class SignatureStepOne extends React.Component {
    state = {
        data: {
            ...this.props.signature
        },
        editDocument: false,
        errors: {},
        errorState: false
    }

    toastId = null;

    updateState = object => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        });

        if(this.state.errorState){
            this.checkRequiredFields();
        }
    }

    updateAttachment = object => {
        this.setState({
            data: {
                ...this.state.data,
                attachment: {
                    ...this.state.data.attachment,
                    ...object
                }
            }
        })
    }

    removeDocument = async () => {
        const response = await this.props.removeSignatureDocument({
            variables: {
                id: this.state.data.attachment.id
            }
        });

        if(response.data.removeSignatureDocument.success){
            this.setState({
                data: {
                    ...this.state.data,
                    attachment: null
                }
            });
        }
    }

    handleFile = async event => {
		const file = event.nativeEvent.target.files[0];
		if (!file) {
			return;
		}
		if (
			file.size / 1000 + parseInt(this.state.totalSize, 10) >
			10000
		) {
			this.setState({
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
				signatureId: this.state.data.id
            };
            if(fileInfo.filetype === 'application/pdf'){
                this.setState({
                    uploading: true
                });

                const response = await this.props.saveSignatureDocument({
                    variables: {
                        document: fileInfo
                    }
                });

                if (response.data) {
                    if(response.data.saveSignatureDocument.id){
                        this.setState({
                            uploading: false,
                            data: {
                                ...this.state.data,
                                attachment: {
                                    ...response.data.saveSignatureDocument
                                }
                            }
                        })
                    }
                    this.props.data.refetch();
                }
            }else{
                this.setState({
                    errors: {
                        ...this.state.errors,
                        file: this.props.translate.majority_percentage
                    }
                })
            }

		};
    };

    saveSignature = async () => {
        const { __typename, attachment, ...signature } = this.state.data;
        const response = await this.props.saveSignature({
            variables: {
                signature: {
                    ...signature
                }
            }
        });
        return response;
    }

    nextStep = async () => {
        if(!this.checkRequiredFields()){
            const result = await this.saveSignature();
            if(!result.errors){
                this.props.nextStep();
            }
        }
    }

    checkRequiredFields = () => {
        const errors = {
            expirationDateToSign: '',
            title: '',
            description: '',
            file: ''
        }

        const { data } = this.state;
        const { translate } = this.props;

        let hasError = false;

        if(!data.expirationDateToSign){
            errors.expirationDateToSign = translate.required_field;
            hasError = true;
        }

        if(!data.title){
            errors.title = translate.required_field;
            hasError = true;
        }

        if(!data.description){
            errors.description = translate.required_field;
            hasError = true;
        }else{
            if(checkForUnclosedBraces(data.description)){
                errors.description = true;
                hasError = true;
                if(this.toastId){
                    toast.dismiss(this.toastId);
                }
                this.toastId = toast(
					<LiveToast
						message={translate.revise_text}
					/>, {
						position: toast.POSITION.TOP_RIGHT,
                        autoClose: true,
                        onClose: () => this.toastId = null,				
						className: "errorToast"
					}
				);
            }
        }

        if(!data.attachment){
            errors.file = translate.must_add_attachment_file_to_sign;
            hasError = true;
        }

        this.setState({
            errors,
            errorState: true
        });

        return hasError;
    }

    render(){
        const { translate } = this.props;
        const primary = getPrimary();
        const secondary = getSecondary();
        const {data, errors } = this.state;

        return(
            <EditorStepLayout
                body={
                    <div>
                        <Typography variant="title" style={{color: primary}}>
                            {translate.signature_header}
                        </Typography>
                        <div
                            style={{
                                maxWidth: '20em',
                                marginTop: '0.8em'
                            }}
                        >
                            <DateTimePicker
                                required
                                minDate={new Date()}
                                errorText={errors.expirationDateToSign}
                                onChange={date => {
                                    const newDate = new Date(date);
                                    const dateString = newDate.toISOString();
                                    this.updateState({expirationDateToSign: dateString})
                                }}
                                minDateMessage={""}
                                acceptText={translate.accept}
                                cancelText={translate.cancel}
                                label={translate.signature_expiration_date}
                                value={data.expirationDateToSign}
                            />
                        </div>
                        <div
                            style={{
                                maxWidth: '20em',
                                marginTop: '0.8em'
                            }}
                        >
                            <TextInput
                                floatingText={translate.signature_title}
                                errorText={errors.title}
                                onChange={(event) => this.updateState({title: event.target.value})}
                                value={data.title}
                            />
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
                                errorText={errors.description}
                                floatingText={translate.description}
                                onChange={value => this.updateState({description: value})}
                            />
                        </div>
                        <div
                            style={{
                                maxWidth: '100%',
                                marginTop: '0.8em'
                            }}
                        >
                            <Typography variant="title" style={{color: primary}}>
                                {translate.new_file_to_sign_title}
                            </Typography>

                            {data.attachment?
                                <div>
                                    <AttachmentItem
                                        attachment={data.attachment}
                                        translate={translate}
                                        edit
                                        editName={() => this.setState({ editDocument: true})}
                                        removeAttachment={this.removeDocument}
                                    />
                                    <DocumentNameEditor
                                        key={data.attachment.id}
                                        attachment={data.attachment}
                                        updateAttachment={this.updateAttachment}
                                        translate={translate}
                                        open={this.state.editDocument}
                                        requestClose={() => this.setState({ editDocument: false })}
                                    />
                                </div>
                            :
                                <div>
                                    <div style={{maxWidth: '10em'}}>
                                        <FileUploadButton
                                            text={translate.new_add}
                                            accept='application/pdf'
                                            style={{
                                                marginTop: "2em",
                                                width: "100%"
                                            }}
                                            buttonStyle={{ width: "100%" }}
                                            color={primary}
                                            textStyle={{
                                                color: "white",
                                                fontWeight: "700",
                                                fontSize: "0.9em",
                                                textTransform: "none"
                                            }}
                                            loading={this.state.uploading}
                                            icon={
                                                <ButtonIcon type="publish" color="white" />
                                            }
                                            onChange={this.handleFile}
                                        />
                                    </div>
                                    {!!this.state.errors.file &&
                                        <p style={{color: 'red', fontWeight: '700'}}>
                                            {this.state.errors.file}
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
                            color={secondary}
                            textStyle={{color: 'white', textTransform: 'none', fontWeight: '700'}}
                            onClick={this.saveSignature}
                        />
                        <BasicButton
                            text={translate.next}
                            color={primary}
                            textStyle={{color: 'white', textTransform: 'none', fontWeight: '700'}}
                            buttonStyle={{marginLeft: '0.8em'}}
                            onClick={this.nextStep}
                        />
                    </div>
                }
            />
        )
    }
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

export default compose(
    graphql(saveSignatureDocument, {
        name: 'saveSignatureDocument'
    }),
    graphql(removeSignatureDocument, {
        name: 'removeSignatureDocument'
    }),
    graphql(saveSignature, {
        name: 'saveSignature'
    })
)(SignatureStepOne);