import React from "react";
import * as mainActions from "../../actions/mainActions";
import * as companyActions from "../../actions/companyActions";
import TopSectionBlocks from "./TopSectionBlocks";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { darkGrey, lightGrey } from "../../styles/colors";

class Dashboard extends React.Component {
	state = {
		height: 10
	}
	componentWillReceiveProps(nextProps) {
		if (!this.props.company.id && nextProps.company.id) {
			this.props.companyActions.getRecount(nextProps.company.id);
		}
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
					{/*<BottomSection />*/}
				</div>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(mainActions, dispatch),
		companyActions: bindActionCreators(companyActions, dispatch)
	};
}

export default connect(
	null,
	mapDispatchToProps
)(Dashboard);
