import React from "react";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";
import { darkGrey, secondary, lightGrey } from "../../styles/colors";
import Header from "./Header";
import { printSessionExpiredError } from "../../utils/CBX";
import { PARTICIPANT_ERRORS } from "../../constants";
import { HEADER_HEIGHT } from "../../styles/constants";

const InvalidUrl = ({ error, test, translate }) => {

	const printError = () => {
		if(error && error.code === PARTICIPANT_ERRORS.REMOVED){
			return translate.participant_removed;
		}

		return printSessionExpiredError();
	}
	
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
					height: `calc(100% - ${HEADER_HEIGHT})`,
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
						{test?
							translate.test_link.toUpperCase()
						:
							translate.invalid_url
						}
					</h2>
					<h5 style={{ color: darkGrey }}>
						{test?
							translate.this_is_test_link
						:
							printError()
						}
					</h5>
				</div>
			</div>
		</div>
	)
}

const mapStateToProps = state => ({
	translate: state.translate
});

export default connect(mapStateToProps)(InvalidUrl);
