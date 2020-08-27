import React from 'react';
import { graphql, compose } from 'react-apollo';
import { signature } from '../../../queries/signature';
import { LoadingSection } from '../../../displayComponents';
import { SIGNATURE_STATES } from '../../../constants';
import SignatureEditorPage from './editor/SignatureEditorPage';
import SignatureConfirmed from './confirmed/SignatureConfirmed';
import withSharedProps from '../../../HOCs/withSharedProps';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

const SignatureRootPage = props => {
    const { data } = props;

    if(data.loading){
        return <LoadingSection />
    }

    if(data.signature.state === SIGNATURE_STATES.DRAFT){
        return <SignatureEditorPage {...props} />;
    }

    if(data.signature.state === SIGNATURE_STATES.SENT){
        return <SignatureConfirmed {...props} />;
    }

    if(data.signature.state === SIGNATURE_STATES.COMPLETED){
        return <SignatureConfirmed {...props} />;
    }
}


export default compose(
    graphql(signature, {
        options: props => ({
            variables: {
                id: +props.match.params.id
            },
            fetchPolicy: 'network-only',
            pollInterval: 8000
        })
    })
)(withSharedProps()(withRouter(SignatureRootPage)));