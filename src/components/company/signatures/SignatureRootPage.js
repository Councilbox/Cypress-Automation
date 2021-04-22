import React from 'react';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { withRouter } from 'react-router-dom';
import { signature } from '../../../queries/signature';
import { LoadingSection } from '../../../displayComponents';
import { SIGNATURE_STATES } from '../../../constants';
import SignatureEditorPage from './editor/SignatureEditorPage';
import SignatureConfirmed from './confirmed/SignatureConfirmed';
import withSharedProps from '../../../HOCs/withSharedProps';

const SignatureRootPage = props => {
	const { data } = props;

	if (data.loading) {
		return <LoadingSection />;
	}

	if (data.signature.state === SIGNATURE_STATES.DRAFT) {
		return <SignatureEditorPage {...props} />;
	}

	if (data.signature.state === SIGNATURE_STATES.SENT) {
		return <SignatureConfirmed {...props} />;
	}

	if (data.signature.state === SIGNATURE_STATES.COMPLETED) {
		return <SignatureConfirmed {...props} />;
	}
};


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
