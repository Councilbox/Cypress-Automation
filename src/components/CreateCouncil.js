import React, { Component } from "react";
import { connect } from "react-redux";
import { LoadingMainApp } from "../displayComponents";
import { withRouter } from "react-router-dom";
import { createCouncil } from "../queries";
import { graphql } from 'react-apollo';
import { bHistory } from "../containers/App";

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
		return response.data.createCouncil.id;
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
			bHistory.push(`/company/${this.props.match.params.company}/council/${newCouncilId}`);
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
