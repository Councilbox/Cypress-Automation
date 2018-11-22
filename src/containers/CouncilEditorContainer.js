import React from "react";
import CouncilEditorPage from "../components/council/editor/CouncilEditorPage";
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { LoadingMainApp } from "../displayComponents";
import { graphql } from "react-apollo";
import { council } from "../queries";

const CouncilEditorContainer = ({
	main,
	company,
	user,
	match,
	translate,
	data
}) => {
	if (!company || data.loading) {
		return <LoadingMainApp />;
	}

	if (!data.council){
		return <Redirect to="/" />
	}

	return (
		<CouncilEditorPage
			translate={translate}
			council={data.council}
			company={company}
			updateStep={() => data.refetch}
			councilID={match.params.id}
		/>
	);
};

const mapStateToProps = state => ({
	translate: state.translate,
	company: state.companies.list[state.companies.selected]
});

export default graphql(council, {
	options: props => ({
		variables: {
			id: props.match.params.id
		}
	})
})(connect(mapStateToProps)(withRouter(CouncilEditorContainer)));
