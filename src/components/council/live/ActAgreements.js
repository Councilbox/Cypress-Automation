import React from "react";
import { LiveToast } from "../../../displayComponents";
import RichTextInput from "../../../displayComponents/RichTextInput";
import { compose, graphql, withApollo } from "react-apollo";
import { updateAgenda } from "../../../queries/agenda";
import withSharedProps from "../../../HOCs/withSharedProps";
import LoadDraftModal from "../../company/drafts/LoadDraftModal";
import { changeVariablesToValues, checkForUnclosedBraces, hasParticipations, generateGBDecidesText } from "../../../utils/CBX";
import { moment } from '../../../containers/App';
import { toast } from 'react-toastify';
import gql from 'graphql-tag';
import { AGENDA_STATES } from "../../../constants";


export const agendaRecountQuery = gql`
	query AgendaRecount($agendaId: Int!) {
		agendaRecount(agendaId: $agendaId){
			positiveVotings
            negativeVotings
			abstentionVotings
			noVotes
			numPositive
			numNegative
			numAbstention
			numNoVote
			positiveSC
			negativeSC
			abstentionSC
			noVoteSC
		}
	}
`;

const ActAgreements = ({ translate, council, company, agenda, recount, ...props }) => {
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(false);
	const timeout = React.useRef(null);
	const editor = React.useRef(null);
	const [comment, setComment] = React.useState(agenda.comment);
	const modal = React.useRef(null);
	const [data, setData] = React.useState(null);

	React.useEffect(() => {
		if(comment !== agenda.comment){
			timeout.current = setTimeout(() => {
				updateAgreement(comment);
			}, 300);
		}

		return () => clearTimeout(timeout.current);
	}, [comment]);

	React.useEffect(() => {
		if(agenda.comment !== comment){
			setComment(agenda.comment);
		}
	}, [agenda]);

	const updateComment = value => {
		setComment(value);
	}

	const updateText = async () => {
		const correctedText = await getCorrectedText(comment);
		editor.current.setValue(correctedText);
		updateAgreement(correctedText);
	}

	React.useEffect(() => {
		if(agenda.votingState === AGENDA_STATES.CLOSED && data){
			if(/{{/.test(comment)){
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
		let interval;
		getData();
		interval = setInterval(getData, 8000);
		return () => clearInterval(interval);
	}, [getData]);


	const updateAgreement = async value => {

		if(checkForUnclosedBraces(value)){
			toast.dismiss();
			toast(
                <LiveToast
                    message={translate.revise_text}
                />, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: true,
                    className: "errorToast"
                }
            );
			setError(true);
			return;
		}
		if (value.replace(/<\/?[^>]+(>|$)/g, "").length > 0) {
			setLoading(true);
			await props.updateAgenda({
				variables: {
					agenda: {
						id: agenda.id,
						councilId: council.id,
						comment: value
					}
				}
			});
			props.refetch();
			setError(false);
			setLoading(false);
		}
	}

	const getCorrectedText = async text => {
		let { numPositive, numNegative, numAbstention, numNoVote } = data;
		let { positiveSC, negativeSC, abstentionSC, noVoteSC } = data;
		const participations = hasParticipations(council);
		const totalPresent =  agenda.socialCapitalPresent + agenda.socialCapitalCurrentRemote;

		const correctedText = await changeVariablesToValues(text, {
			company,
			council,
			...(agenda.votingState === AGENDA_STATES.CLOSED? {
				votings: {
					positive: agenda.positiveVotings + agenda.positiveManual,
					negative: agenda.negativeVotings + agenda.negativeManual,
					abstention: agenda.abstentionVotings + agenda.abstentionManual,
					noVoteTotal: agenda.noVoteVotings + agenda.noVoteManual,
					SCFavorTotal: participations? ((positiveSC / recount.partTotal) * 100).toFixed(3) + '%' : 'VOTACIÓN SIN CAPITAL SOCIAL',//TRADUCCION
					SCAgainstTotal: participations? ((negativeSC / recount.partTotal) * 100).toFixed(3) + '%' : 'VOTACIÓN SIN CAPITAL SOCIAL',
					SCAbstentionTotal: participations? ((abstentionSC / recount.partTotal) * 100).toFixed(3) + '%' : 'VOTACIÓN SIN CAPITAL SOCIAL',
					SCFavorPresent: participations? ((positiveSC / totalPresent) * 100).toFixed(3) + '%' : 'VOTACIÓN SIN CAPITAL SOCIAL',
					SCAgainstPresent: participations? ((negativeSC / totalPresent) * 100).toFixed(3) + '%' : 'VOTACIÓN SIN CAPITAL SOCIAL',
					SCAbstentionPresent: participations? ((abstentionSC / totalPresent) * 100).toFixed(3) + '%' : 'VOTACIÓN SIN CAPITAL SOCIAL',
					numPositive,
					numNegative,
					numAbstention,
					numNoVote
				}
			} : {})
		}, translate);
		return correctedText;
	}

	const loadDraft = async draft => {
		const correctedText = await getCorrectedText(draft.text);
		editor.current.paste(correctedText);
		updateAgreement(correctedText);
		modal.current.close();
	}


	const _section = () => {
		let tags = [];

		const shouldPasteValue = agenda => {
			return agenda.votingState === 2
		}

		if(data) {
			let { numPositive, numNegative, numAbstention, numNoVote } = data;
			let { positiveSC, negativeSC, abstentionSC, noVoteSC } = data;
			const participations = hasParticipations(council);

			const totalSC = recount.partTotal;
			const totalPresent = agenda.socialCapitalPresent + agenda.socialCapitalCurrentRemote;

			tags = [
				{
					value: moment(council.dateStart).format("LLL"),
					label: translate.date
				},
				{
					value: company.businessName,
					label: translate.business_name
				},
				{
					value: generateGBDecidesText(translate, company.governingBodyType),
					label: '[Órgano de gobierno] decide'
				},
				{
					value: council.remoteCelebration === 1? translate.remote_celebration : council.street,
					label: translate.new_location_of_celebrate
				},
				{
					value: company.country,
					label: translate.company_new_country
				},
				{
					value: shouldPasteValue(agenda)? numPositive : '{{numPositive}}',
					label: translate.num_positive
				},
				{
					value: shouldPasteValue(agenda)? numNegative : '{{numNegative}}',
					label: translate.num_negative
				},
				{
					value: shouldPasteValue(agenda)? numAbstention : '{{numAbstention}}',
					label: translate.num_abstention
				},
				{
					value: shouldPasteValue(agenda)? numNoVote : '{{numNoVote}}',
					label: translate.num_no_vote
				},
			]

			if(participations){
				tags.push({
					value: shouldPasteValue(agenda)? ((positiveSC / totalSC) * 100).toFixed(3) + '%' : '{{positiveSCTotal}}',
					label: '% a favor / total capital social'
				},
				{
					value: shouldPasteValue(agenda)? ((negativeSC / totalSC) * 100).toFixed(3) + '%' : '{{negativeSCTotal}}',
					label: '% en contra / total capital social'
				},
				{
					value: shouldPasteValue(agenda)? ((abstentionSC / totalSC) * 100).toFixed(3) + '%' : '{{abstentionSCTotal}}',
					label: '% abstención / total capital social'
				},
				{
					value: shouldPasteValue(agenda)? ((positiveSC / totalPresent) * 100).toFixed(3) + '%' : '{{positiveSCPresent}}',
					label: '% a favor / capital social presente'
				},
				{
					value: shouldPasteValue(agenda)? ((negativeSC / totalPresent) * 100).toFixed(3) + '%' : '{{negativeSCPresent}}',
					label: '% en contra / capital social presente'
				},
				{
					value: shouldPasteValue(agenda)? ((abstentionSC / totalPresent) * 100).toFixed(3) + '%' : '{{abstentionSCPresent}}',
					label: '% abstención / capital social presente'
				});
			} else {
				tags.push({
					value: shouldPasteValue(agenda)? `${agenda.positiveVotings + agenda.positiveManual} ` : '{{positiveVotings}}',
					label: translate.positive_votings
				},
				{
					value: shouldPasteValue(agenda)? `${agenda.negativeVotings + agenda.negativeManual} `: '{{negativeVotings}}',
					label: translate.negative_votings
				});
			}
		}

		return (
			<div
				style={{
					padding: '0.9em',
					paddingTop: "1.2em",
					backgroundColor: "white"
				}}
			>
				<RichTextInput
					ref={editor}
					errorText={error}
					translate={translate}
					loadDraft={
						<LoadDraftModal
							ref={modal}
							translate={translate}
							companyId={company.id}
							loadDraft={loadDraft}
							statute={council.statute}
							statutes={props.data.companyStatutes}
							draftType={5}
						/>
					}
					tags={tags}
					value={comment || ""}
					onChange={value => updateComment(value)}
				/>
			</div>
		)
	}

	return (
		<div
			style={{
				width: "100%",
				position: "relative"
			}}
		>
			{_section()}
		</div>
	)
}

export default compose(graphql(updateAgenda, { name: "updateAgenda" }))(
	withSharedProps()(withApollo(ActAgreements))
);
