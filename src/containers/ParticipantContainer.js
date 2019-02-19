import React from "react";
import { connect } from "react-redux";
import { graphql, withApollo, compose } from "react-apollo";
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
import { bindActionCreators } from 'redux';
import * as mainActions from '../actions/mainActions';


class ParticipantContainer extends React.PureComponent {

	componentDidMount(){
		store.dispatch(setDetectRTC());
	}

	componentDidUpdate(){
		if(this.props.data.participant){
			if(this.props.data.participant.language !== this.props.translate.selectedLanguage){
				this.props.actions.setLanguage(this.props.data.participant.language);
			}
		}
	}

	render() {
		const { data, detectRTC, main, match, council, state } = this.props;

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

		if (!data.participant || !this.props.council.councilVideo || !this.props.state.councilState || Object.keys(detectRTC).length === 0) {
			return <LoadingMainApp />;
		}

		return (
			<div
				id={"mainContainer"}
				style={{
					display: "flex",
					flex: 1,
					height: '100%',
					flexDirection: "column",
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
                                            council={{
												...this.props.council.councilVideo,
												state: this.props.state.councilState.state
											}}
                                            company={this.props.council.councilVideo.company}
                                        />
                                    :
                                        <Council
                                            participant={data.participant}
                                            council={{
												...this.props.council.councilVideo,
												state: this.props.state.councilState.state
											}}
                                            company={this.props.council.councilVideo.company}
											refetchParticipant={data.refetch}
                                        />
                                }
                            </React.Fragment>
                        :
                            <ParticipantLogin
                                participant={data.participant}
                                council={{
									...this.props.council.councilVideo,
									state: this.props.state.councilState.state
								}}
                                company={this.props.council.councilVideo.company}
                            />
                    }
                </React.Fragment>
			</div>
		);
	}
}

const councilQuery = gql`
	query info($councilId: Int!) {
		councilVideo(id: $councilId) {
			active
			autoClose
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

const stateQuery = gql`
	query info($councilId: Int!) {
		councilState(id: $councilId) {
			state
			id
		}
	}
`;

const participantQuery = gql`
	query info {
		participant {
			name
			surname
			id
			type
			phone
			email
			state
			requestWord
			language
			online
			roomType
		}
	}
`;

const mapStateToProps = state => ({
	main: state.main,
	translate: state.translate
});

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(mainActions, dispatch)
    };
}

export default compose(
	graphql(councilQuery, {
		name: 'council',
		options: props => ({
			variables: {
				councilId: props.match.params.councilId
			},
			fetchPolicy: "network-only",
			notifyOnNetworkStatusChange: true,
			pollInterval: 60000
		})
	}),
	graphql(stateQuery, {
		name: 'state',
		options: props => ({
			variables: {
				councilId: props.match.params.councilId
			},
			fetchPolicy: "network-only",
			notifyOnNetworkStatusChange: true,
			pollInterval: 6000
		})
	}),
	graphql(participantQuery, {
		options: props => ({
			fetchPolicy: "network-only",
			notifyOnNetworkStatusChange: true,
			pollInterval: 15000
		})
	})
)(withApollo(withDetectRTC()(withTranslations()(connect(mapStateToProps, mapDispatchToProps)(ParticipantContainer)))));
