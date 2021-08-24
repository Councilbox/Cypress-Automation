import React from 'react';
import { Tooltip } from 'material-ui';
import { AgendaNumber, Icon } from '../../../displayComponents';
import { getPrimary, getSecondary } from '../../../styles/colors';
import ReorderPointsModal from '../agendas/ReorderPointsModal';
import * as CBX from '../../../utils/CBX';
import { AGENDA_TYPES, AGENDA_STATES, COUNCIL_STATES } from '../../../constants';
import { AddAgendaPoint } from '../editor/agenda/StepAgenda';

const AgendaSelector = ({
	agendas, translate, council, onClick, selected, stylesDiv, ...props
}) => {
	const canAddPoints = () => {
		const activePoint = agendas.find(agenda => agenda.pointState === AGENDA_STATES.DISCUSSION);
		if (activePoint) {
			return CBX.canAddPoints(council)
				&& activePoint.subjectType !== AGENDA_TYPES.PRIVATE_ACT
				&& activePoint.subjectType !== AGENDA_TYPES.PUBLIC_ACT;
		}
		return CBX.canAddPoints(council);
	};

	return (
		<div
			style={{
				width: '100%',
				paddingBottom: '2em',
				flexDirection: 'column',
				display: 'flex',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					marginBottom: '0.8em',
					marginTop: '1.2em',
					flexDirection: 'column',
					display: 'flex',
					alignItems: 'center',
				}}
			>
				{agendas.map((agenda, index) => (
					<React.Fragment key={`agendaSelector${agenda.id}`}>
						{index > 0 && (
							<div
								style={{
									margin: 0,
									padding: 0,
									width: '1px',
									borderRight: `3px solid ${getSecondary()}`,
									height: '0.8em'
								}}
							/>
						)}
						<AgendaNumber
							index={agenda.agendaSubject}
							open={agenda.pointState === 1}
							active={selected === index}
							activeColor={getPrimary()}
							voting={agenda.votingState === 1 && agenda.subjectType !== 0}
							translate={translate}
							secondaryColor={getSecondary()}
							onClick={() => onClick(index)}
						/>
					</React.Fragment>
				))}
			</div>
			{(CBX.councilHasSession(council) || council.state < COUNCIL_STATES.ROOM_OPENED)
				&& <React.Fragment>
					{canAddPoints(council) && (
						<div style={{ marginBottom: '0.8em' }}>
							<AddAgendaPoint
								translate={translate}
								Component={localProps => (
									<Tooltip
										title={translate.add_agenda_point}
										placement="top-end"
									>
										<div>
											<AgendaNumber
												index={'+'}
												onClick={localProps.onClick}
												active={false}
												secondaryColor={'#888888'}
											/>
										</div>
									</Tooltip>
								)}
								statute={council.statute}
								companyStatutes={props.companyStatutes}
								majorityTypes={props.majorityTypes}
								votingTypes={props.votingTypes}
								council={{
									...council,
									agendas
								}}
								company={props.company}
								refetch={props.refetch}
							/>
						</div>
					)}

					{CBX.canReorderPoints(council) && (
						<ReorderPointsModal
							translate={translate}
							agendas={agendas}
							councilID={council.id}
							refetch={props.refetch}
						>
							<Tooltip title={translate.reorder_agenda_points}
								placement="top-end"
							>
								<div>
									<AgendaNumber
										index={
											<Icon
												alt="reorder icon"
												style={{
													fontSize: '16px',
													color: '#888888',
													height: 'auto'
												}}
											>low_priority</Icon>
										}
										active={false}
										secondaryColor={'#888888'}
									/>
								</div>
							</Tooltip>
						</ReorderPointsModal>
					)}
				</React.Fragment>
			}
		</div>
	);
};


export default AgendaSelector;
