import React from "react";
import {
	BasicButton,
	ButtonIcon,
	ErrorWrapper,
	Grid,
	GridItem,
	LoadingSection
} from "../../../../displayComponents/index";
import { compose, graphql } from "react-apollo";
import { Typography } from "material-ui";
import { councilStepThree, updateCouncil } from "../../../../queries";
import { removeAgenda } from "../../../../queries/agenda";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import NewAgendaPointModal from "./modals/NewAgendaPointModal";
import PointEditor from "./modals/PointEditor";
import * as CBX from "../../../../utils/CBX";
import ReorderPointsModal from "../../agendas/ReorderPointsModal";
import SaveDraftModal from "../../../company/drafts/SaveDraftModal";
import AgendaItem from "./AgendaItem";
import CouncilHeader from '../CouncilHeader';
import EditorStepLayout from '../EditorStepLayout';

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

	updateCouncil = step => {
		const { agendas, statute, __typename, ...council } = this.props.data.council;

		this.props.updateCouncil({
			variables: {
				council: {
					...council,
					step: step
				}
			}
		});
	};

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

		const agendas = !!council.agendas? council.agendas : [];
		let newDraft = agendas.find(item => item.id === saveAsDraftId);


		if (this.props.data.errors) {
			return <ErrorWrapper error={this.props.data.errors.graph} />;
		}

		return (
			<React.Fragment>
				<EditorStepLayout
					body={
						<React.Fragment>
							{agendas.length > 0 && (
								<Grid>
									{this.props.data.loading?
										<LoadingSection />
									:
										<GridItem
											xs={12}
											lg={12}
											md={12}
											style={{
												display: "flex",
												flexDirection: "row"
											}}
										>
											<NewAgendaPointModal
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
											>
												<BasicButton
													text={translate.add_agenda_point}
													color={primary}
													textStyle={buttonStyle}
													icon={
														<ButtonIcon type="add" color="white" />
													}
													textPosition="after"
												/>
											</NewAgendaPointModal>
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
									}
								</Grid>
							)}

							{agendas.length > 0 ? (
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
										<NewAgendaPointModal
											translate={translate}
											agendas={council.agendas}
											votingTypes={votingTypes}
											majorityTypes={majorityTypes}
											draftTypes={draftTypes}
											statute={council.statute}
											company={this.props.company}
											council={council}
											companyStatutes={
												this.props.data.companyStatutes
											}
											refetch={this.props.data.refetch}
										>
											<BasicButton
												type="raised"
												buttonStyle={buttonStyle}
												text={translate.add_agenda_point}
												color={primary}
												icon={
													<ButtonIcon type="add" color="white" />
												}
												textStyle={{
													color: "white",
													textTransform: "none"
												}}
											/>
										</NewAgendaPointModal>
									</div>
									<Typography variant="body1" style={{ color: "red" }}>
										{errors.emptyAgendas}
									</Typography>
								</div>
							)}
						</React.Fragment>
					}
					buttons={
						<React.Fragment>
							<BasicButton
								text={translate.previous}
								color={secondary}
								textStyle={buttonStyle}
								textPosition="after"
								onClick={this.previousPage}
							/>
							<BasicButton
								text={translate.save}
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
								onClick={this.updateCouncil}
							/>
							<BasicButton
								text={translate.next}
								color={primary}
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
					)}
			</React.Fragment>
		);
	}
}

export default compose(
	graphql(councilStepThree, {
		name: "data",
		options: props => ({
			variables: {
				id: props.councilID,
				companyId: props.company.id
			},
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(removeAgenda, { name: "removeAgenda" }),
	graphql(updateCouncil, { name: "updateCouncil" })
)(StepAgenda);
