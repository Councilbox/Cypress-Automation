import gql from 'graphql-tag';
import React from 'react';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as mainActions from '../../../../actions/mainActions';
import { BasicButton, Grid, GridItem, LoadingMainApp, Scrollbar } from '../../../../displayComponents';
import { moment } from '../../../../containers/App';
import withTranslations from '../../../../HOCs/withTranslations';
import { getPrimary } from '../../../../styles/colors';
import { isMobile } from '../../../../utils/screen';
import { getCustomLogo, useSubdomain } from '../../../../utils/subdomain';
import AppointmentDateForm from './AppointmentDateForm';
import AppointmentParticipantForm from './AppointmentParticipantForm';
import ServiceSelector from './ServiceSelector';


const CreateAppointmentPage = ({ match, translate, actions, client }) => {
	const [loadLanguage, setLoadedLanguage] = React.useState(false);
	const [appointmentData, setAppointmentData] = React.useState({
		companyId: 1054,
		statuteId: 2486,
		name: 'DEMO',
		acceptedLegal: false,
		participant: {
			name: '',
			surname: '',
			dni: '',
			email: '',
			phone: '',
		},
		date: new Date(),
		time: ''
	});
	const [subdomainData, setSubdomainData] = React.useState(null);
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


	const updateAppointmentData = object => {
		setAppointmentData({
			...appointmentData,
			...object
		});
	};

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query Subdomain($name: String!){
					subdomain(name: $name) {
						name
						entities {
							id
							businessName
						}
					}
				}
			`,
			variables: {
				name: subdomain.name
			}
		});

		setSubdomainData(response.data.subdomain);
		updateAppointmentData({
			companyId: response.data.subdomain.entities[0].id
		});
	}, [subdomain.name]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	const createAppointment = async () => {
		const { participant, acceptedLegal, ...council } = appointmentData;

		const date = moment(council.date);
		const time = council.time.split(':');

		date.set({
			hours: time[0],
			minutes: time[1]
		});

		council.dateStart = date.toISOString();
		delete council.date;
		delete council.time;

		const response = await client.mutate({
			mutation: gql`
				mutation CreateAppointment($council: CouncilInput, $participant: ParticipantInput) {
					createAppointment(council: $council, participant: $participant) {
						id
					}
				}
			`,
			variables: {
				participant,
				council
			}
		});

		console.log(response);
	};

	const updateParticipant = object => {
		setAppointmentData({
			...appointmentData,
			participant: {
				...appointmentData.participant,
				...object
			}
		});
	};

	if (!loadLanguage || !subdomainData) {
		return <LoadingMainApp />;
	}

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<Scrollbar>
				<div style={{ width: '100%', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
					<div style={{
						height: '4.5em',
						width: '100%',
						display: 'flex',
						flexGrow: 1,
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
					}}>
						Solicitud de cita previa
					</h2>
					<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
						<Grid style={{
							maxWidth: '1024px',
						}}>
							<GridItem xs={12} md={6} lg={6} style={isMobile ? {} : { height: '100%', overflow: 'hidden' }} >
								<ServiceSelector
									appointment={appointmentData}
									setState={updateAppointmentData}
									entities={subdomainData.entities}
								/>
								<AppointmentDateForm
									appointment={appointmentData}
									setState={updateAppointmentData}
									style={{
										marginTop: '1em'
									}}
								/>
							</GridItem>
							<GridItem xs={12} md={6} lg={6} style={isMobile ? {} : { height: '100%', overflow: 'hidden' }}>
								<AppointmentParticipantForm
									translate={translate}
									appointment={appointmentData}
									participant={appointmentData.participant}
									setLegalTerms={value => setAppointmentData({
										...appointmentData,
										acceptedLegal: value
									})}
									setState={updateParticipant}
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
										onClick={createAppointment}
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
