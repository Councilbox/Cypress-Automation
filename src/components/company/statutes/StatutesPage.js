import React from "react";
import withSharedProps from "../../../HOCs/withSharedProps";
import { compose, graphql, withApollo } from "react-apollo";
import {
	AlertConfirm,
	BasicButton,
	ButtonIcon,
	CardPageLayout,
	LiveToast,
	Scrollbar,
	UnsavedChangesModal,
	LoadingSection,
	TextInput,
	VTabs
} from "../../../displayComponents";
import {
	createStatute,
	deleteStatute,
	statutes,
	updateStatute
} from "../../../queries";
import { censuses } from "../../../queries/census";
import { withRouter } from "react-router-dom";
import { store } from '../../../containers/App';
import { setUnsavedChanges } from '../../../actions/mainActions';
import StatuteEditor from "./StatuteEditor";
import StatuteNameEditor from './StatuteNameEditor';
import { getPrimary, getSecondary } from "../../../styles/colors";
import { checkForUnclosedBraces } from '../../../utils/CBX';
import { toast } from 'react-toastify';
import { useOldState } from "../../../hooks";


const StatutesPage = ({ data, translate, client, ...props }) => {
	const [state, setState] = useOldState({
		selectedStatute: 0,
		newStatute: false,
		newStatuteName: "",
		newLoading: false,
		statute: {},
		success: false,
		editModal: false,
		requestError: false,
		requesting: false,
		unsavedChanges: false,
		rollbackAlert: false,
		unsavedAlert: false,
		errors: {},
		deleteModal: false
	});
	const [censusList, setCensusList] = React.useState(null);
	const [tabs, setTabs] = React.useState([]);

	React.useEffect(() => {
		if(!data.loading){
			setState({
				statute: data.companyStatutes[state.selectedStatute]
			});
			setTabs(data.companyStatutes.map(statute => ({
				title: translate[statute.title] || statute.title,
				data: statute
			})));
		}
	}, [state.selectedStatute, data.loading]);

	React.useEffect(() => {
		if(state.statute === null){
			setState({
				statute: data.companyStatutes[state.selectedStatute]
			});
		}
	}, [state.statute]);

	React.useEffect(() => {
		const requestCensus = async () => {
			const response = await client.query({
				query: censuses,
				variables: {
					companyId: props.company.id
				}
			});

			setCensusList(response.data);
		}

		requestCensus();
	}, [censuses]);

	function checkRequiredFields() {
		let errors = {
			advanceNoticeDays: '',
			minimumSeparationBetweenCall: '',
			maxNumDelegatedVotes: '',
			limitedAccessRoomMinutes: '',
			conveneHeader: '',
			intro: '',
			constitution: '',
			conclusion: ''
		};
		let hasError = false;
		let notify = false;

		const { statute } = state;

		if(statute.existsAdvanceNoticeDays && isNaN(statute.advanceNoticeDays)){
			errors.advanceNoticeDays = translate.required_field;
			hasError = true;
		}

		if(statute.existsSecondCall && isNaN(statute.minimumSeparationBetweenCall)){
			errors.minimumSeparationBetweenCall = translate.required_field;
			hasError = true;
		}

		if(statute.existsMaxNumDelegatedVotes && isNaN(statute.maxNumDelegatedVotes)){
			hasError = true;
			errors.maxNumDelegatedVotes = translate.required_field;
		}

		if(statute.existsLimitedAccessRoom && isNaN(statute.limitedAccessRoomMinutes)){
			hasError = true;
			errors.limitedAccessRoomMinutes = translate.required_field;
		}

		if(checkForUnclosedBraces(statute.conveneHeader)){
			hasError = true;
			notify = true;
			errors.conveneHeader = translate.revise_text;
		}

		if(statute.existsAct){
			if(checkForUnclosedBraces(statute.intro)){
				hasError = true;
				notify = true;
				errors.intro = translate.revise_text;
			}

			if(checkForUnclosedBraces(statute.constitution)){
				hasError = true;
				notify = true;
				errors.constitution = translate.revise_text;
			}

			if(checkForUnclosedBraces(statute.conclusion)){
				hasError = true;
				notify = true;
				errors.conclusion = translate.revise_text;
			}
		}

		if(notify){
			toast(
				<LiveToast
					message={translate.revise_text}
				/>, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,
					className: "errorToast"
				}
			);
		}

		setState({
			errors,
			error: hasError
		});

		return hasError;
	}

	const openDeleteModal = id => {
		setState({
			deleteModal: true,
			deleteID: id
		});
	};

	const openEditModal = index => {
		setState({
			editModal: index
		})
	}

	const resetButtonStates = () => {
		setState({
			error: false,
			loading: false,
			success: false
		});
	};

	const updateStatute = async () => {
		if (!checkRequiredFields()) {
			setState({
				loading: true
			});
			const { __typename, ...statute } = state.statute;

			const response = await props.updateStatute({
				variables: {
					statute: statute
				}
			});
			if (response.errors) {
				setState({
					error: true,
					loading: false,
					success: false
				});
			} else {
				setState({
					error: false,
					loading: false,
					success: true,
					unsavedChanges: false
				});
				await data.refetch();
				store.dispatch(setUnsavedChanges(false));
			}
		}
	};

	const deleteStatute = async () => {
		const response = await props.deleteStatute({
			variables: {
				statuteId: state.deleteID
			}
		});
		if (response) {
			data.refetch();
			setState({
				statute: data.companyStatutes[0],
				selectedStatute: 0,
				deleteModal: false
			});
		}
	};

	const createStatute = async () => {
		if (state.newStatuteName) {
			setState({
				newLoading: true
			});
			const statute = {
				title: state.newStatuteName,
				companyId: props.company.id
			};
			const response = await props.createStatute({
				variables: {
					statute
				}
			});
			if (!response.errors) {
				const updated = await data.refetch();
				if (updated) {
					setState({
						newStatute: false
					});
					handleStatuteChange(data.companyStatutes.length - 1);
				}
				setState({
					newStatute: false,
					newLoading: false
				});
			}
		} else {
			setState({
				errors: {
					...state.errors,
					newStatuteName: translate.required_field
				}
			});
		}
	};

	const updateState = object => {
		if(!state.unsavedChanges){
			store.dispatch(setUnsavedChanges(true));
		}
 		setState({
			statute: {
				...state.statute,
				...object
			},
			unsavedChanges: true
		});
	};

	const handleStatuteChange = index => {
		if(index !== 'new'){
			if (!state.unsavedChanges) {
				setState({
					selectedStatute: index,
					statute: null
				})
			} else{
				setState({
					unsavedAlert: true
				});
			}
		}
	};

	const showNewStatute = () => setState({ newStatute: true });

	const restoreStatute = () => {
		setState({
			statute: null,
			unsavedChanges: false,
			rollbackAlert: false
		});

		store.dispatch(setUnsavedChanges(false));
	}

	const { companyStatutes } = data;
	const { statute, errors, success } = state;
	const secondary = getSecondary();

	if (!companyStatutes) {
		return <LoadingSection />;
	}

	return (
		<CardPageLayout title={translate.statutes} disableScroll={true}>
			{companyStatutes.length > 0? (
				<div style={{height:"calc( 100% - 4em )", paddingRight: "0"}} >
					<VTabs
						tabs={tabs}
						changeTab={handleStatuteChange}
						index={state.selectedStatute}
						additionalTab={
							<BasicButton
								text={translate.add_council_type}
								fullWidth
								loading={state.newLoading}
								textStyle={{fontWeight: '700', textTransform: 'none', color: 'white'}}
								color={secondary}
								icon={<ButtonIcon type="add" color="white" />}
								onClick={showNewStatute}
							/>
						}
						additionalTabAction={showNewStatute}
						translate={translate}
						editAction={openEditModal}
						deleteAction={openDeleteModal}
					>
						{!!statute && (
							<React.Fragment>
								<div style={{position: 'relative', overflow: 'hidden', height: 'calc(100% - 3.5em)'}}>
									<Scrollbar>
										<div style={{paddingLeft: '1em', paddingRight: '1.5em'}}>
											<StatuteEditor
												companyStatutes={companyStatutes}
												statute={statute}
												censusList={censusList}
												company={props.company}
												translate={translate}
												updateState={updateState}
												errors={state.errors}
											/>
											<br />
										</div>
									</Scrollbar>
								</div>
								<div
									style={{
										width: 'calc(100% + 24px)',
										marginLeft: '-24px',
										height: '3.5em',
										paddingTop: '0.5em',
										borderTop: '1px solid gainsboro',
										display: 'flex',
										paddingRight: '1em',
										justifyContent: 'flex-end',
										alignItems: 'center'
									}}
								>
									<div>
										{state.unsavedChanges &&
											<BasicButton
												text={translate.undo_changes}
												color={getSecondary()}
												textStyle={{
													color: "white",
													fontWeight: "700",
													textTransform: 'none'
												}}
												buttonStyle={{
													marginRight: '0.8em'
												}}
												onClick={() => setState({
													rollbackAlert: true
												})}
												icon={
													<ButtonIcon
														type={"replay"}
														color="white"
													/>
												}
											/>
										}
										<BasicButton
											text={translate.save}
											disabled={state.error}
											color={success ? "green" : getPrimary()}
											textStyle={{
												color: "white",
												fontWeight: "700",
												textTransform: 'none'
											}}
											onClick={updateStatute}
											loading={state.loading}
											error={state.error}
											reset={resetButtonStates}
											success={success}
											icon={
												<ButtonIcon
													type={"save"}
													color="white"
												/>
											}
										/>
									</div>
								</div>
							</React.Fragment>
						)}
					</VTabs>
				</div>
			) : (
				<div
					style={{
						width: '100%',
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
						marginTop: '4em'
					}}
				>
					<span style={{fontSize: '1.1em', fontWeight: '700', marginBottom: '1em'}}>
						{translate.no_council_types}
					</span>
					<BasicButton
						text={translate.add_council_type}
						textStyle={{fontWeight: '700', textTransform: 'none', color: 'white'}}
						color={secondary}
						icon={<ButtonIcon type="add" color="white" />}
						onClick={showNewStatute}
					/>
				</div>
			)

			}

			<AlertConfirm
				title={translate.attention}
				bodyText={translate.question_delete}
				open={state.deleteModal}
				buttonAccept={translate.delete}
				buttonCancel={translate.cancel}
				modal={true}
				acceptAction={deleteStatute}
				requestClose={() => setState({ deleteModal: false })}
			/>
			<UnsavedChangesModal
				requestClose={() => setState({ unsavedAlert: false })}
				open={state.unsavedAlert}
			/>
			<AlertConfirm
				title={translate.attention}
				bodyText={translate.are_you_sure_undo_changes}
				open={state.rollbackAlert}
				buttonAccept={translate.accept}
				acceptAction={restoreStatute}
				buttonCancel={translate.cancel}
				modal={true}
				requestClose={() => setState({ rollbackAlert: false })}
			/>
			<AlertConfirm
				requestClose={() =>
					setState({ newStatute: false })
				}
				open={state.newStatute}
				acceptAction={createStatute}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				bodyText={
					<TextInput
						floatingText={translate.council_type}
						required
						type="text"
						errorText={errors.newStatuteName}
						value={statute? statute.newStatuteName : state.newStatuteName}
						onChange={event =>
							setState({
								newStatuteName:
									event.target.value
							})
						}
					/>
				}
				title={translate.add_council_type}
			/>
			{state.editModal !== false &&
				<StatuteNameEditor
					requestClose={() =>
						setState({ editModal: false })
					}
					key={companyStatutes[state.editModal].id}
					statute={companyStatutes[state.editModal]}
					translate={translate}
					refetch={data.refetch}
				/>
			}
		</CardPageLayout>
	)
}

export default withSharedProps()(
	compose(
		graphql(updateStatute, {
			name: "updateStatute"
		}),
		graphql(deleteStatute, {
			name: "deleteStatute"
		}),
		graphql(createStatute, {
			name: "createStatute"
		}),
		graphql(statutes, {
			options: props => ({
				variables: {
					companyId: props.match.params.company
				},
				notifyOnNetworkStatusChange: true,
				fetchPolicy: 'network-only'
			})
		})
	)(withRouter(withApollo(StatutesPage)))
);
