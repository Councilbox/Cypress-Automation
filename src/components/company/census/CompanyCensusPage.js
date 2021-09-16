import React from 'react';
import { withApollo } from 'react-apollo';
import { Tooltip, Card } from 'material-ui';
import { TableCell, TableRow } from 'material-ui/Table';
import { withRouter } from 'react-router-dom';
import { censuses as censusesQuery, deleteCensus, setDefaultCensus } from '../../../queries/census';
import {
	AlertConfirm,
	CardPageLayout,
	CloseIcon,
	DateWrapper,
	Grid,
	GridItem,
	EnhancedTable,
	LoadingSection
} from '../../../displayComponents';
import { getPrimary, getSecondary } from '../../../styles/colors';
import withSharedProps from '../../../HOCs/withSharedProps';
import CloneCensusModal from './CloneCensusModal';
import AddCensusButton from './AddCensusButton';
import EditCensusModal from './censusEditor/modals/EditCensusModal';
import { bHistory } from '../../../containers/App';
import { CENSUS_LIMITS } from '../../../constants';
import { isMobile } from '../../../utils/screen';

const CompanyCensusPage = ({
	translate,
	company,
	client,
	...props
}) => {
	const [state, setState] = React.useState({
		deleteModal: false,
		cloneModal: false,
		editId: false,
		index: 0,
	});
	const [loading, setLoading] = React.useState(true);
	const [censuses, setCensuses] = React.useState(true);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: censusesQuery,
			variables: {
				companyId: +props.match.params.company,
				options: {
					limit: CENSUS_LIMITS[0],
					offset: 0
				}
			}
		});

		setCensuses(response.data.censuses);
		setLoading(false);
	}, []);

	React.useEffect(() => {
		getData();
	}, [getData]);


	const deleteCensusById = async () => {
		setLoading(true);
		const response = await client.mutate({
			mutation: deleteCensus,
			variables: {
				censusId: state.deleteCensus
			}
		});
		if (response) {
			setState({
				...state,
				deleteModal: false,
				deleteCensus: -1
			});
			getData();
		}
	};

	const setDefaultCensusById = async censusId => {
		setState({
			...state,
			changingDefault: censusId
		});
		const response = await client.mutate({
			mutation: setDefaultCensus,
			variables: {
				censusId
			}
		});
		if (response) {
			setState({
				...state,
				changingDefault: -1
			});
			getData();
		}
	};

	const updateState = object => {
		setState({
			...state,
			...object
		});
	};

	const openCensusEdit = censusId => {
		bHistory.push(`/company/${company.id}/census/${censusId}`);
	};

	if (loading) {
		return <LoadingSection />;
	}

	return (
		<CardPageLayout title={translate.censuses_list}>
			<EnhancedTable
				translate={translate}
				defaultLimit={CENSUS_LIMITS[0]}
				defaultFilter={'censusName'}
				limits={CENSUS_LIMITS}
				page={1}
				menuButtons={
					<div style={{
						height: '100%', display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'center'
					}}>
						<div>
							<AddCensusButton
								translate={translate}
								user={props.user}
								company={company}
								refetch={() => getData()}
							/>
						</div>
					</div>
				}
				loading={loading}
				length={censuses.list.length}
				total={censuses.total}
				refetch={() => getData()}
				headers={[
					{
						text: translate.name,
						name: 'censusName',
						canOrder: true
					},
					{
						text: translate.creation_date,
						name: 'creationDate',
						canOrder: true
					},
					{
						name: 'lastEdit',
						text: translate.last_edit,
						canOrder: true
					},
					{
						name: 'creator',
						text: translate.creator,
					},
					{ name: '' }
				]}
			>
				{censuses.list.map((census, index) => (
					<HoverableRow
						census={census}
						id={`census_row_${index}`}
						key={`census_${census.id}`}
						changingDefault={state.changingDefault}
						openCensusEdit={openCensusEdit}
						updateState={updateState}
						setDefaultCensusById={setDefaultCensusById}
						index={index}
						translate={translate}
					/>
				))}
			</EnhancedTable>
			<AlertConfirm
				title={translate.send_to_trash}
				bodyText={translate.send_to_trash_desc}
				open={state.deleteModal}
				buttonAccept={translate.send_to_trash}
				buttonCancel={translate.cancel}
				modal={true}
				acceptAction={deleteCensusById}
				requestClose={() => setState({ ...state, deleteModal: false })}
			/>
			<CloneCensusModal
				translate={translate}
				user={props.user}
				refetch={() => getData()}
				requestClose={() => setState({ ...state, cloneModal: false, index: null })}
				open={state.cloneModal}
				census={censuses.list[state.index]}
			/>
			{!!state.editId
				&& <EditCensusModal
					translate={translate}
					censusId={state.editId}
					refetch={() => getData()}
					open={!!state.editId}
					requestClose={() => setState({
						...state,
						editId: null
					})}
				/>
			}

		</CardPageLayout>
	);
};

const HoverableRow = ({
	census,
	translate,
	setDefaultCensusById,
	...props
}) => {
	const [state, setState] = React.useState({
		showActions: false
	});

	const mouseEnterHandler = () => {
		setState({
			showActions: true
		});
	};

	const mouseLeaveHandler = () => {
		setState({
			showActions: false
		});
	};

	const buttonDefaultCensus = () => (
		<i
			id="census-set-as-default-button"
			className={
				census.defaultCensus
					=== 1 ?
					'fa fa-star'
					: 'fa fa-star-o'
			}
			style={{
				cursor: 'pointer',
				fontSize: '2em',
				color: primary
			}}
			onClick={event => {
				event.stopPropagation();
				setDefaultCensusById(
					census.id
				);
			}}
		/>
	);

	const primary = getPrimary();
	const secondary = getSecondary();

	const actions = <React.Fragment>
		{census.id === props.changingDefault ? (
			<div
				style={{
					display: 'inline-block'
				}}
			>
				<LoadingSection size={20} />
			</div>
		) : (
			<Tooltip title={translate.change_default_census_tooltip}>
				{buttonDefaultCensus()}
			</Tooltip>

		)}
		<Tooltip title={translate.manage_participants}>
			<i
				className={'fa fa-users'}
				id="census-manage-participants-button"
				style={{
					cursor: 'pointer',
					fontSize: '1.8em',
					marginLeft: '0.2em',
					color: primary
				}}
				onClick={event => {
					event.stopPropagation();
					props.openCensusEdit(census.id);
				}}
			/>
		</Tooltip>
		<Tooltip title={translate.edit}>
			<i
				className={'fa fa-edit'}
				id="census-edit-button"
				style={{
					cursor: 'pointer',
					fontSize: '1.8em',
					marginLeft: '0.2em',
					color: primary
				}}
				onClick={event => {
					event.stopPropagation();
					props.updateState({
						editId: census.id
					});
				}}
			/>
		</Tooltip>
		<Tooltip title={translate.clone_census}>
			<i
				className={'fa fa-clone'}
				id="census-clone-button"
				style={{
					cursor: 'pointer',
					fontSize: '1.8em',
					marginLeft: '0.2em',
					color: primary
				}}
				onClick={event => {
					event.stopPropagation();
					props.updateState({
						cloneModal: true,
						index: props.index
					});
				}}
			/>
		</Tooltip>
		<Tooltip title={translate.delete}>
			<span>
				<CloseIcon
					id="census-delete-button"
					style={{
						color: primary,
						marginTop: '-10px'
					}}
					onClick={event => {
						event.stopPropagation();
						props.updateState({
							deleteModal: true,
							deleteCensus: census.id
						});
					}}
				/>
			</span>
		</Tooltip>
	</React.Fragment>;

	if (isMobile) {
		return (
			<Card
				style={{ marginBottom: '0.5em', padding: '0.3em', position: 'relative' }}
				onClick={() => props.openCensusEdit(census.id)}
				id={props.id}
			>
				<Grid>
					<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
						{translate.name}
					</GridItem>
					<GridItem xs={7} md={7}>
						{census.defaultCensus === 1
							&& <Tooltip title={translate.default_census} >
								<i
									className={'fa fa-star'}
									style={{
										cursor: 'pointer',
										fontSize: '1.2em',
										marginRight: '0.6em',
										color: secondary
									}}
								/>
							</Tooltip>
						}
						{census.censusName}
					</GridItem>

					<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
						{translate.creation_date}
					</GridItem>
					<GridItem xs={7} md={7}>
						<DateWrapper
							format="DD/MM/YYYY HH:mm"
							date={census.creationDate}
						/>
					</GridItem>

					<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
						{translate.last_edit}
					</GridItem>
					<GridItem xs={7} md={7}>
						<DateWrapper
							format="DD/MM/YYYY HH:mm"
							date={census.lastEdit}
						/>
					</GridItem>

					<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
						{translate.creator}
					</GridItem>
					<GridItem xs={7} md={7}>
						{`${census.creator ? census.creator.name : ''} ${census.creator ? census.creator.surname : ''}`}
					</GridItem>

					<GridItem xs={12} md={12} >
						{actions}
					</GridItem>

				</Grid>
			</Card>
		);
	}

	return (
		<TableRow
			hover
			onMouseOver={mouseEnterHandler}
			onMouseLeave={mouseLeaveHandler}
			style={{ cursor: 'pointer' }}
			id={props.id || ''}
			onClick={() => props.openCensusEdit(census.id)}
		>
			<TableCell>
				{census.defaultCensus === 1
					&& <Tooltip title={translate.default_census} >
						<i
							className={'fa fa-star'}
							style={{
								cursor: 'pointer',
								fontSize: '1.2em',
								marginRight: '0.6em',
								color: secondary
							}}
						/>
					</Tooltip>
				}
				{census.censusName}
			</TableCell>
			<TableCell>
				<DateWrapper
					format="DD/MM/YYYY HH:mm"
					date={census.creationDate}
				/>
			</TableCell>
			<TableCell>
				<DateWrapper
					format="DD/MM/YYYY HH:mm"
					date={census.lastEdit}
				/>
			</TableCell>
			<TableCell>
				{`${census.creator ? census.creator.name : ''} ${census.creator ? census.creator.surname : ''}`}
			</TableCell>
			<TableCell>
				<div style={{ width: '12.5em', float: 'right' }}>
					{state.showActions
						&& actions
					}
				</div>
			</TableCell>
		</TableRow>
	);
};

export default withSharedProps()(withRouter(withApollo(CompanyCensusPage)));
