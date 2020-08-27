import React from "react";
import { LoadingMainApp } from "../../../displayComponents";
import { withRouter } from "react-router-dom";
import { graphql } from 'react-apollo';
import { bHistory } from "../../../containers/App";
import gql from 'graphql-tag';

class CreateSignature extends React.Component {
	state = {
		creating: false
	};

	createSignature = async companyId => {
		const response = await this.props.createSignature({
			variables: {
				companyId: +companyId
			}
		});
		return response.data.createSignature.id;
	}

	async componentDidMount() {
		if (this.props.match.url === `/company/${this.props.match.params.company}/signature/new` && !this.state.creating) {
			this.setState({
				creating: true
			});
			let newSignatureId = await this.createSignature(
				this.props.match.params.company
			);
			bHistory.replace(`/company/${this.props.match.params.company}/signature/${newSignatureId}`);
		}
		//Nueva forma de firmar signatureIvCert
		if (this.props.match.url === `/company/${this.props.match.params.company}/signatureIvCert/new` && !this.state.creating) {
			this.setState({
				creating: true
			});
			let newSignatureId = await this.createSignature(
				this.props.match.params.company
			);
			bHistory.replace(`/company/${this.props.match.params.company}/signatureIvCert/${newSignatureId}`);
		}
	}

	render() {
		return <LoadingMainApp />;
	}
}

const createSignature = gql`
	mutation CreateSignature($companyId: Int!){
		createSignature(companyId: $companyId){
			id
		}
	}
`;


export default graphql(createSignature, {
	name: 'createSignature'
})(withRouter(CreateSignature));
