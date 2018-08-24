import React from "react";
import { connect } from "react-redux";
import { graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { store } from './App';
import { setDetectRTC } from '../actions/mainActions';
import withTranslations from "../HOCs/withTranslations";
import withDetectRTC from '../HOCs/withDetectRTC';
import { PARTICIPANT_ERRORS } from "../constants";
import { LoadingMainApp } from "../displayComponents";
import InvalidUrl from "../components/participant/InvalidUrl";
import ParticipantLogin from "../components/participant/login/Login";
import ErrorState from "../components/participant/login/ErrorState";
import Council from '../components/participant/council/Council';
import Meet from '../components/participant/meet/Meet';

class ParticipantContainer extends React.PureComponent {

	componentDidMount(){
		store.dispatch(setDetectRTC());
	}

	render() {
		const { data, detectRTC, main, match } = this.props;

		if (data.error && data.error.graphQLErrors["0"]) {
			const code = data.error.graphQLErrors["0"].code;
			if (
				code === PARTICIPANT_ERRORS.PARTICIPANT_BLOCKED ||
				code === PARTICIPANT_ERRORS.PARTICIPANT_IS_NOT_REMOTE ||
				code === PARTICIPANT_ERRORS.DEADLINE_FOR_LOGIN_EXCEEDED
			) {
				return (
					<ErrorState
						code={code}
						data={data.error.graphQLErrors["0"].data}
					/>
				);
			} else {
				return <InvalidUrl />;
			}
		}

		if (data.loading || Object.keys(detectRTC).length === 0) {
			return <LoadingMainApp />;
		}

		return (
			<div
				style={{
					display: "flex",
					flex: 1,
					flexDirection: "column",
					height: "100vh",
					overflow: "auto",
					padding: 0,
					margin: 0
				}}
			>
                <React.Fragment>
                    {main.isParticipantLogged ? 
                            <React.Fragment>
                                {match.path.includes('meet') ?
                                        <Meet 
                                            participant={data.participant}
                                            council={data.councilVideo}
                                            company={data.councilVideo.company}
                                        />
                                    :
                                        <Council 
                                            participant={data.participant}
                                            council={data.councilVideo}
                                            company={data.councilVideo.company}
                                        />
                                }
                            </React.Fragment>
                        :
                            <ParticipantLogin
                                participant={data.participant}
                                council={data.councilVideo}
                                company={data.councilVideo.company}
                            />
                    }
                </React.Fragment>
			</div>
		);
	}
}

const participantQuery = gql`
	query info($councilId: Int!) {
		participant {
			name
			surname
			id
			phone
			email
			language
			online
			roomType
		}
		councilVideo(id: $councilId) {
			active
			agendas {
				agendaSubject
				attachments {
					id
					agendaId
					filename
					filesize
					filetype
					councilId
					state
				}
				councilId
				dateEndVotation
				dateStart
				dateStartVotation
				description
				id
				orderIndex
				pointState
				subjectType
				votingState
			}
			attachments {
				councilId
				filename
				filesize
				filetype
				id
			}
			businessName
			city
			companyId
			company {
				logo
			}
			conveneText
			councilStarted
			councilType
			country
			countryState
			dateEnd
			dateOpenRoom
			dateRealStart
			dateStart
			dateStart2NdCall
			duration
			firstOrSecondConvene
			fullVideoRecord
			hasLimitDate
			headerLogo
			id
			limitDateResponse
			name
			noCelebrateComment
			president
			proposedActSent
			prototype
			quorumPrototype
			satisfyQuorum
			secretary
			securityType
			sendDate
			sendPointsMode
			shortname
			state
			statute {
				id
				prototype
				councilId
				statuteId
				title
				existPublicUrl
				addParticipantsListToAct
				existsAdvanceNoticeDays
				advanceNoticeDays
				existsSecondCall
				minimumSeparationBetweenCall
				canEditConvene
				firstCallQuorumType
				firstCallQuorum
				firstCallQuorumDivider
				secondCallQuorumType
				secondCallQuorum
				secondCallQuorumDivider
				existsDelegatedVote
				existsPresentWithRemoteVote
				existMaxNumDelegatedVotes
				maxNumDelegatedVotes
				existsLimitedAccessRoom
				limitedAccessRoomMinutes
				existsQualityVote
				qualityVoteOption
				canUnblock
				canAddPoints
				canReorderPoints
				existsAct
				existsWhoSignTheAct
				includedInActBook
				includeParticipantsList
				existsComments
				conveneHeader
				intro
				constitution
				conclusion
				actTemplate
				censusId
			}
			street
			tin
			videoMode
			videoRecodingInitialized
			votationType
			weightedVoting
			zipcode
		}
	}
`;

const mapStateToProps = state => ({
	main: state.main
});

export default graphql(participantQuery, {
	options: props => ({
		variables: {
			councilId: props.match.params.councilId
		},
		fetchPolicy: "network-only",
        pollInterval: 5000
	})
})(withApollo(withDetectRTC()(withTranslations()(connect(mapStateToProps)(ParticipantContainer)))));
