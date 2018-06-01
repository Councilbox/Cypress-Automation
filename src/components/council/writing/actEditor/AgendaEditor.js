import React from "react";
import { Grid, GridItem, RichTextInput } from "../../../../displayComponents";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import AgendaRecount from '../../agendas/AgendaRecount';

const primary = getPrimary();
const secondary = getSecondary();

const AgendaEditor = ({
	agenda,
	typeText,
	translate,
	updateAgenda,
	loadDraft,
	recount,
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
				<Tab>
					{translate.comments_and_agreements}
				</Tab>
				<Tab>
					{translate.recount}
				</Tab>
			</TabList>
			<TabPanel>
				<RichTextInput
					ref={editor => (this.editorAgenda = editor)}
					floatingText={translate.comments_and_agreements}
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
					onChange={value =>
						updateAgenda({
							id: agenda.id,
							comment: value
						})
					}
				/>
			</TabPanel>
			<TabPanel>
				<div style={{minHeight: '8em'}}>
					<AgendaRecount
						agenda={agenda}
						translate={translate}
						recount={recount}
						majorityTypes={majorityTypes}
					/>
				</div>
			</TabPanel>

		</Tabs>
	</div>
);

export default AgendaEditor;
