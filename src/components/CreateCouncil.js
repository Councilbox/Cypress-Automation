import React, { Component } from "react";
import { connect } from "react-redux";
import { LoadingMainApp } from "../displayComponents";
import { withRouter } from "react-router-dom";
import { createCouncil } from "../queries";
import { graphql } from 'react-apollo';
import { bHistory } from "../containers/App";
import { toast } from 'react-toastify';

class CreateCouncil extends Component {
	constructor(props) {
		super(props);
		this.state = {
			creating: false
		};
	}

	createCouncil = async (companyId) => {
		const response = await this.props.createCouncil({
			variables: {
				companyId: companyId
			}
		});
		if(response.data.createCouncil){
			return response.data.createCouncil.id;
		}else{
			return null;
		}
	}

	async componentDidMount() {
		if (
			this.props.match.url ===
			`/company/${this.props.match.params.company}/council/new` &&
			!this.state.creating
		) {
			console.log("create");
			this.setState({
				creating: true
			});
			let newCouncilId = await this.createCouncil(
				this.props.match.params.company
			);
			if(newCouncilId){
				bHistory.replace(`/company/${this.props.match.params.company}/council/${newCouncilId}`);
			}else{
				bHistory.replace(`/company/${this.props.match.params.company}`);
				toast.error('No dispone de ningún tipo de reunión, por favor añada uno antes de crear una nueva reunión');//TRADUCCION
			}
		}
	}

	render() {
		return <LoadingMainApp />;
	}
}

const mapStateToProps = state => ({
	main: state.main,
	company: state.company,
	user: state.user,
	council: state.council
});



export default graphql(createCouncil, { name: 'createCouncil' })(connect(
	mapStateToProps
)(withRouter(CreateCouncil)));
