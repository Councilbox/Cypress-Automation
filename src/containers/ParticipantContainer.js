import React from 'react';
import { connect } from 'react-redux';
import { withApollo, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { bindActionCreators } from 'redux';
import { store } from './App';
import { setDetectRTC } from '../actions/mainActions';
import withDetectRTC from '../HOCs/withDetectRTC';
import { PARTICIPANT_ERRORS } from '../constants';
import { LoadingMainApp } from '../displayComponents';
import InvalidUrl from '../components/participant/InvalidUrl';
import ParticipantLogin from '../components/participant/login/Login';
import ErrorState from '../components/participant/login/ErrorState';
import Council from '../components/participant/council/Council';
import Meet from '../components/participant/meet/Meet';
import * as mainActions from '../actions/mainActions';
import { shouldLoadSubdomain } from '../utils/subdomain';
import withTranslations from '../HOCs/withTranslations';
import { usePolling } from '../hooks';
import { ConfigContext } from './AppControl';
import { SERVER_URL } from '../config';
import { addSpecificTranslations } from '../actions/companyActions';
import { initLogRocket } from '../utils/logRocket';

const buildParticipantQuery = () => {
	return (gql`
		query info {
			participant {
				name
				surname
				id
				legalTermsAccepted
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
	`);
};

export const ConnectionInfoContext = React.createContext(null);

const ParticipantContainer = ({
	client, council, match, detectRTC, main, actions, translate, ...props
}) => {
	const [data, setData] = React.useState(null);
	const config = React.useContext(ConfigContext);
	const [companyId, setCompanyId] = React.useState();
	const [loadingConfig, setLoadingConfig] = React.useState(true);
	const [reqData, setConnectionData] = React.useState(null);

	const participant = data ? data.participant : {};

	const participantId = participant ? participant.id : null;


	React.useEffect(() => {
		if (participantId) {
			initLogRocket(participant);
		}
	}, [participantId]);

	const getReqData = React.useCallback(async () => {
		// const response = await fetch(`${SERVER_URL}/connectionInfo`);
		let json = {};// await response.json();

		const getDataFromBackend = async () => {
			const response = await fetch(`${SERVER_URL}/connectionInfo`);
			return response.json();
		};

		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(async position => {
				const geoRequest = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${
					position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=${translate.selectedLanguage}`);
				const response = await fetch(`${SERVER_URL}/connectionInfo/requestOnly`);
				json = await response.json();
				if (geoRequest.status === 200) {
					const geoLocation = await geoRequest.json();
					json.geoLocation = {
						...geoLocation,
						ip: json.requestInfo.ip,
						city: geoLocation.locality,
						state: geoLocation.principalSubdivision,
						country: geoLocation.countryName,
					};
				} else {
					json = await getDataFromBackend();
				}

				setConnectionData(json);
			}, async () => {
				json = await getDataFromBackend();
				setConnectionData(json);
			}, {
				timeout: 2000
			});
		} else {
			json = await getDataFromBackend();
			setConnectionData(json);
		}
	}, []);

	React.useEffect(() => {
		getReqData();
	}, [getReqData]);


	React.useEffect(() => {
		if (data && data.participant) {
			if (data.participant.language !== translate.selectedLanguage) {
				actions.setLanguage(data.participant.language);
			}
		}
	}, [data]);

	React.useEffect(() => {
		props.subscribeToCouncilStateUpdated({ councilId: +match.params.councilId });
	}, [match.params.councilId]);


	React.useEffect(() => {
		if (council.councilVideo) {
			setCompanyId(council.councilVideo.companyId);
		}

		if (data && data.errors && data.errors[0]) {
			setLoadingConfig(false);
		}
	}, [council]);

	const updateConfig = async id => {
		await config.updateConfig(id);
		setLoadingConfig(false);
	};

	React.useEffect(() => {
		if (companyId) {
			updateConfig(companyId);
			store.dispatch(addSpecificTranslations(council.councilVideo.company));
		}
	}, [companyId, translate.selectedCompany]);

	React.useEffect(() => {
		if (council && council.councilVideo) {
			const { subdomain } = council.councilVideo;
			const actualSubdomain = window.location.hostname.split('.')[0];

			if (subdomain) {
				if (subdomain !== actualSubdomain) {
					window.location.replace(`${window.location.origin.replace(actualSubdomain, subdomain)}/participant/redirect/${sessionStorage.getItem('participantToken')}`);
				}
			} else if (shouldLoadSubdomain()) {
				window.location.replace(`${window.location.origin.replace(actualSubdomain, 'app')}/participant/redirect/${sessionStorage.getItem('participantToken')}`);
			}
		}
	}, [council]);


	const getData = async () => {
		const response = await client.query({
			query: buildParticipantQuery(config)
		});

		if (response.errors) {
			setData(response);
		} else {
			setData(response.data);
		}
	};
	usePolling(getData, !loadingConfig ? 10000 : null);


	React.useEffect(() => {
		store.dispatch(setDetectRTC());
	}, []);

	if (!data || !council || !reqData || loadingConfig) {
		return <LoadingMainApp />;
	}

	if (data.errors && data.errors[0]) {
		const { code } = data.errors[0];
		if (
			code === PARTICIPANT_ERRORS.PARTICIPANT_BLOCKED
			|| code === PARTICIPANT_ERRORS.PARTICIPANT_IS_NOT_REMOTE
			|| code === PARTICIPANT_ERRORS.DEADLINE_FOR_LOGIN_EXCEEDED
			|| code === PARTICIPANT_ERRORS.REPRESENTED_DELEGATED
			|| code === PARTICIPANT_ERRORS.REPRESENTATIVE_WITHOUT_REPRESENTED
		) {
			if (!council.councilVideo) {
				return <LoadingMainApp />;
			}
			return (
				<ErrorState
					code={code}
					refetch={getData}
					data={{ council: council.councilVideo, participant: data.errors[0].data }}
				/>
			);
		}
		return <InvalidUrl error={data.errors[0]} />;
	}

	if (!data.participant || !council.councilVideo || Object.keys(detectRTC).length === 0) {
		return <LoadingMainApp />;
	}

	return (
		<ConnectionInfoContext.Provider value={{
			data: reqData,
			setConnectionData
		}}>

			<div
				id={'mainContainer'}
				style={{
					display: 'flex',
					flex: 1,
					height: '100%',
					flexDirection: 'column',
					overflow: 'auto',
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
									reqData={reqData}
									council={{
										...council.councilVideo
									}}
									company={council.councilVideo.company}
								/>
								: <Council
									participant={data.participant}
									reqData={reqData}
									council={{
										...council.councilVideo
									}}
									company={council.councilVideo.company}
									refetchParticipant={getData}
								/>
							}
						</React.Fragment>
						: <ParticipantLogin
							participant={data.participant}
							council={{
								...council.councilVideo
							}}
							refetch={getData}
							company={council.councilVideo.company}
						/>
					}
				</React.Fragment>
			</div>
		</ConnectionInfoContext.Provider>

	);
};


const councilQuery = gql`
	query info($councilId: Int!) {
		councilVideo(id: $councilId) {
			active
			subdomain
			autoClose
			businessName
			subdomain
			councilStarted
			wallActive
			councilType
			askWordMenu
			state
			city
			closeDate
			companyId
			company {
				logo
				id
				type
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
				letParticipantsEnterAfterLimit
				addParticipantsListToAct
				existsAdvanceNoticeDays
				advanceNoticeDays
				hideVotingsRecountFinished
				existsSecondCall
				minimumSeparationBetweenCall
				canEditConvene
				hideAbstentionButton
				hideNoVoteButton
				firstCallQuorumType
				decimalDigits
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
			timezone
			videoRecodingInitialized
			votationType
			weightedVoting
			zipcode
		}
	}
`;

const mapStateToProps = state => ({
	main: state.main,
	translate: state.translate
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(mainActions, dispatch)
});

export default graphql(councilQuery, {
	name: 'council',
	options: props => ({
		variables: {
			councilId: +props.match.params.councilId
		},
		pollInterval: 45000
	}),
	props: props => ({
		...props,
		subscribeToCouncilStateUpdated: params => props.council.subscribeToMore({
			document: gql`
				subscription councilStateUpdated($councilId: Int!){
					councilStateUpdated(councilId: $councilId){
						state
						wallActive
						councilStarted
						subdomain
					}
				}
			`,
			variables: {
				councilId: +params.councilId
			},
			updateQuery: (prev, { subscriptionData }) => {
				const newData = subscriptionData.data.councilStateUpdated;

				return ({
					...prev,
					councilVideo: {
						...prev.councilVideo,
						state: newData.state || prev.councilVideo.state,
						wallActive: newData.wallActive !== null ? newData.wallActive : prev.councilVideo.wallActive,
						subdomain: (newData.subdomain !== null) ? newData.subdomain : prev.councilVideo.subdomain,
						councilStarted: (newData.councilStarted !== null) ? newData.councilStarted : prev.councilVideo.councilStarted
					}
				});
			}
		})
	})
})(withApollo(withDetectRTC()(withTranslations()(connect(mapStateToProps, mapDispatchToProps)(ParticipantContainer)))));
