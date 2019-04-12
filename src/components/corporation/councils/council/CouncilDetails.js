import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { LoadingSection, BasicButton, CollapsibleSection, AlertConfirm, TextInput } from '../../../../displayComponents';
import CouncilItem from '../CouncilItem';
import { getSecondary } from '../../../../styles/colors';
import DownloadAttendantsPDF from '../../../council/writing/actEditor/DownloadAttendantsPDF';
import withTranslations from '../../../../HOCs/withTranslations';
import { exceedsOnlineTimeout, isAskingForWord } from '../../../../utils/CBX';
import SendCredentialsModal from "../../../council/live/councilMenu/SendCredentialsModal";
import AgendaManager from "../../../council/live/AgendaManager";
import StatuteDisplay from '../../../council/display/StatuteDisplay';
import OptionsDisplay from '../../../council/display/OptionsDisplay';
import CostManager from './CostManager';
import CredentialsManager from './CredentialsManager';
import { COUNCIL_STATES } from '../../../../constants';
import LiveParticipantStats from './LiveParticipantStats';


class CouncilDetails extends React.Component {

	state = {
		sendCredentials: false,
		showAgenda: false,
		councilTypeModal: false,
		credManager: false,
		locked: true,
		data: null
	}

	static getDerivedStateFromProps(nextProps, prevState){
		if(!prevState.data){
			if(!nextProps.data.loading){
				return {
					data: nextProps.data
				}
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
		})
	}

	toggleLock = event => {
		event.stopPropagation();
		const locked = this.state.locked;
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

    render(){
        const { translate } = this.props;
		const secondary = getSecondary();

        if(this.props.data.loading){
            return <LoadingSection />
		}

		const { council } = this.state.data;

		if(this.state.showAgenda && council){
			return (
				<React.Fragment>
					<BasicButton
						text="Cerrar agenda manager"
						color={secondary}
						textStyle={{fontWeight: '700', color: 'white'}}
						onClick={this.closeAgendaManager}
					/>
					{council.state > COUNCIL_STATES.ROOM_OPENED?
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
							<i className="fa fa-hourglass-end" aria-hidden="true" style={{color: 'grey', fontSize: '6em'}}></i>
							REUNIÓN FINALIZADA
						</div>
					:
						<div style={{backgroundColor: 'white', height: '100%', border: '2px solid black', position: 'relative'}}>
							<AgendaManager
								recount={this.state.data.councilRecount}
								council={council}
								company={council.company}
								translate={translate}
								fullScreen={this.state.fullScreen}
								refetch={this.props.data.refetch}
								openMenu={() => {}}
							/>
							{this.state.locked &&
								<div style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: 10000}} onClick={() => alert('Se mira pero no se toca')}>

								</div>
							}
							<div
								onClick={this.toggleLock}
								style={{
									backgroundColor: 'gainsboro',
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
									className={this.state.locked? "fa fa-lock" : 'fa fa-unlock-alt'}
									aria-hidden="true"
									style={{color: 'white', fontSize: '2em'}}
								></i>
							</div>

						</div>
					}
				</React.Fragment>
			)
		}

		//const { council } = this.props.data;

        return (
            <div style={{width: '100%', height: '100%', overflow: 'auto', padding: "1em"}}>
                <CouncilItem council={council} hideFixedUrl={council.state > 30} enRoot={true} />
                <div
                    style={{
                        width: '100%',
                        border: `2px solid ${secondary}`,
                        fontSize: '18px',
                        color: secondary,
                        fontWeight: '700',
                        display: 'flex',
						flexDirection: 'column',
                        justifyContent: 'center',
                        // alignItems: 'center'
                    }}
                >
                    Asistentes
					{showGroupAttendees(this.state.data.councilAttendants.list)}
					{`(Total: ${this.state.data.councilAttendants.list.length})`}
                    <div style={{fontSize: '1rem', marginLeft: '0.6em'}}>
                        <DownloadAttendantsPDF
                            council={council}
                            translate={translate}
                            color={secondary}
                        />
                    </div>

                </div>
				<div
                    style={{
                        width: '100%',
                        border: `2px solid ${secondary}`,
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
						text="Ver tipo de reunión"
						color={secondary}
						textStyle={{fontWeight: '700', color: 'white'}}
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
									council={council}
									translate={translate}
								/>
								<h6 style={{marginTop: '1.4em'}}>Tipo de reunión</h6>
								<StatuteDisplay
									statute={council.statute}
									translate={translate}
									quorumTypes={this.state.data.quorumTypes}
								/>
							</React.Fragment>
						}
						title={"Detalle del tipo de reunión"}
					/>
                </div>
				<div
                    style={{
                        width: '100%',
                        border: `2px solid ${secondary}`,
                        fontSize: '18px',
                        color: secondary,
                        fontWeight: '700',
						padding: '1em',
                        display: 'flex',
						flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
					Envios: <br/>
					{showSendsRecount(this.state.data.rootCouncilSends)}
                </div>
				<div
                    style={{
                        width: '100%',
                        border: `2px solid ${secondary}`,
                        fontSize: '18px',
                        color: secondary,
                        fontWeight: '700',
						padding: '1em',
                        display: 'flex',
						flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
					<CostManager
						council={council}
					/>
                </div>
				<div
                    style={{
                        width: '100%',
                        border: `2px solid ${secondary}`,
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
						textStyle={{fontWeight: '700', color: 'white'}}
						onClick={this.showCredManager}
					/>
					<BasicButton
						text="Reenviar credenciales de acceso a sala"
						color={secondary}
						textStyle={{fontWeight: '700', color: 'white'}}
						onClick={this.showCredsModal}
						buttonStyle={{marginLeft: '0.6em'}}
					/>
					<AlertConfirm
						requestClose={this.closeCredManager}
						open={this.state.credManager}
						buttonCancel={'Cancelar'}
						bodyText={
							<CredentialsManager
								council={council}
								translate={this.props.translate}
							/>
						}
						title={"Administrador de credenciales"}
					/>
					<SendCredentialsModal
						show={this.state.sendCredentials}
						council={council}
						requestClose={this.closeCredsModal}
						translate={translate}
					/>
                </div>
				<div
                    style={{
                        width: '100%',
                        border: `2px solid ${secondary}`,
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
						text="Abrir agenda Manager"
						color={secondary}
						textStyle={{fontWeight: '700', color: 'white'}}
						onClick={this.showAgendaManager}
					/>
                </div>
            </div>
        )
    }
}

const showGroupAttendees = attendees => {
	const list = {
		remotos: 0,
		presenciales: 0,
		'presente con voto telématico': 0
	};

	attendees.forEach(attendee => {
		if(attendee.state === 5){
			list.presenciales++;
		}
		if(attendee.state === 0){
			list.remotos++;
		}
		if(attendee.state === 7){
			list.presenteVotoRemoto++;
		}
	})

	return (
		<div>
			{Object.keys(list).map((key, index) => (
				<li key={key}>
					{`${key}: ${list[key]}`}
				</li>
			))}
		</div>
	)
}

const showSendsRecount = sends => {
	const list = {
		'-1': 'Preconvocatoria',
		'0': 'Convocatoria',
		'1': 'Recordatorio',
		'2': 'Aviso de reprogramación',
		'3': 'Reunión cancelada',
		'4': 'Acceso a sala',
		'5': 'Clave de acceso',
		'6': 'Acta',
		'13': 'Propuesta de acta',
		'16': 'Notificación de apertura de votación'
	}

	const recount = {
		Preconvocatoria: 0,
		Convocatoria: 0,
		Recordatorio: 0,
		'Aviso de reprogramación': 0,
		'Reunión cancelada': 0,
		'Acceso a sala': 0,
		'Clave de acceso': 0,
		'Acta': 0,
		'Propuesta de acta': 0,
		'Notificación de apertura de votación': 0,
		'Otros': 0
	}

	sends.forEach(send => {
		recount[list[send.sendType]]++;
	});

	return (
		<div>
			{Object.keys(recount).filter(key => recount[key] > 0).map(key => (
				<li key={key}>{`${key}: ${recount[key]}`}</li>
			))}
			{`Total: ${sends.length}`}
		</div>
	)


}

const CouncilDetailsRoot = gql`
    query CouncilDetailsRoot($id: Int!){
        council(id: $id) {
			id
			businessName
			country
			countryState
			currentQuorum
			quorumPrototype
			secretary
			president
			street
			price
			priceObservations
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
			firstOrSecondConvene
			confirmAssistance
			councilType
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
                advanceNoticeDays
                quorumPrototype
                firstCallQuorumType
                secondCallQuorumType
                existsDelegatedVote
                existMaxNumDelegatedVotes
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
			partTotal
			numTotal
			socialCapitalRightVoting
			numRightVoting
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
				state
				type
			}
		}
    }
`;


export default graphql(CouncilDetailsRoot, {
    options: props => ({
        variables: {
			id: props.match.params.id
        }
    })
})(withRouter(withTranslations()(CouncilDetails)));