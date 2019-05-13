import React from "react";
import { LiveToast } from "../../../displayComponents";
import RichTextInput from "../../../displayComponents/RichTextInput";
import { compose, graphql, withApollo } from "react-apollo";
import { updateAgenda } from "../../../queries/agenda";
import withSharedProps from "../../../HOCs/withSharedProps";
import LoadDraftModal from "../../company/drafts/LoadDraftModal";
import { changeVariablesToValues, checkForUnclosedBraces, hasParticipations } from "../../../utils/CBX";
import { moment } from '../../../containers/App';
import { toast } from 'react-toastify';
import gql from 'graphql-tag';


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

const ActAgreements = ({ translate, council, company, agenda, ...props }) => {
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(false);
	const timeout = React.useRef(null);
	const editor = React.useRef(null);
	const modal = React.useRef(null);
	const [data, setData] = React.useState(null);

	const startUpdateTimeout = value => {
		clearTimeout(timeout.current);

		timeout.current = setTimeout(() => {
			updateAgreement(value);
		}, 450);
	}

	React.useEffect(() => {
		editor.current.setValue(agenda.comment);
	}, [agenda.id]);

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
			setError(false);
			setLoading(false);
		}
	}

	const loadDraft = draft => {
		let { numPositive, numNegative, numAbstention, numNoVote } = data;
		let { positiveSC, negativeSC, abstentionSC, noVoteSC } = data;
		const participations = hasParticipations(council);

		const totalSC = agenda.socialCapitalPresent + agenda.socialCapitalRemote;
		const totalPresent = totalSC - noVoteSC;

		const correctedText = changeVariablesToValues(draft.text, {
			company: company,
			council: council,
			votings: {
				positive: agenda.positiveVotings + agenda.positiveManual,
				negative: agenda.negativeVotings + agenda.negativeManual,
				abstention: agenda.abstentionVotings + agenda.abstentionManual,
				noVoteTotal: agenda.noVoteVotings + agenda.noVoteManual,
				SCFavorTotal: participations? ((positiveSC / totalSC) * 100).toFixed(3) + '%' : 'VOTACIÓN SIN CAPITAL SOCIAL',//TRADUCCION
				SCAgainstTotal: participations? ((negativeSC / totalSC) * 100).toFixed(3) + '%' : 'VOTACIÓN SIN CAPITAL SOCIAL',
				SCAbstentionTotal: participations? ((abstentionSC / totalSC) * 100).toFixed(3) + '%' : 'VOTACIÓN SIN CAPITAL SOCIAL',
				SCFavorPresent: participations? ((positiveSC / totalPresent) * 100).toFixed(3) + '%' : 'VOTACIÓN SIN CAPITAL SOCIAL',
				SCAgainstTotal: participations? ((negativeSC / totalPresent) * 100).toFixed(3) + '%' : 'VOTACIÓN SIN CAPITAL SOCIAL',
				SCAbstentionTotal: participations? ((abstentionSC / totalPresent) * 100).toFixed(3) + '%' : 'VOTACIÓN SIN CAPITAL SOCIAL',
				numPositive,
				numNegative,
				numAbstention,
				numNoVote
			}
		}, translate);
		editor.current.paste(correctedText);
		updateAgreement(correctedText);
		modal.current.close();
	}


	const _section = () => {
		let tags = [];

		if(data) {
			let { numPositive, numNegative, numAbstention, numNoVote } = data;
			let { positiveSC, negativeSC, abstentionSC, noVoteSC } = data;
			const participations = hasParticipations(council);

			const totalSC = agenda.socialCapitalPresent + agenda.socialCapitalRemote;
			const totalPresent = totalSC - noVoteSC;

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
					value: council.remoteCelebration === 1? translate.remote_celebration : council.street,
					label: translate.new_location_of_celebrate
				},
				{
					value: company.country,
					label: translate.company_new_country
				},
				{
					value: numPositive,
					label: translate.num_positive
				},
				{
					value: numNegative,
					label: translate.num_negative
				},
				{
					value: numAbstention,
					label: translate.num_abstention
				},
				{
					value: numNoVote,
					label: translate.num_no_vote
				},
			]

			if(participations){
				tags.push({
					value: ((positiveSC / totalSC) * 100).toFixed(3) + '%',
					label: '% a favor / total capital social'
				},
				{
					value: ((negativeSC / totalSC) * 100).toFixed(3) + '%',
					label: '% en contra / total capital social'
				},
				{
					value: ((abstentionSC / totalSC) * 100).toFixed(3) + '%',
					label: '% abstención / total capital social'
				},
				{
					value: ((positiveSC / totalPresent) * 100).toFixed(3) + '%',
					label: '% a favor / capital social presente'
				},
				{
					value: ((negativeSC / totalPresent) * 100).toFixed(3) + '%',
					label: '% en contra / capital social presente'
				},
				{
					value: ((abstentionSC / totalPresent) * 100).toFixed(3) + '%',
					label: '% abstención / capital social presente'
				});
			} else {
				tags.push({
					value: `${agenda.positiveVotings + agenda.positiveManual} `,
					label: translate.positive_votings
				},
				{
					value: `${agenda.negativeVotings + agenda.negativeManual} `,
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
					value={agenda.comment || ""}
					onChange={value => startUpdateTimeout(value)}
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
