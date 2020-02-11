import React from "react";
import { graphql, compose, withApollo } from "react-apollo";
import { getSecondary, getPrimary } from "../../../../styles/colors";
import gql from "graphql-tag";
import {
	BasicButton,
	Scrollbar,
	LoadingSection,
	LiveToast
} from "../../../../displayComponents";
import { PARTICIPANT_STATES } from "../../../../constants";
import withSharedProps from "../../../../HOCs/withSharedProps";
import { moment } from '../../../../containers/App';
import FinishActModal from "./FinishActModal";
import { updateCouncilAct } from '../../../../queries';
import { ConfigContext } from '../../../../containers/AppControl';
import {
	getActPointSubjectType,
	checkForUnclosedBraces,
	changeVariablesToValues,
	hasSecondCall,
	buildAttendantsString,
	generateAgendaText,
	getGoverningBodySignatories,
	generateStatuteTag
} from '../../../../utils/CBX';
import { toast } from 'react-toastify';
import { TAG_TYPES } from "../../../company/drafts/draftTags/utils";
import DocumentEditor2 from "../../../documentEditor/DocumentEditor2";
import { buildDoc, useDoc, buildDocBlock, buildDocVariable } from "../../../documentEditor/utils";
import DownloadDoc from "../../../documentEditor/DownloadDoc";
import { actBlocks } from "../../../documentEditor/actBlocks";


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
			language
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
				existsComments
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

export const ActContext = React.createContext();
const ActEditor = ({ translate, updateCouncilAct, councilID, client, company, refetch }) => {
	const [saving, setSaving] = React.useState(false);
	const [finishModal, setFinishModal] = React.useState(false);
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const primary = getPrimary();
	const secondary = getSecondary();
	const {
		doc,
        options,
        ...handlers
	} = useDoc({
		transformText: async text => changeVariablesToValues(text, {
			council: {
				...generateCouncilSmartTagsValues(data),
			},
			company
        }, translate)
	});

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: CouncilActData,
			variables: {
				councilID,
				companyId: company.id,
				options: {
					limit: 10000,
					offset: 0
				}
			}
		});

		const actDocument = response.data.council.act.document;

		setData(response.data);
		handlers.initializeDoc(actDocument? {
			doc: actDocument.fragments,
			options: actDocument.options
		} : {
			doc: buildDoc(response.data, translate, 'act'),
			options: {
				stamp: true,
				doubleColumn: false
			}
		});
		setLoading(false);
	}, [councilID]);

	React.useEffect(() => {
		getData();
	}, [getData]);

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

	const generatePreview = async () => {
		const response = await client.mutate({
			mutation: gql`
				mutation ACTHTML($doc: Document, $councilId: Int!){
					generateDocumentHTML(document: $doc, councilId: $councilId)
				}
			`,
			variables: {
				doc: buildDocVariable(doc, options),
				councilId: data.council.id
			}
		});
		return response.data.generateDocumentHTML;
	}

	const updateAct = async () => {
		setSaving(true);
		const response = await updateCouncilAct({
			variables: {
				councilAct: {
					document: {
						fragments: doc,
						options
					},
					councilId: data.council.id
				}
			}
		});
		if(!!response){
			setSaving(false);
		}
	}

	const finishAct = async () => {
        setFinishModal(true);
    }

	if (loading) {
		return <LoadingSection />;
	}

	let council = { ...data.council };
	council.attendants = data.councilAttendants.list;
	council.delegatedVotes = data.participantsWithDelegatedVote;

	return (
		<React.Fragment>
			<DocumentEditor2
				doc={doc}
				data={data}
				{...handlers}
				documentId={data.council.id}
				blocks={Object.keys(actBlocks).map(key => buildDocBlock(actBlocks[key], data, translate, translate))}
				options={options}
				generatePreview={generatePreview}
				download={true}
				documentMenu={
					<React.Fragment>
						<DownloadDoc
							translate={translate}
							doc={doc}
							options={options}
							council={data.council}
						/>
						<BasicButton
							text={translate.save}
							color={primary}
							onClick={updateAct}
							loading={saving}
							textStyle={{
								color: "white",
								fontSize: "0.9em",
								textTransform: "none"
							}}
							textPosition="after"
							iconInit={<i style={{ marginRight: "0.3em", fontSize: "18px" }} className="fa fa-floppy-o" aria-hidden="true"></i>}
							buttonStyle={{
								marginRight: "1em",
								boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
								borderRadius: '3px'
							}}
						/>
						<BasicButton
							text={translate.finish_and_aprove_act}
							color={secondary}
							textStyle={{
								color: "white",
								fontSize: "0.9em",
								textTransform: "none"
							}}
							onClick={finishAct}
							textPosition="after"
							iconInit={<i style={{ marginRight: "0.3em", fontSize: "18px" }} className="fa fa-floppy-o" aria-hidden="true"></i>}
							buttonStyle={{
								marginRight: "1em",
								boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
								borderRadius: '3px'
							}}
						/>

					</React.Fragment>
				}
				translate={translate}
			/>
			<FinishActModal
                show={finishModal}
                generatePreview={generatePreview}
				doc={doc}
				options={options}
				refetch={refetch}
				company={company}
				updateAct={updateAct}
                translate={translate}
                council={data.council}
                requestClose={() => {
                    setFinishModal(false)
                }}
            />
		</React.Fragment>
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
		attendantsString = data.council.attendants.reduce(buildAttendantsString(council, base), '');		/*council.attendants.reduce((acc, attendant) => {
			if(attendant.type === PARTICIPANT_TYPE.REPRESENTATIVE){
				const represented = attendant.delegationsAndRepresentations.find(p => p.state === PARTICIPANT_STATES.REPRESENTATED);
				if(represented){
					return acc + `
					<p style="border: 1px solid black; padding: 5px;">-
						${attendant.name} ${attendant.surname} con DNI ${attendant.dni} en representación de ${
							represented.name + ' ' + represented.surname
						}${(council.statute.quorumPrototype === 1)? ` titular de ${represented.numParticipations} acciones` : ''}
					<p><br/>`;
				}
				return '';

			}
			return acc + `
			<p style="border: 1px solid black; padding: 5px;">-
				${attendant.name} ${attendant.surname} - con DNI ${attendant.dni}${(council.statute.quorumPrototype === 1 && attendant.numParticipations > 0)? ` titular de ${attendant.numParticipations} participaciones` : ''}
			<p><br/>
		`}, `<br/><h4>${translate.assistants.charAt(0).toUpperCase() + translate.assistants.slice(1)}</h4><br/>`);*/
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