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
import AgendaEditor from "./AgendaEditor";
import { DRAFT_TYPES } from "../../../../constants";
import withSharedProps from "../../../../HOCs/withSharedProps";
import { moment } from '../../../../containers/App';
import Dialog, { DialogContent, DialogTitle } from "material-ui/Dialog";
import SendActDraftModal from './SendActDraftModal';
import FinishActModal from "./FinishActModal";
import { updateCouncilAct } from '../../../../queries';
import DownloadActPDF from '../actViewer/DownloadActPDF';
import ExportActToMenu from '../actViewer/ExportActToMenu';
import { ConfigContext } from '../../../../containers/AppControl';
import { getActPointSubjectType, checkForUnclosedBraces, changeVariablesToValues } from '../../../../utils/CBX';
import { toast } from 'react-toastify';
import { isMobile } from "react-device-detect";

const CouncilActData = gql`
	query CouncilActData($councilID: Int!, $companyId: Int!, $options: OptionsInput ) {
		council(id: $councilID) {
			id
			businessName
			country
			countryState
			currentQuorum
			quorumPrototype
			secretary
			president
			street
			city
			name
			remoteCelebration
			dateStart
			dateStart2NdCall
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
			items {
				id
				value
			}
			options {
				id
				maxSelections
			}
			ballots {
				id
				participantId
				weight
				value
				itemId
			}
			numNoVoteVotings
			numPositiveVotings
			numNegativeVotings
			numAbstentionVotings
			numPresentCensus
			presentCensus
			numCurrentRemoteCensus
			currentRemoteCensus
			comment
		}

		councilRecount(councilId: $councilID){
			socialCapitalTotal
			partTotal
			partPresent
			partRemote
			weighedPartTotal
			numTotal
		}

		participantsWithDelegatedVote(councilId: $councilID){
			id
			name
			surname
			state
			representative {
				id
				name
				surname
			}
		}

		votingTypes {
			label
			value
		}

		councilAttendants(
			councilId: $councilID
			options: $options
		) {
			list {
				id
				name
				surname
				lastDateConnection
			}
		}

		companyStatutes(companyId: $companyId) {
			id
			title
			censusId
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

	static getDerivedStateFromProps(nextProps, prevState) {
		if (!nextProps.data.loading) {
			if (!prevState.data.council) {
				return {
					data: {
						...nextProps.data,
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

	componentDidMount() {
		this.props.data.refetch();
	}

	loadDraft = async draft => {
 		const correctedText = await changeVariablesToValues(draft.text, {
			company: this.props.company,
			council: this.state.data.council
		}, this.props.translate);

		this[this.state.load].paste(correctedText);
		this.setState({
			loadDraft: false
		});
	};

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
		if(this.state.data.council.act){
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
				if(!!response){
					this.setState({
						updating: false
					});
				}
			}
		}
	}

	getTypeText = subjectType => {
		const votingType = this.state.data.votingTypes.find(item => item.value === subjectType)
		return !!votingType? this.props.translate[votingType.label] : '';
	}

	render() {
		const secondary = getSecondary();
		const primary = getPrimary();
		const { translate, company } = this.props;
		const {
			error,
			loading,
		} = this.props.data;
		const { errors, data } = this.state;
		let { council } = data;

		if (loading) {
			return <LoadingSection />;
		}

		if (error) {
			return <ErrorWrapper error={error} translate={translate} />;
		}

		council.attendants = this.state.data.councilAttendants.list;
		council.delegatedVotes = this.state.data.participantsWithDelegatedVote;


		return (
			<ConfigContext.Consumer>
				{config => (
					<div style={{ height: "100%", background: 'transparent' }}>
						<div style={{overflow: 'hidden', height: 'calc(100% - 3.5em)'}}>
								<Scrollbar>
									<div style={{padding: '1.2em 5%'}}>
										<div
											style={{
												display: 'flex',
												width: '100%',
												padding: '0.6em 0px',
												justifyContent: 'flex-end'
											}}
										>
											{config.exportActToWord?
												<div style={{display: 'flex'}}>
													<ExportActToMenu
														translate={this.props.translate}
														council={council}
														html={this.state.data.council.act.emailAct}
													/>
												</div>
											:
												<DownloadActPDF
													translate={this.props.translate}
													council={council}
												/>
											}
											{config.actCouncilInfo?
												<BasicButton
													text={this.props.translate.show_info_panel}
													color={'white'}
													type="flat"
													textStyle={{ color: secondary }}
													buttonStyle={{border: `1px solid ${secondary}`, marginLeft: '0.6em'}}
													onClick={this.props.toggleInfoMenu}
												/>
											:
												<Config config={config}/>
											}


										</div>
										{!!data.council.act && data.council.act.intro !== undefined &&
											<RichTextInput
												ref={editor => this.intro = editor}
												translate={translate}
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
																load: 'intro',
																draftType: DRAFT_TYPES.INTRO
															})
														}
													/>
												}
												tags={generateActTags('intro', { council, company, recount: this.props.councilRecount || data.councilRecount }, translate)}
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
												ref={editor => (this.constitution = editor)}
												floatingText={translate.constitution}
												translate={translate}
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
																load: 'constitution',
																draftType: DRAFT_TYPES.CONSTITUTION
															})
														}
													/>
												}
												tags={generateActTags('constitution', { council, company, recount: this.props.councilRecount || data.councilRecount }, translate)}
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
																updateCouncilAct={this.updateCouncilAct}
																recount={this.state.data.councilRecount}
																statutes={this.state.data.companyStatutes}
																translate={translate}
																majorityTypes={this.state.data.majorityTypes}
																typeText={this.getTypeText(agenda.subjectType)}
																company={this.props.company}
																data={this.state.data}
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
													ref={editor => (this.conclusion = editor)}
													floatingText={translate.conclusion}
													translate={translate}
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
																	load: 'conclusion',
																	draftType: DRAFT_TYPES.CONCLUSION
																})
															}
														/>
													}
													tags={generateActTags('conclusion', { council, company, recount: this.props.councilRecount || data.councilRecount }, translate)}
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
											text={translate.save_draft}
											color={"white"}
											loadingColor={primary}
											disabled={this.state.disableButtons}
											loading={this.state.updating}
											textStyle={{
												color: primary,
												fontWeight: "700",
												fontSize: "0.9em",
												textTransform: "none"
											}}
											onClick={() => this.updateActState({})}
											buttonStyle={{
												marginRight: "1em",
												border: `2px solid ${primary}`
											}}
										/>
										<BasicButton
											text={isMobile? translate.send_draft_phone_button : translate.send_draft_act_review}
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
											text={isMobile? translate.finish : translate.end_writing_act}
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
									loadDraft={this.loadDraft}
									statute={council.statute}
									statutes={this.state.data.companyStatutes}
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
							config={config}
							liveMode={this.props.liveMode}
							translate={translate}
							show={this.state.finishActModal}
							requestClose={() => this.setState({ finishActModal: false })}
						/>
					</div>
				)}
			</ConfigContext.Consumer>
		);
	}
}

const Config = config => {
	return <span/>
}


export default compose(
	graphql(CouncilActData, {
		name: "data",
		options: props => ({
			variables: {
				councilID: props.councilID,
				companyId: props.companyID,
				options: {
					limit: 10000,
					offset: 0
				}
			},
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(updateCouncilAct, {
		name: 'updateCouncilAct'
	})
)(withSharedProps()(ActEditor));

const generateActTags = (type, data, translate) => {
	const { council, company } = data;
	let tags;
	let attendantsString = '';
	let delegatedVotesString = '';
	council.attendants.forEach(attendant => attendantsString += `${attendant.name} ${attendant.surname} <br/>`);
	council.delegatedVotes.forEach(vote => delegatedVotesString += `${vote.name} ${vote.surname} ${translate.delegates.toLowerCase()} ${vote.representative && vote.representative.name} ${vote.representative && vote.representative.surname} <br/>`);

	switch(type){
		case 'intro':
			tags = [
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
					value: council.remoteCelebration === 1? translate.remote_celebration : council.street,
					label: translate.new_location_of_celebrate
				},
			]

			if(council.remoteCelebration !== 1){
				tags = [...tags,
					{
						value: council.city,
						label: translate.company_new_locality
					},
					{
						value: council.countryState,
						label: translate.company_new_country_state
					}
				];
			}

			tags = [...tags,
				{
					value: attendantsString,
					label: translate.assistants.charAt(0).toUpperCase() + translate.assistants.slice(1)
				},
				{
					value: delegatedVotesString,
					label: translate.delegations
				},
				{
					value: council.delegatedVotes.length,
					label: translate.num_delegations
				}
			]

			return tags;

		case 'constitution':
			const base = council.quorumPrototype === 1? data.recount.socialCapitalTotal : data.recount.partTotal;
			tags = [
				{
					value: `${company.businessName} `,
					label: translate.business_name
				},
				{
					value: council.president,
					label: translate.president
				},
				{
					value: council.secretary,
					label: translate.secretary
				},
				{
					value: council.currentQuorum,
					label: `${translate.social_capital}/ ${translate.participants.toLowerCase()}`
				},
				{
					value: (council.currentQuorum / parseInt(base) * 100).toFixed(3),
					label: translate.social_capital_percentage
				},
				{
					value: council.remoteCelebration === 1? translate.remote_celebration : council.street,
					label: translate.new_location_of_celebrate
				},
				{
					value: `${moment(council.dateRealStart).format(
						"LLLL"
					)} `,
					label: translate.date_real_start
				}
			]

			if(council.remoteCelebration !== 1){
				tags = [...tags,
					{
						value: council.city,
						label: translate.company_new_locality
					},
					{
						value: council.countryState,
						label: translate.company_new_country_state
					}
				];
			}


			tags = [...tags,
				{
					value: attendantsString,
					label: translate.assistants.charAt(0).toUpperCase() + translate.assistants.slice(1)
				},
				{
					value: delegatedVotesString,
					label: translate.delegations
				},
				{
					value: council.delegatedVotes.length,
					label: translate.num_delegations
				}
			]

			return tags;

		case 'conclusion':
			tags = [
				{
					value: council.president,
					label: translate.president
				},
				{
					value: council.secretary,
					label: translate.secretary
				},
				{
					value: `${moment(council.dateEnd).format(
						"LLLL"
					)} `,
					label: translate.date_end
				},
				{
					value: attendantsString,
					label: translate.assistants.charAt(0).toUpperCase() + translate.assistants.slice(1)
				},
				{
					value: delegatedVotesString,
					label: translate.delegations
				},
				{
					value: council.delegatedVotes.length,
					label: translate.num_delegations
				}
			]
			return tags;

		default:
			return [];
	}
}
