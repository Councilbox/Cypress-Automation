import React from "react";
import { Grid, GridItem, TabsScreen, BasicButton, LiveToast } from "../../../../displayComponents";
import RichTextInput from "../../../../displayComponents/RichTextInput";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import AgendaRecount from '../../agendas/AgendaRecount';
import { AGENDA_TYPES, DRAFT_TYPES, VOTE_VALUES } from '../../../../constants';
import { toast } from 'react-toastify';
import { graphql } from 'react-apollo';
import VotingsTable from '../../../council/live/voting/VotingsTable';
import CommentsTable from "../../live/comments/CommentsTable";
import Dialog, { DialogContent, DialogTitle } from "material-ui/Dialog";
import { checkForUnclosedBraces, changeVariablesToValues } from '../../../../utils/CBX';
import LoadDraft from "../../../company/drafts/LoadDraft";
import { updateAgenda } from "../../../../queries/agenda";

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

			const { __typename, votings, ...agenda } = this.props.agenda;
			await this.props.updateAgenda({
				variables: {
					agenda: {
						...agenda,
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

	loadDraft = draft => {
		const correctedText = changeVariablesToValues(draft.text, {
		   company: this.props.company,
		   council: this.props.council
	    }, this.props.translate);

		this.updateAgendaState({
			comment: correctedText
		});

		this.editor.setValue(correctedText);
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

		agenda.votings.forEach(vote => {
			switch(vote.vote){
				case VOTE_VALUES.ABSTENTION:
					abstentionVotings++;
					break;
				case VOTE_VALUES.POSITIVE:
					positiveVotings++;
					break;
				case VOTE_VALUES.NEGATIVE:
					negativeVotings++;
					break;
				default:
					noVotes++;
			}
		})

		if(!readOnly){
			tabs.push({
				text: translate.comments_and_agreements,
				component: () => {
					return (
						<div style={{padding: '1em'}}>
							<RichTextInput
								ref={editor => (this.editor = editor)}
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
								tags={[
									{
										value: `${agenda.positiveVotings} `,
										label: translate.positive_votings
									},
									{
										value: `${agenda.negativeVotings} `,
										label: translate.negative_votings
									},
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
									}
								]}
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
				text: translate.recount,
				component: () => {
					return (
						<div style={{minHeight: '8em', padding: '1em'}}>
							<AgendaRecount
								agenda={agenda}
								council={council}
								translate={translate}
								recount={recount}
								majorityTypes={majorityTypes}
							/>
						</div>
					);
				}
			});

			tabs.push({
				text: translate.voting,
				component: () => {
					return (
						<div style={{minHeight: '8em', padding: '1em'}}>
							<VotingsTable
								translate={translate}
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
								fontSize: "1em"
							}}
						>
							{agenda.agendaSubject}
						</div>
						{agenda.description && (
							<div
								style={{
									width: "100%",
									marginTop: "1em",
									fontSize: '0.9rem'
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