import React from "react";
import { councils, deleteCouncil } from "../../queries.js";
import { compose, graphql, withApollo } from "react-apollo";
import {
	AlertConfirm,
	ErrorWrapper,
	Scrollbar,
	BasicButton,
	Grid,
	GridItem,
	LoadingSection,
	MainTitle,
	PaginationFooter,
	CardPageLayout,
} from "../../displayComponents/index";
import { isLandscape, isMobile } from '../../utils/screen';
import { getSecondary } from '../../styles/colors';
import "react-perfect-scrollbar/dist/css/styles.css";
import withWindowSize from '../../HOCs/withWindowSize';
import CouncilsList from './CouncilsList';
import CouncilsHistory from './CouncilsHistory';
import CouncilsFilters from './CouncilsFilters';
import { useOldState } from '../../hooks';
import { DRAFTS_LIMITS } from "../../constants.js";
import MenuSuperiorTabs from "./MenuSuperiorTabs.js";
import { bHistory } from "../../containers/App.js";

const getSection = translate => {
	const section = window.location.pathname.split('/').pop();
	const sections = {
		'drafts': translate.companies_draft,
		'calendar': translate.companies_calendar,
		'live': translate.companies_live,
		'act': translate.companies_writing,
		'confirmed': translate.act_book,
		'history': translate.dashboard_historical
	}

	return sections[section];
}

const Councils = ({ translate, client, ...props }) => {
	const [loading, setLoading] = React.useState(true);
	const [councilsData, setCouncilsData] = React.useState(true);
	const [error, setError] = React.useState(false);
	const [state, setState] = useOldState({
		councilToDelete: "",
		deleteModal: false,
		selectedIds: new Map(),
		limit: DRAFTS_LIMITS[0],
		page: 1,
	});
	const statesTabLink = {
		[translate.companies_draft]: `/company/${props.company.id}/councils/drafts`,
		[translate.companies_calendar]: `/company/${props.company.id}/councils/calendar`,
		[translate.companies_live]: `/company/${props.company.id}/councils/live`,
		[translate.companies_writing]: `/company/${props.company.id}/councils/act`,
		[translate.act_book]: `/company/${props.company.id}/councils/confirmed`,
		[translate.dashboard_historical]: `/company/${props.company.id}/councils/history`,
	}
	const statesTabInfo = {
		[translate.companies_draft]: [0, 3],
		[translate.companies_calendar]: [10, 5],
		[translate.companies_live]: [20, 30],
		[translate.companies_writing]: [40],
		[translate.act_book]: [60, 70],
		[translate.dashboard_historical]: [-1, 40, 60, 70, 80, 90]
	}

	const [selecteReuniones, setSelecteReuniones] = React.useState(getSection(translate));
	const [selecteReunionesLink, setSelecteReunionesLink] = React.useState(statesTabLink[getSection(translate)]);

	React.useEffect(() => {
		const section = getSection(translate);
		if (section !== selecteReuniones) {
			setSelecteReuniones(section);
		}
	}, [window.location.pathname]);

	const getData = async (filters) => {
		const response = await client.query({
			query: councils,
			variables: {
				state: statesTabInfo[selecteReuniones],
				// state: props.state,
				companyId: +props.company.id,
				isMeeting: false,
				active: 1,
				options: {
					limit: DRAFTS_LIMITS[0],
					offset: DRAFTS_LIMITS[0] * (state.page - 1)
				},
				...filters
			},
			errorPolicy: 'all',
			notifyOnNetworkStatusChange: true
		});
		setCouncilsData(response.data.councils)
		setLoading(false)
		setSelecteReunionesLink(statesTabLink[selecteReuniones]);
		handleChange();
	}

	React.useEffect(() => {
		setLoading(true);
		getData();
	}, [selecteReuniones, state.page])

	const select = id => {
		if (state.selectedIds.has(id)) {
			state.selectedIds.delete(id);
		} else {
			state.selectedIds.set(id, 'selected');
		}

		setState({
			...state,
			selectedIds: new Map(state.selectedIds)
		});
	}

	const selectAll = () => {
		const newSelected = new Map();
		if (state.selectedIds.size !== councilsData.length) {
			councilsData.list.forEach(council => {
				newSelected.set(council.id, 'selected');
			})
		}

		setState({
			...state,
			selectedIds: newSelected
		});
	}

	const openDeleteModal = councilID => {
		if (Number.isInteger(councilID)) {
			if (!state.selectedIds.has(councilID)) {
				state.selectedIds.set(councilID, 'selected');
			}
		}
		setState({
			...state,
			deleteModal: true,
			selectedIds: new Map(state.selectedIds)
		});
	};

	const deleteCouncil = async () => {
		setLoading(true)
		const response = await props.mutate({
			variables: {
				councilId: Array.from(state.selectedIds.keys())
			}
		});
		if (response) {
			setState({
				...state,
				deleteModal: false,
				selectedIds: new Map()
			});
			getData()
		}
	};

	const mobileLandscape = () => {
		return props.windowSize === 'xs' && isLandscape();
	}


	const changePage = page => {
		setState({
			...state,
			page: page,
		});
	};

	const handleChange = section => {
		bHistory.push(statesTabLink[section]);
	}


	return (
		<div
			style={{
				height: '100%',
				width: '100%',
				overflow: "hidden",
				position: "relative"
			}}
		>
			<div style={{ width: '100%', height: '100%', padding: '1em', paddingTop: "0px" }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.6em" }}>
					<div>
						<MenuSuperiorTabs
							items={[translate.companies_draft, translate.companies_calendar,
							translate.companies_live, translate.companies_writing, translate.act_book,
							translate.dashboard_historical]}
							setSelect={handleChange}
							selected={selecteReuniones}
						/>
					</div>
					<div style={{ display: "flex" }}>
						<div style={{
							position: 'relative',
							color: 'black',
							display: 'flex',
							alignItems: 'center'
						}}>
							<i style={{
								position: 'relative',
								fontSize: '18px',
							}} className={'fa fa-calendar-o'}></i>
							<i style={{
								position: 'relative',
								left: ' -5px',
								bottom: '-5px',
							}} className={'fa fa-clock-o'}></i>
						</div>
						<div>
							<CouncilsFilters refetch={getData} translate={translate} />
						</div>
					</div>
				</div>
				{/* <MainTitle
					icon={props.icon}
					title={props.title}
					size={props.windowSize}
					subtitle={props.desc}
				/> */}
				<Grid style={{ marginTop: '0.6em' }}>
					<GridItem xs={4} md={8} lg={9}>
						{state.selectedIds.size > 0 &&
							<BasicButton
								text={state.selectedIds.size === 1 ? translate.delete_one_item : `${translate.new_delete} ${state.selectedIds.size} ${translate.items}`}
								color={getSecondary()}
								textStyle={{ color: 'white', fontWeight: '700' }}
								onClick={openDeleteModal}
							/>
						}
					</GridItem>
				</Grid>
				{loading ? (
					<div style={{
						width: '100%',
						marginTop: '8em',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<LoadingSection />
					</div>
				) : (
						<div style={{ height: `calc(100% - ${mobileLandscape() ? '7em' : '3em'})`, overflow: 'hidden' }}>
							<Scrollbar>
								<div style={{ padding: "1em", paddingTop: '2em' }}>
									{false ? (
										<div>
											{error.graphQLErrors.map((error, index) => {
												return (
													<ErrorWrapper
														key={`error_${index}`}
														error={error}
														translate={translate}
													/>
												);
											})}
										</div>
									) : councilsData.list.length > 0 ? (
										selecteReuniones === translate.companies_writing || selecteReuniones === translate.act_book || selecteReuniones === translate.dashboard_historical ?
											<div>
												<CouncilsHistory
													councils={councilsData.list}
													openDeleteModal={openDeleteModal}
													translate={translate}
													company={props.company}
												/>
												<Grid style={{ padding: isMobile ? "1em 0em 0em 0em" : '2em 3em 1em 2em' }}>
													<PaginationFooter
														page={state.page}
														translate={translate}
														length={councilsData.list.length}
														limit={state.limit}
														total={councilsData.total}
														changePage={changePage}
													/>
												</Grid>
											</div>
											: (
												<div>
													<CouncilsList
														openDeleteModal={openDeleteModal}
														translate={translate}
														select={select}
														selectAll={selectAll}
														selectedIds={state.selectedIds}
														councils={councilsData.list}
														company={props.company}
														link={selecteReunionesLink}
													/>
													<Grid style={{ padding: isMobile ? "1em 0em 0em 0em" : '2em 3em 1em 2em' }}>
														<PaginationFooter
															page={state.page}
															translate={translate}
															length={councilsData.list.length}
															limit={state.limit}
															total={councilsData.total}
															changePage={changePage}
														/>
													</Grid>
												</div>
											)
									) : (
												<span>{translate.no_results}</span>
											)}
									<AlertConfirm
										title={translate.send_to_trash}
										bodyText={translate.delete_items}
										open={state.deleteModal}
										buttonAccept={translate.send_to_trash}
										buttonCancel={translate.cancel}
										modal={true}
										acceptAction={deleteCouncil}
										requestClose={() =>
											setState({ ...state, deleteModal: false })
										}
									/>
								</div>
							</Scrollbar>
						</div>
					)}
			</div>
		</div>
	);
}

export default compose(
	graphql(deleteCouncil),
)(withWindowSize(withApollo(Councils)));
