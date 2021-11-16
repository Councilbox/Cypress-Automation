import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import { getSecondary, getPrimary } from '../../../../styles/colors';
import {
	BasicButton,
	LoadingSection,
} from '../../../../displayComponents';
import { PARTICIPANT_STATES, AGENDA_STATES } from '../../../../constants';
import withSharedProps from '../../../../HOCs/withSharedProps';
import { moment } from '../../../../containers/App';
import FinishActModal from './FinishActModal';
import { updateCouncilAct as updateMutation } from '../../../../queries';
import { ConfigContext } from '../../../../containers/AppControl';
import {
	changeVariablesToValues,
	hasSecondCall,
	buildAttendantsString,
	generateAgendaText,
	getGoverningBodySignatories,
	buildDelegationsString
} from '../../../../utils/CBX';
import DocumentEditor from '../../../documentEditor/DocumentEditor';
import {
	buildDoc, useDoc, buildDocBlock, buildDocVariable
} from '../../../documentEditor/utils';
import DownloadDoc from '../../../documentEditor/DownloadDoc';
import { actBlocks } from '../../../documentEditor/actBlocks';
import SendActToVote from '../../live/act/SendActToVote';
import SendActDraftModal from './SendActDraftModal';


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
			councilType
			president
			street
			city
			wallActive
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
				introRightColumn
				constitutionRightColumn
				conclusionRightColumn
			}
			statute {
				id
				title
				statuteId
				decimalDigits
				doubleColumnDocs
				prototype
				existsSecondCall
				existsQualityVote
				introSecondary
				conclusionSecondary
				constitutionSecondary
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
			recount
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
			commentRightColumn
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
				position
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
	if (cache.has(string)) {
		return cache.get(string);
	}

	const numParticipationsPresent = (data.councilAttendants.list.reduce((acc, curr) => {
		let counter = acc;
		counter += curr.numParticipations;
		if (curr.delegationsAndRepresentations.filter(p => p.state === PARTICIPANT_STATES.REPRESENTATED).length > 0) {
			counter += curr.delegationsAndRepresentations.reduce((sum, par) => sum + par.numParticipations, 0);
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
	};

	cache.set(string, calculatedObject);
	return calculatedObject;
};

export const ActContext = React.createContext();
const ActEditor = ({
	translate, updateCouncilAct, councilID, client, company, refetch, withDrawer, liveMode
}) => {
	const [saving, setSaving] = React.useState(false);
	const [sendToVote, setSendToVote] = React.useState(false);
	const [sendActDraft, setSendActDraft] = React.useState(false);
	const [finishModal, setFinishModal] = React.useState(false);
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const config = React.useContext(ConfigContext);
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

		setData({
			...response.data,
			company
		});

		handlers.initializeDoc(actDocument ? {
			doc: actDocument.fragments,
			options: actDocument.options
		} : {
			doc: buildDoc({
				...response.data,
				company
			}, translate, 'act'),
			options: {
				stamp: !config.disableDocumentStamps,
				doubleColumn: response.data.council.statute.doubleColumnDocs === 1,
				language: response.data.council.language,
				secondaryLanguage: 'en'
			}
		});
		setLoading(false);
	}, [councilID]);

	React.useEffect(() => {
		getData();
	}, [getData]);

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
	};

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
		if (response) {
			setSaving(false);
		}
	};

	const finishAct = async () => {
		setFinishModal(true);
	};

	if (loading) {
		return <LoadingSection />;
	}

	const council = { ...data.council };
	council.attendants = data.councilAttendants.list;
	council.delegatedVotes = data.participantsWithDelegatedVote;

	const finishedToolbar = () => (
		<>
			<DownloadDoc
				translate={translate}
				doc={doc}
				options={options}
				council={data.council}
				styles={{
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
				}}
			/>
			<BasicButton
				text={translate.save}
				id="council-act-save-button"
				color={primary}
				onClick={updateAct}
				loading={saving}
				textStyle={{
					color: 'white',
					fontSize: '0.9em',
					textTransform: 'none'
				}}
				textPosition="after"
				iconInit={<i style={{ marginRight: '0.3em', fontSize: '18px' }} className="fa fa-floppy-o" aria-hidden="true"></i>}
				buttonStyle={{
					marginRight: '1em',
					boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
					borderRadius: '3px'
				}}
			/>
			<BasicButton
				text={translate.send_draft_phone_button}
				id="council-act-send-draft-button"
				color={secondary}
				onClick={() => setSendActDraft(true)}
				loading={saving}
				textStyle={{
					color: 'white',
					fontSize: '0.9em',
					textTransform: 'none'
				}}
				textPosition="after"
				iconInit={<i style={{ marginRight: '0.3em', fontSize: '18px' }} className="fa fa-file-text-o" aria-hidden="true"></i>}
				buttonStyle={{
					marginRight: '1em',
					boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
					borderRadius: '3px'
				}}
			/>
			<SendActDraftModal
				translate={translate}
				council={council}
				updateAct={updateAct}
				show={sendActDraft}
				requestClose={() => setSendActDraft(false)}
			/>
			<FinishActModal
				finishInModal={true}
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
					setFinishModal(false);
				}}
			/>
			<BasicButton
				text={
					<span style={{

					}}>
						{translate.finish_and_aprove_act}
					</span>
				}
				id="council-act-approve-button"
				color={secondary}
				textStyle={{
					color: 'white',
					fontSize: '0.9em',
					textTransform: 'none'
				}}
				onClick={finishAct}
				textPosition="after"
				iconInit={<i style={{ marginRight: '0.3em', fontSize: '18px' }} className="fa fa-check" aria-hidden="true"></i>}
				buttonStyle={{
					marginRight: '1em',
					boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
					borderRadius: '3px',
					overflow: 'hidden'
				}}
			/>

		</>
	);

	const liveToolbar = () => {
		const actPoint = data.agendas[data.agendas.length - 1];

		return (
			<>
				{actPoint.pointState === AGENDA_STATES.CLOSED ?
					<>
						<FinishActModal
							finishInModal={true}
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
								setFinishModal(false);
							}}
						/>
						<BasicButton
							text={
								<span style={{

								}}>
									{translate.finish_and_aprove_act}
								</span>
							}
							color={secondary}
							id="council-act-approve-button"
							textStyle={{
								color: 'white',
								fontSize: '0.9em',
								textTransform: 'none'
							}}
							onClick={finishAct}
							textPosition="after"
							iconInit={<i style={{ marginRight: '0.3em', fontSize: '18px' }} className="fa fa-floppy-o" aria-hidden="true"></i>}
							buttonStyle={{
								marginRight: '1em',
								boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
								borderRadius: '3px',
								overflow: 'hidden'
							}}
						/>
					</>

					: <>
						<BasicButton
							text={translate.save_preview_act}
							color={'white'}
							id="council-act-send-to-vote-button"
							textStyle={{
								color: primary,
								fontWeight: '700',
								fontSize: '0.9em',
								textTransform: 'none'
							}}
							onClick={() => setSendToVote(true)}
							buttonStyle={{
								marginRight: '1em',
								border: `2px solid ${primary}`
							}}
						/>
						<SendActToVote
							council={data.council}
							agenda={actPoint}
							refetch={refetch}
							updateAct={updateAct}
							generatePreview={generatePreview}
							doc={doc}
							options={options}
							company={company}
							translate={translate}
							show={sendToVote}
							requestClose={() => setSendToVote(false)}
						/>
					</>
				}
			</>
		);
	};

	return (
		<React.Fragment>
			<DocumentEditor
				withDrawer={withDrawer}
				doc={doc}
				data={data}
				{...handlers}
				documentId={data.council.id}
				blocks={Object.keys(actBlocks).map(key => buildDocBlock(actBlocks[key], data, translate.selectedLanguage, 'en'))}
				options={options}
				generatePreview={generatePreview}
				download={true}
				documentMenu={liveMode ? liveToolbar() : finishedToolbar()}
				translate={translate}
			/>
		</React.Fragment>
	);
};

export default compose(
	graphql(updateMutation, {
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


	if (!attendantsString) {
		attendantsString = data.council.attendants.reduce(buildAttendantsString(council, base), '');
		cache.set(`${council.id}_attendants`, attendantsString);
	}

	if (!delegatedVotesString) {
		delegatedVotesString = buildDelegationsString(council.delegatedVotes, council, translate);
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
				'LLLL'
			)} `,
			label: translate.date_real_start
		},
		firstOrSecondConvene: {
			value: `${
				council.firstOrSecondConvene ?
					translate.first
					: translate.second
			} `,
			label: translate.first_or_second_call
		},
		location: {
			value: council.remoteCelebration === 1 ? translate.remote_celebration : council.street,
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
			value: (council.currentQuorum / (parseInt(base, 10) * 100)).toFixed(3),
			label: translate.social_capital_percentage
		},
		dateEnd: {
			value: `${moment(council.dateEnd).format(
				'LLLL'
			)} `,
			label: translate.date_end
		},
		numPresentOrRemote: {
			value: council.numPresentAttendance + council.numRemoteAttendance,
			label: translate.number_attentands_in_person
		},
		percentageSCPresent: {
			value: `${council.percentageSCPresent}%`,
			label: translate.percentage_shares_personally
		},
		percentageSCDelegated: {
			value: `${council.percentageSCDelegated}%`,
			label: translate.percentage_shares_represented
		},
		percentageSCTotal: {
			value: `${council.percentageSCTotal}%`,
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
	};

	switch (type) {
		case 'intro':
			tags = [
				smartTags.businessName,
				smartTags.dateStart
			];

			if (hasSecondCall(council.statute)) {
				tags = [...tags, smartTags.dateStart2NdCall];
			}

			if (council.remoteCelebration !== 1) {
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
			];

			return tags;

		case 'certHeader':
			tags = [
				smartTags.businessName,
				smartTags.dateStart
			];

			if (hasSecondCall(council.statute)) {
				tags = [...tags, smartTags.dateStart2NdCall];
			}

			if (council.remoteCelebration !== 1) {
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
			];
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
			];

			if (council.remoteCelebration !== 1) {
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
			];
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
			];
			return tags;
		}
		default:
			return [];
	}
};
