import React from 'react';
import { BasicButton } from '../../../../displayComponents';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import EditorStepLayout from '../../../council/editor/EditorStepLayout';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import SignatureParticipants from './SignatureParticipants';

const SignatureStepTwoIvnosys = ({ ...props }) => {
    const [state, setState] = React.useState({
        loading: false
    })

    const updateState = object => {
        setState({
            ...state,
            data: {
                ...state.data,
                ...object
            }
        });
    }

    const sendSignature = async () => {
        setState({
            ...state,
            loading: true
        });
        const response = await props.sendSignature({
            variables: {
                id: props.signature.id
            }
        });
        if (response.data.sendSignature.success) {
            setState({
                ...state,
                loading: false
            })
            props.refetch();
        }
    }

    const { translate } = props;
    const primary = getPrimary();
    const secondary = getSecondary();
    
    return (
        <EditorStepLayout
            body={
                <div>
                    <SignatureParticipants
                        company={props.company}
                        refetch={props.refetch}
                        signature={props.signature}
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
                        onClick={props.prevStep}
                    />
                    <BasicButton
                        text={translate.save}
                        color={secondary}
                        textStyle={{ color: 'white', textTransform: 'none', fontWeight: '700' }}
                        //////cambiar esto
                        // onClick={saveSignature}
                    />
                    <BasicButton
                        text={translate.new_send_to_sign}
                        color={primary}
                        loading={state.loading}
                        textStyle={{ color: 'white', textTransform: 'none', fontWeight: '700' }}
                        buttonStyle={{ marginLeft: '0.8em' }}
                        onClick={sendSignature}
                    />
                </div>
            }
        />
    )
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
})(SignatureStepTwoIvnosys);