import React, { Component } from "react";
import SignUpPage from "../components/notLogged/signUp/SignUpPage";
import Header from "../components/Header";
import { connect } from "react-redux";

class SignUpContainer extends Component {
	render() {
		return (
			<div
				style={{
					height: "100vh",
					width: "100%"
				}}
			>
				<Header translate={this.props.translate} helpIcon />
				<SignUpPage
					main={this.props.main}
					translate={this.props.translate}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	main: state.main,
	translate: state.translate
});

export default connect(mapStateToProps)(SignUpContainer);
