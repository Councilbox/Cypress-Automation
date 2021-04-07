import React from 'react';
import { Card } from 'material-ui';
import { withRouter } from 'react-router';
import { Grid, GridItem, Link, NotLoggedLayout } from '../../../displayComponents';
import { ReactComponent as CancelIcon } from '../../../assets/img/cancel-appointment.svg';
import { ReactComponent as DocumentationIcon } from '../../../assets/img/upload.svg';
import { moment } from '../../../containers/App';
import withSharedProps from '../../../HOCs/withSharedProps';
import { isMobile } from '../../../utils/screen';
import Title from '../UI/Title';
import { useSubdomain } from '../../../utils/subdomain';
import ParticipantCouncilAttachments from '../../participant/agendas/ParticipantCouncilAttachments';


const MainMenu = ({ translate, participant, appointment, match }) => {
	const subdomain = useSubdomain();

	console.log(match);

	return (
		<NotLoggedLayout
			translate={translate}
			helpIcon={true}
			languageSelector={true}
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
					}} elevation={6}>
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
						justifyContent: 'center'
					}}>
						<Title>Sistema de gestión de citas previas - {subdomain.title}</Title>
						<ParticipantInfo
							appointment={appointment}
							participant={participant}
							translate={translate}
						/>
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
								md={6}
								lg={6}
								style={{
									padding: '0.3em',
								}}
							>
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
									text="Cancelar cita"
								/>
							</GridItem>
							<GridItem
								xs={12}
								md={6}
								lg={6}
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
					</Card>
				}
			</div>
		</NotLoggedLayout>
	);
};

const ParticipantInfo = ({ translate, participant, appointment }) => {

	const Participant = (
		<>
			<div style={{ fontWeight: '700' }}>{participant.name} {participant.surname}</div>
			<div style={{ fontWeight: '700' }}>{translate.dni} {participant.dni}</div>
		</>
	);

	const AppointMent = (
		<>
			<div><b>Centro:</b> {appointment.company.businessName}</div>
			<div><b>Servicio:</b> {translate[appointment.statute.title] || appointment.statute.title}</div>
			<div><b>Fecha:</b> {`${moment(appointment.dateStart).format('DD / MMMM / yyyy hh:mm')}h`}</div>
		</>
	);

	return (
		<div
			style={{
				marginTop: '1.3em',
				objectFit: 'contain',
				width: '100%',
				fontSize: '16px',
				display: 'flex',
				justifyContent: 'space-evenly',
				flexDirection: isMobile ? 'column' : 'row',
				alignItems: 'center',
				color: 'var(--primary)',
				borderRadius: '2px',
				padding: '1em 2em',
				backgroundColor: 'rgba(187, 210, 241, 0.34)'
			}}
		>
			<div>
				{Participant}
			</div>
			<div>
				{AppointMent}
			</div>
		</div>
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


export default withSharedProps()(withRouter(MainMenu));
