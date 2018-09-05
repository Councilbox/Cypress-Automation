import React from "react";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";
import { darkGrey, secondary, lightGrey } from "../../styles/colors";
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
						backgroundColor: lightGrey,
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
						<h2 style={{ color: secondary }}>
							{this.props.translate.invalid_url}
						</h2>
						<h5 style={{ color: darkGrey }}>
							{
								this.props.translate
									.access_from_mail_check_correctly_copied
							}
						</h5>
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
