import React, { Component, Fragment } from "react";
import { graphql, compose } from "react-apollo";
import { getSecondary, getPrimary } from "../../../../styles/colors";
import gql from "graphql-tag";
import {
	BasicButton,
	ErrorWrapper,
	Scrollbar,
	LoadingSection,
	LiveToast
} from "../../../../displayComponents";
import LoadDraft from "../../../company/drafts/LoadDraft";
import RichTextInput from "../../../../displayComponents/RichTextInput";
import { updateAgenda } from "../../../../queries/agenda";
import AgendaEditor from "./AgendaEditor";
import { DRAFT_TYPES } from "../../../../constants";
import withSharedProps from "../../../../HOCs/withSharedProps";
import moment from "moment";
import Dialog, { DialogContent, DialogTitle } from "material-ui/Dialog";
import SendActDraftModal from './SendActDraftModal';
import FinishActModal from "./FinishActModal";
import { updateCouncilAct } from '../../../../queries';
import { getActPointSubjectType, checkForUnclosedBraces } from '../../../../utils/CBX';
import { toast } from 'react-toastify';

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
			name
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
			statute {
				id
				prototype
				existsQualityVote
			}
		}

		agendas(councilId: $councilID) {
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

	state = {
		loading: false,
		data: {},
		updating: false,
		draftType: null,
		sendActDraft: false,
		disableButtons: false,
		agendaErrors: new Map(),
		finishActModal: false,
		loadDraft: false,
		errors: {}
	};

	timeout = null;

	static getDerivedStateFromProps(nextProps) {
		if (!nextProps.data.loading) {
			if (nextProps.data.council) {
				return {
					data: {
						council: {
							...nextProps.data.council,
							agendas: nextProps.data.agendas,
							act: nextProps.data.council.act || {}
						}
					}
				};
			}
		}

		return null;
	};

	componentDidUpdate(prevProps, prevState){
		if(!this.props.data.loading){
			if(prevState.data.council){
				if(prevState.data.council.id !== this.state.data.council.id){
					this.updateCouncilAct();
				}
			}else{
				this.updateCouncilAct();
			}
		}
	}

	updateActState = async object => {
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
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => this.updateCouncilAct(), 450);
		});
	};

	checkBraces = () => {
		const act = this.state.data.council.act;
		let errors = {
			intro: false,
			conclusion: false,
			constitution: false
		};
		let hasError = false;

		if(act.intro){
			if(checkForUnclosedBraces(act.intro)){
				errors.intro = true;
				hasError = true;
			}
		}

		if(act.constitution){
			if(checkForUnclosedBraces(act.constitution)){
				errors.constitution = true;
				hasError = true;
			}
		}

		if(act.conclusion){
			if(checkForUnclosedBraces(act.conclusion)){
				errors.conclusion = true;
				hasError = true;
			}
		}

		if(hasError){
			toast(
				<LiveToast
					message={this.props.translate.revise_text}
				/>, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,			
					className: "errorToast"
				}
			);
		}

		this.setState({
			disableButtons: hasError,
			errors
		});

		return hasError;
	}

	updateCouncilAct = async () => {
		const { __typename, ...act } = this.state.data.council.act;

		if(!this.checkBraces()){
			this.setState({
				updating: true,
				disableButtons: false
			});

			const response = await this.props.updateCouncilAct({
				variables: {
					councilAct: {
						...act,
						councilId: this.state.data.council.id
					}
				}
			});

			if(response){
				this.setState({
					updating: false
				});
			}
		}
	}

	updateAgendaState = object => {
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
		}, async () => {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => this.updateAgenda(), 450);
		});
	};

	checkAgendasCommentBraces = () => {
		let agendaErrors = new Map();
		let hasError = false;

		const { agendas } = this.state.data.council;

		agendas.forEach(agenda => {
			if(checkForUnclosedBraces(agenda.comment)){
				agendaErrors.set(agenda.id, true);
				hasError = true;
			}
		});

		if(hasError){
			toast(
				<LiveToast
					message={this.props.translate.revise_text}
				/>, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,			
					className: "errorToast"
				}
			);
		}

		this.setState({
			disableButtons: hasError,
			agendaErrors
		});

		return hasError;
	}

	updateAgenda = async () => {
		if(!this.checkAgendasCommentBraces()){
			const { agendas } = this.state.data.council;
			this.setState({
				updating: true
			});

			await Promise.all(agendas.map(async item => {
				const { __typename, votings, ...agenda } = item;
				await this.props.updateAgenda({
					variables: {
						agenda: {
							...agenda,
							councilId: this.state.data.council.id
						}
					}
				});
			}));
			this.updateCouncilAct();
		}
	}

	getTypeText = (subjectType) => {
		const votingType = this.props.data.votingTypes.find(item => item.value === subjectType)
		return !!votingType? this.props.translate[votingType.label] : '';
	}

	render() {
		const secondary = getSecondary();
		const primary = getPrimary();
		const { translate, company } = this.props;
		const {
			error,
			loading,
			companyStatutes
		} = this.props.data;
		const { errors, data } = this.state;
		const { council } = data;

		if (loading) {
			return <LoadingSection />;
		}

		if (error) {
			return <ErrorWrapper error={error} translate={translate} />;
		}

		return (
			<div style={{ height: "100%", background: 'transparent' }}>
				<div style={{overflow: 'hidden', height: 'calc(100% - 3.5em)'}}>
						<Scrollbar>
							<div style={{padding: '1.2em 5%'}}>
								{!!data.council.act &&
									<RichTextInput
										ref={editor => this.editorIntro = editor}
										floatingText={translate.intro}
										type="text"
										id="act-intro"
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
												value: `${company.businessName} `,
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
										value={data.council.act.intro || ''}
										onChange={value => {
											if(value !== data.council.act.intro){
												this.updateActState({
													intro: value
												})
											}
										}}
									/>
								}
								<div style={{marginTop: '1em'}}>
									<RichTextInput
										ref={editor => (this.editorConstitution = editor)}
										floatingText={translate.constitution}
										type="text"
										id="act-constitution"
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
												value: `${company.businessName} `,
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
										value={data.council.act.constitution || ''}
										onChange={value => {
											if(value !== data.council.act.constitution){
												this.updateActState({
													constitution: value
												})
											}
										}}
									/>
								</div>
								{!!council.agendas && (
									<Fragment>
										{council.agendas.filter(agenda => agenda.subjectType !== getActPointSubjectType()).map((agenda, index) => {
											return (
												<div style={{marginTop: '2.5em' }} key={`agenda${agenda.id}`}>
													<AgendaEditor
														agenda={agenda}
														council={council}
														error={this.state.agendaErrors.get(agenda.id)}
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
														updateAgenda={this.updateAgendaState}
														translate={translate}
														majorityTypes={this.props.data.majorityTypes}
														typeText={this.getTypeText(agenda.subjectType)}
													/>
													{index < council.agendas.length -1 &&
														<hr style={{marginTop: '2.5em'}} />
													}
												</div>
											);
										})}
									</Fragment>
								)}
								{!this.props.liveMode &&
									<div
										ref={ref => this.conclusionSection = ref}
									>
										<RichTextInput
											ref={editor => (this.editorConclusion = editor)}
											floatingText={translate.conclusion}
											type="text"
											id="act-conclusion"
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
											value={data.council.act.conclusion || ''}
											onChange={value => {
												this.updateActState({
													conclusion: value
												})
											}}
										/>
									</div>
								}
							</div>
						</Scrollbar>
					</div>
					<div
						style={{
							height: '3.5em',
							zIndex: '100',
							width: '100%',
							borderTop: '1px solid gainsboro',
							borderBottom: '1px solid gainsboro',
							display: 'flex',
							borderBottomRadius: '3px',
							justifyContent: 'flex-end',
							alignItems: 'center'
						}}
					>
						{!this.props.liveMode &&
							<div>
								<BasicButton
									text={translate.send_draft_act_review}
									color={"white"}
									disabled={this.state.disableButtons}
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
									loading={this.state.updating}
									loadingColor={primary}
									disabled={this.state.updating || this.state.disableButtons}
									color={"white"}
									textStyle={{
										color: primary,
										fontWeight: "700",
										fontSize: "0.9em",
										textTransform: "none"
									}}
									onClick={() => this.setState({
										finishActModal: true
									})}
									buttonStyle={{
										marginRight: "1em",
										border: `2px solid ${primary}`
									}}
								/>
							</div>

						}
					</div>
				<Dialog
					open={this.state.loadDraft}
					maxWidth={false}
					onClose={() => this.setState({ loadDraft: false })}
				>
					<DialogTitle>{translate.load_draft}</DialogTitle>
					<DialogContent style={{ width: "800px" }}>
						<LoadDraft
							translate={translate}
							companyId={this.props.company.id}
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
				<FinishActModal
					refetch={this.props.refetch}
					council={council}
					translate={translate}
					show={this.state.finishActModal}
					requestClose={() => this.setState({ finishActModal: false })}
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
	}),
	graphql(updateAgenda, {
		name: 'updateAgenda'
	})
)(withSharedProps()(ActEditor));
