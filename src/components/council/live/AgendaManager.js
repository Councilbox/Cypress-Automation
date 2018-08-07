import React from "react";
import AgendaDetailsSection from "./AgendaDetailsSection";
import AgendaSelector from "./AgendaSelector";
import { Card } from "material-ui";
import { graphql } from "react-apollo";
import { agendaManager } from "../../../queries";
import { LoadingSection, Scrollbar } from "../../../displayComponents";

class AgendaManager extends React.Component {

	state = {
		selectedPoint: 0
	};

	changeSelectedPoint = index => {
		this.setState({
			selectedPoint: index
		});
	};

	nextPoint = () => {
		if(this.state.selectedPoint < this.props.data.agendas.length - 1){
			this.setState({
				selectedPoint: this.state.selectedPoint + 1
			});
		}
	}

	handleKeyPress = event => {
		const key = event.nativeEvent;
		const { selectedPoint } = this.state;

		if (key.altKey) {
		} else {
			switch (key.keyCode) {
				case 38:
					if (selectedPoint > 0) {
						this.changeSelectedPoint(selectedPoint - 1);
					}
					break;
				case 40:
					if (selectedPoint < this.props.council.agendas.length - 1) {
						this.changeSelectedPoint(selectedPoint + 1);
					}
					break;
				default:
					return;
			}
		}
	};

	render() {
		const { council, translate, company } = this.props;

		if (this.props.data.loading) {
			return <LoadingSection />;
		}

		const { agendas } = this.props.data;


		if (this.props.fullScreen) {
			return (
				<Card
					style={{
						width: "100%",
						height: "calc(100vh - 3em)",
						overflow: "hidden",
						backgroundColor: "white"
					}}
					onClick={this.props.openMenu}
				>
					<Scrollbar>
						<AgendaSelector
							agendas={agendas}
							company={company}
							council={council}
							votingTypes={this.props.data.votingTypes}
							companyStatutes={this.props.data.companyStatutes}
							selected={this.state.selectedPoint}
							onClick={this.changeSelectedPoint}
							translate={translate}
							councilID={council.id}
							refetch={this.props.refetch}
						/>
					</Scrollbar>
				</Card>
			);
		}

		return (
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "row"
				}}
			>
				<Card
					style={{
						width: "5em",
						height: "100%",
						overflow: "auto",
						backgroundColor: "white"
					}}
				>
					<Scrollbar>
						<AgendaSelector
							agendas={agendas}
							company={company}
							council={council}
							votingTypes={this.props.data.votingTypes}
							companyStatutes={this.props.data.companyStatutes}
							majorityTypes={this.props.data.majorityTypes}
							selected={this.state.selectedPoint}
							onClick={this.changeSelectedPoint}
							translate={translate}
							councilID={council.id}
							refetch={this.props.refetch}
						/>
					</Scrollbar>
				</Card>
				<div
					style={{
						width: "94%",
						height: "calc(100vh - 3em)",
						padding: "0",
						display: "flex",
						flexDirection: "row",
						outline: 0
					}}
					tabIndex="0"
					onKeyUp={this.handleKeyPress}
				>
					<AgendaDetailsSection
						ref={agendaDetails =>
							(this.agendaDetails = agendaDetails)
						}
						recount={this.props.recount}
						council={council}
						agendas={agendas}
						nextPoint={this.nextPoint}
						data={this.props.data}
						selectedPoint={this.state.selectedPoint}
						majorityTypes={this.props.data.majorityTypes}
						participants={this.props.participants}
						councilID={this.props.councilID}
						translate={translate}
						refetch={this.props.refetch}
					/>
				</div>
			</div>
		);
	}
}

export default graphql(agendaManager, {
	options: props => ({
		variables: {
			companyId: props.company.id,
			councilId: props.council.id
		}
	})
})(AgendaManager);
