import React from 'react';
import { Card } from 'material-ui';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import AgendaSelector from './AgendaSelector';
import AgendaDetailsSection from './AgendaDetailsSection';
import { LoadingSection, Scrollbar, AlertConfirm } from '../../../displayComponents';
import { AGENDA_STATES } from '../../../constants';
import { useOldState, usePolling } from '../../../hooks';
import { isMobile } from '../../../utils/screen';

const getInitialSelectedPoint = agendas => {
	const index = agendas.findIndex(agenda => agenda.pointState === AGENDA_STATES.DISCUSSION);
	return index !== -1 ? index : 0;
};

const reducer = (state, action) => {
	const actions = {
		LOAD_DATA: () => ({
			...state,
			data: action.value,
			loading: false,
			selectedPoint: (state.selectedPoint >= action.value.agendas.length && action.value.agendas.length !== 0) ?
				action.value.agendas.length - 1
			:				state.selectedPoint !== null ? state.selectedPoint : getInitialSelectedPoint(action.value.agendas)
		}),
		NEXT_POINT: () => ({
			...state,
			selectedPoint: state.selectedPoint + 1
		}),
		SET_SELECTED_POINT: () => ({
			...state,
			selectedPoint: action.value
		})
	};

	return actions[action.type] ? actions[action.type]() : state;
};


const AgendaManager = ({ translate, council, company, stylesDiv, client, ...props }, ref) => {
	const [{ data, loading, selectedPoint }, dispatch] = React.useReducer(reducer, {
		data: {},
		loading: true,
		selectedPoint: null
	});

	const [state, setState] = useOldState({
		// selectedPoint: null,
		loaded: false,
		editedVotings: false,
		votingsAlert: false
	});
	const agendaDetails = React.useRef();

	const getData = React.useCallback(async () => {
		if (!council) {
			return;
		}

		const response = await client.query({
			query: agendaManager,
			variables: {
				companyId: council.companyId,
				councilId: council.id
			}
		});

		dispatch({ type: 'LOAD_DATA', value: response.data });
	}, [council]);

	usePolling(getData, 5000);

	React.useEffect(() => {
		if (!loading) {
			setState({
				loaded: true
			});
		}
	}, [loading]);


	React.useEffect(() => {
		// if(state.loaded && state.selectedPoint === null){
		// 	setState({
		// 		selectedPoint: getInitialSelectedPoint()
		// 	})
		// }
	}, [state.loaded]);


	const changeEditedVotings = value => {
		setState({
			editedVotings: value
		});
	};

	const showVotingsAlert = cb => {
		setState({
			votingsAlert: true,
			acceptAction: () => {
				cb();
				setState({
					editedVotings: false,
					votingsAlert: false
				});
			}
		});
	};

	const closeVotingsAlert = () => {
		setState({
			votingsAlert: false
		});
	};

	const changeSelectedPoint = index => {
		const cb = () => dispatch({ type: 'SET_SELECTED_POINT', value: index });

		if (state.editedVotings) {
			showVotingsAlert(cb);
		} else {
			cb();
		}
	};

	const nextPoint = () => {
		if (selectedPoint < data.agendas.length - 1) {
			dispatch({ type: 'NEXT_POINT' });
			// setState({
			// 	selectedPoint: state.selectedPoint + 1
			// });
		}
	};

	React.useImperativeHandle(ref, () => ({
		showVotingsAlert,
		state
	}));

	if (!data.agendas || selectedPoint === null) {
		return <LoadingSection />;
	}

	const { agendas } = data;

	if (props.fullScreen) {
		return (
			<div
				style={{
					width: 'calc(100% - 2px)',
					height: '100%',
					maxHeight: 'calc(100% - 3em)',
					borderLeft: '1px solid gainsboro',
					overflow: 'hidden',
					backgroundColor: 'white',
				}}
				onClick={props.openMenu}
			>
				<Scrollbar>
					<AgendaSelector
						agendas={agendas}
						company={company}
						council={council}
						fullScreen={true}
						votingTypes={data.votingTypes}
						companyStatutes={data.companyStatutes}
						selected={selectedPoint}
						onClick={changeSelectedPoint}
						translate={translate}
						councilID={council.id}
						refetch={getData}
					/>
				</Scrollbar>
			</div>
		);
	}

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'row',
			}}
		>
			<Card
				style={{
					width: isMobile ? '3em' : '5em',
					height: '100%',
					borderLeft: '1px solid gainsboro',
					overflow: 'auto',
					backgroundColor: 'white'
				}}
			>
				<Scrollbar autoHide={true}>
					<AgendaSelector
						agendas={agendas}
						company={company}
						council={council}
						votingTypes={data.votingTypes}
						companyStatutes={data.companyStatutes}
						majorityTypes={data.majorityTypes}
						selected={selectedPoint}
						onClick={changeSelectedPoint}
						translate={translate}
						councilID={council.id}
						refetch={getData}
					/>
				</Scrollbar>
			</Card>
			<div
				style={{
					width: `calc(100% - ${isMobile ? '3em' : '5em'})`,
					height: '100%',
					padding: '0',
					display: 'flex',
					flexDirection: 'row',
					outline: 0
				}}
				tabIndex="0"
			>
				{(agendas.length > 0 && agendas[selectedPoint]) ?
					<AgendaDetailsSection
						ref={agendaDetails}
						recount={props.recount}
						council={council}
						key={selectedPoint}
						agendas={agendas}
						editedVotings={state.editedVotings}
						changeEditedVotings={changeEditedVotings}
						showVotingsAlert={showVotingsAlert}
						nextPoint={nextPoint}
						data={data}
						company={company}
						root={props.root}
						selectedPoint={selectedPoint}
						majorityTypes={data.majorityTypes}
						votingTypes={data.votingTypes}
						companyStatutes={data.companyStatutes}
						participants={props.participants}
						councilID={props.councilID}
						translate={translate}
						refetchCouncil={props.refetch}
						refetch={getData}
					/>
				:					<div style={{ margin: '2em' }}>
						{translate.empty_agendas}
					</div>
					}
			</div>
			<AlertConfirm
				requestClose={closeVotingsAlert}
				open={state.votingsAlert}
				acceptAction={state.acceptAction}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				bodyText={<div>{translate.unsaved_manual_votes}</div>}
				title={translate.warning}
			/>
		</div>
	);
};

export const agendaManager = gql`
	query AgendaManagerFields($companyId: Int!, $councilId: Int!) {
		agendas(councilId: $councilId) {
			abstentionManual
			abstentionVotings
			qualityVoteSense
			agendaSubject
			items {
				id
				value
			}
			options {
				maxSelections
				minSelections
				id
				writeIn
			}
			attachments {
				id
				agendaId
				filename
				filesize
				filetype
				councilId
				state
			}
			votingsRecount
			comment
			commentRightColumn
			councilId
			currentRemoteCensus
			dateEndVotation
			dateStart
			dateStartVotation
			ballots {
				id
				weight
				admin
				value
				participantId
				itemId
			}
			description
			id
			majority
			majorityDivider
			majorityType
			negativeManual
			negativeVotings
			noParticipateCensus
			noVoteManual
			noVoteVotings
			numAbstentionManual
			numAbstentionVotings
			numCurrentRemoteCensus
			numNegativeManual
			numNegativeVotings
			numNoParticipateCensus
			numNoVoteManual
			numNoVoteVotings
			numPositiveManual
			numPositiveVotings
			numPresentCensus
			numRemoteCensus
			numTotalManual
			numTotalVotings
			orderIndex
			pointState
			positiveManual
			positiveVotings
			presentCensus
			remoteCensus
			socialCapitalCurrentRemote
			socialCapitalNoParticipate
			socialCapitalPresent
			socialCapitalRemote
			sortable
			subjectType
			totalManual
			totalVotings
			votingState
		}
		languages {
			desc
			columnName
		}

		companyStatutes(companyId: $companyId) {
			title
			id
		}

		majorityTypes {
			value
			label
		}

		quorumTypes {
			label
			value
		}

		votingTypes {
			label
			value
		}

		draftTypes {
			id
			label
		}
	}
`;

export default withApollo(React.forwardRef(AgendaManager));
