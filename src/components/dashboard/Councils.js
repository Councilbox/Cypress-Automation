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
} from "../../displayComponents/index";
import { isLandscape } from '../../utils/screen';
import { getSecondary } from '../../styles/colors';
import "react-perfect-scrollbar/dist/css/styles.css";
import withWindowSize from '../../HOCs/withWindowSize';
import CouncilsList from './CouncilsList';
import CouncilsHistory from './CouncilsHistory';
import CouncilsFilters from './CouncilsFilters';
import { useOldState } from '../../hooks';
import { DRAFTS_LIMITS } from "../../constants.js";



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

	const getData = async (filters) => {
		const response = await client.query({
			query: councils,
			variables: {
				state: props.state,
				companyId: props.company.id,
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
	}

	React.useEffect(() => {
		setLoading(true)
		getData()
	}, [props.link, state.page])

	const select = id => {
		if (state.selectedIds.has(id)) {
			state.selectedIds.delete(id);
		} else {
			state.selectedIds.set(id, 'selected');
		}

		setState({
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
			page: page,
		});
	};


	return (
		<div
			style={{
				height: '100%',
				width: '100%',
				overflow: "hidden",
				position: "relative"
			}}
		>
			<div style={{ width: '100%', height: '100%', padding: '1em' }}>
				<MainTitle
					icon={props.icon}
					title={props.title}
					size={props.windowSize}
					subtitle={props.desc}
				/>
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
					<GridItem xs={8} md={4} lg={3}>
						<CouncilsFilters refetch={getData} />
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
						<div style={{ height: `calc(100% - ${mobileLandscape() ? '7em' : '13.5em'})`, overflow: 'hidden' }}>
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
										props.link === "/history" || props.link === "/finished" ?
											<div>
												<CouncilsHistory
													councils={councilsData.list}
													openDeleteModal={openDeleteModal}
													translate={translate}
													company={props.company}
												/>
												<Grid style={{ padding: '2em 3em 1em 2em' }}>
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
														link={props.link}
													/>
													<Grid style={{ padding: '2em 3em 1em 2em' }}>
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
											setState({ deleteModal: false })
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
