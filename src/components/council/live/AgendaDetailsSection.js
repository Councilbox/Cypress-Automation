import React from "react";
import AgendaAttachmentsManager from "./AgendaAttachmentsManager";
import ActAgreements from "./ActAgreements";
import OpenRoomButton from "./OpenRoomButton";
import StartCouncilButton from "./StartCouncilButton";
import EndCouncilButton from "./EndCouncilButton";
import ToggleAgendaButton from "./ToggleAgendaButton";
import ToggleVotingsButton from "./ToggleVotingsButton";
import Comments from "./Comments";
import CouncilMenu from './councilMenu/CouncilMenu';
import Votings from "./Votings";
import * as CBX from "../../../utils/CBX";
import { AGENDA_TYPES } from "../../../constants";
import ActPointStateManager from './act/ActPointStateManager';
import ActPointInfoDisplay from './act/ActPointInfoDisplay';
import { Collapse } from 'react-collapse';
import { BasicButton, Grid, GridItem, Scrollbar } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import RecountSection from './RecountSection';


class AgendaDetailsSection extends React.Component {
	state = {
		openIndex: 1,
		expanded: false
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
					expanded: false
				});
			} else {
				this.setState({
					openIndex: 1,
					expanded: false
				});
			}
		}
	}

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
					<GridItem xs={12} md={9} style={{ display: 'flex', minHeight: '6.5em', flexDirection: 'column', justifyContent: 'space-between' }}>
						<div style={{ fontWeight: '700' }}>{`${agenda.orderIndex} - ${agenda.agendaSubject}`}</div>
						<Grid>
							<GridItem xs={12} md={12} lg={3}>
								<BasicButton
									text={translate.description}
									color={getSecondary()}
									textStyle={{
										textTransform: 'none',
										fontWeight: '700',
										color: 'white',
										fontSize: "0.85em",
									}}
									onClick={() => this.setState({
										expanded: !this.state.expanded
									})}
								/>
							</GridItem>
							<GridItem xs={12} md={5} lg={4} style={{ display: 'flex', alignItems: 'center' }}>
								{councilStarted && !CBX.agendaClosed(agenda) && (
									<React.Fragment>
										{agenda.subjectType === AGENDA_TYPES.PUBLIC_ACT || agenda.subjectType === AGENDA_TYPES.PRIVATE_ACT ?
											<ActPointStateManager
												council={council}
												agenda={agenda}
												translate={translate}
												refetch={this.props.refetchCouncil}
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
							<GridItem xs={12} md={7} lg={5} style={{ display: 'flex', alignItems: 'center' }}>
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
					<GridItem xs={12} md={3} style={{ borderLeft: '1px solid gainsboro', display: 'flex', flexDirection: 'column' }}>
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
				<div style={{ borderTop: '1px solid gainsboro', width: '100%', height: 'calc(100vh - 11em)', overflow: 'hidden' }}>
					<Scrollbar>
						<Collapse isOpened={this.state.expanded}>
							<div
								style={{
									fontSize: "0.9em",
									padding: '1em',
									paddingBottom: '1.5em',
									lineHeight: '1.2em',
									width: '100%',
									backgroundColor: 'white'
								}}
								onClick={() => this.setState({ expanded: !this.state.expanded })}
								dangerouslySetInnerHTML={{
									__html: agenda.description
								}}
							/>
						</Collapse>
						{agenda.subjectType !== CBX.getActPointSubjectType() ?
							<React.Fragment>
								<div
									style={{
										width: "100%",
									}}
									className="withShadow"
								>
									<ActAgreements
										agenda={agenda}
										key={`agendaAgreements_${agenda.id}`}
										translate={translate}
										council={this.props.council}
										refetch={this.props.refetch}
										data={this.props.data}
									/>
								</div>
								{CBX.councilStarted(council) &&
									<React.Fragment>
										{CBX.councilHasComments(council.statute) && CBX.showAgendaVotingsTable(agenda) && (
											<div
												style={{
													width: "100%",
													marginTop: "0.4em"
												}}
												className="withShadow"
											>
												<Comments
													agenda={agenda}
													council={council}
													translate={translate}
												/>
											</div>
										)}
										{CBX.showAgendaVotingsTable(agenda) && (
											<React.Fragment>
												{CBX.showAgendaVotingsTable(agenda) &&
													<React.Fragment>
														<div
															style={{
																width: "100%",
																marginTop: "0.4em"
															}}
															className="withShadow"
														>
															<RecountSection
																agenda={agenda}
																key={`agendaRecount_${agenda.id}`}
																council={council}
																translate={translate}
																recount={this.props.recount}
																refetch={this.props.refetch}
																majorityTypes={this.props.majorityTypes}
															/>
														</div>

														<div
															style={{
																width: "100%",
																marginTop: "0.4em"
															}}
															className="withShadow"
														>
															<Votings
																key={`agendaVotings_${agenda.id}`}
																ref={votings => (this.votings = votings)}
																refetch={this.props.refetch}
																agenda={agenda}
																translate={translate}
															/>
														</div>
													</React.Fragment>
												}
											</React.Fragment>
										)}
									</React.Fragment>
								}
								<div
									style={{
										width: "100%",
										marginTop: "0.4em"
									}}
									className="withShadow"
								>
									<AgendaAttachmentsManager
										attachments={agenda.attachments}
										translate={translate}
										key={`agendaAttachments_${agenda.id}`}
										councilID={this.props.council.id}
										refetch={this.props.refetch}
										agendaID={agenda.id}
									/>
								</div>
							</React.Fragment>
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
					</Scrollbar>
				</div>

			</div>
		);
	}
}

export default AgendaDetailsSection;

/* this.state.expanded?
	<div
		style={{
			fontSize: "0.9em",
			marginTop: "1em",
			lineHeight: '1.2em',
			width: '100%'
		}}
		onClick={() => this.setState({expanded: !this.state.expanded})}
		dangerouslySetInnerHTML={{
			__html: agenda.description
		}}
	/>
:
	<div onClick={() => this.setState({expanded: !this.state.expanded})}>
		<Truncate
			lines={4}
			dangerouslySetInnerHTML={{
				__html: agenda.description
			}}
		/>
	</div>

							<Collapse isOpened={true}>
							{this.state.expanded?
								<div
									style={{
										fontSize: "0.9em",
										marginTop: "1em",
										lineHeight: '1.2em',
										width: '100%'
									}}
									onClick={() => this.setState({expanded: !this.state.expanded})}
									dangerouslySetInnerHTML={{
										__html: agenda.description
									}}
								/>
							:
								<div onClick={() => this.setState({expanded: !this.state.expanded})}>
									<Truncate
										lines={4}
										dangerouslySetInnerHTML={{
											__html: agenda.description
										}}
									/>
								</div>
							}
						</Collapse>
 */
