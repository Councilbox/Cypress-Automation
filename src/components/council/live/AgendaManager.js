import React from "react";
import AgendaDetailsSection from "./AgendaDetailsSection";
import AgendaSelector from "./AgendaSelector";
import { Card } from "material-ui";
import { graphql } from "react-apollo";
import { agendaManager } from "../../../queries";
import { LoadingSection } from "../../../displayComponents";
import { checkCouncilState } from '../../../utils/CBX';

class AgendaManager extends React.Component {

	state = {
		selectedPoint: 0
	};

	changeSelectedPoint = index => {
		this.setState({
			selectedPoint: index
		});
	};

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
		const { agendas } = this.props.council;

		if (this.props.data.loading) {
			return <LoadingSection />;
		}

		if (this.props.fullScreen) {
			return (
				<Card
					style={{
						width: "100%",
						height: "100%",
						overflow: "auto",
						backgroundColor: "white"
					}}
					onClick={this.props.openMenu}
				>
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
						data={this.props.data}
						selectedPoint={this.state.selectedPoint}
						attachments={council.agenda_attachments}
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
			companyId: props.company.id
		}
	})
})(AgendaManager);
