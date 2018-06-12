import React from "react";
import CouncilFinishedPage from "../components/council/writing/CouncilFinishedPage";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const CouncilFinishedContainer = ({
	main,
	company,
	user,
	council,
	match,
	translate
}) => {
	return (
		<CouncilFinishedPage
			translate={translate}
			companyID={match.params.company}
			councilID={match.params.council}
		/>
	);
};

const mapStateToProps = state => ({
	translate: state.translate
});

export default connect(mapStateToProps)(withRouter(CouncilFinishedContainer));
