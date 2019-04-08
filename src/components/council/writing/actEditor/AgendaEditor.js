import React from "react";
import { Grid, GridItem, TabsScreen, BasicButton, LiveToast } from "../../../../displayComponents";
import RichTextInput from "../../../../displayComponents/RichTextInput";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import AgendaRecount from '../../agendas/AgendaRecount';
import { AGENDA_TYPES, DRAFT_TYPES, VOTE_VALUES } from '../../../../constants';
import { toast } from 'react-toastify';
import { graphql } from 'react-apollo';
import VotingsTableFiltersContainer from '../../../council/live/voting/VotingsTableFiltersContainer';
import CommentsTable from "../../live/comments/CommentsTable";
import Dialog, { DialogContent, DialogTitle } from "material-ui/Dialog";
import { checkForUnclosedBraces, changeVariablesToValues, hasParticipations, isCustomPoint, cleanAgendaObject } from '../../../../utils/CBX';
import LoadDraft from "../../../company/drafts/LoadDraft";
import AgendaDescriptionModal from '../../live/AgendaDescriptionModal';
import { updateAgenda } from "../../../../queries/agenda";
import CustomAgendaRecount from "../../live/voting/CustomAgendaRecount";

class AgendaEditor extends React.Component {

	state = {
		loadDraft: false,
		draftType: '',
		comment: this.props.agenda.comment
	}

	updateAgendaState = object => {
		this.setState({
			...object
		}, async () => {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => this.updateAgenda(), 450);
		});
	};

	updateAgenda = async () => {
		if(!checkForUnclosedBraces(this.state.comment)){
			this.setState({
				updating: true
			});

			const clean = cleanAgendaObject(this.props.agenda);
			await this.props.updateAgenda({
				variables: {
					agenda: {
						...clean,
						comment: this.state.comment,
						councilId: this.props.council.id
					}
				}
			});
			this.props.updateCouncilAct();
		} else {
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
	}

	update = () => {
		this.props.data.refetch();
		this.props.updateCouncilAct();
	}

	loadDraft = draft => {
		const correctedText = changeVariablesToValues(draft.text, {
		   company: this.props.company,
		   council: this.props.council
	    }, this.props.translate);

/* 		this.updateAgendaState({
			comment: correctedText
		}); */

		this.editor.paste(correctedText);
		this.setState({
			loadDraft: false
		});
	}

	render(){
		const {
			agenda,
			council,
			typeText,
			translate,
			error,
			recount,
			readOnly,
			majorityTypes
		} = this.props;
		const secondary = getSecondary();
		const primary = getPrimary();

		let tabs = [];

		let positiveVotings = 0;
		let negativeVotings = 0;
		let abstentionVotings = 0;
		let noVotes = 0;

		const participations = hasParticipations(council);

		let positiveSC = 0;
		let negativeSC = 0;
		let abstentionSC = 0;
		let noVoteSC = 0;

		agenda.votings.forEach(vote => {
			switch(vote.vote){
				case VOTE_VALUES.ABSTENTION:
					abstentionVotings++;
					abstentionSC += vote.author.socialCapital;
					break;
				case VOTE_VALUES.POSITIVE:
					positiveVotings++;
					positiveSC += vote.author.socialCapital;
					break;
				case VOTE_VALUES.NEGATIVE:
					negativeVotings++;
					negativeSC += vote.author.socialCapital;
					break;
				case VOTE_VALUES.NO_VOTE:
					noVoteSC += vote.author.socialCapital;
					break;
				default:
					noVotes++;
			}
		});

		const totalSC = agenda.socialCapitalPresent + agenda.socialCapitalRemote + agenda.socialCapitalNoParticipate;
		const totalPresent =  agenda.socialCapitalPresent + agenda.socialCapitalRemote;

		let tags = [
			{
				value: positiveVotings,
				label: translate.num_positive
			},
			{
				value: negativeVotings,
				label: translate.num_negative
			},
			{
				value: abstentionVotings,
				label: translate.num_abstention
			},
			{
				value: noVotes,
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
								ref={editor => (this.editor = editor)}
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
											this.setState({
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
										this.updateAgendaState({
											comment: value
										})
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
								/>
							}
							<VotingsTableFiltersContainer
								translate={translate}
								hideStatus
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
							companyStatutes={this.props.statutes}
							majorityTypes={this.props.majorityTypes}
							draftTypes={this.props.draftTypes}
							refetch={this.update}
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
					open={this.state.loadDraft}
					maxWidth={false}
					onClose={() => this.setState({ loadDraft: false })}
				>
					<DialogTitle>{translate.load_draft}</DialogTitle>
					<DialogContent style={{ width: "800px" }}>
						<LoadDraft
							translate={translate}
							companyId={this.props.company? this.props.company.id : ''}
							loadDraft={this.loadDraft}
							statute={this.props.council.statute}
							statutes={this.props.data? this.props.data.companyStatutes : ''}
							draftType={this.state.draftType}
						/>
					</DialogContent>
				</Dialog>
			</div>
		);
	}
}

export default graphql(updateAgenda, {
	name: 'updateAgenda'
})(AgendaEditor);