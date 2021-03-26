import React from 'react';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as mainActions from '../../../../actions/mainActions';
import { BasicButton, Grid, GridItem, LoadingMainApp, Scrollbar } from '../../../../displayComponents';
import withTranslations from '../../../../HOCs/withTranslations';
import { getPrimary } from '../../../../styles/colors';
import { getCustomLogo, useSubdomain } from '../../../../utils/subdomain';
import AppointmentDateForm from './AppointmentDateForm';
import AppointmentParticipantForm from './AppointmentParticipantForm';
import ServiceSelector from './ServiceSelector';


const CreateAppointmentPage = ({ match, translate, actions }) => {
	const [loadLanguage, setLoadedLanguage] = React.useState(false);
	const subdomain = useSubdomain();
	const { language } = match.params;

	const primary = getPrimary();

	React.useEffect(() => {
		if (language && language !== translate.selectedLanguage) {
			actions.setLanguage(language);
		} else {
			setLoadedLanguage(true);
		}
	}, [language, translate.selectedLanguage]);


	if (!loadLanguage) {
		return <LoadingMainApp />;
	}

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<Scrollbar>
				<div>
					<div style={{
						height: '4.5em',
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<img src={getCustomLogo()} style={{
							height: '3em',
							width: 'auto',
							...subdomain?.styles?.appointmentLogo
						}} />
					</div>
					<h2 style={{
						marginTop: '1em',
						textAlign: 'center',
						fontWeight: 'normal',
						fontStretch: 'normal',
						fontStyle: 'normal',
						lineHeight: 'normal',
						letterSpacing: 'normal'
					}}>Solicitud de cita previa</h2>
					<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
						<Grid style={{
							maxWidth: '1024px',
						}}>
							<GridItem xs={12} md={6} lg={6} style={{ height: '100%', overflow: 'hidden' }} >
								<ServiceSelector

								/>
								<AppointmentDateForm
									style={{
										marginTop: '1em'
									}}
								/>
							</GridItem>
							<GridItem xs={12} md={6} lg={6} style={{ height: '100%', overflow: 'hidden' }}>
								<AppointmentParticipantForm

								/>
							</GridItem>
						</Grid>
					</div>
					<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
						<Grid
							style={{
								maxWidth: '1024px',
							}}
							alignItems="flex-end"
							alignContent="flex-end"
						>
							<GridItem xs={12} md={12} lg={12} style={{ height: '100%', overflow: 'hidden' }}>
								<div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', padding: '0.6em 0' }}>
									<BasicButton
										text="Cancelar"
										color="white"
										type="flat"
										textStyle={{
											fontWeight: '700',
											fontSize: '1.1em'
										}}
										buttonStyle={{
											padding: '0.8em'
										}}
									/>
									<BasicButton
										text="Solicitar cita"
										color={primary}
										textStyle={{
											color: 'white',
											fontWeight: '700',
											fontSize: '1.1em'
										}}
										buttonStyle={{
											marginLeft: '0.6em',
											padding: '0.8em'
										}}
									/>
								</div>
							</GridItem>
						</Grid>
					</div>
					<div
						style={{
							width: '90%',
							backgroundColor: 'rgba(180, 198, 222, 0.16)',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							height: '2em'
						}}
					>
						
					</div>
				</div>
			</Scrollbar>
		</div>
	);
};

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(mainActions, dispatch)
});

export default withTranslations()(withApollo(connect(null, mapDispatchToProps)(CreateAppointmentPage)));
