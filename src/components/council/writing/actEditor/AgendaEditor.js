import React from "react";
import { Grid, GridItem, TabsScreen } from "../../../../displayComponents";
import RichTextInput from "../../../../displayComponents/RichTextInput";
import { getPrimary } from "../../../../styles/colors";
import AgendaRecount from '../../agendas/AgendaRecount';
import { AGENDA_TYPES } from '../../../../constants';
import VotingsTable from '../../../council/live/voting/VotingsTable';
import CommentsTable from "../../live/comments/CommentsTable";

const primary = getPrimary();

const AgendaEditor = ({
	agenda,
	council,
	typeText,
	translate,
	error,
	updateAgenda,
	loadDraft,
	recount,
	readOnly,
	majorityTypes
}) => {

	let tabs = [];

	if(!readOnly){
		tabs.push({
			text: translate.comments_and_agreements,
			component: () => {
				return (
					<div style={{padding: '1em'}}>
						<RichTextInput
							ref={editor => (this.editorAgenda = editor)}
							type="text"
							errorText={error}
							loadDraft={loadDraft}
							tags={[
								{
									value: `${agenda.positiveVotings} `,
									label: translate.positive_votings
								},
								{
									value: `${agenda.negativeVotings} `,
									label: translate.negative_votings
								}
							]}
							value={agenda.comment || ''}
							onChange={value =>{
								if(value !== agenda.comment){
									updateAgenda({
										id: agenda.id,
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
		</div>
	);
}

export default AgendaEditor;