import React from 'react';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import { Link, withRouter } from 'react-router-dom';
import {
	Table, TableHead, TableRow, TableCell, TableBody,
} from 'material-ui';
import {
	LoadingSection, BasicButton, AlertConfirm, Scrollbar
} from '../../../../displayComponents';
import CouncilItem from '../CouncilItem';
import { getSecondary } from '../../../../styles/colors';
import DownloadAttendantsPDF from '../../../council/writing/actEditor/DownloadAttendantsPDF';
import withTranslations from '../../../../HOCs/withTranslations';
import SendCredentialsModal from '../../../council/live/councilMenu/SendCredentialsModal';
import AgendaManager from '../../../council/live/AgendaManager';
import { StatuteDisplay } from '../../../council/display/StatuteDisplay';
import OptionsDisplay from '../../../council/display/OptionsDisplay';
import CostManager from './CostManager';
import CredentialsManager from './CredentialsManager';
import { COUNCIL_STATES } from '../../../../constants';
import FailedSMSList from './FailedSMSList';
import CouncilDetailsParticipants from './CouncilDetailsParticipants';
import * as CBX from '../../../../utils/CBX';
import { SearchCouncils } from '../CouncilsDashboard';
import ParticipantsManager from '../../../council/live/participants/ParticipantsManager';
import CheckPhoneModal from './CheckPhoneModal';
import DownloadConvenedPDF from './DownloadConvenedPDF';
import MergeCouncilsButton from './MergeCouncilsButton';
import CouncilOptionsEditor from './optionsEditor/CouncilOptionsEditor';
import QuorumDisplay from '../../../council/live/quorum/QuorumDisplay';


const cancelAct = gql`
	mutation CancelAct($councilId: Int!){
		cancelApprovedAct(councilId: $councilId){
			success
			message
		}
	}
`;

const showSendsRecount = sends => {
	const list = {
		'-1': 'Preconvocatoria',
		0: 'Convocatoria',
		1: 'Recordatorio',
		2: 'Aviso de reprogramación',
		3: 'Reunión cancelada',
		4: 'Acceso a sala',
		5: 'Clave de acceso',
		6: 'Acta',
		13: 'Propuesta de acta',
		16: 'Notificación de apertura de votación',
		18: 'Delegación de voto',
		19: 'Rechazo de delegación',
		20: 'Delegación retirada',
		21: 'Notificación de delegación'
	};

	const recount = {
		Preconvocatoria: 0,
		Convocatoria: 0,
		Recordatorio: 0,
		'Aviso de reprogramación': 0,
		'Reunión cancelada': 0,
		'Acceso a sala': 0,
		'Clave de acceso': 0,
		Acta: 0,
		'Propuesta de acta': 0,
		'Notificación de apertura de votación': 0,
		'Notificación de delegación': 0,
		'Delegación de voto': 0,
		'Rechazo de delegación': 0,
		'Delegación retirada': 0,
		Otros: 0
	};

	sends.forEach(send => {
		if (recount[list[send.sendType]] !== undefined) {
			recount[list[send.sendType]]++;
		} else {
			recount.Otros++;
		}
	});


	return (
		<React.Fragment>
			{Object.keys(recount).filter(key => recount[key] > 0).map(key => (
				<TableRow key={key}>
					<TableCell style={{ textTransform: 'capitalize' }}>
						{`${key}`}
					</TableCell>
					<TableCell >
						{`${recount[key]}`}
					</TableCell>
				</TableRow>
			))}


			<TableRow>
				<TableCell>Total</TableCell>
				<TableCell colSpan={3}>{sends.length}</TableCell>
			</TableRow>
		</React.Fragment>
	);
};

class CouncilDetails extends React.Component {
	state = {
		sendCredentials: false,
		showAgenda: false,
		councilTypeModal: false,
		councilConfigEditor: false,
		credManager: false,
		locked: true,
		data: null,
		councilDetailsParticipants: false
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (!prevState.data) {
			if (!nextProps.data.loading) {
				return {
					data: nextProps.data
				};
			}
		}

		return null;
	}

	showCredsModal = () => {
		this.setState({
			sendCredentials: true
		});
	}

	closeCredsModal = () => {
		this.setState({
			sendCredentials: false
		});
	}

	showCouncilType = () => {
		this.setState({
			councilTypeModal: true
		});
	}

	closeCouncilType = () => {
		this.setState({
			councilTypeModal: false
		});
	}

	showCredManager = () => {
		this.setState({
			credManager: true
		});
	}

	closeCredManager = () => {
		this.setState({
			credManager: false
		});
	}

	toggleLock = event => {
		event.stopPropagation();
		const { locked } = this.state;
		this.setState({
			locked: !locked
		});
	}

	showAgendaManager = () => {
		this.setState({
			showAgenda: true
		});
	}

	closeAgendaManager = () => {
		this.setState({
			showAgenda: false
		});
	}

	cancelCouncilAct = async () => {
		await this.props.cancelAct({
			variables: {
				councilId: this.state.data.council.id
			}
		});

		this.props.data.refetch();
	}

	render() {
		const { translate } = this.props;
		const secondary = getSecondary();

		if (this.props.data.loading) {
			return <LoadingSection />;
		}

		const { council } = this.state.data;

		if (!council) {
			return <FailPageSearchId
				id={this.props.match.params.id}
			/>;
		}
		if (this.state.showAgenda && council) {
			return (
				<React.Fragment>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: '.8em',
						}}>
						<BasicButton
							text="Cerrar agenda manager"
							color={secondary}
							textStyle={{ fontWeight: '700', color: 'white' }}
							onClick={this.closeAgendaManager}
						/>
						<div style={{
							display: 'flex',
							flexDirection: 'row'
						}}>
							<QuorumDisplay
								council={council}
								company={council.company}
								recount={this.state.data.councilRecount}
								translate={translate}
							/>
						</div>
					</div>
					{council.state > COUNCIL_STATES.ROOM_OPENED ?
						<div
							style={{
								width: '100%',
								height: 'calc(100% - 6em)',
								display: 'flex',
								alignItems: 'center',
								flexDirection: 'column',
								fontWeight: '700',
								justifyContent: 'center'
							}}
						>
							<i className="fa fa-hourglass-end" aria-hidden="true" style={{ color: 'grey', fontSize: '6em' }}></i>
							REUNIÓN FINALIZADA
						</div>
						: <div style={{
							backgroundColor: 'white', height: '100%', border: '2px solid black', position: 'relative'
						}}>
							<AgendaManager
								recount={this.state.data.councilRecount}
								council={council}
								company={council.company}
								translate={translate}
								fullScreen={this.state.fullScreen}
								root={true}
								refetch={this.props.data.refetch}
								openMenu={() => { }}
							/>
							{this.state.locked
								&& <div style={{
									position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: 10000
								}} onClick={() => alert('Se mira pero no se toca')}>

								</div>
							}
							<div
								onClick={this.toggleLock}
								style={{
									opacity: '0.9',
									borderRadius: '1.5em',
									display: 'flex',
									alignItems: 'center',
									zIndex: 20000,
									justifyContent: 'center',
									backgroundColor: 'red',
									cursor: 'pointer',
									width: '3em',
									height: '3em',
									position: 'absolute',
									top: '-15px',
									right: '20px'
								}}
							>
								<i
									className={this.state.locked ? 'fa fa-lock' : 'fa fa-unlock-alt'}
									aria-hidden="true"
									style={{ color: 'white', fontSize: '2em' }}
								></i>
							</div>

						</div>
					}
				</React.Fragment>
			);
		}

		if (this.state.councilDetailsParticipants && council) {
			return (
				<div style={{ height: '100%' }}>
					<div
						style={{
							color: 'rgb(125, 33, 128)',
							maxWidth: ' calc(100% - 2em)',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis',
							verticalAlign: 'middle',
							zIndex: '20',
							marginLeft: '2em',
							marginRight: '1em',
							position: 'relative',
							fontWeight: '300',
							display: 'flex',
							fontStyle: 'italic',
							fontFamily: 'Lato',
							fontSize: '28px',
							top: '45px',
						}}>
						<div
							style={{
								cursor: 'pointer',
								visibility: 'visible',
							}}
							onClick={() => this.setState({ councilDetailsParticipants: false })}>
							<i className="fa fa-angle-left" ></i>
							<span style={{
								fontStyle: 'normal',
								marginRight: '8px',
								marginLeft: '5px',
							}}>
								|
							</span>
						</div>
						<div>
							Participantes
						</div>
					</div>
					<div style={{ height: '100%' }}>
						{council.state >= 20 ?
							<>
								<ParticipantsManager
									stylesDiv={{
										margin: '0', marginTop: '3.5em', height: 'calc( 100% - 10em )', borderTop: '1px solid #e7e7e7', width: '100%'
									}}
									translate={translate}
									council={council}
									root={true}
								/>
							</>
							: <CouncilDetailsParticipants
								council={council}
								participations={CBX.hasParticipations(council)}
								translate={translate}
							// refetch={refetch}
							/>
						}

						{/* <br></br>
<CredentialsManager
council={council}
translate={this.props.translate}
/> */}
					</div>
				</div >
			);
		}

		// const { council } = this.props.data;

		return (
			<div style={{ width: '100%', height: '100%' }}>
				<Scrollbar>
					<div style={{ padding: '1em' }}>
						<CouncilItem council={council} hideFixedUrl={council.state > 30} enCouncilRoot={true} translate={translate} />
						<div
							style={{
								width: '100%',
								// border: `2px solid ${secondary}`,
								fontSize: '18px',
								color: secondary,
								fontWeight: '700',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								margin: '1em 0px'
								// alignItems: 'center'
							}}
						>
							<div style={{
								fontSize: '1rem', marginLeft: '0.6em', justifyContent: 'flex-end', display: 'flex'
							}}>
								<MergeCouncilsButton
									council={council}
									translate={translate}
									color={secondary}
								/>
								<DownloadConvenedPDF
									council={council}
									translate={translate}
									color={secondary}
								/>
								<DownloadAttendantsPDF
									council={council}
									translate={translate}
									color={secondary}
								/>
								<BasicButton
									text="Ver tipo de reunión"
									color={secondary}
									textStyle={{
										fontWeight: '700', color: 'white', marginTop: '0.5em', marginBottom: '1.4em', marginLeft: '1.5em'
									}}
									onClick={this.showCouncilType}
								/>
								<AlertConfirm
									requestClose={this.closeCouncilType}
									open={this.state.councilTypeModal}
									buttonCancel={'Cancelar'}
									bodyText={
										<React.Fragment>
											<h6>Opciones</h6>
											<OptionsDisplay
												council={this.props.data.council}
												translate={translate}
											/>
											<h6 style={{ marginTop: '1.4em' }}>Tipo de reunión</h6>
											<StatuteDisplay
												statute={this.props.data.council.statute}
												translate={translate}
												quorumTypes={this.state.data.quorumTypes}
											/>
										</React.Fragment>
									}
									title={'Detalle del tipo de reunión'}
								/>
								<BasicButton
									text="Configurar reunión"
									color={secondary}
									textStyle={{
										fontWeight: '700', color: 'white', marginTop: '0.5em', marginBottom: '1.4em', marginLeft: '1.5em'
									}}
									onClick={() => this.setState({ councilConfigEditor: true })}
								/>
								<AlertConfirm
									requestClose={() => this.setState({ councilConfigEditor: false })}
									open={this.state.councilConfigEditor}
									buttonCancel={'Cerrar'}
									bodyText={
										<CouncilOptionsEditor
											translate={translate}
											council={this.props.data.council}
											refetch={this.props.data.refetch}
										/>
									}
									title={'Detalle del tipo de reunión'}
								/>
							</div>
							<div style={{ display: 'flex' }}>
								<Table style={{ width: '45%' }}>
									<TableHead>
										<TableRow>
											<TableCell colSpan={2} style={{ textAlign: 'center' }}>Asistentes</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{showGroupAttendees(this.state.data.councilAttendants.list, council.id)}
										<TableRow>
											<TableCell>Total</TableCell>
											<TableCell>{this.state.data.councilAttendants.list.length}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
								<Table style={{ maxWidth: '45%', marginLeft: '10%' }}>
									<TableHead>
										<TableRow>
											<TableCell colSpan={2} style={{ textAlign: 'center' }}>Envios</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{showSendsRecount(this.state.data.rootCouncilSends)}
									</TableBody>
								</Table>
							</div>
						</div>
						<div
							style={{
								width: '100%',
								fontSize: '18px',
								color: secondary,
								fontWeight: '700',
								padding: '1em',
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<CostManager
								council={council}
							/>
						</div>
						<div
							style={{
								width: '100%',
								fontSize: '18px',
								color: secondary,
								fontWeight: '700',
								padding: '1em',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<BasicButton
								text="Administrador de credenciales"
								color={secondary}
								textStyle={{ fontWeight: '700', color: 'white' }}
								onClick={this.showCredManager}
							/>
							<BasicButton
								text="Reenviar credenciales de acceso a sala"
								color={secondary}
								textStyle={{ fontWeight: '700', color: 'white' }}
								onClick={this.showCredsModal}
								buttonStyle={{ marginLeft: '0.6em' }}
							/>
							<AlertConfirm
								requestClose={this.closeCredManager}
								open={this.state.credManager}
								buttonCancel={'Cancelar'}
								classNameDialog={'height100'}
								bodyStyle={{
									minWidth: '100vh', maxWidth: '100vh', height: '100%', overflowY: 'hidden'
								}}
								bodyText={
									<CredentialsManager
										council={council}
										translate={this.props.translate}
									/>
								}
								title={'Administrador de credenciales'}
							/>
							<SendCredentialsModal
								show={this.state.sendCredentials}
								council={council}
								requestClose={this.closeCredsModal}
								translate={translate}
							/>
						</div>
						{/* //montar en una aparte */}
						{/* <Link to={`/council/${council.company.id}/participants`} >
asdasd
</Link> */}
						<div
							style={{
								width: '100%',
								fontSize: '18px',
								color: secondary,
								fontWeight: '700',
								padding: '1em',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<BasicButton
								text="Participantes"
								color={secondary}
								textStyle={{ fontWeight: '700', color: 'white', marginRight: '1em' }}
								onClick={() => this.setState({ councilDetailsParticipants: true })}
							/>
							<CheckPhoneModal
								translate={translate}
							/>
						</div>
						<div
							style={{
								width: '100%',
								fontSize: '18px',
								color: secondary,
								fontWeight: '700',
								padding: '1em',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							{council.state > 40
								&& <BasicButton
									text="Cancelar acta"
									color={secondary}
									onClick={this.cancelCouncilAct}
									textStyle={{ fontWeight: '700', color: 'white' }}
								/>
							}
							<BasicButton
								text="Abrir agenda Manager"
								color={secondary}
								textStyle={{ fontWeight: '700', color: 'white' }}
								onClick={this.showAgendaManager}
							/>
							{council.securityType === 2
								&& <FailedSMSList
									council={council}
									translate={translate}
								/>
							}
						</div>
					</div>
				</Scrollbar>
			</div >
		);
	}
}

const FailPageSearchId = ({ id }) => (
	<div>
		<SearchCouncils reload={true} />
		<div style={{
			fontSize: '25px', color: 'black', display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center', marginTop: '4em'
		}}>
			<div style={{ color: '#dc7373', fontSize: '35px', marginRight: '1em' }}>
				<i className="fa fa-exclamation-triangle" />
			</div>
			<div>
				La reunión con id <b>{id}</b> no existe
			</div>

		</div>
	</div>
);

const showGroupAttendees = (attendees, councilId) => {
	const list = {
		remotos: 0,
		presenciales: 0,
		'Dejaron la sala': 0,
		'presente con voto telématico': 0
	};

	attendees.forEach(attendee => {
		if (attendee.state === 5) {
			list.presenciales++;
		}
		if (attendee.state === 0 && attendee.online !== 0) {
			list.remotos++;
		}

		if (attendee.state === 11) {
			list['Dejaron la sala']++;
		}

		if (attendee.state === 7) {
			list['presente con voto telématico']++;
		}
	});

	return (
		Object.keys(list).map(key => (
			<TableRow key={key}>
				<TableCell style={{ textTransform: 'capitalize' }} >
					{`${key}`}
				</TableCell>
				<TableCell>
					<div style={{ display: 'flex' }}>
						{`${list[key]}`}
						{key === 'remotos' &&
							<div style={{ marginLeft: '1em' }}>
								<Link to={`/council/${councilId}/remoteParticipants`}>Monitor</Link>
							</div>
						}
					</div>
				</TableCell>
			</TableRow>
		))
	);
};

const CouncilDetailsRoot = gql`
    query CouncilDetailsRoot($id: Int!){
        council(id: $id) {
			id
			businessName
			companyId
			country
			countryState
			currentQuorum
			quorumPrototype,
			initialQuorum
			secretary
			president
			street
			price
			promoCode
			city
			state
			dateStart
			dateRealStart
			councilStarted
			name
			remoteCelebration
			dateStart2NdCall
			dateEnd
			qualityVoteId
			wallActive
			askWordMenu
			firstOrSecondConvene
			confirmAssistance
			councilType
			askWordMenu
			fullVideoRecord
			autoClose
			closeDate
			securityType
			approveActDraft
			statute {
				id
                prototype
                existsSecondCall
                existsQualityVote
                minimumSeparationBetweenCall
				existsAdvanceNoticeDays
				shareholdersPortal
				defaultVote
                advanceNoticeDays
                quorumPrototype
                firstCallQuorumType
                secondCallQuorumType
                existsDelegatedVote
				existMaxNumDelegatedVotes
				hideVotingsRecountFinished
                maxNumDelegatedVotes
                limitedAccessRoomMinutes
                existsLimitedAccessRoom
                existsComments
                notifyPoints
                existsQualityVote
                existsPresentWithRemoteVote
                canAddPoints
                canReorderPoints
                canUnblock
                existsAct
                includedInActBook
				decimalDigits
                includeParticipantsList
                conveneHeader
                intro
                constitution
                conclusion
			}
            company{
				id
                businessName
            }
            participants {
                id
            }
			act {
				id
				intro
				constitution
				conclusion
			}
			statute {
				id
				prototype
				existsQualityVote
			}
		}

		councilRecount(councilId: $id) {
			socialCapitalTotal
			weighedPartTotal
			partTotal
			numTotal
			socialCapitalRightVoting
			numRightVoting,
			partRightVoting,
			treasuryShares
		}

		agendas(councilId: $id) {
			id
			orderIndex
			agendaSubject
			subjectType
			abstentionVotings
			abstentionManual
			noVoteVotings
			noVoteManual
			positiveVotings
			positiveManual
			negativeVotings
			negativeManual
			description
			majorityType
			majority
			majorityDivider
			votings {
				id
				participantId
				comment
				vote
			}
			numPresentCensus
			presentCensus
			numCurrentRemoteCensus
			currentRemoteCensus
			comment
		}

		quorumTypes {
			label
			value
		}

		rootCouncilSends(councilId: $id){
			id
			sendType
			reqCode
			sendDate
			participantId
			liveParticipantId
		}

        councilAttendants(councilId: $id) {
			list {
				id
				name
				surname
				online
				state
				type
			}
		}
    }
`;


export default compose(
	graphql(CouncilDetailsRoot, {
		options: props => ({
			variables: {
				id: +props.match.params.id
			}
		}),
	}),
	graphql(cancelAct, {
		name: 'cancelAct'
	})
)(withRouter(withTranslations()(CouncilDetails)));
