import React from 'react';
import { IconButton, Paper } from 'material-ui';
import { isMobile } from 'react-device-detect';
import { CloseIcon, Grid, GridItem } from '../../../../displayComponents';
import { isCustomPoint } from '../../../../utils/CBX';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import withTranslations from '../../../../HOCs/withTranslations';
import { getSubjectAbrv } from '../../../../displayComponents/AgendaNumber';

const AgendaItem = ({
 agenda, typeText, selectAgenda, translate, removeAgenda, saveAsDraft
}) => {
	const primary = getPrimary();
	const secondary = getSecondary();

	return (
		<Paper
			style={{
				width: '100%',
				padding: '1vw',
				marginTop: '0.6em',
				cursor: 'pointer'
			}}
			onClick={() => {
				selectAgenda(agenda.orderIndex);
			}}
		>
			<Grid spacing={8}>
				<GridItem xs={7} md={9}>
					<Grid spacing={0}>
						<GridItem xs={3} md={1} lg={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<div
								style={{
									color: primary,
									width: '30px',
									margin: '-0.25em 0',
									fontWeight: '700',
									fontSize: isMobile ? '1.1em' : '1.5em'
								}}
							>
								{getSubjectAbrv(agenda.agendaSubject)}
							</div>
						</GridItem>
						<GridItem xs={9}>
							<div
								style={{
									fontWeight: '600',
									fontSize: isMobile ? '0.9em' : '1em'
								}}
							>
								{agenda.agendaSubject}
							</div>
							{agenda.description && (
								<div
									style={{
										width: '100%',
										marginTop: '1em',
										fontSize: '0.9rem'
									}}
									dangerouslySetInnerHTML={{ __html: agenda.description }}
								/>
							)}
							<GridItem xs={12} md={12} lg={12}>
								{agenda.attachments && agenda.attachments.map((attachment, index) => (
									<div style={{
										border: `1px solid ${secondary}`,
										float: 'left',
										marginTop: '1em',
										padding: '5px',
										marginLeft: index > 0 ? '5px' : '0',
										borderRadius: '5px',
										color: 'primary'
									}} key={`attachment_${attachment.id}`}>
										{attachment.filename || attachment.name}
									</div>
								))}
							</GridItem>
						</GridItem>
						{agenda.items.length > 0
							&& <GridItem xs={12} md={12} lg={12} style={{ marginTop: '2em' }}>
								{`${translate.answers_options}: ${translate.max}: ${agenda.options.maxSelections}${agenda.options.minSelections > 1 ? ` - ${translate.min}: ${agenda.options.minSelections}` : ''
									}`}
								<ul>
									{agenda.items.map(item => (
										<li key={`agenda_item_${item.id}`} style={{ whiteSpace: 'pre-wrap', marginTop: '0.3em' }}>
											{item.value}
										</li>
									))}
								</ul>
							</GridItem>
						}
					</Grid>
				</GridItem>
				<GridItem xs={5} md={3}>
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
									float: 'right',
									color: primary
								}}
								onClick={event => {
									event.stopPropagation();
									removeAgenda(agenda.id);
								}}
							/>
							{!isCustomPoint(agenda.subjectType)
								&& <IconButton
									style={{
										float: 'right',
										height: '28px',
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
							}
						</GridItem>
					</Grid>
				</GridItem>
			</Grid>
		</Paper>
	);
};

export default withTranslations()(AgendaItem);
