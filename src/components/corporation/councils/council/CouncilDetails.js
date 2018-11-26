import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { LoadingSection, BasicButton, CollapsibleSection, AlertConfirm } from '../../../../displayComponents';
import CouncilItem from '../CouncilItem';
import { getSecondary } from '../../../../styles/colors';
import DownloadAttendantsPDF from '../../../council/writing/actEditor/DownloadAttendantsPDF';
import withTranslations from '../../../../HOCs/withTranslations';
import { exceedsOnlineTimeout, isAskingForWord } from '../../../../utils/CBX';
import SendCredentialsModal from "../../../council/live/councilMenu/SendCredentialsModal";
import AgendaManager from "../../../council/live/AgendaManager";
import StatuteDisplay from '../../../council/display/StatuteDisplay';
import OptionsDisplay from '../../../council/display/OptionsDisplay';
import CredentialsManager from './CredentialsManager';

class CouncilDetails extends React.Component {

	state = {
		sendCredentials: false,
		showAgenda: false,
		councilTypeModal: false,
		locked: true
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

		if(this.state.showAgenda){
			return (
				<React.Fragment>
					<BasicButton
						text="Cerrar agenda manager"
						color={secondary}
						textStyle={{fontWeight: '700', color: 'white'}}
						onClick={this.closeAgendaManager}
					/>
					<div style={{backgroundColor: 'white', height: '100%', border: '2px solid black', position: 'relative'}}>
						<AgendaManager
							recount={this.props.data.councilRecount}
							council={this.props.data.council}
							company={this.props.data.council.company}
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
				</React.Fragment>
			)
		}

		let online = 0;
		let offline = 0;
		let broadcasting = 0;
		let askingForWord = 0;
		this.props.data.videoParticipants.list.forEach(
			participant => {
				if(isAskingForWord(participant)){
					askingForWord++;
				}
				if (exceedsOnlineTimeout(participant.lastDateConnection)) {
					offline++;
				} else {
					if (participant.requestWord === 2) {
						broadcasting++;
					}
					online++;
				}
			}
		);

        return (
            <div>
                <CouncilItem council={this.props.data.council} />
                <div
                    style={{
                        width: '100%',
                        border: `2px solid ${secondary}`,
                        fontSize: '18px',
                        color: secondary,
                        fontWeight: '700',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    Asistentes {`(Total: ${this.props.data.councilAttendants.list.length})`}
                    <div style={{fontSize: '1rem', marginLeft: '0.6em'}}>
                        <DownloadAttendantsPDF
                            council={this.props.data.council}
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
									council={this.props.data.council}
									translate={translate}
								/>
								<h6 style={{marginTop: '1.4em'}}>Tipo de reunión</h6>
								<StatuteDisplay
									statute={this.props.data.council.statute}
									translate={translate}
									quorumTypes={this.props.data.quorumTypes}
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
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
					Remotos {`(Online: ${online} || Offline: ${offline} || Palabra concedida: ${broadcasting} || Pidiendo Palabra: ${askingForWord})`}
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
						text="Reenviar credenciales de acceso a sala"
						color={secondary}
						textStyle={{fontWeight: '700', color: 'white'}}
						onClick={this.showCredsModal}
					/>
					<AlertConfirm
						requestClose={this.closeCredsModal}
						open={this.state.sendCredentials}
						buttonCancel={'Cancelar'}
						bodyText={
							<CredentialsManager
								council={this.props.data.council}
								translate={this.props.translate}
							/>
						}
						title={"Detalle del tipo de reunión"}
					/>
					{/* <SendCredentialsModal
						show={this.state.sendCredentials}
						council={this.props.data.council}
						requestClose={this.closeCredsModal}
						translate={translate}
					/> */}
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

        councilAttendants(councilId: $id) {
			list {
				id
				name
				surname
			}
		}
		videoParticipants(councilId: $id){
			list {
				id
				name
				lastDateConnection
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