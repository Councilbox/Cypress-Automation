import React from 'react';
import { Card } from 'material-ui';
import { Grid, GridItem, Link, NotLoggedLayout } from '../../../displayComponents';
import withSharedProps from '../../../HOCs/withSharedProps';
import { ReactComponent as Icon } from '../../../assets/img/create-appointment.svg';
import { getPrimary } from '../../../styles/colors';
import { isMobile } from '../../../utils/screen';
import Title from '../UI/Title';
import { useSubdomain } from '../../../utils/subdomain';
import AppointmentFooter from './create/AppointmentFooter';


const LandingPage = ({ translate }) => {
	const subdomain = useSubdomain();
	const primary = getPrimary();

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
				flexDirection: 'column',
				flexGrow: 1
			}}>
				<Grid
					style={{
						width: 'clamp(300px, 920px, 100%)'
					}}
				>
					<GridItem xs={12} md={12} lg={12}>
						<Card style={{
							margin: isMobile ? '6em 0' : 'auto',
							backgroundColor: 'white',
							width: isMobile ? '100%' : '',
							padding: isMobile ? '4em 2em' : '8em 10em',
							display: 'flex',
							alignItems: 'center',
							flexDirection: 'column',
							justifyContent: 'center'
						}}>
							<Title fontSize="20px">
								{translate.appointment_landing_title} - {subdomain.title}
							</Title>
							<div style={{ margin: '2em 0', fontSize: '18px' }}>
								{translate.appointment_landing_subtitle}
							</div>
							<Link to="/newAppointment">
								<Card
									style={{
										backgroundColor: primary,
										cursor: 'pointer',
										padding: '4em',
										textAlign: 'center'
									}}
								>
									<Icon fill="white" />
									<div style={{ color: 'white', marginTop: '0.6em' }}>
										{translate.request_appointment}
									</div>
								</Card>
							</Link>
						</Card>
					</GridItem>
					<GridItem xs={12} md={12} lg={12}>
						<div
							style={{
								marginTop: '2em'
							}}
						>
							<AppointmentFooter color="white" />
						</div>
					</GridItem>
				</Grid>
			</div>
		</NotLoggedLayout>
	);
};

export default withSharedProps()(LandingPage);
