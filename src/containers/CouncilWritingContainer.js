import React from "react";
import CouncilActPage from "../components/council/writing/CouncilActPage";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const CouncilWritingContainer = ({
	main,
	company,
	user,
	council,
	match,
	translate
}) => {
	return (
		<CouncilActPage
			translate={translate}
			companyID={match.params.company}
			councilID={match.params.council}
		/>
	);
};

const mapStateToProps = state => ({
	translate: state.translate
});

export default connect(mapStateToProps)(withRouter(CouncilWritingContainer));
