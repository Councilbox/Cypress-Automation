import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton } from '../../../../displayComponents';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import EditorStepLayout from '../../../council/editor/EditorStepLayout';
import SignatureParticipants from './SignatureParticipants';

class SignatureStepTwo extends React.Component {
    state = {
        loading: false
    }

    updateState = object => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        });
    }

    sendSignature = async () => {
        this.setState({
            loading: true
        });
        const response = await this.props.sendSignature({
            variables: {
                id: this.props.signature.id
            }
        });
        if(response.data.sendSignature.success){
            this.setState({
                loading: false
            });
            this.props.refetch();
        }
    }

    render(){
        const { translate } = this.props;
        const primary = getPrimary();
        const secondary = getSecondary();
        return(
            <EditorStepLayout
                body={
                    <div>
                        <SignatureParticipants
                            company={this.props.company}
                            refetch={this.props.refetch}
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
                            textStyle={{ color: 'white', textTransform: 'none', fontWeight: '700' }}
                            buttonStyle={{ marginRight: '0.8em' }}
                            onClick={this.props.prevStep}
                        />
                        <BasicButton
                            text={translate.save}
                            color={secondary}
                            textStyle={{ color: 'white', textTransform: 'none', fontWeight: '700' }}
                            onClick={this.saveSignature}
                        />
                        <BasicButton
                            text={translate.new_send_to_sign}
                            color={primary}
                            loading={this.state.loading}
                            textStyle={{ color: 'white', textTransform: 'none', fontWeight: '700' }}
                            buttonStyle={{ marginLeft: '0.8em' }}
                            onClick={this.sendSignature}
                        />
                    </div>
                }
            />
        );
    }
}

const sendSignature = gql`
    mutation SendSignature($id: Int!){
        sendSignature(id: $id){
            success
        }
    }
`;

export default graphql(sendSignature, {
    name: 'sendSignature'
})(SignatureStepTwo);
