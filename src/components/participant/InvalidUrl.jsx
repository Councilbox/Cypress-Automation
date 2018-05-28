import React from "react";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";
import { darkGrey, secondary } from "../../styles/colors";
import Header from "./Header";

class InvalidUrl extends React.Component {
	render() {
		return (
			<div
				style={{
					height: "100vh",
					width: "100vw"
				}}
			>
				<Header />
				<div
					style={{
						display: "flex",
						height: "calc(100% - 48px)",
						width: "100%",
						alignItems: "center",
						justifyContent: "center"
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							textAlign: "center"
						}}
					>
						<FontAwesome
							name={"exclamation-circle"}
							style={{
								color: secondary,
								fontSize: "70px"
							}}
						/>
						<h1 style={{ color: secondary }}>
							{this.props.translate.invalid_url}
						</h1>
						<h3 style={{ color: darkGrey }}>
							{
								this.props.translate
									.access_from_mail_check_correctly_copied
							}
						</h3>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	translate: state.translate
});

export default connect(mapStateToProps)(InvalidUrl);
