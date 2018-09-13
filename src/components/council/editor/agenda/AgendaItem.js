import React from "react";
import { CloseIcon, Grid, GridItem } from "../../../../displayComponents";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import { IconButton, Paper } from "material-ui";

const AgendaItem = ({ agenda, typeText, selectAgenda, removeAgenda, saveAsDraft }) => {
	const primary = getPrimary();
	const secondary = getSecondary();

	return(
		<Paper
			style={{
				width: "100%",
				padding: "1vw",
				marginTop: "0.6em",
				cursor: "pointer"
			}}
			onClick={event => {
				selectAgenda(agenda.orderIndex);
			}}
		>
			<Grid spacing={8}>
				<GridItem xs={9} md={9}>
					<Grid spacing={0}>
						<GridItem xs={1} md={1} lg={1} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
							<div
								style={{
									color: primary,
									width: "30px",
									margin: "-0.25em 0",
									fontWeight: "700",
									fontSize: "1.5em"
								}}
							>
								{agenda.orderIndex}
							</div>
						</GridItem>
						<GridItem xs={11}>
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
					</Grid>
				</GridItem>
				<GridItem xs={3} md={3}>
					<Grid spacing={0}>
						<GridItem
							xs={6}
							style={{
								color: secondary,
								fontWeight: 800
							}}
						>
							{typeText}
						</GridItem>
						<GridItem xs={6}>
							<CloseIcon
								style={{
									float: "right",
									color: primary
								}}
								onClick={event => {
									event.stopPropagation();
									removeAgenda(agenda.id);
								}}
							/>
							<IconButton
								style={{
									float: "right",
									height: "28px",
									outline: 0
								}}
								onClick={event => {
									event.stopPropagation();
									saveAsDraft(agenda.id);
								}}
							>
								<i
									className="fa fa-save"
									style={{ color: secondary }}
								/>
							</IconButton>
						</GridItem>
					</Grid>
				</GridItem>
			</Grid>
		</Paper>
	)
};

export default AgendaItem;
