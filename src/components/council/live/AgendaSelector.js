import React from "react";
import { AgendaNumber, Icon } from "../../../displayComponents";
import { getPrimary, getSecondary } from "../../../styles/colors";
import NewAgendaPointModal from "../editor/agenda/modals/NewAgendaPointModal";
import ReorderPointsModal from "../agendas/ReorderPointsModal";
import * as CBX from "../../../utils/CBX";
import { Tooltip } from "material-ui";
import { AGENDA_TYPES, AGENDA_STATES } from "../../../constants";
import { AddAgendaPoint } from "../editor/agenda/StepAgenda";

class AgendaSelector extends React.Component {

	canAddPoints = () => {
		const activePoint = this.props.agendas.find(agenda => agenda.pointState === AGENDA_STATES.DISCUSSION);
		if(activePoint){
			return CBX.canAddPoints(this.props.council) &&
				activePoint.subjectType !== AGENDA_TYPES.PRIVATE_ACT &&
				activePoint.subjectType !== AGENDA_TYPES.PUBLIC_ACT;
		}
		return CBX.canAddPoints(this.props.council)
	}

	render() {
		const { agendas, translate, council, onClick, selected } = this.props;

		return (
			<div
				style={{
					width: "100%",
					paddingBottom: "2em",
					flexDirection: "column",
					display: "flex",
					alignItems: "center",
				}}
			>
				<div
					style={{
						marginBottom: "0.8em",
						marginTop: '1.2em',
						flexDirection: "column",
						display: "flex",
						alignItems: "center"
					}}
				>
					{agendas.map((agenda, index) => {
						return (
							<React.Fragment key={`agendaSelector${agenda.id}`}>
								{index > 0 && (
									<div
										style={{
											margin: 0,
											padding: 0,
											width: "1px",
											borderRight: `3px solid ${getSecondary()}`,
											height: "0.8em"
										}}
									/>
								)}
								<AgendaNumber
									index={index + 1}
									open={agenda.pointState === 1}
									active={selected === index}
									activeColor={getPrimary()}
									voting={agenda.votingState === 1 && agenda.subjectType !== 0}
									translate={translate}
									secondaryColor={getSecondary()}
									onClick={() => onClick(index)}
								/>
							</React.Fragment>
						);
					})}
				</div>
				{this.canAddPoints(council) && (
					<div style={{ marginBottom: "0.8em" }}>
						<AddAgendaPoint
							translate={translate}
							Component={() => (
								<Tooltip
									title={translate.add_agenda_point}
									placement="top-end"
								>
									<div>
										<AgendaNumber
											index={"+"}
											active={false}
											secondaryColor={"#888888"}
										/>
									</div>
								</Tooltip>
							)}
							statute={council.statute}
							companyStatutes={this.props.companyStatutes}
							majorityTypes={this.props.majorityTypes}
							votingTypes={this.props.votingTypes}
							council={{
								...council,
								agendas
							}}
							company={this.props.company}
							refetch={this.props.refetch}
						/>
					</div>
				)}

				{CBX.canReorderPoints(council) && (
					<ReorderPointsModal
						translate={translate}
						agendas={agendas}
						councilID={this.props.councilID}
						refetch={this.props.refetch}
					>
						<Tooltip title={translate.reorder_agenda_points}>
							<div>
								<AgendaNumber
									index={
										<Icon
											alt="reorder icon"
											style={{
												fontSize: '16px',
												color: "#888888",
												height: "auto"
											}}
										>low_priority</Icon>
									}
									active={false}
									secondaryColor={"#888888"}
								/>
							</div>
						</Tooltip>
					</ReorderPointsModal>
				)}
			</div>
		);
	}
}

export default AgendaSelector;
