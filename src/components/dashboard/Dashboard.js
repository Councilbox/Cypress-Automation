import React from "react";
import * as companyActions from "../../actions/companyActions";
import TopSectionBlocks from "./TopSectionBlocks";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { darkGrey, lightGrey } from "../../styles/colors";
import withSharedProps from '../../HOCs/withSharedProps';

class Dashboard extends React.Component {
	state = {
		height: 10
	}
	
	render() {
		const { translate, company, user } = this.props;
		return (
			<div
				style={{
					overflowY: "auto",
					width: "100%",
					backgroundColor: "white",
					padding: 0,
					height: "100%",
					display: "flex",
					alignItems: "center",
					flexDirection: "column"
				}}
				className="container-fluid"
			>
				<div className="row" style={{ width: "100%" }}>
					<div
						style={{
							width: "100%",
							height: "calc(100vh - 3em)",
							backgroundColor: lightGrey,
							display: "flex",
							alignItems: "center",
							flexDirection: "column",
							paddingBottom: "5em"
						}}
					>
						<div
							style={{
								padding: "1em",
								paddingTop: "2em"
							}}
						>
							{`${translate.welcome} ${this.props.user.name}`}.
						</div>
						<div
							style={{
								fontWeight: "700",
								color: darkGrey,
								padding: "2em",
								fontSize: "1em",
								paddingTop: "0.5em"
							}}
						>
							Te recomendamos que comiences revisando la
							configuración de tu empresa
						</div>
						<TopSectionBlocks
							translate={translate}
							company={company}
							user={user}
						/>
					</div>
				</div>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		companyActions: bindActionCreators(companyActions, dispatch)
	};
}

export default connect(null, mapDispatchToProps)(withSharedProps()(Dashboard));
