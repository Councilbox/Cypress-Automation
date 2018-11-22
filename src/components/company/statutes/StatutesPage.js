import React from "react";
import withSharedProps from "../../../HOCs/withSharedProps";
import { compose, graphql } from "react-apollo";
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
import { withRouter } from "react-router-dom";
import { store } from '../../../containers/App';
import { setUnsavedChanges } from '../../../actions/mainActions';
import StatuteEditor from "./StatuteEditor";
import StatuteNameEditor from './StatuteNameEditor';
import { getPrimary, getSecondary } from "../../../styles/colors";
import { checkForUnclosedBraces } from '../../../utils/CBX';
import { toast } from 'react-toastify';


class StatutesPage extends React.Component {
	state = {
		selectedStatute: 0,
		newStatute: false,
		newStatuteName: "",
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
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.data.loading && !nextProps.data.loading) {
			if (nextProps.data.companyStatutes[this.state.selectedStatute]) {
				this.setState({
					statute: {
						...nextProps.data.companyStatutes[
							this.state.selectedStatute
						]
					}
				});
			}
		}
	}

	componentDidMount() {
		this.props.data.refetch();
	}

	checkRequiredFields() {
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

		const { statute } = this.state;
		const { translate } = this.props;

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

		this.setState({
			errors,
			error: hasError
		});

		return hasError;
	}

	openDeleteModal = id => {
		this.setState({
			deleteModal: true,
			deleteID: id
		});
	};

	openEditModal = index => {
		this.setState({
			editModal: index
		})
	}

	resetButtonStates = () => {
		this.setState({
			error: false,
			loading: false,
			success: false
		});
	};

	updateStatute = async () => {
		if (!this.checkRequiredFields()) {
			this.setState({
				loading: true
			});
			const { __typename, ...data } = this.state.statute;

			const response = await this.props.updateStatute({
				variables: {
					statute: data
				}
			});
			if (response.errors) {
				this.setState({
					error: true,
					loading: false,
					success: false
				});
			} else {
				this.setState({
					error: false,
					loading: false,
					success: true,
					unsavedChanges: false
				});
				store.dispatch(setUnsavedChanges(false));
			}
		}
	};

	deleteStatute = async () => {
		const response = await this.props.deleteStatute({
			variables: {
				statuteId: this.state.deleteID
			}
		});
		if (response) {
			this.props.data.refetch();
			this.setState({
				statute: this.props.data.companyStatutes[0],
				selectedStatute: 0,
				deleteModal: false
			});
		}
	};

	createStatute = async () => {
		if (this.state.newStatuteName) {
			const statute = {
				title: this.state.newStatuteName,
				companyId: this.props.company.id
			};
			const response = await this.props.createStatute({
				variables: {
					statute: statute
				}
			});
			if (!response.errors) {
				const updated = await this.props.data.refetch();
				if (updated) {
					this.setState({
						newStatute: false
					});
					this.handleStatuteChange(
						this.props.data.companyStatutes.length - 1
					);
				}
			}
		} else {
			this.setState({
				errors: {
					...this.state.errors,
					newStatuteName: this.props.translate.required_field
				}
			});
		}
	};

	updateState = object => {
		this.setState({
			statute: {
				...this.state.statute,
				...object
			},
			unsavedChanges: true
		});
		store.dispatch(setUnsavedChanges(true));
	};

	handleStatuteChange = index => {
		if(index !== 'new'){
			if (!this.state.unsavedChanges) {
				this.setState({
					selectedStatute: index,
					statute: {
						...this.props.data.companyStatutes[index]
					}
				})
			} else{
				this.setState({
					unsavedAlert: true
				});
			}
		}
	};

	showNewStatute = () => this.setState({ newStatute: true });

	restoreStatute = () => {
		this.setState({
			statute: {
				...this.props.data.companyStatutes[
					this.state.selectedStatute
				]
			},
			unsavedChanges: false,
			rollbackAlert: false
		});
		store.dispatch(setUnsavedChanges(false));
	}


	render() {
		const { companyStatutes } = this.props.data;
		const { translate } = this.props;
		const { statute, errors, success } = this.state;
		const secondary = getSecondary();

		if (!companyStatutes) {
			return <LoadingSection />;
		}

		let tabs = [];
		for (let i = 0; i < companyStatutes.length; i++) {
			const companyStatute = companyStatutes[i];
			tabs.push({
				title: translate[companyStatute.title] || companyStatute.title,
				data: companyStatute
			});
		}

		return (
			<CardPageLayout title={translate.statutes} disableScroll={true}>
				{companyStatutes.length > 0? (
					<React.Fragment>
						<VTabs
							tabs={tabs}
							changeTab={this.handleStatuteChange}
							index={this.state.selectedStatute}
							additionalTab={
								<BasicButton
									text={translate.add_council_type}
									fullWidth
									textStyle={{fontWeight: '700', textTransform: 'none', color: 'white'}}
									color={secondary}
									icon={<ButtonIcon type="add" color="white" />}
									onClick={this.showNewStatute}
								/>
							}
							additionalTabAction={this.showNewStatute}
							translate={translate}
							editAction={this.openEditModal}
							deleteAction={this.openDeleteModal}
						>
							{!!statute && (
								<React.Fragment>
									<div style={{position: 'relative', overflow: 'hidden', height: 'calc(100% - 3.5em)'}}>
										<Scrollbar>
											<div style={{paddingLeft: '1em', paddingRight: '1.5em'}}>
												<StatuteEditor
													companyStatutes={companyStatutes}
													statute={statute}
													company={this.props.company}
													translate={translate}
													updateState={this.updateState}
													errors={this.state.errors}
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
											{this.state.unsavedChanges &&
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
													onClick={() => this.setState({
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
												disabled={this.state.error}
												color={success ? "green" : getPrimary()}
												textStyle={{
													color: "white",
													fontWeight: "700",
													textTransform: 'none'
												}}
												onClick={this.updateStatute}
												loading={this.state.loading}
												error={this.state.error}
												reset={this.resetButtonStates}
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
					</React.Fragment>
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
							onClick={this.showNewStatute}
						/>
					</div>
				)

				}

				<AlertConfirm
					title={translate.attention}
					bodyText={translate.question_delete}
					open={this.state.deleteModal}
					buttonAccept={translate.delete}
					buttonCancel={translate.cancel}
					modal={true}
					acceptAction={this.deleteStatute}
					requestClose={() => this.setState({ deleteModal: false })}
				/>
				<UnsavedChangesModal
					requestClose={() => this.setState({ unsavedAlert: false })}
					open={this.state.unsavedAlert}
				/>
				<AlertConfirm
					title={translate.attention}
					bodyText={translate.are_you_sure_undo_changes}
					open={this.state.rollbackAlert}
					buttonAccept={translate.accept}
					acceptAction={this.restoreStatute}
					buttonCancel={translate.cancel}
					modal={true}
					requestClose={() => this.setState({ rollbackAlert: false })}
				/>
				<AlertConfirm
					requestClose={() =>
						this.setState({ newStatute: false })
					}
					open={this.state.newStatute}
					acceptAction={this.createStatute}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					bodyText={
						<TextInput
							floatingText={translate.council_type}
							required
							type="text"
							errorText={errors.newStatuteName}
							value={statute? statute.newStatuteName : ''}
							onChange={event =>
								this.setState({
									newStatuteName:
										event.target.value
								})
							}
						/>
					}
					title={translate.add_council_type}
				/>
				{this.state.editModal !== false &&
					<StatuteNameEditor
						requestClose={() =>
							this.setState({ editModal: false })
						}
						key={companyStatutes[this.state.editModal].id}
						statute={companyStatutes[this.state.editModal]}
						translate={translate}
						refetch={this.props.data.refetch}
					/>
				}
			</CardPageLayout>
		);
	}
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
				notifyOnNetworkStatusChange: true
			})
		})
	)(withRouter(StatutesPage))
);
