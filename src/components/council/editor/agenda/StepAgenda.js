import React from "react";
import {
	BasicButton,
	ButtonIcon,
	ErrorWrapper,
	Grid,
	GridItem,
	DropDownMenu,
	LoadingSection
} from "../../../../displayComponents/index";
import { compose, graphql } from "react-apollo";
import { Typography } from "material-ui";
import { councilStepThree, updateCouncil } from "../../../../queries";
import { removeAgenda } from "../../../../queries/agenda";
import { MenuItem, Divider } from 'material-ui';
import { getPrimary, getSecondary } from "../../../../styles/colors";
import NewAgendaPointModal from "./modals/NewAgendaPointModal";
import PointEditor from "./modals/PointEditor";
import ReorderPointsModal from "../../agendas/ReorderPointsModal";
import SaveDraftModal from "../../../company/drafts/SaveDraftModal";
import AgendaItem from "./AgendaItem";
import EditorStepLayout from '../EditorStepLayout';
import NewCustomPointModal from './modals/NewCustomPointModal';
import { ConfigContext } from "../../../../containers/AppControl";

const buttonStyle = {
	color: "white",
	fontWeight: "700",
	fontSize: "0.9em",
	textTransform: "none"
};

class StepAgenda extends React.Component {
	state = {
		votingTypes: [],
		edit: false,
		editIndex: 0,
		loading: false,
		success: false,
		saveAsDraft: false,
		saveAsDraftId: 0,
		errors: {
			agendaSubject: "",
			description: "",
			emptyAgendas: ""
		}
	};

	componentDidMount() {
		this.props.data.refetch();
	}

	updateCouncil = async step => {
		this.setState({
			loading: true
		})
		const { agendas, statute, __typename, ...council } = this.props.data.council;

		await this.props.updateCouncil({
			variables: {
				council: {
					...council,
					step: step
				}
			}
		});

		await this.setState({
			loading: false,
			success: true
		})
	};

	resetButtonStates = () => {
		this.setState({
			loading: false,
			success: false
		})
	}

	removeAgenda = async agendaId => {
		const response = await this.props.removeAgenda({
			variables: {
				agendaId: agendaId,
				councilId: this.props.councilID
			}
		});

		if (response) {
			this.props.data.refetch();
		}
	};

	selectAgenda = index => {
		this.setState({
			edit: true,
			editIndex: index
		});
	};

	nextPage = async () => {
		if (this.checkConditions()) {
			await this.updateCouncil(4);
			this.props.nextStep();
		}
	};

	checkConditions = () => {
		const { errors } = this.state;
		const agendas = this.props.data.council.agendas;

		if (agendas.length !== 0) {
			return true;
		} else {
			this.setState({
				errors: {
					...errors,
					emptyAgendas: this.props.translate.required_agendas
				}
			});
			return false;
		}
	};

	previousPage = () => {
		if (true) {
			this.updateCouncil(3);
			this.props.previousStep();
		}
	};

	saveAsDraft = id => {
		this.setState({
			saveAsDraft: true,
			saveAsDraftId: id
		});
	};

	render() {
		const { translate } = this.props;
		const {
			errors,
			edit,
			editIndex,
			saveAsDraft,
			saveAsDraftId
		} = this.state;
		const {
			votingTypes,
			council,
			majorityTypes,
			draftTypes
		} = this.props.data;
		const primary = getPrimary();
		const secondary = getSecondary();

		let agendas = [];

		if (!this.props.data.loading) {
			agendas = !!council.agendas ? council.agendas : [];
		}
		let newDraft = agendas.find(item => item.id === saveAsDraftId);


		if (this.props.data.errors) {
			return <ErrorWrapper error={this.props.data.errors.graph} />;
		}

		return (
			<React.Fragment>
				<EditorStepLayout
					body={
						<React.Fragment>
							<Grid>
								{this.props.data.loading?
									<div
										style={{
											height: "300px",
											width: "100%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center"
										}}
									>
										<LoadingSection />
									</div>
									:
									agendas.length > 0 ? (
										<React.Fragment>
											<GridItem
												xs={12}
												lg={12}
												md={12}
												style={{
													display: "flex",
													flexDirection: "row"
												}}
											>
												<AddAgendaPoint
													translate={translate}
													agendas={council.agendas}
													votingTypes={votingTypes}
													majorityTypes={majorityTypes}
													draftTypes={draftTypes}
													statute={council.statute}
													company={this.props.company}
													council={council}
													companyStatutes={this.props.data.companyStatutes}
													refetch={this.props.data.refetch}
												/>
												<ReorderPointsModal
													translate={translate}
													agendas={council.agendas}
													councilID={this.props.councilID}
													refetch={this.props.data.refetch}
													style={{ marginLeft: "0.8em" }}
												>
													<BasicButton
														text={translate.reorder_agenda_points}
														color={secondary}
														textStyle={buttonStyle}
														icon={
															<ButtonIcon
																type="cached"
																color="white"
															/>
														}
														textPosition="after"
													/>
												</ReorderPointsModal>
											</GridItem>
											<div
												style={{
													width: "100%"
												}}
											>
												{agendas.map((agenda, index) => {
													return (
														<AgendaItem
															agenda={agenda}
															key={`agenda${index}`}
															typeText={
																translate[
																votingTypes.find(
																	item =>
																		item.value ===
																		agenda.subjectType
																).label
																]
															}
															removeAgenda={this.removeAgenda}
															selectAgenda={this.selectAgenda}
															saveAsDraft={this.saveAsDraft}
														/>
													);
												})}
											</div>
										</React.Fragment>
									) : (
											<div
												style={{
													width: "100%",
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													marginTop: "2em",
													marginBottom: "3em"
												}}
											>
												<Typography variant="subheading">
													{translate.empty_agendas}
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
														company={this.props.company}
														council={council}
														companyStatutes={this.props.data.companyStatutes}
														refetch={this.props.data.refetch}
													/>
												</div>
												<Typography variant="subheading" style={{ color: "red", fontWeight: '700', marginTop: '1.2em'}}>
													{errors.emptyAgendas}
												</Typography>
											</div>
										)
								}
							</Grid>
							{!this.props.data.loading &&
								<React.Fragment>
									<PointEditor
										translate={translate}
										draftTypes={draftTypes}
										statute={council.statute}
										company={this.props.company}
										council={council}
										companyStatutes={this.props.data.companyStatutes}
										open={edit}
										agenda={council.agendas.find(
											item => item.orderIndex === editIndex
										)}
										votingTypes={votingTypes}
										majorityTypes={majorityTypes}
										refetch={this.props.data.refetch}
										requestClose={() => this.setState({ edit: false })}
									/>
									{saveAsDraft &&
										newDraft && (
											<SaveDraftModal
												open={saveAsDraft}
												statute={council.statute}
												data={{
													...newDraft,
													text: newDraft.description,
													description: "",
													title: newDraft.agendaSubject,
													votationType: newDraft.subjectType,
													type: draftTypes.filter(
														draft => draft.label === "agenda"
													)[0].value,
													statuteId: council.statute.statuteId
												}}
												company={this.props.company}
												requestClose={() =>
													this.setState({ saveAsDraft: false })
												}
												companyStatutes={this.props.data.companyStatutes}
												votingTypes={votingTypes}
												majorityTypes={majorityTypes}
												draftTypes={draftTypes}
											/>
										)
									}
								</React.Fragment>
							}
						</React.Fragment>
					}
					buttons={
						<React.Fragment>
							<BasicButton
								text={translate.previous}
								disable={this.props.data.loading}
								color={secondary}
								textStyle={buttonStyle}
								textPosition="after"
								onClick={this.previousPage}
							/>
							<BasicButton
								text={translate.save}
								disable={this.props.data.loading}
								success={this.state.success}
								loading={this.state.loading}
								reset={this.resetButtonStates}
								color={secondary}
								textStyle={{
									color: "white",
									fontWeight: "700",
									fontSize: "0.9em",
									marginLeft: "0.5em",
									marginRight: "0.5em",
									textTransform: "none"
								}}
								icon={<ButtonIcon type="save" color="white" />}
								textPosition="after"
								onClick={() => this.updateCouncil(3)}
							/>
							<BasicButton
								text={translate.next}
								color={primary}
								disable={this.props.data.loading}
								loadingColor={'white'}
								textStyle={{
									color: "white",
									fontWeight: "700",
									fontSize: "0.9em",
									textTransform: "none"
								}}
								textPosition="after"
								onClick={this.nextPage}
							/>
						</React.Fragment>
					}
				/>
			</React.Fragment>
		);
	}
}

const AddAgendaPoint = ({ translate, council, votingTypes, majorityTypes, draftTypes, ...props }) => {
	const config = React.useContext(ConfigContext);
	const [state, setState] = React.useState({
		yesNoModal: false,
		customPointModal: false
	})
	const [loading, setLoading] = React.useState(false);
	const primary = getPrimary();
	const secondary = getSecondary();

	const showCustomPointModal = () => {
		setState({
			...state,
			customPointModal: true
		});
	}

	const closeCustomPointModal = () => {
		setState({
			...state,
			customPointModal: false
		});
	}

	const showYesNoModal = () => {
		setState({
			...state,
			yesNoModal: true
		})
	}

	const closeYesNoModal = () => {
		setState({
			...state,
			yesNoModal: false
		})
	}

	return (
		<React.Fragment>
			{config.customPoints ?
				<DropDownMenu
					color={primary}
					id={'new-agenda-trigger'}
					loading={loading}
					text={translate.add_agenda_point}
					textStyle={buttonStyle}
					icon={
						<ButtonIcon type="add" color="white" />
					}
					items={
						<React.Fragment>
							<MenuItem onClick={showYesNoModal}>
								<div
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'space-between'
									}}
								>
									<i className="material-icons" style={{fontSize: '1.2em', color: secondary}}>
										thumbs_up_down
									</i>
									<span style={{marginLeft: '2.5em', marginRight: '0.8em'}}>
										Punto si / no / abstención
									</span>
								</div>
							</MenuItem>
							<Divider />
							<MenuItem onClick={showCustomPointModal}>
								<div
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'space-between'
									}}
								>
									<i className="material-icons" style={{fontSize: '1.2em', color: secondary}}>
										poll
									</i>
									<span style={{marginLeft: '2.5em', marginRight: '0.8em'}}>
										Punto personalizado
									</span>
								</div>
							</MenuItem>
						</React.Fragment>
					}
				/>
			:
				<BasicButton
					text={translate.add_agenda_point}
					color={primary}
					textStyle={buttonStyle}
					icon={
						<ButtonIcon type="add" color="white" />
					}
					textPosition="after"
				/>
			}

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
		</React.Fragment>
	)
}

export default compose(
	graphql(councilStepThree, {
		name: "data",
		options: props => ({
			variables: {
				id: props.councilID,
				companyId: props.company.id
			}
		})
	}),
	graphql(removeAgenda, { name: "removeAgenda" }),
	graphql(updateCouncil, { name: "updateCouncil" })
)(StepAgenda);
