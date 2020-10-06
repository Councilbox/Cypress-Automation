import React from "react";
import ToggleAgendaButton from "./ToggleAgendaButton";
import ToggleVotingsButton from "./ToggleVotingsButton";
import CouncilMenu from './councilMenu/CouncilMenu';
import * as CBX from "../../../utils/CBX";
import { graphql } from 'react-apollo';
import { AGENDA_TYPES, AGENDA_STATES } from "../../../constants";
import ActPointStateManager from './act/ActPointStateManager';
import ActPointInfoDisplay from './act/ActPointInfoDisplay';
import { Collapse } from 'react-collapse';
import { BasicButton, Grid, GridItem, TextInput } from '../../../displayComponents';
import { getSecondary, secondary, getPrimary } from '../../../styles/colors';
import AgendaDetailsTabs from './AgendaDetailsTabs';
import AgendaDescriptionModal from './AgendaDescriptionModal';
import { updateAgenda } from "../../../queries/agenda";
import PointEditorLive from './PointEditorLive';
import { useOldState } from "../../../hooks";
import CouncilStateButton from './menus/CouncilStateButton';
import ToolTip from "../../../displayComponents/Tooltip";
import PointEditor from "../editor/agenda/modals/PointEditor";

const calculateOpenIndex = agendas => {
	const openAgenda = agendas.find(
		(agenda, index) => agenda.pointState === 1 || (agenda.pointState === 0 && agendas[index > 0 ? index - 1 : 0].pointState === 2)
	);
	return openAgenda ? openAgenda.orderIndex : 1;
}


const AgendaDetailsSection = ({ agendas, translate, council, participants, refetch, updateAgenda, ...props }) => {
	const [openIndex, setOpenIndex] = React.useState(calculateOpenIndex(agendas));
	const [expanded, setExpanded] = React.useState(false);
	const [pointEditor, setPointEditor] = React.useState(false);
	const [pointNameEditor, setPointNameEditor] = React.useState(false);

	React.useEffect(() => {
		setOpenIndex(calculateOpenIndex(agendas));
	}, [agendas]);

	const showEditPointModal = () => {
		setPointEditor(true);
	}

	const closePointEditor = () => {
		setPointEditor(false);
	}

	const toggleDescription = () => {
		const newValue = !expanded;
		setExpanded(newValue);
	}

	const councilStarted = CBX.councilStarted(council);
	const agenda = agendas[props.selectedPoint];
	const smallLayout = window.innerWidth < 500;
	const normalLayout = window.innerWidth > 750;

	

	/*
		{!!state.editAgenda &&
			<PointEditor
				translate={translate}
				draftTypes={draftTypes}
				statute={council.statute}
				company={props.company}
				council={council}
				companyStatutes={data.companyStatutes}
				open={!!state.editAgenda}
				agenda={state.editAgenda}
				votingTypes={votingTypes}
				majorityTypes={majorityTypes}
				refetch={getData}
				requestClose={() =>
					setState({ editAgenda: null })
				}
			/>
		}
		{!!state.editCustomAgenda && (
			<CustomPointEditor
				translate={translate}
				draftTypes={draftTypes}
				statute={council.statute}
				company={props.company}
				council={council}
				companyStatutes={data.companyStatutes}
				open={!!state.editCustomAgenda}
				agenda={state.editCustomAgenda}
				votingTypes={votingTypes}
				majorityTypes={majorityTypes}
				refetch={getData}
				requestClose={() =>
					setState({ editCustomAgenda: null })
				}
			/>
		)}
	^*/
	
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
		>
			<Grid
				style={{
					width: "100%",
					padding: "1em 0 1em 1em",
				}}
			>
				<GridItem xs={12} md={12} style={{ display: 'flex', minHeight: '6.5em', flexDirection: 'column', justifyContent: 'space-between', paddingRight: '1em' }}>
					<div style={{ fontWeight: '700', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
						{pointNameEditor ?
							<EditTitlePoint
								title={agenda.agendaSubject}
								translate={translate}
								refetch={refetch}
								setPointNameEditor={setPointNameEditor}
								updateAgenda={updateAgenda}
								agenda={agenda}
								council={council}
							/>
							:
							<div style={{ display: "flex", alignItems: "center", maxWidth: 'calc(100% - 11em)' }}>
								<div>
									<ToolTip text={agenda.agendaSubject}>
										<div style={{
											display: '-webkit-box',
											maxWidth: '100%',
											WebkitLineClamp: 3,
											WebkitBoxOrient: 'vertical',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											paddingRight: "0.5em"
										}}
										>
											{`${agenda.agendaSubject}`}
										</div>

									</ToolTip>
								</div>
								{(agenda.pointState === AGENDA_STATES.INITIAL || props.root) &&
									<div>
										<i
											className="fa fa-pencil-square-o"
											aria-hidden="true"
											style={{
												color: secondary,
												fontSize: '1.3em',
												cursor: 'pointer',
												marginLeft: '0.2em'
											}}
											onClick={() => setPointNameEditor(true)}
										></i>
									</div>
								}
							</div>

						}
						<div style={{ paddingRight: '1em' }}>
							{(agenda.pointState === AGENDA_STATES.INITIAL && agenda.votingState === AGENDA_STATES.INITIAL && agenda.subjectType !== CBX.getActPointSubjectType()) ?
								<React.Fragment>
									<span style={{ cursor: 'pointer' }} onClick={showEditPointModal}>{translate[CBX.getAgendaTypeLabel(agenda)]}</span>
									<i
										className="fa fa-pencil-square-o"
										aria-hidden="true"
										onClick={showEditPointModal}
										style={{
											color: secondary,
											fontSize: '1.3em',
											cursor: 'pointer',
											marginLeft: '0.2em'
										}}
									></i>
									{/* <PointEditorLive
										translate={translate}
										agenda={agenda}
										key={`point_editor_${agenda.id}`}
										votingTypes={props.votingTypes}
										council={council}
										refetch={refetch}
										majorityTypes={props.majorityTypes}
										open={pointEditor}
										requestClose={}
									/> */}
									<PointEditor
										translate={translate}
										draftTypes={props.draftTypes}
										statute={council.statute}
										company={props.company}
										council={council}
										companyStatutes={props.companyStatutes}
										open={pointEditor}
										agenda={agenda}
										votingTypes={props.votingTypes}
										majorityTypes={props.majorityTypes}
										refetch={refetch}
										requestClose={closePointEditor}
									/>
								</React.Fragment>
								:
								translate[CBX.getAgendaTypeLabel(agenda)]
							}
						</div>
					</div>
					<Grid>
						<GridItem xs={normalLayout ? 3 : 12} md={normalLayout ? 3 : 12} lg={3} style={{ display: 'flex', alignItems: 'center' }}>
							{agenda.subjectType !== CBX.getActPointSubjectType() &&
								<React.Fragment>
									{agenda.description ?
										<BasicButton
											text={translate.description}
											color={'white'}
											textStyle={{
												textTransform: 'none',
												fontWeight: '700',
												color: getSecondary(),
												fontSize: "0.85em",
											}}
											onClick={() => setExpanded(!expanded)}
										/>
										:
										<>
											<span style={{ marginRight: '0.6em' }}>{translate.no_description}</span>
											<AgendaDescriptionModal
												agenda={agenda}
												translate={translate}
												council={council}
												companyStatutes={props.companyStatutes}
												majorityTypes={props.majorityTypes}
												draftTypes={props.draftTypes}
												refetch={refetch}
											/>
										</>
										
									}
								</React.Fragment>
							}
						</GridItem>
						<GridItem xs={normalLayout ? 4 : 12} md={normalLayout ? 4 : 5} lg={4} style={{ display: 'flex', alignItems: 'center' }}>
							{councilStarted && !CBX.agendaClosed(agenda) && (
								<React.Fragment>
									{agenda.subjectType === AGENDA_TYPES.PUBLIC_ACT || agenda.subjectType === AGENDA_TYPES.PRIVATE_ACT ?
										<ActPointStateManager
											council={council}
											agenda={agenda}
											translate={translate}
											refetch={props.refetchCouncil}
											active={agenda.orderIndex === openIndex}
										/>
										:
										<ToggleAgendaButton
											agenda={agenda}
											council={council}
											nextPoint={props.nextPoint}
											translate={translate}
											refetch={refetch}
											active={agenda.orderIndex === openIndex}
										/>
									}
								</React.Fragment>
							)}
						</GridItem>
						<GridItem xs={normalLayout ? 5 : 12} md={normalLayout ? 5 : 7} lg={5} style={{ display: 'flex', alignItems: 'center' }}>
							{(agenda.subjectType !== AGENDA_TYPES.INFORMATIVE && agenda.subjectType !== CBX.getActPointSubjectType()) && councilStarted ? (
								<ToggleVotingsButton
									council={council}
									showVotingsAlert={props.showVotingsAlert}
									editedVotings={props.editedVotings}
									agenda={agenda}
									translate={translate}
									refetch={refetch}
								/>
							) : <div />}
						</GridItem>
					</Grid>
				</GridItem>
			</Grid>
			<div style={{ borderTop: '1px solid gainsboro', position: 'relative', width: '100%', height: `calc( ${smallLayout ? '100vh' : '100%'} - ${smallLayout ? '14em' : '6.5em'})`, overflow: 'hidden' }}>
				{agenda.description &&
					<Collapse isOpened={expanded}>
						<div
							style={{
								visibility: expanded ? 'visible' : 'hidden',
								cursor: 'pointer',
								marginLeft: '0.2em',
								position: 'absolute',
								top: 5,
								left: '0.5em'
							}}
						>
							<AgendaDescriptionModal
								agenda={agenda}
								translate={translate}
								council={council}
								companyStatutes={props.companyStatutes}
								majorityTypes={props.majorityTypes}
								draftTypes={props.draftTypes}
								refetch={refetch}
							/>
						</div>
						<div
							style={{
								fontSize: "0.9em",
								padding: '1em',
								marginTop: '0.8em',
								paddingBottom: '1.5em',
								lineHeight: '1.2em',
								width: '100%',
								backgroundColor: 'white',
							}}
							onClick={toggleDescription}
							dangerouslySetInnerHTML={{
								__html: agenda.description
							}}
						/>
					</Collapse>
				}
				{agenda.subjectType !== CBX.getActPointSubjectType() ?
					<AgendaDetailsTabs
						key={`agenda_${agenda.id}`}
						translate={translate}
						agenda={agenda}
						council={council}
						showVotingsAlert={props.showVotingsAlert}
						changeEditedVotings={props.changeEditedVotings}
						editedVotings={props.editedVotings}
						refetch={refetch}
						data={props.data}
						recount={props.recount}
						majorityTypes={props.majorityTypes}
					/>
					:
					<ActPointInfoDisplay
						council={council}
						data={props.data}
						agenda={agenda}
						companyID={council.companyId}
						translate={translate}
						recount={props.recount}
						showVotingsAlert={props.showVotingsAlert}
						changeEditedVotings={props.changeEditedVotings}
						majorityTypes={props.majorityTypes}
						refetch={refetch}
					/>
				}
			</div>

		</div>
	);
}


const EditTitlePoint = ({ title, translate, setPointNameEditor, updateAgenda, agenda, council, refetch }) => {
	const [pointNameEditorText, setPointNameEditorText] = React.useState('');

	React.useEffect(() => {
		setPointNameEditorText(title);
	}, [title]);


	const saveTitle = async () => {
		await updateAgenda({
			variables: {
				agenda: {
					id: agenda.id,
					agendaSubject: pointNameEditorText,
					councilId: council.id
				}
			}
		});
		refetch();
		setPointNameEditor(false);
	}

	return (
		<div
			style={{ display: "flex", alignItems: "center" }}
		>
			<TextInput
				value={pointNameEditorText}
				disableUnderline={true}
				styleInInput={{ marginRight: "0.5em", color: "rgba(0, 0, 0, 0.54)", background: "#e6e6e6", paddingLeft: "5px" }}
				styles={{ marginTop: "-16px" }}
				stylesTextField={{ marginBottom: "0px" }}
				onChange={event => setPointNameEditorText(event.target.value)}
			/>
			<BasicButton
				backgroundColor={{
					backgroundColor: "white",
					border: "1px solid" + getPrimary(),
					color: getPrimary(),
					marginRight: "0.5em",
					padding: "0px",
					borderRadius: '4px',
					minHeight: '30px',
				}}
				text={translate.save}
				onClick={saveTitle}
			/>
			<BasicButton
				text={translate.cancel}
				backgroundColor={{
					backgroundColor: "white",
					border: "1px solid" + getSecondary(),
					padding: "0px",
					borderRadius: '4px', color: getSecondary(),
					minHeight: '30px',
				}}
				onClick={() => setPointNameEditor(false)}
			/>
		</div>
	)
}


export default graphql(updateAgenda, {
	name: 'updateAgenda'
})(AgendaDetailsSection);