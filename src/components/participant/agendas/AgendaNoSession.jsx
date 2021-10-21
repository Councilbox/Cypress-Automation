import React from 'react';
import {
	Paper, Typography, Divider, Card, CardHeader, CardContent, Collapse, CardActions, Tooltip, Button
} from 'material-ui';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import {
	LoadingSection, Scrollbar, AlertConfirm, DisabledSection
} from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import AgendaMenu from './AgendaMenu';
import AgendaDescription from './AgendaDescription';
import { getAgendaTypeLabel, councilStarted } from '../../../utils/CBX';
import CouncilInfoMenu from '../menus/CouncilInfoMenu';
import * as CBX from '../../../utils/CBX';
import CommentModal from './CommentModal';
import { store } from '../../../containers/App';
import { logoutParticipant } from '../../../actions/mainActions';
import { updateCustomPointVoting } from './CustomPointVotingMenu';
import FinishModal from './FinishModal';
import Results from '../Results';
import ResultsTimeline from '../ResultsTimeline';
import { isMobile } from '../../../utils/screen';
import CouncilAttachmentsModal from './CouncilAttachmentsModal';
import { COUNCIL_STATES, COUNCIL_TYPES } from '../../../constants';
import VoteSuccessMessage from './VoteSuccessMessage';
import { ConfigContext } from '../../../containers/AppControl';
import VotingCertificate from './VotingCertificate';


export const VotingContext = React.createContext({});

const styles = {
	container: {
		width: '100%',
		height: 'calc( 100% - 2em )',
		overflow: 'hidden',
		position: 'relative'
	},
	container100: {
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		position: 'relative'
	},
	agendasHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: '8px',
		justifyContent: 'space-between'
	}
};

const updateAgendaVoting = gql`
    mutation UpdateAgendaVoting($agendaVoting: AgendaVotingInput!){
        updateAgendaVoting(agendaVoting: $agendaVoting){
            success
            message
        }
    }
`;


const AgendaNoSession = ({
	translate, council, participant, data, noSession, client, updateComment, ...props
}) => {
	const primary = getPrimary();
	const scrollbar = React.useRef();
	let agendas = [];
	const [responses, setResponses] = React.useState(new Map());
	const [finishModal, setFinishModal] = React.useState(false);
	const [showModal, setShowModal] = React.useState(false);
	const [idActive, setIdActive] = React.useState(false);

	const itemRefs = [];

	const renderAgendaCard = agenda => (
		<AgendaCard
			agenda={agenda}
			council={council}
			translate={translate}
			participant={participant}
			refetch={data.refetch}
			responses={responses}
			setResponse={setResponses}
			client={client}
		/>
	);

	const showFinishModal = () => {
		setFinishModal(true);
	};

	const sendVoteAndExit = async () => {
		const response = await Promise.all(Array.from(responses).filter(res => res[1] !== -1).map(res => {
			if (Array.isArray(res[1])) {
				return client.mutate({
					mutation: updateCustomPointVoting,
					variables: {
						selections: res[1],
						votingId: res[0]
					}
				});
			}

			return client.mutate({
				mutation: updateAgendaVoting,
				variables: {
					agendaVoting: {
						id: res[0],
						vote: res[1],
					}
				}
			});
		}));

		if (response) {
			await client.mutate({
				mutation: gql`
					mutation participantFinishedVoting{
						participantFinishedVoting{
							success
						}
					}
				`
			});
			await data.refetch();
			logout();
		}
	};

	React.useEffect(() => {
		if (data.participantVotings && responses.size === 0) {
			data.participantVotings.filter(voting => (
				voting.participantId === participant.id
			|| voting.delegateId === participant.id || voting.author.representative.id === participant.id)).forEach(voting => {
				responses.set(voting.id, -1);
			});
			setResponses(new Map(responses));
		}
	}, [data]);

	const renderModalBody = () => (
		<div style={{ width: '100%', height: '100%' }}>
			<div style={{
				height: '100%', marginTop: '1em', overflow: 'hidden', padding: '1em'
			}}>
				<div style={{ marginBottom: '0.5em', fontWeight: '600' }}>{translate.thanks_for_participation}</div>
				<div style={{ marginBottom: '1em', fontWeight: '600' }}>{translate.if_click_options_finalize}</div>
				<div style={{ marginBottom: '1em' }}>{translate.my_participation} - <span style={{ color: getPrimary() }}>{participant.name} {participant.surname || ''}</span></div>
				<div style={{ height: 'calc( 100% - 2.5em )' }}>
					<Scrollbar>
						<Results
							stylesHead={{ marginTop: '1em' }}
							council={council}
							participant={participant}
							translate={translate}
							endPage={true}
						/>
					</Scrollbar>
				</div>
			</div>
		</div>
	);

	const logout = () => {
		store.dispatch(logoutParticipant(participant, council));
	};

	const scrollTo = id => {
		if (itemRefs[id] != null) {
			itemRefs[id].scrollIntoView();
		}
	};

	React.useLayoutEffect(() => {
		const activeAgenda = data.agendas.find(agenda => CBX.agendaPointOpened(agenda));
		if (activeAgenda && activeAgenda.id !== idActive) {
			scrollTo(activeAgenda.id);
			setIdActive(activeAgenda.id);
		}

		if (props.timeline && idActive) {
			setIdActive(false);
		}
	}, [data.agendas, props.timeline]);

	const renderExitModal = () => (
		<AlertConfirm
			requestClose={() => setShowModal(false)}
			open={showModal}
			acceptAction={logout}
			buttonCancel={translate.cancel}
			buttonAccept={translate.finish}
			bodyText={renderModalBody()}
			bodyStyle={{ height: '60vh', overflow: 'hidden' }}
			title={translate.summary}
		></AlertConfirm>
	);

	const renderFinishModal = () => (
		<FinishModal
			open={finishModal}
			translate={translate}
			requestClose={() => setFinishModal(false)}
			action={sendVoteAndExit}
		/>
	);

	const renderExitButton = () => (
		CBX.voteAllAtOnce({ council }) ?
			<Button
				onClick={showFinishModal}
				style={{
					borderRadius: '25px',
					background: 'white',
					color: primary,
					height: '25px',
					fontSize: '13px',
					userSelect: 'none',
					textTransform: 'none',
					minHeight: '0px',
					lineHeight: '0.5',
					borderColor: primary,
					border: '2px solid',
					marginRight: '0.5em'
				}}
			>
				<b>{translate.to_vote}</b>
			</Button>
			:
			<Button
				onClick={() => setShowModal(true)}
				style={{
					borderRadius: '25px',
					background: 'white',
					color: primary,
					height: '25px',
					fontSize: '13px',
					textTransform: 'none',
					minHeight: '0px',
					lineHeight: '0.5',
					borderColor: primary,
					border: '2px solid',
					marginRight: '0.5em'
				}}
			>
				<b>{translate.finish}</b>
			</Button>
	);

	if (data.agendas) {
		agendas = data.agendas.map(agenda => ({
			...agenda,
			votings: data.participantVotings.filter(voting => voting.agendaId === agenda.id)
		}));
	}

	if (props.inPc) {
		return (
			<VotingContext.Provider value={{
				responses,
				setResponses
			}}>
				{renderFinishModal()}
				<Paper style={!noSession ? styles.container : styles.container100} elevation={4}>
					{(council.state === COUNCIL_STATES.PAUSED && !props.timeline) &&
						<DisabledSection>
							{translate.council_paused}
						</DisabledSection>
					}

					<div style={{ height: '100%' }}>
						{!props.sinCabecera &&
							<React.Fragment>
								<div style={{
									padding: '8px',
									position: 'relative',
									textAlign: 'center'
								}}>
									{props.timeline ?
										(
											<React.Fragment>
												<Typography variant="title" style={{ fontWeight: '700' }}>{translate.summary}</Typography>
											</React.Fragment>
										) : (
											<React.Fragment>
												<Typography variant="title" style={{ fontWeight: '700' }}>{council.councilType === 5 ? translate.council : translate.agenda}</Typography>
											</React.Fragment>
										)
									}
									<div style={{ position: 'absolute', top: '3px', right: '5px' }}>
										{/* <div style={{ width: '9em' }}> */}
										<CouncilInfoMenu
											{...props}
											translate={translate}
											participant={participant}
											council={council}
											agendaNoSession={true}
											noSession={noSession}
										/>

									</div>
								</div>
								<Divider />
							</React.Fragment>
						}
						{props.sinCabecera &&
							<div style={{
								position: 'fixed', top: '50px', right: '15px', background: 'gainsboro', width: '47px', height: '32px', borderRadius: '25px'
							}}>
								<CouncilInfoMenu
									{...props}
									noSession={noSession}
									translate={translate}
									participant={participant}
									council={council}
								/>
							</div>
						}
						{props.timeline ? (
							<ResultsTimeline
								council={council}
								participant={participant}
								translate={translate}
								endPage={true}
							/>
						) : (
							<Scrollbar ref={scrollbar}>
								<div style={{ marginTop: '2em' }}>
									{!councilStarted(council) &&
										<div style={{
											backgroundColor: primary, width: '100%', padding: '1em', color: 'white', fontWeight: '700'
										}}>
											{translate.council_not_started_yet}
										</div>
									}
									{council.company.logo &&
										<div
											style={{
												width: '100%',
												display: 'flex',
												justifyContent: 'center',
												height: '2.5em',
												marginTop: '0.6em'
											}}
										>
											<img src={council.company.logo} style={{ height: '100%', width: 'auto' }}></img>
										</div>
									}
									<div style={{ marginTop: '20px', paddingBottom: '2em' }}>
										{council.councilType === COUNCIL_TYPES.ONE_ON_ONE &&
											<CouncilAttachmentsModal
												council={council}
												participant={participant}
												translate={translate}
											/>
										}
										{data.agendas ?
											<React.Fragment>
												{agendas.map((agenda, index) => (
													<React.Fragment key={`agenda_card_${index}`} >
														<div ref={el => { itemRefs[agenda.id] = el; }} style={{ width: '100%' }}>
															{renderAgendaCard(agenda)}
														</div>
													</React.Fragment>
												))}
											</React.Fragment>
											:
											<LoadingSection />
										}
									</div>
								</div>
							</Scrollbar>
						)}
					</div>
				</Paper>
				{!noSession &&
					<div style={{ marginTop: '0.5em', display: 'flex', justifyContent: 'flex-end' }}>
						{renderExitButton()}
					</div>
				}
				{renderExitModal()}
			</VotingContext.Provider>
		);
	}

	return (
		<VotingContext.Provider value={{
			setResponses,
			responses
		}}>
			{renderFinishModal()}
			<div style={{ height: !noSession ? 'calc( 100% - 3em )' : '100%' }}>
				{(council.state === COUNCIL_STATES.PAUSED && !props.timeline) &&
					<DisabledSection>
						{translate.council_paused}
					</DisabledSection>
				}
				{!props.sinCabecera &&
					<React.Fragment>
						<div style={styles.agendasHeader}>
							<Typography variant="title" style={{ fontWeight: '700' }}>{council.councilType === 5 ? translate.council : translate.agenda}</Typography>
							<div style={{ width: '3em' }}>
								<CouncilInfoMenu
									{...props}
									translate={translate}
									participant={participant}
									council={council}
									noSession={noSession}
								/>
							</div>
						</div>
						<Divider />
					</React.Fragment>
				}
				{props.sinCabecera &&
					<div style={{
						position: 'relative', top: '5px', width: '100%', height: '32px'
					}}>
						<CouncilInfoMenu
							noSession={noSession}
							{...props}
							translate={translate}
							participant={participant}
							council={council}
						/>
					</div>
				}
				{!councilStarted(council) &&
					<div style={{
						backgroundColor: primary, width: '100%', padding: '1em', color: 'white', fontWeight: '700'
					}}>
						{translate.council_not_started_yet}
					</div>
				}
				<div style={{ padding: '0.6em' }}> {/* marginTop: '10px', */}
					{council.councilType === 5 &&
						<CouncilAttachmentsModal
							council={council}
							participant={participant}
							translate={translate}
						/>
					}
					{data.agendas ?
						<React.Fragment>
							{agendas.map((agenda, index) => (
								<React.Fragment key={`agenda_card_${index}`} >
									<div ref={el => { itemRefs[agenda.id] = el; }}>
										{renderAgendaCard(agenda)}
									</div>
								</React.Fragment>
							))}
							{!noSession &&
								<div style={{ marginTop: '0.5em', display: 'flex', justifyContent: 'flex-end' }}>
									{renderExitButton()}
								</div>
							}
						</React.Fragment>

						:
						<LoadingSection />
					}
				</div>

				{renderExitModal()}
			</div>
		</VotingContext.Provider>
	);
};

const AgendaCard = ({
	agenda, translate, participant, refetch, council
}) => {
	const ownVote = CBX.findOwnVote(agenda.votings, participant);
	const config = React.useContext(ConfigContext);

	const agendaStateIcon = () => {
		let title = '';
		if (council.councilType >= 2) {
			return <span />;
		}

		let icon = 'fa fa-lock';
		let color = '';
		if (CBX.agendaPointNotOpened(agenda) || CBX.agendaClosed(agenda)) {
			icon = 'fa fa-lock colorGrey';
			title = translate.closed;
		}
		if (CBX.agendaPointOpened(agenda)) {
			icon = 'fa fa-unlock-alt colorGren';
			color = '#278289';
			title = translate.in_discussion;
		}
		return (
			<Tooltip title={title}>
				<i
					className={icon}
					aria-label={icon === 'fa fa-lock colorGrey' ? 'punto cerrado' : 'punto abierto'}
					style={{
						marginRight: '0.6em', cursor: 'auto', fontSize: '18px', color
					}}
				></i>
			</Tooltip>
		);
	};


	const agendaVotingIcon = () => {
		const mostrar = agenda.subjectType !== 0;
		if (mostrar) {
			let title = CBX.isConfirmationRequest(agenda.subjectType) ? translate.closed : translate.closed_votings;
			let color = 'default';
			if (CBX.agendaVotingsOpened(agenda)) {
				title = CBX.isConfirmationRequest(agenda.subjectType) ? translate.confirm : translate.opened_votings;
				color = '#278289';
			}
			return (
				<Tooltip title={title}>
					<i
						className={'material-icons'}
						aria-label={title}
						style={{
							marginRight: '0.6em', fontSize: '20px', color, cursor: 'context-menu'
						}}
					>
						how_to_vote
					</i>
				</Tooltip>
			);
		}
		return <span />;
	};


	return (
		<div style={{ margin: '0 auto', marginBottom: '15px', width: isMobile ? '100%' : '93%' }} key={agenda.id}>
			<Card
				aria-label={`punto${agenda.orderIndex + 1} ${translate[getAgendaTypeLabel(agenda)]} título ${agenda.agendaSubject}`}
				style={{ border: CBX.agendaPointOpened(agenda) ? '1px solid purple' : 'none' }}
			>
				<CardHeader
					action={
						<div style={{ display: 'flex' }}>
							<div>
								{agendaStateIcon()}
							</div>
							<div>
								{agendaVotingIcon()}
							</div>
						</div>
					}
					title={<div style={{ fontSize: '17px', fontWeight: '700' }}>{agenda.agendaSubject}</div>}
					subheader={translate[getAgendaTypeLabel(agenda)]}
				/>
				<Collapse in={true} timeout="auto" unmountOnExit>
					<CardContent>
						<AgendaDescription agenda={agenda} translate={translate} />
						<AgendaMenu
							horizontal={true}
							agenda={agenda}
							council={council}
							participant={participant}
							translate={translate}
							refetch={refetch}
						/>
					</CardContent>
				</Collapse>

				<CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
					<CommentModal
						translate={translate}
						agenda={agenda}
						participant={participant}
						council={council}
						refetch={refetch}
					/>
					{!config.altSelectedOption ?
						<VoteSuccessMessage
							vote={ownVote}
							agenda={agenda}
							translate={translate}
						/>
						:
						<VotingCertificate
							vote={ownVote}
							translate={translate}
							agenda={agenda}
							participant={participant}
						/>
					}
				</CardActions>
			</Card>
		</div>
	);
};

export default withApollo(AgendaNoSession);
