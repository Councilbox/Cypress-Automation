import React from "react";
import CouncilFinishedPage from "../components/council/writing/CouncilFinishedPage";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const CouncilFinishedContainer = ({
	company,
	match,
	translate
}) => {
	return (
		<CouncilFinishedPage
			translate={translate}
			company={company}
			councilID={match.params.council}
		/>
	);
};

const mapStateToProps = state => ({
	translate: state.translate,
	company: state.companies.list[state.companies.selected]
});

export default connect(mapStateToProps)(withRouter(CouncilFinishedContainer));
