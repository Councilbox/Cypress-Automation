import React from 'react';
import { Card } from 'material-ui';
import { Link, NotLoggedLayout } from '../../../displayComponents';
import withSharedProps from '../../../HOCs/withSharedProps';
import { ReactComponent as Icon } from '../../../assets/img/create-appointment.svg';
import { getPrimary } from '../../../styles/colors';
import { isMobile } from '../../../utils/screen';


const LandingPage = ({ translate }) => {
	const primary = getPrimary();

	return (
		<NotLoggedLayout
			translate={translate}
			helpIcon={true}
			languageSelector={true}
		>
			<div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<Card style={{
					height: isMobile ? 'calc(100vh - 15em)' : '',
					margin: isMobile ? '3em 0' : 'auto',
					backgroundColor: 'white',
					width: isMobile ? '100%' : '',
					padding: isMobile ? '0' : '8em 10em',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}>
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
								Solicitar cita previa
							</div>
						</Card>
					</Link>
				</Card>
			</div>
		</NotLoggedLayout>
	);
};

export default withSharedProps()(LandingPage);
