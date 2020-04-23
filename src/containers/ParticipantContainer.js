import React from "react";
import { connect } from "react-redux";
import { withApollo, graphql } from "react-apollo";
import gql from "graphql-tag";
import { store } from './App';
import { setDetectRTC } from '../actions/mainActions';
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
import { shouldLoadSubdomain } from "../utils/subdomain";
import withTranslations from "../HOCs/withTranslations";
import { usePolling } from "../hooks";
import { ConfigContext } from "./AppControl";
import { SERVER_URL } from "../config";


export const ConnectionInfoContext = React.createContext(null);

const ParticipantContainer = ({ client, council, match, detectRTC, main, actions, translate, ...props }) => {
	//const [council, setCouncil] = React.useState(null);
	const [state, setState] = React.useState(null);
	const [data, setData] = React.useState(null);
	const config = React.useContext(ConfigContext);
	const companyId = React.useRef();
	const [reqData, setConnectionData] = React.useState(null);
	

	const getReqData = React.useCallback(async () => {
        const response = await fetch(`${SERVER_URL}/connectionInfo`);
        let json = await response.json();

        if(!json.geoLocation){
            if('geolocation' in navigator){
                navigator.geolocation.getCurrentPosition(async position => {
                    const geoRequest = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${
                        position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=${translate.selectedLanguage}`);
                    if(geoRequest.status === 200){
                        const geoLocation = await geoRequest.json();
                        json.geoLocation = {
                            city: geoLocation.locality,
                            state: geoLocation.principalSubdivision,
                            country: geoLocation.countryCode
                        }
                    }
                });
                
            }
        }

        setConnectionData(json);
    }, [])

    React.useEffect(() => {
        getReqData();
    }, [getReqData]);


	React.useEffect(() => {
		if(data && data.participant){
			if(data.participant.language !== translate.selectedLanguage){
				actions.setLanguage(data.participant.language);
			}
		}
	}, [data]);

	React.useEffect(() => {
		props.subscribeToCouncilStateUpdated({ councilId: match.params.councilId });
	}, [match.params.councilId])


	React.useEffect(() => {
		if(council.councilVideo){
			companyId.current = council.councilVideo.companyId;
		}
	}, [council])

	React.useEffect(() => {
		if(companyId.current){
			config.updateConfig(companyId.current);
		}
	}, [companyId.current]);

	React.useEffect(() => {
		if(state && state.councilState){
			const { subdomain } = state.councilState;
			const actualSubdomain = window.location.hostname.split('.')[0];

			if(subdomain){
				if(subdomain !== actualSubdomain){
					window.location.replace(window.location.origin.replace(actualSubdomain, subdomain) + '/participant/redirect/' + sessionStorage.getItem('participantToken'));
				}
			} else {
				if(shouldLoadSubdomain()){
					window.location.replace(window.location.origin.replace(actualSubdomain, 'app') + '/participant/redirect/' + sessionStorage.getItem('participantToken'));
				}
			}
		}
	}, [state]);

	// const getCouncil = async () => {
	// 	const response = await client.query({
	// 		query: councilQuery,
	// 		variables: {
	// 			councilId: match.params.councilId
	// 		}
	// 	});
		
	// 	setCouncil(response.data);
	// 	companyId.current = response.data.councilVideo.companyId
	// }

	//usePolling(getCouncil, 60000);

	const getState = async () => {
		const response = await client.query({
			query: stateQuery,
			variables: {
				councilId: match.params.councilId
			}
		});
		setState(response.data);
	}

	usePolling(getState, 8000);

	const getData = async () => {
		const response = await client.query({
			query: participantQuery
		});

		if(response.errors){
			setData(response);
		} else {
			setData(response.data);
		}
	}
	usePolling(getData, 10000);


	React.useEffect(() => {
		store.dispatch(setDetectRTC());
	}, []);

	if(!data || !council || !state){
		return <LoadingMainApp />;
	}


	if (data.errors && data.errors[0]) {
		const code = data.errors[0].code;
		if (
			code === PARTICIPANT_ERRORS.PARTICIPANT_BLOCKED ||
			code === PARTICIPANT_ERRORS.PARTICIPANT_IS_NOT_REMOTE ||
			code === PARTICIPANT_ERRORS.DEADLINE_FOR_LOGIN_EXCEEDED ||
			code === PARTICIPANT_ERRORS.REPRESENTED_DELEGATED
		) {
			if (!council.councilVideo) {
				return <LoadingMainApp />;
			}
			return (
				<ErrorState
					code={code}
					data={{ council: council.councilVideo }}
				/>
			);
		} else {
			return <InvalidUrl />;
		}
	}

	if (!data.participant || !council.councilVideo || !state.councilState || Object.keys(detectRTC).length === 0) {
		return <LoadingMainApp />;
	}


	return (
		<ConnectionInfoContext.Provider value={{
			data: reqData,
			setConnectionData
		}}>

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
												...council.councilVideo,
												state: state.councilState.state,
												councilStarted: state.councilState.councilStarted,
											}}
											company={council.councilVideo.company}
										/>
									:
										<Council
											participant={data.participant}
											council={{
												...council.councilVideo,
												state: state.councilState.state,
												councilStarted: state.councilState.councilStarted,
											}}
											company={council.councilVideo.company}
											refetchParticipant={getData}
										/>
								}
							</React.Fragment>
						:
							<ParticipantLogin
								participant={data.participant}
								council={{
									...council.councilVideo,
									state: state.councilState.state,
									councilStarted: state.councilState.councilStarted,
								}}
								company={council.councilVideo.company}
							/>
					}
				</React.Fragment>
			</div>
		</ConnectionInfoContext.Provider>
		
	);
}


const councilQuery = gql`
	query info($councilId: Int!) {
		councilVideo(id: $councilId) {
			active
			subdomain
			autoClose
			businessName
			subdomain
			city
			closeDate
			companyId
			company {
				logo
			}
			conveneText
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
			councilStarted
			id
			subdomain
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
			voteDenied
			voteDeniedReason
			hasVoted
			phone
			numParticipations
			delegatedVotes {
				id
				name
				surname
				numParticipations
				voteDenied
				voteDeniedReason
				state
				type
			}
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

export default graphql(councilQuery, {
	name: 'council',
	options: props => ({
		variables: {
			councilId: props.match.params.councilId
		}
	}),
	props: props => {
		return {
		  ...props,
		  subscribeToCouncilStateUpdated: params => {
			return props.council.subscribeToMore({
				document: gql`
					subscription councilStateUpdated($councilId: Int!){
						councilStateUpdated(councilId: $councilId){
							id
							state
						}
					}`,
				variables: {
					councilId: params.councilId
				},
				updateQuery: (prev, { subscriptionData }) => {
					console.log(subscriptionData);

					/*
					if(subscriptionData.data.councilStateUpdated){
						if(subscriptionData.data.councilStateUpdated.active === 1){
							return ({
								adminAnnouncement: subscriptionData.data.councilStateUpdated
							});
						}
					}

					return ({
						adminAnnouncement: null
					});*/

				}
			});
		  }
		};
	  }
})(withApollo(withDetectRTC()(withTranslations()(connect(mapStateToProps, mapDispatchToProps)(ParticipantContainer)))));
