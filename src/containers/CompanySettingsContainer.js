import React, { Component } from "react";
import CompanySettingsPage from "../components/company/settings/CompanySettingsPage";
import { connect } from "react-redux";

class CompanySettingsContainer extends Component {
	render() {
		return (
			<CompanySettingsPage
				linkButton={true}
				main={this.props.main}
				translate={this.props.translate}
				company={this.props.company}
				user={this.props.user}
			/>
		);
	}
}

const mapStateToProps = state => ({
	main: state.main,
	translate: state.translate,
	user: state.user,
	company: state.companies.list[state.companies.selected]
});

export default connect(mapStateToProps)(CompanySettingsContainer);
