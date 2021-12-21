import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { toast } from 'react-toastify';
import gql from 'graphql-tag';
import { LiveToast } from '../../../displayComponents';
import RichTextInput from '../../../displayComponents/RichTextInput';
import { updateAgenda } from '../../../queries/agenda';
import withSharedProps from '../../../HOCs/withSharedProps';
import LoadDraftModal from '../../company/drafts/LoadDraftModal';
import {
	changeVariablesToValues, checkForUnclosedBraces, hasParticipations, generateGBDecidesText, generateStatuteTag
} from '../../../utils/CBX';
import { moment } from '../../../containers/App';
import { AGENDA_STATES } from '../../../constants';
import { TAG_TYPES } from '../../company/drafts/draftTags/utils';
import { getTranslations } from '../../../queries';
import { buildTranslateObject } from '../../../actions/mainActions';
import { ConfigContext } from '../../../containers/AppControl';


export const agendaRecountQuery = gql`
	query AgendaRecount($agendaId: Int!) {
		agendaRecount(agendaId: $agendaId){
			positiveVotings
			negativeVotings
			abstentionVotings
			noVotes
			numPositive
			numNegative
			numTotal
			numAbstention
			numNoVote
			positiveSC
			negativeSC
			abstentionSC
			noVoteSC
		}
	}
`;

const ActAgreements = ({
	translate, council, company, agenda, recount, ...props
}) => {
	const [error, setError] = React.useState(false);
	const timeout = React.useRef(null);
	const editor = React.useRef(null);
	const editorRightColumn = React.useRef();
	const [comment, setComment] = React.useState(agenda.comment);
	const [commentRightColumn, setCommentRightColumn] = React.useState(agenda.commentRightColumn);
	const [data, setData] = React.useState(null);
	const config = React.useContext(ConfigContext);

	const updateAgreement = async value => {
		if (checkForUnclosedBraces(value)) {
			toast.dismiss();
			toast(
				<LiveToast
					id="error-toast"
					message={translate.revise_text}
				/>, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,
					className: 'errorToast'
				}
			);
			setError(true);
			return;
		}

		if (value.replace(/<\/?[^>]+(>|$)/g, '').length > 0 || !value) {
			await props.updateAgenda({
				variables: {
					agenda: {
						id: agenda.id,
						councilId: council.id,
						comment: value,
						commentRightColumn
					}
				}
			});
			props.refetch();
			setError(false);
		}
	};

	React.useEffect(() => {
		if (comment !== agenda.comment || commentRightColumn !== agenda.commentRightColumn) {
			timeout.current = setTimeout(() => {
				updateAgreement(comment);
			}, 300);
		}

		return () => clearTimeout(timeout.current);
	}, [comment, commentRightColumn]);

	React.useEffect(() => {
		if (agenda.comment !== comment) {
			setComment(agenda.comment);
		}
	}, [agenda]);

	const updateComment = value => {
		setComment(value);
	};

	const getCorrectedText = async (text, translations) => {
		const {
			numPositive, numNegative, numAbstention, numNoVote
		} = data;
		const { positiveSC, negativeSC, abstentionSC, noVoteSC } = data;
		const participations = hasParticipations(council);
		const totalPresent = agenda.socialCapitalPresent + agenda.socialCapitalCurrentRemote;

		const abstentionTotal = config.combineAbstentionNoVote ? (
			abstentionSC + noVoteSC
		) : abstentionSC;

		const correctedText = await changeVariablesToValues(text, {
			company,
			council,
			...(agenda.votingState === AGENDA_STATES.CLOSED ? {
				votings: {
					positive: agenda.positiveVotings + agenda.positiveManual,
					negative: agenda.negativeVotings + agenda.negativeManual,
					abstention: config.combineAbstentionNoVote ?
						agenda.abstentionVotings + agenda.abstentionManual + agenda.noVoteVotings + agenda.noVoteManual
						: agenda.abstentionVotings + agenda.abstentionManual,
					noVoteTotal: agenda.noVoteVotings + agenda.noVoteManual,
					SCFavorTotal: participations ? `${((positiveSC / recount.partTotal) * 100).toFixed(3)}%` : '-',
					SCAgainstTotal: participations ? `${((negativeSC / recount.partTotal) * 100).toFixed(3)}%` : '-',
					SCAbstentionTotal: participations ? `${((abstentionTotal / recount.partTotal) * 100).toFixed(3)}%` : '-',
					SCFavorPresent: participations ? `${((positiveSC / totalPresent) * 100).toFixed(3)}%` : '-',
					SCAgainstPresent: participations ? `${((negativeSC / totalPresent) * 100).toFixed(3)}%` : '-',
					SCAbstentionPresent: participations ? `${((abstentionTotal / totalPresent) * 100).toFixed(3)}%` : '-',
					numPositive,
					numNegative,
					numAbstention,
					numNoVote
				}
			} : {})
		}, translations);
		return correctedText;
	};

	const handleSecondaryText = async (text, replace) => {
		const response = await props.client.query({
			query: getTranslations,
			variables: {
				language: 'en'
			}
		});
		const translationObject = buildTranslateObject(response.data.translations);
		const correctedText = await getCorrectedText(text, translationObject);

		if (replace) {
			editorRightColumn.current.setValue(correctedText);
		} else {
			editorRightColumn.current.paste(correctedText);
		}
	};

	const updateText = async () => {
		const correctedText = await getCorrectedText(comment, translate);
		if (editorRightColumn.current && council.statute.doubleColumnDocs === 1) {
			await handleSecondaryText(commentRightColumn, true);
		}
		editor.current.setValue(correctedText);
		updateAgreement(correctedText);
	};

	React.useEffect(() => {
		if (agenda.votingState === AGENDA_STATES.CLOSED && data) {
			updateText();
			if (/{{/.test(comment)) {
				updateText();
			}
		}
	}, [agenda.votingState, data]);

	const getData = React.useCallback(async () => {
		const response = await props.client.query({
			query: agendaRecountQuery,
			variables: {
				agendaId: agenda.id
			}
		});

		setData(response.data.agendaRecount);
	}, [agenda.id]);

	React.useEffect(() => {
		getData();
		const interval = setInterval(getData, 8000);
		return () => clearInterval(interval);
	}, [getData]);

	const loadDraft = async draft => {
		const correctedText = await getCorrectedText(draft.text, translate);

		if (editorRightColumn.current && council.statute.doubleColumnDocs === 1) {
			await handleSecondaryText(draft.secondaryText, false);
		}
		editor.current.paste(correctedText);
		updateAgreement(correctedText);
	};

	const section = () => {
		let tags = [];

		const shouldPasteValue = votingState => votingState === 2;

		if (data) {
			const {
				numPositive, numNegative, numAbstention, numNoVote
			} = data;
			const { positiveSC, negativeSC, abstentionSC } = data;
			const participations = hasParticipations(council);

			const totalSC = recount.partTotal;
			const totalPresent = agenda.socialCapitalPresent + agenda.socialCapitalCurrentRemote;

			tags = [
				{
					value: moment(council.dateStart).format('LLL'),
					label: translate.date
				},
				{
					getValue: () => moment().format('LLL'),
					label: translate.actual_date
				},
				{
					value: company?.businessName,
					label: translate.business_name
				},
				{
					value: generateGBDecidesText(translate, company?.governingBodyType),
					label: '[Órgano de gobierno] decide'
				},
				{
					value: council.remoteCelebration === 1 ? translate.remote_celebration : council.street,
					label: translate.new_location_of_celebrate
				},
				{
					value: company?.country,
					label: translate.company_new_country
				},
				{
					value: shouldPasteValue(agenda.votingState) ? numPositive : '{{numPositive}}',
					label: translate.num_positive
				},
				{
					value: shouldPasteValue(agenda.votingState) ? numNegative : '{{numNegative}}',
					label: translate.num_negative
				},
				{
					value: shouldPasteValue(agenda.votingState) ? numAbstention : '{{numAbstention}}',
					label: translate.num_abstention
				},
				{
					value: shouldPasteValue(agenda.votingState) ? numNoVote : '{{numNoVote}}',
					label: translate.num_no_vote
				},
			];

			if (participations) {
				tags.push({
					value: shouldPasteValue(agenda.votingState) ? `${((positiveSC / totalSC) * 100).toFixed(3)}%` : '{{positiveSCTotal}}',
					label: '% a favor / total capital social'
				},
				{
					value: shouldPasteValue(agenda.votingState) ? `${((negativeSC / totalSC) * 100).toFixed(3)}%` : '{{negativeSCTotal}}',
					label: '% en contra / total capital social'
				},
				{
					value: shouldPasteValue(agenda.votingState) ? `${((abstentionSC / totalSC) * 100).toFixed(3)}%` : '{{abstentionSCTotal}}',
					label: '% abstención / total capital social'
				},
				{
					value: shouldPasteValue(agenda.votingState) ? `${((positiveSC / totalPresent) * 100).toFixed(3)}%` : '{{positiveSCPresent}}',
					label: '% a favor / capital social presente'
				},
				{
					value: shouldPasteValue(agenda.votingState) ? `${((negativeSC / totalPresent) * 100).toFixed(3)}%` : '{{negativeSCPresent}}',
					label: '% en contra / capital social presente'
				},
				{
					value: shouldPasteValue(agenda.votingState) ? `${((abstentionSC / totalPresent) * 100).toFixed(3)}%` : '{{abstentionSCPresent}}',
					label: '% abstención / capital social presente'
				});
			} else {
				tags.push({
					value: shouldPasteValue(agenda.votingState) ? `${agenda.positiveVotings + agenda.positiveManual} ` : '{{positiveVotings}}',
					label: translate.positive_votings
				},
				{
					value: shouldPasteValue(agenda.votingState) ? `${agenda.negativeVotings + agenda.negativeManual} ` : '{{negativeVotings}}',
					label: translate.negative_votings
				});
			}
		}

		return (
			<div
				style={{
					padding: '0.9em',
					paddingTop: '1.2em',
					backgroundColor: 'white'
				}}
			>

				<RichTextInput
					ref={editor}
					errorText={error}
					translate={translate}
					loadDraft={
						<LoadDraftModal
							translate={translate}
							companyId={company?.id}
							loadDraft={loadDraft}
							statute={council.statute}
							defaultTags={
								{
									comments_and_agreements: {
										active: true,
										type: TAG_TYPES.DRAFT_TYPE,
										name: 'comments_and_agreements',
										label: translate.comments_and_agreements
									},
									...generateStatuteTag(council.statute, translate)
								}}
						/>
					}
					tags={tags}
					value={comment || ''}
					onChange={value => {
						updateComment(value);
					}}
				/>
				{council.statute.doubleColumnDocs === 1
&& <div style={{ marginTop: '1em' }}>
	<RichTextInput
		ref={editorRightColumn}
		floatingText={translate.decision_making_right_column}
		errorText={error}
		translate={translate}
		tags={tags}
		value={commentRightColumn || ''}
		onChange={value => setCommentRightColumn(value)}
	/>
</div>
				}

			</div>
		);
	};

	return (
		<div
			style={{
				width: '100%',
				position: 'relative'
			}}
		>
			{section()}
		</div>
	);
};

export default compose(graphql(updateAgenda, { name: 'updateAgenda' }))(
	withSharedProps()(withApollo(ActAgreements))
);
