import React from "react";
import { councils, deleteCouncil } from "../../queries.js";
import { compose, graphql } from "react-apollo";
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


const Councils = ({ data, translate, ...props }) => {
	const [state, setState] = useOldState({
		councilToDelete: "",
		deleteModal: false,
		selectedIds: new Map(),
		limit:  DRAFTS_LIMITS[0],
		page: 1,
	});

	React.useEffect(() => {
		data.refetch();
	}, [props.link])

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
		if (state.selectedIds.size !== data.councils.length) {
			data.councils.forEach(council => {
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
		data.loading = true;
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
			data.refetch();
		}
	};

	const mobileLandscape = () => {
		return props.windowSize === 'xs' && isLandscape();
	}


	const changePage = page => {
		setState({
			...state,
			page: page
		});
	};


	const { loading, councils, error } = data;
	console.log(councils)

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
						<CouncilsFilters refetch={data.refetch} />
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
							<PaginationFooter
								page={state.page}
								translate={translate}
								length={councils.length}
								limit={state.limit}
								total={50}
								changePage={changePage}
							/>
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
									) : councils.length > 0 ? (
										props.link === "/history" || props.link === "/finished" ?
											<CouncilsHistory
												councils={councils}
												openDeleteModal={openDeleteModal}
												translate={translate}
												company={props.company}
											/>
											: (

												<CouncilsList
													openDeleteModal={openDeleteModal}
													translate={translate}
													select={select}
													selectAll={selectAll}
													selectedIds={state.selectedIds}
													councils={councils}
													company={props.company}
													link={props.link}
												/>
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
	graphql(councils, {
		options: props => ({
			variables: {
				state: props.state,
				companyId: props.company.id,
				isMeeting: false,
				active: 1,
				options: {
					limit: DRAFTS_LIMITS[0],
					offset: 0
				}
			},
			errorPolicy: 'all',
			notifyOnNetworkStatusChange: true
		})
	})
)(withWindowSize(Councils));
