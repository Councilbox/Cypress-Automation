import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TextArea from 'antd/lib/input/TextArea';
import { moment } from '../../../containers/App';
import { AlertConfirm, BasicButton, Scrollbar } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import Stars from './Stars';
import { useSubdomain } from '../../../utils/subdomain';
import { useStatus, STATUS } from '../../../hooks';

let timeout;

const CouncilSurveyModal = ({
	open, requestClose, autoOpen, translate, client, participant
}) => {
	const [state, setState] = React.useState({
		creationDate: null,
		id: null,
		data: {
			satisfaction: 0,
			performance: 0,
			recommend: 0,
			care: 0,
			suggestions: ''
		}
	});
	const { loading, error, setStatus } = useStatus(STATUS.LOADING);

	const [errors, setErrors] = React.useState({});
	const subdomain = useSubdomain();

	const checkRequiredFields = () => {
		const newErrors = {};

		if (state.satisfaction === 0) {
			newErrors.satisfaction = translate.required_field;
		}

		if (state.performance === 0) {
			newErrors.performance = translate.required_field;
		}

		if (state.recommend === 0) {
			newErrors.recommend = translate.required_field;
		}

		if (state.care === 0) {
			newErrors.care = translate.required_field;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length > 0;
	};

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query ParticipantSurvey($participantId: Int!){
					participantSurvey(participantId: $participantId){
						creationDate
						data
						id
					}
				}
			`,
			variables: {
				participantId: participant.id
			}
		});

		if (response.data.participantSurvey) {
			setState(response.data.participantSurvey);
		} else {
			const closedWindow = localStorage.getItem('cbx-survey-closed');
			if (!closedWindow || !JSON.parse(closedWindow)[participant.id]) {
				autoOpen();
			}
		}
		setStatus(STATUS.IDDLE);
	}, [participant.id, client]);

	const resetAndClose = () => {
		timeout = setTimeout(() => {
			getData();
			setStatus(STATUS.IDDLE);
			requestClose();
		}, 1800);
	};

	React.useEffect(() => {
		if (!open) {
			return () => clearTimeout(timeout);
		}
	}, [open]);

	const sendSurvey = async () => {
		if (!checkRequiredFields()) {
			setStatus(STATUS.LOADING);
			await client.mutate({
				mutation: gql`
					mutation CreateParticipantSurvey($participantSurvey: ParticipantSurveyInput){
						createParticipantSurvey(participantSurvey: $participantSurvey){
							id
						}
					}
				`,
				variables: {
					participantSurvey: {
						data: state.data
					}
				}
			});
			resetAndClose();
		}
	};

	React.useEffect(() => {
		getData();
	}, [getData]);

	const disabled = !!state.id;

	return (
		<AlertConfirm
			bodyStyle={{
				minWidth: '60vw',
				padding: '1.5em',
				overflow: 'hidden'
			}}
			bodyText={
				<div style={{ padding: '1em' }}>
					<div style={{
						width: '100%',
						borderRadius: '3px',
						marginBottom: '1em',
						background: 'linear-gradient(to top,#b6d1dc -30%, #7976b0 120%)'
					}}>
						<div style={{
							display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 1em'
						}}>
							<div>
								<div style={{
									fontWeight: '800', color: 'white', fontSize: '.9rem', padding: '1rem'
								}} >
									<p style={{ margin: '0' }}>
										{translate.satisfaction_survey}
									</p>
								</div>
							</div>
						</div>
					</div>
					<div style={{
						border: 'none', borderRadius: '1px', textAlign: 'left', color: 'black', fontSize: '14px'
					}}>
						<div style={{ height: 'calc(50vh - 32px)' }}>
							<Scrollbar>
								<div style={{ height: '100%', padding: '.5rem' }}>
									<div>
										<div>{translate.rate_the_satisfaction.replace(/{{appName}}/, subdomain.title || 'Councilbox')}.</div>
										<div>
											<Stars
												name={'satisfaction'}
												value={state.data.satisfaction}
												disabled={disabled}
												error={errors.satisfaction}
												onClick={value => {
													setState({
														...state,
														data: {
															...state.data,
															satisfaction: +value
														}
													});
												}}
											/>
										</div>
									</div>
									<div>
										<div>{translate.rate_performance.replace(/{{appName}}/, subdomain.title || 'Councilbox')}.</div>
										<div>
											<Stars
												name={'performance'}
												value={state.data.performance}
												error={errors.performance}
												disabled={disabled}
												onClick={value => {
													setState({
														...state,
														data: {
															...state.data,
															performance: +value
														}
													});
												}}
											/>
										</div>
									</div>
									<div>
										<div>{translate.degree_recomend_use.replace(/{{appName}}/, subdomain.title || 'Councilbox')}.</div>
										<div>
											<Stars
												name={'recommend'}
												value={state.data.recommend}
												error={errors.recommend}
												disabled={disabled}
												onClick={value => {
													setState({
														...state,
														data: {
															...state.data,
															recommend: +value
														}
													});
												}}
											/>
										</div>
									</div>
									<div>
										<div>{translate.rate_care_received}</div>
										<div>
											<Stars
												name={'care'}
												value={state.data.care}
												error={errors.care}
												disabled={disabled}
												onClick={value => {
													setState({
														...state,
														data: {
															...state.data,
															care: +value
														}
													});
												}}
											/>
										</div>
									</div>
									<div>
										<div>{translate.what_would_you_improve.replace(/{{appName}}/, subdomain.title || 'Councilbox')}</div>
										<div style={{ marginTop: '0.5em' }}>
											<TextArea
												style={{
													width: '100%',
													resize: 'none',
													border: 'none',
													padding: '.2rem',
													background: '#d0d0d080'
												}}
												value={state.data.suggestions}
												disabled={disabled}
												onChange={event => {
													setState({
														...state,
														data: {
															...state.data,
															suggestions: event.target.value
														}
													});
												}}
											/>
										</div>
									</div>

								</div>
							</Scrollbar>
						</div>
						{state.creationDate
							&& <div style={{ marginBottom: '1em', marginTop: '1em' }}>
								{translate.sent_fem}: {moment(state.creationDate).format('LLL')}
							</div>
						}
						<div>
							<div style={{
								marginTop: '1.5em', display: 'flex', flexDirection: 'row', padding: '1rem'
							}}>
								{!disabled
									&& <BasicButton
										onClick={sendSurvey}
										text={translate.send}
										loading={loading}
										error={error}
										backgroundColor={{
											background: getPrimary(),
											color: 'white',
											borderRadius: '1px',
											padding: '1em 3em 1em 3em',
											marginRight: '1em'
										}}
									>
									</BasicButton>
								}

								<BasicButton
									onClick={() => {
										localStorage.setItem('cbx-survey-closed', JSON.stringify({
											[participant.id]: true
										}));
										requestClose();
									}}
									text={translate.close}
									backgroundColor={{
										background: 'white',
										color: getPrimary(),
										borderRadius: '1px',
										fontWeight: '700',
										padding: '1em 3em 1em 3em',
										boxShadow: 'none'
									}}
								>
								</BasicButton>
							</div>
						</div>
					</div>
				</div>
			}
			open={open}
			requestClose={requestClose}
		/>
	);
};

export default withApollo(CouncilSurveyModal);
