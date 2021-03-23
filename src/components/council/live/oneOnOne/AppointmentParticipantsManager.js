import gql from 'graphql-tag';
import React from 'react';
import { withApollo } from 'react-apollo';
import { client } from '../../../../containers/App';
import { Grid, GridItem, LoadingSection } from '../../../../displayComponents';
import { ReactComponent as Online } from '../../../../assets/img/participant-connected.svg';
import { ReactComponent as Disconnected } from '../../../../assets/img/participant-not-connected.svg';
import { getPrimary } from '../../../../styles/colors';
import ResendCredentialsModal from '../participants/modals/ResendCredentialsModal';
import { hasAccessKey } from '../../../../utils/CBX';
import ParticipantClaveJusticia from './ParticipantClaveJusticia';
import { usePolling } from '../../../../hooks';

const reducer = (state, action) => {
	const actions = {
		LOADING: () => ({
			...state,
			status: 'LOADING'
		}),
		LOADED: () => ({
			...state,
			status: 'IDDLE',
			data: action.payload
		}),
		ERROR: () => ({
			...state,
			status: 'ERROR',
			error: action.payload
		})
	};

	return actions[action.type] ? actions[action.type]() : state;
};


const AppointmentParticipantsManager = React.memo(({ council, translate }) => {
	const [{
		status,
		data
	}, dispatch] = React.useReducer(reducer, {
		data: null,
		status: 'LOADING'
	});
	const primary = getPrimary();

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query LiveParticipants($councilId: Int!) {
					liveParticipants(councilId: $councilId) {
						list {
							name
							id
							surname
							claveJusticiaPending
							email
							online
							state
						}
					}
				}
			`,
			variables: {
				councilId: council.id
			}
		});
		dispatch({ type: 'LOADED', payload: response.data.liveParticipants });
	}, [council.id]);

	usePolling(getData, 10000);

	if (status === 'LOADING') {
		return <LoadingSection />;
	}

	return (
		<div
			style={{
				width: '99%',
				height: '100%',
				paddingTop: '2em'
			}}
		>
			{data.list.map((participant, index) => {
				const even = index % 2;
				return (
					<Grid
						key={`live_participant_${participant.id}`}
						style={{
							dislay: 'flex',
							padding: '3px',
							backgroundColor: even ? 'rgba(208, 228, 240, 0.39)' : 'inherit'
						}}
					>
						<GridItem
							xs={4}
							lg={2}
							md={3}
							className="truncate"
							style={{
								objectFit: 'contain',
								fontWeight: 'bold',
								fontStretch: 'normal',
								paddingLeft: '2em',
								fontStyle: 'normal',
								lineHeight: 'normal',
								display: 'flex',
								alignItems: 'center',
								letterSpacing: 'normal',
								color: 'primary'
							}}
						>
							{participant.name} {participant.surname || ''}
						</GridItem>
						<GridItem xs={1} lg={1} md={1} style={{ display: 'flex', justifyContent: 'center' }}>
							{participant.online === 1 &&
								<div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
									<div>
										<Online fill={primary} />
									</div>
									<div style={{ fontSize: '10px', color: primary }}>
										{translate.connected}
									</div>
								</div>
							}
							{participant.online !== 1 &&
								<div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
									<div>
										<Disconnected fill={'red'} />
									</div>
									<div style={{ fontSize: '10px', color: 'red' }}>
										{translate.not_connected_singular}
									</div>
								</div>
							}
						</GridItem>
						<GridItem xs={7} lg={7} md={7} style={{ paddingLeft: '1em', display: 'flex' }}>
							<div>
								<ParticipantClaveJusticia
									participant={participant}
									translate={translate}
								/>
							</div>
							<div style={{ marginLeft: '0.5em' }}>
								<ResendCredentialsModal
									participant={participant}
									council={council}
									translate={translate}
									security={hasAccessKey(council)}
									refetch={getData}
								/>
							</div>
						</GridItem>
					</Grid>
				);
			})}
		</div>
	);
});

export default withApollo(AppointmentParticipantsManager);
