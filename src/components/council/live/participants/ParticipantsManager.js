import React from 'react';
import { withApollo } from 'react-apollo';
import { getSecondary, getPrimary } from '../../../../styles/colors';
import { FilterButton, SelectInput, Grid, GridItem, CollapsibleSection, LoadingSection } from '../../../../displayComponents';
import { isMobile } from 'react-device-detect';
import { MenuItem, Paper } from 'material-ui';
import ParticipantsPage from "./sections/ParticipantsPage";
import { useOldState } from '../../../../hooks';
import gql from 'graphql-tag';



const initialState = {
    layout: 'squares', // table, compact
    loadingMore: false,
    loading: true,
    refreshing: false,
    editParticipant: undefined,
    view: 'STATES' // CONVENE, CREDENTIALS, ATTENDANCE, TYPE
}

const ParticipantsManager = ({ client, translate, council }) => {
    const [state, setState] = useOldState(initialState);
    const [participants, setParticipants] = React.useState(null);
    const [filters, setFilters] = useOldState({
        typeStatus: null,
        type: null,
		filterText: "",
        filterField: "fullName",
        limit: 24,
		status: null,
		onlyNotSigned: false,
		addGuest: false
    })

    const secondary = getSecondary();
    const primary = getPrimary();

    React.useEffect(() => {
        let timeout = setTimeout(() => updateParticipants(), 300);
        const interval = setInterval(() => updateParticipants(), 7000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        }
    }, [state.view, filters.filterText, filters.limit, filters.type, filters.status, filters.onlyNotSigned, filters.filterField]);


    const buildVariables = () => {
		let variables = {
			filters: []
		};

		if (filters.type || filters.type === 0) {
			variables.typeFilter = filters.type;
		} else {
			variables.typeFilter = null;
        }

		variables.options = {
			limit: filters.limit,
			offset: 0
		}

		if (filters.filterText) {
			variables.filters = [
				...variables.filters,
				{ field: filters.filterField, text: filters.filterText }
			];
		}

		if(filters.onlyNotSigned){
			variables.filters = [
				...variables.filters,
				{ field: 'signed', text: 0}
			];
		}

		if(filters.charFilter){
			variables.filters = [
				...variables.filters,
				{ field: 'surname', text: filters.charFilter}
			]
		}

		///CORREGIR

		return variables;
	};

    const updateParticipants = async () => {
        setState({loading: true});
        const response = await client.query({
            query: getQuery(state.view),
            variables: {
                councilId: council.id,
                ...buildVariables()
            }
        });

        setParticipants({
            ...response.data,
            refetch: updateParticipants
        });
        setState({loading: false});
    }

    const toggleSettings = () => {
		const newValue = !state.open;
		setState({open: newValue});
    }

    const updateState = object => {
		setState({
			...object
		});
    };


    const changeView = object => {
        //setParticipants(null);
        setFilters({ type: null });
        setState(object);
    }

    const editParticipant = id => {
		setState({
			editParticipant: id
		});
	};

    
    const changeTableLayout = () => {
		setState({
			layout: state.layout === 'compact' ? 'full' : 'compact'
		});
	}

    const _renderSection = () => {
        let { layout, addGuest } = state;
        if(participants === null){
            return (
                <LoadingSection />
            )
        }

        return (
            <ParticipantsPage
                council={council}
                translate={translate}
                layout={layout}
                data={participants}
                view={state.view}
                loading={state.loading}
                limit={state.limit}
                filters={filters}
                setFilters={setFilters}
                menuOpen={state.open}
                editParticipant={editParticipant}
                addGuest={addGuest}
                updateState={updateState}
            />
        )
	}


    const _renderTableOptions = () => {

		return (
			<div
				style={{
					display: 'flex',
					width: '100%',
					justifyContent: 'flex-end',
					alignItems: 'center',
					backgroundColor: 'white',
					borderBottom: '1px solid gainsboro',
					position: "relative",
					overflow: 'hidden'
				}}
			>
				<div style={{overflow: 'hidden', marginRight: '0.6em', display: 'flex'}}>
					<FilterButton
						tooltip={translate.grid}
						onClick={() => setState({ layout: 'squares', open: false })}
						active={state.layout === "squares"}
						size= {'2.55em'}
					>
                        <i className="fa fa-th-large" style={{
								color: primary,
								fontSize: "0.9em"
						}}/>
					</FilterButton>
					<FilterButton
						tooltip={translate.table}
						onClick={() => setState({ layout: 'table', open: false })}
						active={state.layout === "table"}
						size= {'2.55em'}
					>
                        <i className="fa fa-th-list" style={{
								color: primary,
								fontSize: "0.9em"
						}}/>
					</FilterButton>
				</div>

				<div style={{minWidth: '14em'}}>
					<SelectInput
						fullWidth
						floatingText={translate.visualization_type}
						value={state.view}
						onChange={(event => changeView({ view: event.target.value, limit: 24, open: false}))}
					>
						<MenuItem value={'STATES'}>
							{translate.by_participant_state}
						</MenuItem>
						<MenuItem value={'TYPE'}>
							{translate.by_participant_type}
						</MenuItem>
						<MenuItem value={'ATTENDANCE'}>
							{translate.assistance_intention}
						</MenuItem>
						<MenuItem value={'CREDENTIALS'}>
							{translate.credentials}
						</MenuItem>
					</SelectInput>
				</div>
			</div>
		)
	}

    return (
        <Paper
            style={{
                width: "calc(100% - 1.2em)",
                height: "calc(100% - 1.2em)",
                overflowX: 'hidden',
                padding: 0,
                margin: '0.6em',
                outline: 0
            }}
        >
            <i
                className="material-icons"
                style={{
                    position: 'absolute',
                    zIndex: 600,
                    cursor: 'pointer',
                    top: isMobile? '2.5em' : '1.8em',
                    right: '1em',
                    color: secondary
                }}
                onClick={toggleSettings}
            >
                settings
            </i>
            <Grid spacing={0} style={{
                height: "100%",
            }}>
                <GridItem
                    xs={12}
                    md={12}
                    lg={12}
                    style={{
                        height: "100%",
                        overflow: 'hidden'
                    }}
                >
                    <Paper
                        style={{
                            height: "100%",
                            position: 'relative'
                        }}
                    >
                        <CollapsibleSection
                            trigger={() => <span/>}
                            open={state.open}
                            collapse={_renderTableOptions}
                        />
                        {state.editParticipant}
                        {_renderSection()}
                    </Paper>
                </GridItem>
            </Grid>
        </Paper>
    );
}


const getQuery = type => {

    const sections = {
        'STATES': 'liveParticipantsState',
        'ATTENDANCE': 'liveParticipantsAttendance',
        'CREDENTIALS': 'liveParticipantsCredentials',
        'TYPE': 'liveParticipantsType',
        'CONVENE': 'liveParticipantsConvene'
    }

    const typeFilters = {
        'STATES': 'stateStatus',
        'ATTENDANCE': 'attendanceStatus',
        'CREDENTIALS': 'notificationStatus',
        'TYPE': 'typeStatus',
        'CONVENE': 'notificationStatus'
    }

    const recounts = {
        'STATES': `
            stateRecount(councilId: $councilId) {
                all
                remote
                remoteOffline
                remoteOnline
                present
                presentWithElectronicVote
                delegated
                representated
                noParticipate
            }
        `,
        'ATTENDANCE': `
            attendanceRecount(councilId: $councilId) {
                all
                notConfirmed
                remote
                present
                noParticipate
                delegated
            }
        `,
        'CREDENTIALS': `
            crendentialSendRecount(councilId: $councilId) {
                all
                failed
                notSend
                invalidAddress
                spam
                pendingShipping
                delivered
                opened
            }
        `,
        'TYPE': `
            participantTypeRecount(councilId: $councilId) {
                all
                participant
                representative
                guest
            }
        `,
        'CONVENE': `
            conveneSendRecount(councilId: $councilId) {
                all
                failed
                notSend
                invalidAddress
                spam
                pendingShipping
                delivered
                opened
            }
        `,
    }


    return gql`
        query liveParticipants(
            $councilId: Int!
            $filters: [FilterInput]
            $typeFilter: Int,
            $options: OptionsInput
        ) {
            ${sections[type]}(
                councilId: $councilId
                ${typeFilters[type]}: $typeFilter,
                filters: $filters
                options: $options
            ) {
                list {
                    id
                    state
                    councilId
                    name
                    personOrEntity
                    position
                    email
                    phone
                    dni
                    type
                    signed
                    online
                    requestWord
                    numParticipations
                    surname
                    ${type === 'CREDENTIALS'?
                        `sendCredentials {
                            reqCode
                        }`
                    :
                        ''
                    }
                }
                total
            }
            ${recounts[type]}
        }
    `;
}

export default withApollo(ParticipantsManager);