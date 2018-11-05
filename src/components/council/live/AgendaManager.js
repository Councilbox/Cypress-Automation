import React from "react";
import AgendaDetailsSection from "./AgendaDetailsSection";
import AgendaSelector from "./AgendaSelector";
import { Card } from "material-ui";
import { graphql } from "react-apollo";
import { agendaManager } from "../../../queries";
import { LoadingSection, Scrollbar } from "../../../displayComponents";
import { AGENDA_STATES } from '../../../constants';
import { isMobile } from 'react-device-detect';

class AgendaManager extends React.Component {

	state = {
		selectedPoint: 0,
		loaded: false
	};

	static getDerivedStateFromProps(nextProps, prevState){
		if(!nextProps.data.loading){
			return {
				loaded: true
			}
		}

		return null;
	}

	componentDidUpdate(prevProps, prevState){
		if(!prevState.loaded && this.state.loaded){
			this.setState({
				selectedPoint: this.getInitialSelectedPoint()
			});
		}
	}

	getInitialSelectedPoint = () => {
		const index = this.props.data.agendas.findIndex(agenda => agenda.pointState === AGENDA_STATES.DISCUSSION);
		return index !== -1? index : 0;
	}

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

		if (!key.altKey) {
			switch (key.keyCode) {
				case 38:
					if (selectedPoint > 0) {
						this.changeSelectedPoint(selectedPoint - 1);
					}
					break;
				case 40:
					if (selectedPoint < this.props.data.agendas.length - 1) {
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

		if (!this.props.data.agendas) {
			return <LoadingSection />;
		}

		const { agendas } = this.props.data;


		if (this.props.fullScreen) {
			return (
				<div
					style={{
						width: "calc(100% - 2px)",
						height: "100%",
						maxHeight: 'calc(100vh - 3em)',
						borderLeft: '1px solid gainsboro',
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
							fullScreen={true}
							votingTypes={this.props.data.votingTypes}
							companyStatutes={this.props.data.companyStatutes}
							selected={this.state.selectedPoint}
							onClick={this.changeSelectedPoint}
							translate={translate}
							councilID={council.id}
							refetch={this.props.data.refetch}
						/>
					</Scrollbar>
				</div>
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
						width: isMobile? '3em' : "5em",
						height: "100%",
						borderLeft: '1px solid gainsboro',
						overflow: "auto",
						backgroundColor: "white"
					}}
				>
					<Scrollbar autoHide={true}>
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
							refetch={this.props.data.refetch}
						/>
					</Scrollbar>
				</Card>
				<div
					style={{
						width: `calc(100% - ${isMobile? '3em' : '5em'})`,
						height: "100%",
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
						votingTypes={this.props.data.votingTypes}
						participants={this.props.participants}
						councilID={this.props.councilID}
						translate={translate}
						refetchCouncil={this.props.refetch}
						refetch={this.props.data.refetch}
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
		},
		pollInterval: 5000
	})
})(AgendaManager);
