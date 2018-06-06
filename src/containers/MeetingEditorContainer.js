import React from "react";
import MeetingEditorPage from "../components/meeting/editor/MeetingEditorPage";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { graphql } from "react-apollo";
import { LoadingMainApp } from "../displayComponents";
import { council } from "../queries";

const MeetingEditorContainer = ({
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

	return (
		<MeetingEditorPage
			translate={translate}
			councilState={data.council.state}
			step={+data.council.step}
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
})(connect(mapStateToProps)(withRouter(MeetingEditorContainer)));
