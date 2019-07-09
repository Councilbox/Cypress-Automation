import React from "react";
import { Grid, GridItem, TabsScreen, BasicButton, LiveToast, LoadingSection } from "../../../../displayComponents";
import RichTextInput from "../../../../displayComponents/RichTextInput";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import AgendaRecount from '../../agendas/AgendaRecount';
import { AGENDA_TYPES, DRAFT_TYPES, VOTE_VALUES } from '../../../../constants';
import { toast } from 'react-toastify';
import { graphql, compose } from 'react-apollo';
import VotingsTableFiltersContainer from '../../../council/live/voting/VotingsTableFiltersContainer';
import CommentsTable from "../../live/comments/CommentsTable";
import Dialog, { DialogContent, DialogTitle } from "material-ui/Dialog";
import { checkForUnclosedBraces, changeVariablesToValues, hasParticipations, isCustomPoint, cleanAgendaObject } from '../../../../utils/CBX';
import LoadDraft from "../../../company/drafts/LoadDraft";
import AgendaDescriptionModal from '../../live/AgendaDescriptionModal';
import { updateAgenda } from "../../../../queries/agenda";
import CustomAgendaRecount from "../../live/voting/CustomAgendaRecount";
import { agendaRecountQuery } from "../../live/ActAgreements";
import { useOldState } from "../../../../hooks";


const AgendaEditor = ({ agenda, agendaData, error, recount, readOnly, majorityTypes, typeText, data, company, translate, council, ...props }) => {
	const [comment, setComment] = React.useState(agenda.comment);
	const editor = React.useRef();
	const [loading, setLoading] = React.useState(false);
	const [state, setState] = useOldState({
		loadDraft: false,
		draftType: ''
	});
	const secondary = getSecondary();
	const primary = getPrimary();

	const updateAgenda = React.useCallback(async () => {
		if(!checkForUnclosedBraces(comment)){
			setLoading(true);
			await props.updateAgenda({
				variables: {
					agenda: {
						...cleanAgendaObject(agenda),
						comment: comment,
						councilId: council.id
					}
				}
			});
			props.updateCouncilAct();
		} else {
			toast(
				<LiveToast
					message={translate.revise_text}
				/>, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,
					className: "errorToast"
				}
			);
		}
	});

	React.useEffect(() => {
		let timeout;
		if(comment !== agenda.comment){
			timeout = setTimeout(updateAgenda, 500);
		}
		return () => clearTimeout(timeout);
	}, [comment]);

	const update = () => {
		data.refetch();
		props.updateCouncilAct();
	}

	const loadDraft = draft => {
		let { numPositive, numNegative, numAbstention, numNoVote } = agendaData.agendaRecount;
		let { positiveSC, negativeSC, abstentionSC, noVoteSC } = agendaData.agendaRecount;
		const participations = hasParticipations(council);
		const totalSC = agenda.socialCapitalPresent + agenda.socialCapitalRemote + agenda.socialCapitalNoParticipate;
		const totalPresent =  agenda.socialCapitalPresent + agenda.socialCapitalRemote;

		const correctedText = changeVariablesToValues(draft.text, {
			company,
			council,
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
		setState({
			loadDraft: false
		});
	}


	if(agendaData.loading){
		return <span />;
	}
	let tabs = [];
	let { numPositive, numNegative, numAbstention, numNoVote } = agendaData.agendaRecount;
	let { positiveSC, negativeSC, abstentionSC, noVoteSC } = agendaData.agendaRecount;
	const participations = hasParticipations(council);
	const totalSC = agenda.socialCapitalPresent + agenda.socialCapitalRemote + agenda.socialCapitalNoParticipate;
	const totalPresent =  agenda.socialCapitalPresent + agenda.socialCapitalRemote;


	let tags = [
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


	if(!readOnly){
		tabs.push({
			text: translate.comments_and_agreements,
			component: () => {
				return (
					<div style={{padding: '1em'}}>
						<RichTextInput
							ref={editor}
							translate={translate}
							type="text"
							errorText={error}
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
										setState({
											loadDraft: true,
											draftType: DRAFT_TYPES.COMMENTS_AND_AGREEMENTS
										})
									}
								/>
							}
							tags={tags}
							value={agenda.comment || ''}
							onChange={value =>{
								if(value !== agenda.comment){
									setComment(value)
								}
							}}
						/>
					</div>
				);
			}
		})
	}

	tabs.push({
		text: translate.act_comments,
		component: () => {
			return (
				<div style={{minHeight: '8em', padding: '1em', paddingBottom: '1.4em'}}>
					<CommentsTable
						translate={translate}
						agenda={agenda}
					/>
				</div>
			);
		}
	});

	if(agenda.subjectType !== AGENDA_TYPES.INFORMATIVE){
		tabs.push({
			text: translate.voting,
			component: () => {
				return (
					<div style={{minHeight: '8em', padding: '1em'}}>
						{!isCustomPoint(agenda.subjectType)?
							<AgendaRecount
								agenda={agenda}
								council={council}
								translate={translate}
								recount={recount}
								majorityTypes={majorityTypes}
							/>
						:
							<CustomAgendaRecount
								agenda={agenda}
								translate={translate}
								council={council}
							/>
						}
						<VotingsTableFiltersContainer
							translate={translate}
							hideStatus
							council={council}
							agenda={agenda}
						/>
					</div>
				);
			}
		});
	}

	return (
		<div
			style={{
				width: "100%",
				margin: "0.6em 0",
			}}
		>
			<Grid spacing={16} style={{marginBottom: '1em'}}>
				<GridItem xs={1}
					style={{
						color: primary,
						width: "30px",
						margin: "-0.25em 0",
						fontWeight: "700",
						fontSize: "1.5em",
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					{agenda.orderIndex}
				</GridItem>
				<GridItem xs={9}>
					<div
						style={{
							fontWeight: "600",
							fontSize: "1.1em",
							marginBottom: '1em'
						}}
					>
						{agenda.agendaSubject}
					</div>
					<AgendaDescriptionModal
						agenda={agenda}
						translate={translate}
						council={council}
						companyStatutes={props.statutes}
						majorityTypes={majorityTypes}
						draftTypes={props.draftTypes}
						refetch={update}
					/>
					{agenda.description && (
						<div
							style={{
								width: "100%",
								marginTop: "0.3em",
								fontSize: '0.87rem'
							}}
							dangerouslySetInnerHTML={{ __html: agenda.description }}
						/>
					)}
				</GridItem>
				<GridItem xs={2}>{typeText}</GridItem>
			</Grid>
			<TabsScreen
				uncontrolled={true}
				tabsInfo={tabs}
			/>
			<Dialog
				open={state.loadDraft}
				maxWidth={false}
				onClose={() => setState({ loadDraft: false })}
			>
				<DialogTitle>{translate.load_draft}</DialogTitle>
				<DialogContent style={{ width: "800px" }}>
					<LoadDraft
						translate={translate}
						companyId={company? company.id : ''}
						loadDraft={loadDraft}
						statute={council.statute}
						statutes={data? data.companyStatutes : ''}
						draftType={state.draftType}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}


export default compose(
	graphql(agendaRecountQuery, {
		name: 'agendaData',
		options: props => ({
			variables: {
				agendaId: props.agenda.id
			}
		})
	}),
	graphql(updateAgenda, {
		name: 'updateAgenda'
	})
)(AgendaEditor);