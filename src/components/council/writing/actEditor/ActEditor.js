import React, { Component, Fragment } from "react";
import { graphql, compose, withApollo } from "react-apollo";
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
import { TAG_TYPES } from "../../../company/drafts/draftTags/utils";
import { isMobile } from "../../../../utils/screen";
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
				document
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


const ActEditor = ({ translate, updateCouncilAct, councilID, client, companyID }) => {
	const [saving, setSaving] = React.useState(false);
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);



	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: CouncilActData,
			variables: {
				councilID,
				companyId: companyID,
				options: {
					limit: 10000,
					offset: 0
				}
			}
		});

		setData(response.data);
		setLoading(false);
	}, [councilID]);

	React.useEffect(() => {
		getData();
	}, [getData]);
	// const [{
	// 	loading,
	// }, setState] = React.useState({
	// 	loading: false,
	// 	data: {},
	// 	updating: false,
	// 	draftType: null,
	// 	sendActDraft: false,
	// 	disableButtons: false,
	// 	agendaErrors: new Map(),
	// 	finishActModal: false,
	// 	loadDraft: false,
	// 	errors: {}
	// });

	//timeout = null;

	const loadDraft = async draft => {
		// const { data } = this.state;
 		// const correctedText = await changeVariablesToValues(draft.text, {
		// 	company: this.props.company,
		// 	council: generateCouncilSmartTagsValues(data)
		// }, this.props.translate);

		// this[this.state.load].paste(correctedText);
		// this.setState({
		// 	loadDraft: false
		// });
	}

	const updateActState = async object => {
		// this.setState({
		// 	data: {
		// 		...this.state.data,
		// 		council: {
		// 			...this.state.data.council,
		// 			act: {
		// 				...this.state.data.council.act,
		// 				...object
		// 			}
		// 		}
		// 	}
		// }, async () => {
		// 	clearTimeout(this.timeout);
		// 	this.timeout = setTimeout(() => this.updateCouncilAct(), 450);
		// });
	};

	const checkBraces = () => {
		// const act = this.state.data.council.act;
		// let errors = {
		// 	intro: false,
		// 	conclusion: false,
		// 	constitution: false
		// };
		// let hasError = false;

		// if(act.intro){
		// 	if(checkForUnclosedBraces(act.intro)){
		// 		errors.intro = true;
		// 		hasError = true;
		// 	}
		// }

		// if(act.constitution){
		// 	if(checkForUnclosedBraces(act.constitution)){
		// 		errors.constitution = true;
		// 		hasError = true;
		// 	}
		// }

		// if(act.conclusion){
		// 	if(checkForUnclosedBraces(act.conclusion)){
		// 		errors.conclusion = true;
		// 		hasError = true;
		// 	}
		// }

		// if(hasError){
		// 	toast(
		// 		<LiveToast
		// 			message={this.props.translate.revise_text}
		// 		/>, {
		// 			position: toast.POSITION.TOP_RIGHT,
		// 			autoClose: true,
		// 			className: "errorToast"
		// 		}
		// 	);
		// }

		// this.setState({
		// 	disableButtons: hasError,
		// 	errors
		// });

		// return hasError;
	}

	const updateAct = async doc => {
		setSaving(true);
		const response = await updateCouncilAct({
			variables: {
				councilAct: {
					document: doc,
					councilId: data.council.id
				}
			}
		});
		if(!!response){
			setSaving(false);
		}
	}

	const getTypeText = subjectType => {
		const votingType = data.votingTypes.find(item => item.value === subjectType)
		return !!votingType? translate[votingType.label] : '';
	}

	if (loading) {
		return <LoadingSection />;
	}

	// if (error) {
	// 	return <ErrorWrapper error={error} translate={translate} />;
	// }

	let council = { ...data.council };
	council.attendants = data.councilAttendants.list;
	council.delegatedVotes = data.participantsWithDelegatedVote;

	return (
		<DocumentEditor
			data={data}
			updateDocument={updateAct}
		/>
	)
}

export default compose(
	graphql(updateCouncilAct, {
		name: 'updateCouncilAct'
	}),
	withApollo
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