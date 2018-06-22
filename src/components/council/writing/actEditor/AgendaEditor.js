import React from "react";
import { Grid, GridItem, RichTextInput } from "../../../../displayComponents";
import { getPrimary } from "../../../../styles/colors";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import AgendaRecount from '../../agendas/AgendaRecount';
import { AGENDA_TYPES } from '../../../../constants';
import VotingsTable from '../../../council/live/voting/VotingsTable';
import { Card } from 'material-ui';
import CommentsTable from "../../live/comments/CommentsTable";

const primary = getPrimary();

const AgendaEditor = ({
	agenda,
	council,
	typeText,
	translate,
	updateAgenda,
	loadDraft,
	recount,
	readOnly,
	majorityTypes
}) => (
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
		<Tabs>
			<TabList>
				{!readOnly &&
					<Tab>
						{translate.comments_and_agreements}
					</Tab>
				}
				<Tab>
					{translate.act_comments}
				</Tab>
				{agenda.subjectType !== AGENDA_TYPES.INFORMATIVE &&
					<React.Fragment>
						<Tab>
							{translate.recount}
						</Tab>
						<Tab>
							{translate.voting}
						</Tab>
					</React.Fragment>
				}
			</TabList>
			{!readOnly &&
				<TabPanel style={{width: '100%'}}>
					<Card style={{padding: '1em'}}>
						<RichTextInput
							ref={editor => (this.editorAgenda = editor)}
							type="text"
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
					</Card>
				</TabPanel>
			}
			<TabPanel>
				<Card style={{minHeight: '8em', padding: '1em', paddingBottom: '1.4em'}}>
					<CommentsTable
						translate={translate}
						agenda={agenda}
					/>
				</Card>
			</TabPanel>
			{agenda.subjectType !== AGENDA_TYPES.INFORMATIVE &&
				<React.Fragment>
					<TabPanel>
						<Card style={{minHeight: '8em', padding: '1em'}}>
							<AgendaRecount
								agenda={agenda}
								council={council}
								translate={translate}
								recount={recount}
								majorityTypes={majorityTypes}
							/>
						</Card>
					</TabPanel>	
					<TabPanel>
						<Card>
							<VotingsTable
								translate={translate}
								agenda={agenda}
							/>
						</Card>
					</TabPanel>	
				</React.Fragment>
			}
		</Tabs>
	</div>
);

export default AgendaEditor;
