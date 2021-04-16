import React from 'react';
import { Card } from 'material-ui';
import { Grid, GridItem, Link, NotLoggedLayout } from '../../../displayComponents';
import { ReactComponent as CancelIcon } from '../../../assets/img/cancel-appointment.svg';
import { ReactComponent as DocumentationIcon } from '../../../assets/img/upload.svg';
import { ReactComponent as RescheduleAppointmentIcon } from '../../../assets/img/create-appointment.svg';
import { bHistory } from '../../../containers/App';
import withSharedProps from '../../../HOCs/withSharedProps';
import { isMobile } from '../../../utils/screen';
import Title from '../UI/Title';
import { useSubdomain } from '../../../utils/subdomain';
import ParticipantCouncilAttachments from '../../participant/agendas/ParticipantCouncilAttachments';
import CancelAppointment from './CancelAppointment';
import { COUNCIL_STATES } from '../../../constants';
import ParticipantInfo from './ParticipantInfo';
import RescheduleAppointment from './RescheduleAppointment';


const MainMenu = ({ translate, participant, appointment, match, refetch }) => {
	const subdomain = useSubdomain();

	return (
		<NotLoggedLayout
			translate={translate}
			helpIcon={true}
		>
			<div style={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexGrow: 1
			}}>
				{match.url.includes('documentation') ?
					<Card style={{
						margin: isMobile ? '4em 0' : 'auto',
						width: isMobile ? '100%' : '80%',
						position: 'relative',
					}} elevation={6}>
						<div style={{ position: 'relative', top: 5, right: 5 }}>
							<i
								className={'fa fa-close'}
								style={{
									cursor: 'pointer',
									fontSize: '25px',
									color: 'var(--primary)',
									position: 'absolute',
									right: '12px',
									top: '18px'
								}}
								onClick={() => bHistory.back() }
							/>
						</div>
						<ParticipantCouncilAttachments
							translate={translate}
							council={appointment}
							participant={participant}
						/>
					</Card>
					:
					<Card style={{
						margin: isMobile ? '6em 0' : 'auto',
						backgroundColor: 'white',
						width: isMobile ? '100%' : '',
						padding: isMobile ? '4em 2em' : '4em 2em',
						display: 'flex',
						...(isMobile ? {} : {
							minWidth: '850px'
						}),
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						textAlign: 'center'
					}}>
						<Title>{translate.appointment_landing_title} - {subdomain.title}</Title>
						<ParticipantInfo
							appointment={appointment}
							participant={participant}
							translate={translate}
						/>
						{appointment.state === COUNCIL_STATES.CANCELED &&
							<h3 style={{ marginTop: '1.2em' }}>
								{translate.appointment_canceled}
							</h3>
						}
						{appointment.state !== COUNCIL_STATES.CANCELED &&
							<>
								<Grid
									spacing={20}
									style={{
										marginTop: '1.3em',
										width: '100%',
										borderRadius: '2px',
									}}
								>
									<GridItem
										xs={12}
										md={4}
										lg={4}
										style={{
											padding: '0.3em',
										}}
									>
										<CancelAppointment
											refetch={refetch}
											trigger={
												<PanelButton
													icon={
														<CancelIcon
															style={{
																width: '93px',
																height: '93px',
															}}
														/>
													}
													color="#dc7373"
													backgroundColor="white"
													text={translate.cancel_appointment}
												/>
											}
											appointment={appointment}
											translate={translate}
										/>
									</GridItem>
									<GridItem
										xs={12}
										md={4}
										lg={4}
										style={{
											padding: '0.3em',
										}}
									>
										<RescheduleAppointment
											refetch={refetch}
											trigger={
												<PanelButton
													icon={
														<RescheduleAppointmentIcon
															fill="var(--primary)"
															style={{
																width: '93px',
																height: '93px',
															}}
														/>
													}
													color="var(--primary)"
													backgroundColor="white"
													text={translate.appointment_reschedule}
												/>
											}
											appointment={appointment}
											translate={translate}
										/>
									</GridItem>
									<GridItem
										xs={12}
										md={4}
										lg={4}
										style={{
											padding: '0.3em',
										}}
									>
										<Link to={`/attendance/participant/${participant.id}/council/${appointment.id}/documentation`}>
											<PanelButton
												icon={
													<DocumentationIcon
														style={{
															width: '93px',
															height: '93px',
														}}
													/>
												}
												color="white"
												backgroundColor="var(--primary)"
												text={translate.your_documentation}
											/>
										</Link>
									</GridItem>
								</Grid>
							</>
						}
					</Card>
				}
			</div>
		</NotLoggedLayout>
	);
};

const PanelButton = ({ text, icon, color, backgroundColor }) => (
	<div
		style={{
			flexGrow: 1,
			cursor: 'pointer',
			border: `1px solid ${color}`,
			display: 'flex',
			alignItems: 'center',
			padding: '2em 0.6em',
			borderRadius: '6px',
			flexDirection: 'column',
			backgroundColor,
			justifyContent: 'center'
		}}
	>
		{icon}
		<div
			style={{
				color,
				fontSize: '20px',
				marginTop: '0.6em'
			}}
		>
			{text}
		</div>
	</div>
);


export default withSharedProps()(MainMenu);
