import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { Typography, MenuItem, Divider } from 'material-ui';
import {
	BasicButton,
	ButtonIcon,
	Grid,
	GridItem,
	DropDownMenu,
	LoadingSection,
	AlertConfirm
} from '../../../../displayComponents/index';
import { councilStepThree, updateCouncil as updateCouncilMutation } from '../../../../queries';
import { removeAgenda as removeAgendaMutation } from '../../../../queries/agenda';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import NewAgendaPointModal from './modals/NewAgendaPointModal';
import PointEditor from './modals/PointEditor';
import ReorderPointsModal from '../../agendas/ReorderPointsModal';
import SaveDraftModal from '../../../company/drafts/SaveDraftModal';
import AgendaItem from './AgendaItem';
import EditorStepLayout from '../EditorStepLayout';
import NewCustomPointModal from './modals/NewCustomPointModal';
import CustomPointEditor from './modals/CustomPointEditor';
import { ConfigContext } from '../../../../containers/AppControl';
import { useOldState } from '../../../../hooks';
import { TAG_TYPES } from '../../../company/drafts/draftTags/utils';
import { getAgendaTypeLabel, isAppointment, isCustomPoint } from '../../../../utils/CBX';
import EditorStepper from '../EditorStepper';

const buttonStyle = {
	color: 'white',
	fontWeight: '700',
	fontSize: '0.9em',
	textTransform: 'none'
};

const StepAgenda = ({
	client,
	translate,
	step,
	...props
}) => {
	const [state, setState] = useOldState({
		votingTypes: [],
		edit: false,
		editIndex: 0,
		success: false,
		loading: false,
		saveAsDraftId: null,
		confirmationRequestModal: false,
		agendaIdRemove: false,
		errors: {
			agendaSubject: '',
			description: '',
			emptyAgendas: ''
		}
	});
	const [loading, setLoading] = React.useState(true);
	const [deleteModal, setDeleteModal] = React.useState(false);
	const [data, setData] = React.useState({});
	const primary = getPrimary();
	const secondary = getSecondary();

	const getData = React.useCallback(async () => {
		setLoading(true);
		const response = await client.query({
			query: councilStepThree,
			variables: {
				id: props.councilID,
				companyId: props.company.id
			}
		});

		if (response.data) {
			setData(response.data);
		}

		setLoading(false);
	}, [props.councilID]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	const updateCouncil = async stepIn => {
		setState({ loading: true });
		const {
			agendas, statute, __typename, ...council
		} = data.council;

		await props.updateCouncil({
			variables: {
				council: {
					...council,
					stepIn
				}
			}
		});

		setLoading(false);
		setState({
			loading: false,
			success: true
		});
	};

	const resetButtonStates = () => {
		setState({
			loading: false,
			success: false
		});
	};

	const removeAgenda = async () => {
		const response = await props.removeAgenda({
			variables: {
				agendaId: deleteModal,
				councilId: props.councilID
			}
		});

		if (response) {
			getData();
			setDeleteModal(null);
		}
	};

	const selectAgenda = index => {
		const agenda = data.council.agendas.find(
			item => item.orderIndex === index
		);

		if (isCustomPoint(agenda.subjectType)) {
			setState({
				editCustomAgenda: agenda
			});
		} else {
			setState({
				editAgenda: agenda
			});
		}
	};

	const checkConditions = () => {
		const { errors } = state;
		const { agendas } = data.council;

		if (agendas.length !== 0) {
			return true;
		}
		setState({
			errors: {
				...errors,
				emptyAgendas: translate.required_agendas
			}
		});
		return false;
	};

	const nextPage = async () => {
		if (data.council.statute.canAddPoints === 1 || checkConditions()) {
			await updateCouncil(4);
			props.nextStep();
		}
	};

	const previousPage = async () => {
		await updateCouncil(3);
		props.previousStep();
	};

	const saveAsAgendaDraft = id => {
		setState({
			saveAsDraftId: id
		});
	};

	const { errors, saveAsDraftId } = state;
	const {
		votingTypes, council, majorityTypes, draftTypes
	} = data;

	let agendas = null;
	let newDraft;

	if (council) {
		agendas = council.agendas ? council.agendas : [];
		newDraft = agendas.find(item => item.id === saveAsDraftId);
	}

	return (
		<React.Fragment>
			<div
				style={{
					width: '100%',
					textAlign: 'center',
				}}
			>
				<div style={{
					marginBottom: '1.2em', marginTop: '0.8em', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem'
				}}>
					<EditorStepper
						translate={translate}
						active={step - 1}
						goToPage={nextPage}
						previousPage={previousPage}
					/>
				</div>
			</div>
			<EditorStepLayout
				body={
					<React.Fragment>
						<Grid>
							{agendas === null ? (
								<div
									style={{
										height: '300px',
										width: '100%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center'
									}}
								>
									<LoadingSection />
								</div>
							) : agendas.length > 0 ? (
								<React.Fragment>
									<GridItem
										xs={12}
										lg={12}
										md={12}
										style={{
											display: 'flex',
											flexDirection: 'row'
										}}
									>
										<AddAgendaPoint
											translate={translate}
											agendas={council.agendas}
											votingTypes={votingTypes}
											majorityTypes={majorityTypes}
											draftTypes={draftTypes}
											statute={council.statute}
											company={props.company}
											council={council}
											companyStatutes={data.companyStatutes}
											refetch={getData}
										/>
										<ReorderPointsModal
											translate={translate}
											agendas={council.agendas}
											councilID={props.councilID}
											refetch={getData}
											style={{ marginLeft: '0.8em' }}
										>
											<BasicButton
												text={
													<div style={{ display: 'flex', alignItems: 'center' }}>
														<div>{translate.reorder_agenda_points}</div>
														<div style={{ display: 'flex' }}><ButtonIcon
															type="cached"
															color="white"
															style={{ marginTop: '3px' }}
														/></div>
													</div>
												}
												color={secondary}
												textStyle={buttonStyle}
												textPosition="after"
											/>
										</ReorderPointsModal>
									</GridItem>
									<div
										style={{
											width: '100%',
											paddingBottom: '1em'
										}}
									>
										{agendas.map((agenda, index) => (
											<AgendaItem
												agenda={agenda}
												key={`agenda${index}`}
												typeText={translate[getAgendaTypeLabel(agenda)]}
												removeAgenda={() => setDeleteModal(agenda.id)}
												selectAgenda={selectAgenda}
												saveAsDraft={saveAsAgendaDraft}
											/>
										))}
									</div>
								</React.Fragment>
							) : (
								<div
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										marginTop: '2em',
										marginBottom: '3em'
									}}
								>
									<Typography variant="subheading">
										{isAppointment(council) ?
											''
											:
											translate.empty_agendas
										}
									</Typography>
									<br />
									<div>
										<AddAgendaPoint
											translate={translate}
											agendas={council.agendas}
											votingTypes={votingTypes}
											majorityTypes={majorityTypes}
											draftTypes={draftTypes}
											statute={council.statute}
											company={props.company}
											council={council}
											companyStatutes={data.companyStatutes}
											refetch={getData}
										/>
									</div>
									<Typography
										variant="subheading"
										style={{
											color: 'red',
											fontWeight: '700',
											marginTop: '1.2em'
										}}
									>
										{errors.emptyAgendas}
									</Typography>
								</div>
							)}
						</Grid>
						{!loading && (
							<React.Fragment>
								{!!state.editAgenda
									&& <PointEditor
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
										requestClose={() => setState({ editAgenda: null })
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
										requestClose={() => setState({ editCustomAgenda: null })}
									/>
								)}
								{(saveAsDraftId && newDraft) && (
									<SaveDraftModal
										open={saveAsDraftId}
										statute={council.statute}
										data={{
											...newDraft,
											text: newDraft.description,
											description: '',
											title: newDraft.agendaSubject,
											votationType: newDraft.subjectType,
											type: draftTypes.filter(
												draft => draft.label === 'agenda'
											)[0].value,
											tags: {
												[`statute_${council.statute.statuteId}`]: {
													label: translate[council.statute.title] || council.statute.title,
													name: `statute_${council.statute.statuteId}`,
													type: TAG_TYPES.STATUTE,
													active: true
												},
												agenda: {
													type: TAG_TYPES.DRAFT_TYPE,
													label: translate.agenda,
													name: 'agenda',
													active: true
												}
											},
											statuteId: council.statute.statuteId
										}}
										company={props.company}
										requestClose={() => setState({ saveAsDraftId: null })
										}
										companyStatutes={data.companyStatutes}
										votingTypes={votingTypes}
										majorityTypes={majorityTypes}
										draftTypes={draftTypes}
									/>
								)}
							</React.Fragment>
						)}
					</React.Fragment>
				}
				buttons={
					<React.Fragment>
						<BasicButton
							text={translate.previous}
							disable={loading}
							color={secondary}
							textStyle={buttonStyle}
							textPosition="after"
							onClick={previousPage}
						/>
						<BasicButton
							text={translate.save}
							disable={data.loading}
							success={state.success}
							loading={state.loading}
							reset={resetButtonStates}
							color={secondary}
							textStyle={{
								color: 'white',
								fontWeight: '700',
								fontSize: '0.9em',
								marginLeft: '0.5em',
								marginRight: '0.5em',
								textTransform: 'none'
							}}
							icon={<ButtonIcon type="save" color="white" />}
							textPosition="after"
							onClick={() => updateCouncil(3)}
						/>
						<BasicButton
							text={translate.next}
							id={'ordenDelDiaNext'}
							color={primary}
							disable={loading}
							loadingColor={'white'}
							textStyle={{
								color: 'white',
								fontWeight: '700',
								fontSize: '0.9em',
								textTransform: 'none'
							}}
							textPosition="after"
							onClick={nextPage}
						/>
					</React.Fragment>
				}
			/>
			<AlertConfirm
				title={translate.attention}
				bodyText={translate.question_delete}
				open={deleteModal}
				buttonAccept={translate.delete}
				buttonCancel={translate.cancel}
				acceptAction={removeAgenda}
				requestClose={() => setDeleteModal(false)}
			/>
		</React.Fragment>
	);
};

export const AddAgendaPoint = ({
	translate,
	council,
	votingTypes,
	majorityTypes,
	draftTypes,
	Component,
	...props
}) => {
	const config = React.useContext(ConfigContext);
	const [state, setState] = React.useState({
		yesNoModal: false,
		customPointModal: false
	});
	const primary = getPrimary();
	const secondary = getSecondary();

	const showCustomPointModal = () => {
		setState({
			...state,
			customPointModal: true
		});
	};

	const closeCustomPointModal = () => {
		setState({
			...state,
			customPointModal: false
		});
	};

	const showYesNoModal = () => {
		setState({
			...state,
			yesNoModal: true
		});
	};

	const showConfirmationRequestModal = () => {
		setState({
			...state,
			confirmationRequestModal: true
		});
	};

	const closeYesNoModal = () => {
		setState({
			...state,
			yesNoModal: false
		});
	};

	const renderTrigger = () => {
		if (isAppointment(council)) {
			if (Component) {
				return (
					<Component
						onClick={showConfirmationRequestModal}
					/>
				);
			}

			return (
				<BasicButton
					text={translate.confirmation_request}
					color={primary}
					onClick={showConfirmationRequestModal}
					textStyle={buttonStyle}
					icon={<ButtonIcon type="add" color="white" />}
					textPosition="after"
				/>
			);
		}

		return (
			<DropDownMenu
				color={primary}
				id={'newPuntoDelDiaOrdenDelDiaNew'}
				loading={false}
				{...(Component ? ({ Component }) : {})}
				text={
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<div>{translate.add_agenda_point}</div>
						<div style={{ display: 'flex', alignItems: 'center' }}><ButtonIcon type="add" color="white" style={{ marginTop: '3px' }} /></div>
					</div>
				}
				textStyle={buttonStyle}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				items={
					<React.Fragment>
						<MenuItem onClick={showYesNoModal}>
							<div
								id={'puntoSiNoAbstencion'}
								style={{
									width: '100%',
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center'
									// justifyContent: "space-between"
								}}
							>
								<i
									className="material-icons"
									style={{
										fontSize: '1.2em',
										color: secondary
									}}
								>
									thumbs_up_down
								</i>
								<span
									style={{
										marginLeft: '2.5em',
										marginRight: '0.8em'
									}}
								>
									{translate.approving_point}
								</span>
							</div>
						</MenuItem>
						<Divider />
						<MenuItem onClick={showCustomPointModal}>
							<div
								id={'puntoPersonalizado'}
								style={{
									width: '100%',
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center'
									// justifyContent: "space-between"
								}}
							>
								<i
									className="material-icons"
									style={{
										fontSize: '1.2em',
										color: secondary
									}}
								>
									poll
								</i>
								<span
									style={{
										marginLeft: '2.5em',
										marginRight: '0.8em'
									}}
								>
									{translate.custom_point}
								</span>
							</div>
						</MenuItem>
						{config.confirmationRequestPoint
							&& <>
								<Divider />
								<MenuItem onClick={() => setState({ ...state, confirmationRequestModal: true })}>
									<div
										id={'puntoPersonalizado'}
										style={{
											width: '100%',
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'space-between'
										}}
									>
										<i
											className="material-icons"
											style={{
												fontSize: '1.2em',
												color: secondary
											}}
										>
											check_circle_outline
										</i>
										<span
											style={{
												marginLeft: '2.5em',
												marginRight: '0.8em'
											}}
										>
											{translate.confirmation_request}
										</span>
									</div>
								</MenuItem>
							</>
						}
					</React.Fragment>
				}
			/>
		);
	};

	return (
		<React.Fragment>
			{renderTrigger()}
			{state.yesNoModal && (
				<NewAgendaPointModal
					translate={translate}
					agendas={council.agendas}
					votingTypes={votingTypes}
					open={state.yesNoModal}
					requestClose={closeYesNoModal}
					majorityTypes={majorityTypes}
					draftTypes={draftTypes}
					statute={council.statute}
					company={props.company}
					council={council}
					companyStatutes={props.companyStatutes}
					refetch={props.refetch}
				/>
			)}
			{state.confirmationRequestModal && (
				<NewAgendaPointModal
					translate={translate}
					confirmation={true}
					hideMajority={true}
					agendas={council.agendas}
					votingTypes={votingTypes}
					showLoadDraft={true}
					open={state.confirmationRequestModal}
					requestClose={() => setState({ ...state, confirmationRequestModal: false })}
					majorityTypes={majorityTypes}
					draftTypes={draftTypes}
					statute={council.statute}
					company={props.company}
					council={council}
					companyStatutes={props.companyStatutes}
					refetch={props.refetch}
				/>
			)}
			{state.customPointModal && (
				<NewCustomPointModal
					translate={translate}
					agendas={council.agendas}
					votingTypes={votingTypes}
					open={state.customPointModal}
					requestClose={closeCustomPointModal}
					majorityTypes={majorityTypes}
					draftTypes={draftTypes}
					statute={council.statute}
					company={props.company}
					council={council}
					companyStatutes={props.companyStatutes}
					refetch={props.refetch}
				/>
			)}
		</React.Fragment>
	);
};

export default compose(
	graphql(removeAgendaMutation, { name: 'removeAgenda' }),
	graphql(updateCouncilMutation, { name: 'updateCouncil' })
)(withApollo(StepAgenda));
