import React, { Component, Fragment } from "react";
import { graphql, compose } from "react-apollo";
import { getSecondary, getPrimary } from "../../../../styles/colors";
import gql from "graphql-tag";
import {
	BasicButton,
	ErrorWrapper,
	LoadingSection
} from "../../../../displayComponents";
import Scrollbar from "react-perfect-scrollbar";
import LoadDraft from "../../../company/drafts/LoadDraft";
import RichTextInput from "../../../../displayComponents/RichTextInput";
import AgendaEditor from "./AgendaEditor";
import { DRAFT_TYPES } from "../../../../constants";
import moment from "moment";
import Dialog, { DialogContent, DialogTitle } from "material-ui/Dialog";
import SendActDraftModal from './SendActDraftModal';
import { updateCouncilAct } from '../../../../queries';

const CouncilActData = gql`
	query CouncilActData($councilID: Int!) {
		council(id: $councilID) {
			id
			businessName
			country
			countryState
			currentQuorum
			secretary
			president
			street
			city
			dateRealStart
			dateEnd
			qualityVoteId
			firstOrSecondConvene
			act {
				id
				intro
				constitution
				conclusion
			}
			agendas {
				id
				orderIndex
				agendaSubject
				subjectType
				abstentionVotings
				abstentionManual
				noVoteVotings
				noVoteManual
				positiveVotings
				positiveManual
				negativeVotings
				negativeManual
				description
				majorityType
				majority
				majorityDivider
				votings {
					id
					participantId
					comment
					vote
				}
				numPresentCensus
				presentCensus
				numCurrentRemoteCensus
				currentRemoteCensus
				comment
			}
			statute {
				id
				prototype
				existsQualityVote
			}
		}
		councilRecount(councilId: $councilID){
			id
			socialCapitalTotal
			partTotal
			numTotal
		}
		votingTypes {
			label
			value
		}

		majorityTypes {
			label
			value
		}
	}
`;

class ActEditor extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			draftType: null,
			sendActDraft: false,
			loadDraft: false,
			errors: {}
		};
	}

	static getDerivedStateFromProps(nextProps) {
		if (!nextProps.data.loading) {
			if (nextProps.data.council) {
				return {
					data: {
						council: {
							...nextProps.data.council
						}
					}
				};
			}
		}

		return null;
	};

	updateAct = async object => {
		this.setState({
			data: {
				...this.state.data,
				council: {
					...this.state.data.council,
					act: {
						...this.state.data.council.act,
						...object
					}
				}
			}
		}, async () => {
			const { __typename, ...act } = this.state.data.council.act;

			const response = await this.props.updateCouncilAct({
				variables: {
					councilAct: {
						...act,
						councilId: this.state.data.council.id
					}
				}
			});
	
			console.log(response);
		});

	};

	updateAgenda = object => {
		let modifiedAgendas = this.state.data.council.agendas.map(agenda => {
			if (object.id === agenda.id) {
				return {
					...agenda,
					comment: object.comment
				};
			}
			return agenda;
		});

		this.setState({
			data: {
				...this.state.data,
				council: {
					...this.state.data.council,
					agendas: modifiedAgendas
				}
			}
		});
	};

	getTypeText = (subjectType) => {
		const votingType = this.props.data.votingTypes.find(item => item.value === subjectType)
		return !!votingType? this.props.translate[votingType.label] : '';
	}

	render() {
		const secondary = getSecondary();
		const primary = getPrimary();
		const { translate } = this.props;
		const {
			error,
			loading,
			votingTypes,
			council,
			companyStatutes
		} = this.props.data;
		const { errors, data } = this.state;

		if (loading) {
			return <LoadingSection />;
		}

		if (error) {
			return <ErrorWrapper error={error} translate={translate} />;
		}

		return (
			<div style={{ height: "100%", overflow: 'hidden', position: 'relative' }}>
				<Scrollbar option={{ suppressScrollX: true }}>
					<div style={{padding: '1.5em', overflow: 'hidden'}}>
						{!!data.council.act &&
							<RichTextInput
								ref={editor => (this.editorIntro = editor)}
								floatingText={translate.intro}
								type="text"
								loadDraft={
									<BasicButton
										text={translate.load_draft}
										color={secondary}
										textStyle={{
											color: "white",
											fontWeight: "600",
											fontSize: "0.8em",
											textTransform: "none",
											marginLeft: "0.4em",
											minHeight: 0,
											lineHeight: "1em"
										}}
										textPosition="after"
										onClick={() =>
											this.setState({
												loadDraft: true,
												draftType: DRAFT_TYPES.INTRO
											})
										}
									/>
								}
								tags={[
									{
										value: `${council.businessName} `,
										label: translate.business_name
									},
									{
										value: `${moment(council.dateRealStart).format(
											"LLLL"
										)} `,
										label: translate.date_real_start
									},
									{
										value: `${
											council.firstOrSecondConvene
												? translate.first
												: translate.second
										} `,
										label: translate.first_or_second_call
									},
									{
										value: council.street,
										label: translate.new_location_of_celebrate
									},
									{
										value: council.city,
										label: translate.company_new_locality
									}
								]}
								errorText={errors.intro}
								value={data.council.act.intro}
								onChange={value =>
									this.updateAct({
										intro: value
									})
								}
							/>
						}
						<div style={{marginTop: '1em'}}>
							<RichTextInput
								ref={editor => (this.editorConstitution = editor)}
								floatingText={translate.constitution}
								type="text"
								loadDraft={
									<BasicButton
										text={translate.load_draft}
										color={secondary}
										textStyle={{
											color: "white",
											fontWeight: "600",
											fontSize: "0.8em",
											textTransform: "none",
											marginLeft: "0.4em",
											minHeight: 0,
											lineHeight: "1em"
										}}
										textPosition="after"
										onClick={() =>
											this.setState({
												loadDraft: true,
												draftType: DRAFT_TYPES.CONSTITUTION
											})
										}
									/>
								}
								tags={[
									{
										value: `${council.businessName} `,
										label: translate.business_name
									},
									{
										value: `${council.president} `,
										label: translate.president
									},
									{
										value: `${council.secretary} `,
										label: translate.secretary
									},
									{
										value: `${moment(council.dateRealStart).format(
											"LLLL"
										)} `,
										label: translate.date_real_start
									},
									{
										value: `${
											council.firstOrSecondConvene
												? translate.first
												: translate.second
										} `,
										label: translate.first_or_second_call
									},
									{
										value: council.street,
										label: translate.new_location_of_celebrate
									},
									{
										value: council.city,
										label: translate.company_new_locality
									}
								]}
								errorText={errors.constitution}
								value={data.council.act.constitution}
								onChange={value =>
									this.updateAct({
										constitution: value
									})
								}
							/>
						</div>
						{!!council.agendas && (
							<Fragment>
								{council.agendas.map((agenda, index) => {
									return (
										<div style={{marginTop: '2.5em' }} key={`agenda${agenda.id}`}>
											<AgendaEditor
												agenda={agenda}
												council={council}
												recount={this.props.data.councilRecount}
												loadDraft={
													<BasicButton
														text={translate.load_draft}
														color={secondary}
														textStyle={{
															color: "white",
															fontWeight: "600",
															fontSize: "0.8em",
															textTransform: "none",
															marginLeft: "0.4em",
															minHeight: 0,
															lineHeight: "1em"
														}}
														textPosition="after"
														onClick={() =>
															this.setState({
																loadDraft: true,
																draftType:
																	DRAFT_TYPES.AGENDA
															})
														}
													/>
												}
												updateAgenda={this.updateAgenda}
												translate={translate}
												majorityTypes={this.props.data.majorityTypes}
												typeText={this.getTypeText(agenda.subjectType)}
											/>
											{index <= council.agendas.length -1 &&
												<hr style={{marginTop: '2.5em'}} />
											}
										</div>
									);
								})}
							</Fragment>
						)}
						<RichTextInput
							ref={editor => (this.editorConclusion = editor)}
							floatingText={translate.conclusion}
							type="text"
							loadDraft={
								<BasicButton
									text={translate.load_draft}
									color={secondary}
									textStyle={{
										color: "white",
										fontWeight: "600",
										fontSize: "0.8em",
										textTransform: "none",
										marginLeft: "0.4em",
										minHeight: 0,
										lineHeight: "1em"
									}}
									textPosition="after"
									onClick={() =>
										this.setState({
											loadDraft: true,
											draftType: DRAFT_TYPES.CONCLUSION
										})
									}
								/>
							}
							tags={[
								{
									value: `${council.president} `,
									label: translate.president
								},
								{
									value: `${council.secretary} `,
									label: translate.secretary
								},
								{
									value: `${moment(council.dateEnd).format(
										"LLLL"
									)} `,
									label: translate.date_end
								}
							]}
							errorText={errors.conclusion}
							value={data.council.act.conclusion}
							onChange={value =>
								this.updateAct({
									conclusion: value
								})
							}
						/>
						<div style={{padding: '1em', paddingTop: '1.8em', width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
							<BasicButton
								text={translate.new_save}
								color={"white"}
								textStyle={{
									color: primary,
									fontWeight: "700",
									fontSize: "0.9em",
									textTransform: "none"
								}}
								buttonStyle={{
									marginRight: "1em",
									border: `2px solid ${primary}`
								}}
							/>
							<BasicButton
								text={translate.send_draft_act_review}
								color={"white"}
								textStyle={{
									color: primary,
									fontWeight: "700",
									fontSize: "0.9em",
									textTransform: "none"
								}}
								onClick={() => this.setState({
									sendActDraft: true
								})}
								buttonStyle={{
									marginRight: "1em",
									border: `2px solid ${primary}`
								}}
							/>
							<BasicButton
								text={translate.end_writing_act}
								color={"white"}
								textStyle={{
									color: primary,
									fontWeight: "700",
									fontSize: "0.9em",
									textTransform: "none"
								}}
								buttonStyle={{
									marginRight: "1em",
									border: `2px solid ${primary}`
								}}
							/>
						</div>
					</div>
				</Scrollbar>
				<Dialog
					open={this.state.loadDraft}
					maxWidth={false}
					onClose={() => this.setState({ loadDraft: false })}
				>
					<DialogTitle>{translate.load_draft}</DialogTitle>
					<DialogContent style={{ width: "800px" }}>
						<LoadDraft
							translate={translate}
							companyId={this.props.companyID}
							loadDraft={this.state.loadDraft}
							statute={council.statute}
							statutes={companyStatutes}
							draftType={this.state.draftType}
						/>
					</DialogContent>
				</Dialog>
				<SendActDraftModal
					council={council}
					translate={translate}
					show={this.state.sendActDraft}
					requestClose={() => this.setState({ sendActDraft: false })}
				/>
			</div>
		);
	}
}

export default compose(
	graphql(CouncilActData, {
		name: "data",
		options: props => ({
			variables: {
				councilID: props.councilID,
				companyID: props.companyID
			}
		})
	}),
	graphql(updateCouncilAct, {
		name: 'updateCouncilAct'
	})
)(ActEditor);
