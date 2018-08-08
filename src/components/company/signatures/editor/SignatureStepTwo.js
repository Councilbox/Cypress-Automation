import React from 'react';
import { TextInput, DateTimePicker, BasicButton, FileUploadButton, ButtonIcon } from '../../../../displayComponents';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import EditorStepLayout from '../../../council/editor/EditorStepLayout';
import RichTextInput from '../../../../displayComponents/RichTextInput';
import { Typography } from 'material-ui';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import AttachmentItem from '../../../attachments/AttachmentItem';
import DocumentNameEditor from './DocumentNameEditor';
import SignatureParticipants from './SignatureParticipants';

class SignatureStepTwo extends React.Component {
    state = {}

    updateState = object => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        });
    }

    sendSignature = async () => {
        const response = await this.props.sendSignature({
            variables: {
                id: this.props.signature.id
            }
        });

        console.log(response);
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
                        <SignatureParticipants
                            signature={this.props.signature}
                            translate={translate}
                        />
                    </div>
                }
                buttons={
                    <div>
                        <BasicButton
                            text={translate.previous}
                            color={secondary}
                            textStyle={{color: 'white', textTransform: 'none', fontWeight: '700'}}
                            buttonStyle={{marginRight: '0.8em'}}
                            onClick={this.props.prevStep}
                        />
                        <BasicButton
                            text={translate.save}
                            color={secondary}
                            textStyle={{color: 'white', textTransform: 'none', fontWeight: '700'}}
                            onClick={this.saveSignature}
                        />
                        <BasicButton
                            text={translate.new_send_to_sign}
                            color={primary}
                            textStyle={{color: 'white', textTransform: 'none', fontWeight: '700'}}
                            buttonStyle={{marginLeft: '0.8em'}}
                            onClick={this.sendSignature}
                        />
                    </div>
                }
            />
        )
    }
}

const sendSignature = gql`
    mutation SendSignature($id: Int!){
        sendSignature(id: $id){
            id
        }
    }
`;

export default graphql(sendSignature, {
    name: 'sendSignature'
})(SignatureStepTwo);