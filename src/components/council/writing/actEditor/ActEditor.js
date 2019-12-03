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
import { DRAFT_TYPES, PARTICIPANT_STATES, PARTICIPANT_TYPE } from "../../../../constants";
import withSharedProps from "../../../../HOCs/withSharedProps";
import { moment } from '../../../../containers/App';
import Dialog, { DialogContent, DialogTitle } from "material-ui/Dialog";
import SendActDraftModal from './SendActDraftModal';
import FinishActModal from "./FinishActModal";
import { updateCouncilAct } from '../../../../queries';
import DownloadActPDF from '../actViewer/DownloadActPDF';
import ExportActToMenu from '../actViewer/ExportActToMenu';
import { ConfigContext } from '../../../../containers/AppControl';
import {
	getActPointSubjectType,
	checkForUnclosedBraces,
	changeVariablesToValues,
	hasSecondCall,
	generateAgendaText,
	getGoverningBodySignatories,
	generateStatuteTag
} from '../../../../utils/CBX';
import { toast } from 'react-toastify';
import { isMobile } from "react-device-detect";
import { TAG_TYPES } from "../../../company/drafts/draftTags/utils";
import DocumentEditor from "../../../documentEditor/DocumentEditor";

export const CouncilActData = gql`
	query CouncilActData($councilID: Int!, $companyId: Int!, $options: OptionsInput ) {
		council(id: $councilID) {
			id
			businessName
			country
			countryState
			currentQuorum
			emailText
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
				title
				statuteId
				prototype
				existsSecondCall
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
			socialCapitalPresent
			socialCapitalRemote
			socialCapitalCurrentRemote
			socialCapitalNoParticipate
			comment
		}
		councilRecount(councilId: $councilID){
			socialCapitalTotal
			partTotal
			partPresent
			partRemote
			partNoParticipate
			numCurrentRemote
			numPresent
			numNoParticipate
			numRemote
			socialCapitalPresent
			numDelegations
			numTotal
			weighedPartTotal
			numTotal
		}
		participantsWithDelegatedVote(councilId: $councilID){
			id
			name
			surname
			state
			numParticipations
			socialCapital
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
				dni
				state
				type
				socialCapital
				delegationsAndRepresentations {
					type
					state
					name
					surname
					socialCapital
					numParticipations
				}
				numParticipations
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

const cache = new Map();

export const generateCouncilSmartTagsValues = data => {
	const string = JSON.stringify(data);
	if(cache.has(string)){
		return cache.get(string);
	}

	const numParticipationsPresent = (data.councilAttendants.list.reduce((acc, curr) => {
		let counter = acc;
		counter = counter + curr.numParticipations;
		if(curr.delegationsAndRepresentations.filter(p => p.state === PARTICIPANT_STATES.REPRESENTATED).length > 0){
			counter = counter + curr.delegationsAndRepresentations.reduce((acc, curr) => {
				return acc + curr.numParticipations;
			}, 0);
		}
		return counter;
	}, 0));

	const numParticipationsRepresented = (data.participantsWithDelegatedVote.reduce((acc, curr) => acc + curr.numParticipations, 0));


	const percentageSCPresent = ((numParticipationsPresent / data.councilRecount.partTotal) * 100).toFixed(3);

	const percentageSCDelegated = ((numParticipationsRepresented / data.councilRecount.partTotal) * 100).toFixed(3);

	const calculatedObject = {
		...data.council,
		agenda: data.agendas,
		...data.councilRecount,
		attendants: data.councilAttendants.list,
		numPresentAttendance: data.councilAttendants.list.filter(p => p.state === 5 || p.state === 7).length,
		numRemoteAttendance: data.councilAttendants.list.filter(p => p.state === 0).length,
		numDelegatedAttendance: data.participantsWithDelegatedVote.length,
		numTotalAttendance: data.participantsWithDelegatedVote.length + data.councilAttendants.list.length,
		percentageSCPresent,
		percentageSCDelegated,
		numParticipationsPresent,
		numParticipationsRepresented,
		percentageSCTotal: (+percentageSCDelegated + (+percentageSCPresent)).toFixed(3)
	}

	cache.set(string, calculatedObject);
	return calculatedObject;
}

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
		const { data } = this.state;
 		const correctedText = await changeVariablesToValues(draft.text, {
			company: this.props.company,
			council: generateCouncilSmartTagsValues(data)
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
			<DocumentEditor

			/>
		)

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
											{!this.props.liveMode &&
												<React.Fragment>
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
															text={translate.governing_body_members}
															color={'white'}
															type="flat"
															textStyle={{ color: secondary }}
															buttonStyle={{border: `1px solid ${secondary}`, marginLeft: '0.6em'}}
															onClick={this.props.toggleInfoMenu}
														/>
													:
														<Config config={config}/>
													}
												</React.Fragment>
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
												tags={generateActTags('intro', {
													council: {
														...council,
														...generateCouncilSmartTagsValues(data)
													},
													company,
													recount: this.props.councilRecount || data.councilRecount
												}, translate)}
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
												tags={generateActTags('constitution', {
													council: {
														...council,
														...generateCouncilSmartTagsValues(data)
													},
													company,
													recount: this.props.councilRecount || data.councilRecount
												}, translate)}
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
													tags={generateActTags('conclusion', {
														council: {
															...council,
															...generateCouncilSmartTagsValues(data)
														},
														company,
														recount: this.props.councilRecount || data.councilRecount
													}, translate)}
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
											id={'finalizarRedaccionDeActa'}
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
									defaultTags={{
										[this.state.load]: {
											active: true,
											type: TAG_TYPES.DRAFT_TYPE,
											name: this.state.load,
											label: translate[this.state.load]
										},
										...generateStatuteTag(council.statute, translate)
									}}
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
			fetchPolicy: 'network-only',
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(updateCouncilAct, {
		name: 'updateCouncilAct'
	})
)(withSharedProps()(ActEditor));


export const generateActTags = (type, data, translate) => {
	const { council, company } = data;
	let tags;
	const base = data.recount.partTotal;
	let attendantsString = cache.get(`${council.id}_attendants`);
	let delegatedVotesString = cache.get(`${council.id}_delegated`);

	//TRADUCCION

	if(!attendantsString){
		attendantsString = council.attendants.reduce((acc, attendant) => {
			if(attendant.type === PARTICIPANT_TYPE.REPRESENTATIVE){
				const represented = attendant.delegationsAndRepresentations.find(p => p.state === PARTICIPANT_STATES.REPRESENTATED);
				return acc + `
				<p style="border: 1px solid black; padding: 5px;">-
					${attendant.name} ${attendant.surname} con DNI ${attendant.dni} en representación de ${
						represented.name + ' ' + represented.surname
					}${(council.statute.quorumPrototype === 1)? ` titular de ${represented.numParticipations} acciones` : ''}
				<p><br/>`;
			}
			return acc + `
			<p style="border: 1px solid black; padding: 5px;">-
				${attendant.name} ${attendant.surname} - con DNI ${attendant.dni}${(council.statute.quorumPrototype === 1 && attendant.numParticipations > 0)? ` titular de ${attendant.numParticipations} participaciones` : ''}
			<p><br/>
		`}, `<br/><h4>${translate.assistants.charAt(0).toUpperCase() + translate.assistants.slice(1)}</h4><br/>`);
		cache.set(`${council.id}_attendants`, attendantsString);
	}

	if(!delegatedVotesString){
		delegatedVotesString = council.delegatedVotes.reduce((acc, vote) => {
			return acc + `<p style="border: 1px solid black; padding: 5px;">-${
				vote.name} ${
				vote.surname} titular de ${vote.numParticipations} ${
				translate.delegates.toLowerCase()} ${
				vote.representative && vote.representative.name} ${vote.representative && vote.representative.surname} </p><br/>`
		}, `<br/><h4>${translate.delegations}</h4><br/>`);
		cache.set(`${council.id}_delegated`, delegatedVotesString);
	}


	const smartTags = {
		businessName: {
			value: `${company.businessName} `,
			label: translate.business_name
		},
		dateStart: {
			value: moment(council.dateStart).format('LLL'),
			label: translate['1st_call_date']
		},
		dateStart2NdCall: {
			value: moment(council.dateStart2NdCall).format('LLL'),
			label: translate['2nd_call_date']
		},
		dateRealStart: {
			value: `${moment(council.dateRealStart).format(
				"LLLL"
			)} `,
			label: translate.date_real_start
		},
		firstOrSecondConvene: {
			value: `${
				council.firstOrSecondConvene
					? translate.first
					: translate.second
			} `,
			label: translate.first_or_second_call
		},
		location: {
			value: council.remoteCelebration === 1? translate.remote_celebration : council.street,
			label: translate.new_location_of_celebrate
		},
		now: {
			getValue: () => moment().format('LLL'),
			label: translate.actual_date
		},
		city: {
			value: council.city,
			label: translate.company_new_locality
		},
		country: {
			value: council.countryState,
			label: translate.company_new_country_state
		},
		attendants: {
			value: attendantsString,
			label: translate.assistants.charAt(0).toUpperCase() + translate.assistants.slice(1)
		},
		delegatedVotes: {
			value: delegatedVotesString,
			label: translate.delegations
		},
		numDelegations: {
			value: council.delegatedVotes.length,
			label: translate.num_delegations
		},
		president: {
			value: council.president,
			label: translate.president
		},
		secretary: {
			value: council.secretary,
			label: translate.secretary
		},
		currentQuorum: {
			value: council.currentQuorum,
			label: translate.number_of_participations
		},
		percentageShares: {
			value: (council.currentQuorum / parseInt(base, 10) * 100).toFixed(3),
			label: translate.social_capital_percentage
		},
		dateEnd: {
			value: `${moment(council.dateEnd).format(
				"LLLL"
			)} `,
			label: translate.date_end
		},
		numPresentOrRemote: {
			value: council.numPresentAttendance + council.numRemoteAttendance,
			label: translate.number_attentands_in_person
		},
		percentageSCPresent: {
			value: council.percentageSCPresent + '%',
			label: translate.percentage_shares_personally
		},
		percentageSCDelegated: {
			value: council.percentageSCDelegated + '%',
			label: translate.percentage_shares_represented
		},
		percentageSCTotal: {
			value: council.percentageSCTotal + '%',
			label: translate.percentage_quorum
		},
		numParticipationsPresent: {
			value: council.numParticipationsPresent,
			label: translate.number_shares_personally
		},
		numParticipationsRepresented: {
			value: council.numParticipationsRepresented,
			label: translate.number_shares_represented
		},
		convene: {
			value: council.emailText,
			label: translate.convene
		},
		agenda: {
			value: generateAgendaText(translate, council.agenda),
			label: translate.agenda
		},
		signatories: {
			value: getGoverningBodySignatories(translate, company.governingBodyType, company.governingBodyData),
			label: translate.signatories
		}
	}

	switch(type){
		case 'intro':
			tags = [
				smartTags.businessName,
				smartTags.dateStart
			]

			if(hasSecondCall(council.statute)){
				tags = [...tags, smartTags.dateStart2NdCall];
			}

			if(council.remoteCelebration !== 1){
				tags = [...tags, smartTags.city, smartTags.country];
			}

			tags = [...tags,
				smartTags.dateRealStart,
				smartTags.firstOrSecondConvene,
				smartTags.president,
				smartTags.secretary,
				smartTags.location,
				smartTags.now,
				smartTags.convene,
				smartTags.attendants,
				smartTags.agenda,
				smartTags.delegatedVotes,
				smartTags.numPresentOrRemote,
				smartTags.numDelegations,
				smartTags.numParticipationsPresent,
				smartTags.numParticipationsRepresented,
				smartTags.percentageSCPresent,
				smartTags.percentageSCDelegated,
				smartTags.percentageSCTotal
			]

			return tags;

		case 'certHeader':
			tags = [
				smartTags.businessName,
				smartTags.dateStart
			]

			if(hasSecondCall(council.statute)){
				tags = [...tags, smartTags.dateStart2NdCall];
			}

			if(council.remoteCelebration !== 1){
				tags = [...tags, smartTags.city, smartTags.country];
			}

			tags = [...tags,
				smartTags.dateRealStart,
				smartTags.firstOrSecondConvene,
				smartTags.president,
				smartTags.secretary,
				smartTags.location,
				smartTags.now,
				smartTags.convene,
				smartTags.agenda,
				smartTags.attendants,
				smartTags.delegatedVotes,
				smartTags.numPresentOrRemote,
				smartTags.numDelegations,
				smartTags.numParticipationsPresent,
				smartTags.numParticipationsRepresented,
				smartTags.percentageSCPresent,
				smartTags.percentageSCDelegated,
				smartTags.percentageSCTotal
			]
			return tags;

		case 'constitution':
			tags = [
				smartTags.businessName,
				smartTags.now,
				smartTags.president,
				smartTags.secretary,
				smartTags.percentageShares,
				smartTags.location,
				smartTags.dateRealStart,
				smartTags.percentageSCPresent,
				smartTags.percentageSCDelegated,
				smartTags.percentageSCTotal
			]

			if(council.remoteCelebration !== 1){
				tags = [...tags, smartTags.city, smartTags.country];
			}


			tags = [...tags,
				smartTags.attendants,
				smartTags.delegatedVotes,
				smartTags.numPresentOrRemote,
				smartTags.numDelegations,
				smartTags.numParticipationsPresent,
				smartTags.numParticipationsRepresented,
				smartTags.currentQuorum,
			];

			return tags;

		case 'conclusion':
			tags = [
				smartTags.president,
				smartTags.secretary,
				smartTags.dateEnd,
				smartTags.attendants,
				smartTags.delegatedVotes,
				smartTags.numDelegations
			]
			return tags;

		case 'certFooter': {
			tags = [
				smartTags.president,
				smartTags.secretary,
				smartTags.signatories,
				smartTags.now,
				smartTags.dateEnd,
				smartTags.attendants,
				smartTags.delegatedVotes,
				smartTags.numDelegations
			]
			return tags;
		}
		default:
			return [];
	}
}