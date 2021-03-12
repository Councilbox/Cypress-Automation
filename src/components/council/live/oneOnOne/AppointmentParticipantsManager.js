import gql from 'graphql-tag';
import React from 'react';
import { withApollo } from 'react-apollo';
import { client } from '../../../../containers/App';
import { BasicButton, Grid, GridItem, LoadingSection } from '../../../../displayComponents';
import { ReactComponent as Online } from '../../../../assets/img/participant-connected.svg';
import { ReactComponent as Disconnected } from '../../../../assets/img/participant-not-connected.svg';
import { getPrimary } from '../../../../styles/colors';
import ResendCredentialsModal from '../participants/modals/ResendCredentialsModal';
import { hasAccessKey } from '../../../../utils/CBX';

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


const AppointmentParticipantsManager = ({ council, translate }) => {
	const [{
		status,
		data,
		error
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

		console.log(response);

		dispatch({ type: 'LOADED', payload: response.data.liveParticipants });
	}, [council.id]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	if (status === 'LOADING') {
		return <LoadingSection />;
	}

	return (
		<div
			style={{
				width: '99%',
				height: '100%',
				padding: '2em',
				border: '2px solid red'
			}}
		>
			{[...data.list, ...data.list, ...data.list].map((participant, index) => {
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
								<Online fill={primary} />
							}
							{participant.online !== 1 &&
								<Disconnected fill={'red'} />
							}
						</GridItem>
						<GridItem xs={6} lg={4} md={4} style={{ paddingLeft: '1em' }}>
							<BasicButton
								text="Enviar pin"
								color={primary}
								textStyle={{
									color: 'white',
									fontWeight: '700'
								}}
								buttonStyle={{
									marginRight: '1em'
								}}
							/>
							<ResendCredentialsModal
								participant={participant}
								council={council}
								translate={translate}
								security={hasAccessKey(council)}
								refetch={getData}
							/>
						</GridItem>
					</Grid>
				);
			})}
		</div>
	);
};

export default withApollo(AppointmentParticipantsManager);
