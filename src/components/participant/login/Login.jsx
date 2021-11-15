import React from 'react';
import { Card } from 'material-ui';
import withTranslations from '../../../HOCs/withTranslations';
import withDetectRTC from '../../../HOCs/withDetectRTC';
import { councilIsLive, councilIsFinished, checkHybridConditions } from '../../../utils/CBX';
import LoginForm from './LoginForm';
import CouncilState from './CouncilState';
import { NotLoggedLayout } from '../../../displayComponents';
import { isMobile } from '../../../utils/screen';
import RequestDataInfo from './RequestDataInfo';
import DataAuthorization from './Legalterms/DataAuthorization';
import { ConfigContext } from '../../../containers/AppControl';

// '850px'
const width = window.innerWidth > 450 ? '850px' : '100%';

const styles = {
	mainContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		position: 'relative',
		padding: isMobile ? '' : '10px'
	},
	cardContainer: {
		margin: isMobile ? '20%' : '20px',
		marginBottom: '5px',
		minWidth: width,
		maxWidth: '100%'
	}
};

const reducer = (state, action) => {
	const actions = {
		SUCCESS: () => ({
			...state,
			status: 'SUCCESS',
			message: action.payload.message
		}),
		ERROR: () => ({
			...state,
			status: 'ERROR',
			message: action.payload.message
		})
	};

	return actions[action.type] ? actions[action.type]() : state;
};

const ParticipantLogin = ({
	participant, council, company, ...props
}) => {
	const [selectHeadFinished, setSelectHeadFinished] = React.useState('participacion');
	const [{ status, message }, updateState] = React.useReducer(reducer, { status: 'WAITING' });
	const config = React.useContext(ConfigContext);

	const finishedVoted = (councilIsFinished(council) || participant.hasVoted);

	const loginForm = () => (
		<LoginForm
			participant={participant}
			council={council}
			company={company}
			status={status}
			message={message}
			updateState={updateState}
		/>
	);

	if ((finishedVoted || !councilIsLive(council)) && isMobile) {
		return (
			<NotLoggedLayout
				translate={props.translate}
				helpIcon={true}
				languageSelector={false}
				councilIsFinished={councilIsFinished(council)}
				setSelectHeadFinished={setSelectHeadFinished}
				selectHeadFinished={selectHeadFinished}
			>
				<CouncilState
					council={council}
					company={company}
					participant={participant}
					selectHeadFinished={selectHeadFinished}
				/>
			</NotLoggedLayout>
		);
	}
	const renderLogin = ((councilIsLive(council) && !participant.hasVoted) && !checkHybridConditions(council));
	return (
		<NotLoggedLayout
			translate={props.translate}
			helpIcon={true}
			participantLanguageSelector={true}
			languageSelector={false}
			loginFooter={renderLogin}
		>
			{renderLogin ?
				<>
					{(participant.legalTermsAccepted || !config.participantTermsCheck) ?
						<div style={{
							...styles.mainContainer,
							minHeight: isMobile && 'calc(100% - 5em)',
							...(!isMobile ? {
								justifyContent: 'center'
							} : {}),
							...(council.securityType === 2 && isMobile && {
								height: '',
							}),
						}}>
							<>
								<Card style={{
									...styles.cardContainer,
									minWidth: window.innerWidth > 450 ? '550px' : '100%',
									padding: '0.6em',
									marginTop: isMobile && window.innerHeight < 750 ? '5%' : '20px',
									...(council.securityType === 2 && isMobile && {
										margin: '10% 20% 5px'
									}),
								}} elevation={6}>
									{loginForm()}
								</Card>
								<Card style={{
									width: window.innerWidth > 450 ? '550px' : '100%',
									...(council.securityType === 2 && isMobile && {
										marginBottom: '6em'
									}),
								}}>
									<RequestDataInfo
										data={{}}
										translate={props.translate}
										message={message}
										status={'SUCCESS'} // SUCCESS
									/>
								</Card>
							</>
							<div>
								<div>{props.translate.marketing_text_councilbox}</div>
							</div>
						</div>
						:
						<div style={{
							...styles.mainContainer,
							...(!isMobile ? {
								justifyContent: 'center'
							} : {}),
							...(council.securityType === 2 && isMobile && {
								height: '',
							}),
						}}>
							<Card style={{
								...styles.cardContainer,
								padding: '2em',
								background: finishedVoted && 'transparent',
								boxShadow: finishedVoted && 'none',
								minWidth: window.innerWidth > 750 ? '650px' : '100%'
							}} elevation={6}>
								<DataAuthorization
									participant={participant}
									council={council}
									company={company}
									translate={props.translate}
									refetch={props.refetch}
								/>
							</Card>
							<Card style={{
								width: window.innerWidth > 750 ? '650px' : '100%'
							}}>
								<RequestDataInfo
									data={{}}
									translate={props.translate}
									message={message}
									status={'SUCCESS'} // SUCCESS
								/>
							</Card>
						</div>
					}
				</>
				:
				<div style={styles.mainContainer}>
					<div style={{
						...styles.cardContainer,
						minWidth: width
					}}>
						<CouncilState council={council} company={company} participant={participant} />
					</div>
				</div>
			}
		</NotLoggedLayout>
	);
};


export default withTranslations()(withDetectRTC()(ParticipantLogin));
