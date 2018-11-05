import React from "react";
import OpenRoomButton from "./OpenRoomButton";
import StartCouncilButton from "./StartCouncilButton";
import EndCouncilButton from "./EndCouncilButton";
import ToggleAgendaButton from "./ToggleAgendaButton";
import ToggleVotingsButton from "./ToggleVotingsButton";
import CouncilMenu from './councilMenu/CouncilMenu';
import * as CBX from "../../../utils/CBX";
import { graphql } from 'react-apollo';
import { AGENDA_TYPES, AGENDA_STATES } from "../../../constants";
import { MenuItem } from 'material-ui';
import ActPointStateManager from './act/ActPointStateManager';
import ActPointInfoDisplay from './act/ActPointInfoDisplay';
import { Collapse } from 'react-collapse';
import { BasicButton, Grid, GridItem, SelectInput } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import AgendaDetailsTabs from './AgendaDetailsTabs';
import { updateAgenda } from "../../../queries/agenda";


class AgendaDetailsSection extends React.Component {
	state = {
		openIndex: 1,
		expanded: false,
		subjectType: this.props.agendas[this.props.selectedPoint].subjectType
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.agendas) {
			const openAgenda = nextProps.agendas.find(
				(agenda, index) =>
					agenda.pointState === 1 ||
					(agenda.pointState === 0 &&
						nextProps.agendas[index > 0 ? index - 1 : 0]
							.pointState === 2)
			);
			if (openAgenda) {
				this.setState({
					openIndex: openAgenda.orderIndex,
					expanded: false,
					subjectType: nextProps.agendas[nextProps.selectedPoint].subjectType
				});
			} else {
				this.setState({
					openIndex: 1,
					expanded: false,
					subjectType: nextProps.agendas[nextProps.selectedPoint].subjectType
				});
			}
		}
	}

	changeSubjectType = subjectType => {
		this.setState({
			subjectType: subjectType
		}, () => this.updateSubjectType())
	}

	toggleDescription = () => {
		const newValue = !this.state.expanded;
		this.setState({
			expanded: newValue
		});
	}

	updateSubjectType = async () => {
		const response = await this.props.updateAgenda({
			variables: {
				agenda: {
					id: this.props.agendas[this.props.selectedPoint].id,
					councilId: this.props.agendas[this.props.selectedPoint].councilId,
					subjectType: this.state.subjectType
				}
			}
		});
		if (response) {
			this.props.refetch();
		}
	};

	render() {
		const {
			translate,
			council,
			agendas,
			participants,
			refetch
		} = this.props;
		const councilStarted = CBX.councilStarted(council);
		const agenda = agendas[this.props.selectedPoint];
		const filteredTypes = CBX.filterAgendaVotingTypes(this.props.votingTypes, council.statute);
		const smallLayout = window.innerWidth < 500;
		const normalLayout = window.innerWidth > 750;

		return (
			<div
				style={{
					width: "100%",
					height: "100%",
					margin: 0,
					paddingLeft: "1px",
					overflow: "hidden",
					overflowX: 'hidden',
					outline: 0
				}}
				tabIndex="0"
				onKeyUp={this.handleKeyPress}
			>
				<Grid
					style={{
						width: "100%",
						padding: "1em 0 1em 1em",
					}}
				>
					<GridItem xs={smallLayout? 12 : 8} md={9} style={{ display: 'flex', minHeight: '6.5em', flexDirection: 'column', justifyContent: 'space-between' }}>
						<div style={{ fontWeight: '700',  width: '100%', display: 'flex', justifyContent: 'space-between' }}>
							<div>
								{`${agenda.orderIndex} - ${agenda.agendaSubject}`}
							</div>
							<div style={{paddingRight: '1em'}}>
								{(agenda.pointState === AGENDA_STATES.INITIAL && agenda.votingState === AGENDA_STATES.INITIAL)?
									<SelectInput
										floatingText={translate.type}
										value={"" + this.state.subjectType}
										onChange={event => this.changeSubjectType(+event.target.value)}
									>
										{filteredTypes.map(voting => {
											return (
												<MenuItem
													value={"" + voting.value}
													key={`voting${voting.value}`}
												>
													{translate[voting.label]}
												</MenuItem>
											);
										})}
									</SelectInput>
								:
									translate[CBX.getAgendaTypeLabel(agenda)]
								}
							</div>
						</div>
						<Grid>
							<GridItem xs={normalLayout? 3 : 12} md={normalLayout? 3 : 12} lg={3} style={{display: 'flex', alignItems: 'center'}}>
								{agenda.subjectType !== CBX.getActPointSubjectType() &&
									<React.Fragment>
										{agenda.description?
											<BasicButton
												text={translate.description}
												color={'white'}
												textStyle={{
													textTransform: 'none',
													fontWeight: '700',
													color: getSecondary(),
													fontSize: "0.85em",
												}}
												onClick={() => this.setState({
													expanded: !this.state.expanded
												})}
											/>
										:
											translate.no_description
										}
									</React.Fragment>
								}
							</GridItem>
							<GridItem xs={normalLayout? 4 : 12} md={normalLayout? 4 : 5} lg={4} style={{ display: 'flex', alignItems: 'center' }}>
								{councilStarted && !CBX.agendaClosed(agenda) && (
									<React.Fragment>
										{agenda.subjectType === AGENDA_TYPES.PUBLIC_ACT || agenda.subjectType === AGENDA_TYPES.PRIVATE_ACT ?
											<ActPointStateManager
												council={council}
												agenda={agenda}
												translate={translate}
												refetch={this.props.refetchCouncil}
												active={agenda.orderIndex === this.state.openIndex}
											/>
											:
											<ToggleAgendaButton
												agenda={agenda}
												nextPoint={this.props.nextPoint}
												translate={translate}
												refetch={this.props.data.refetch}
												active={agenda.orderIndex === this.state.openIndex}
											/>
										}
									</React.Fragment>
								)}
							</GridItem>
							<GridItem xs={normalLayout? 5 : 12} md={normalLayout? 5 : 7} lg={5} style={{ display: 'flex', alignItems: 'center' }}>
								{CBX.showAgendaVotingsToggle(council, agenda) && agenda.subjectType !== CBX.getActPointSubjectType() ? (
									<ToggleVotingsButton
										council={council}
										agenda={agenda}
										translate={translate}
										refetch={refetch}
									/>
								) : <div />}
							</GridItem>
						</Grid>
					</GridItem>
					<GridItem xs={smallLayout? 12 : 4} md={3} style={{ borderLeft: '1px solid gainsboro', display: 'flex', flexDirection: 'column' }}>
						<div style={{marginLeft: 'auto'}}>
							{council.state === 20 || council.state === 30 ? (
								!CBX.councilStarted(council) ? (
									<div>
										<StartCouncilButton
											recount={this.props.recount}
											council={council}
											translate={translate}
											participants={participants}
											refetch={this.props.refetchCouncil}
										/>
									</div>
								) : (
										<div>
											<EndCouncilButton
												council={{
													...council,
													agendas: this.props.agendas
												}}
												translate={translate}
											/>
										</div>
									)
							) : (
									<OpenRoomButton
										translate={translate}
										council={council}
										refetch={this.props.refetchCouncil}
									/>
								)
							}
						</div>
						<div style={{marginLeft: 'auto', marginTop: '0.5em' }}>
							<CouncilMenu
								council={council}
								translate={translate}
							/>
						</div>
					</GridItem>
				</Grid>
				<div style={{ borderTop: '1px solid gainsboro', width: '100%', height: `calc(100vh - ${smallLayout? '20em' : '11em'})`, overflow: 'hidden' }}>
						<Collapse isOpened={this.state.expanded}>
							<div
								style={{
									fontSize: "0.9em",
									padding: '1em',
									paddingBottom: '1.5em',
									lineHeight: '1.2em',
									width: '100%',
									backgroundColor: 'white',
								}}
								onClick={this.toggleDescription}
								dangerouslySetInnerHTML={{
									__html: agenda.description
								}}
							/>
						</Collapse>
						{agenda.subjectType !== CBX.getActPointSubjectType() ?
							<AgendaDetailsTabs
								key={`agenda_${agenda.id}`}
								translate={translate}
								agenda={agenda}
								council={council}
								refetch={this.props.refetch}
                        		data={this.props.data}
								recount={this.props.recount}
								majorityTypes={this.props.majorityTypes}
							/>
						:
							<ActPointInfoDisplay
								council={council}
								data={this.props.data}
								agenda={agenda}
								companyID={this.props.council.companyId}
								translate={translate}
								refetch={this.props.refetch}
							/>
						}
				</div>

			</div>
		);
	}
}

export default graphql(updateAgenda, {
	name: 'updateAgenda'
})(AgendaDetailsSection);