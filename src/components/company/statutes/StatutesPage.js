import React, { Component, Fragment } from "react";
import withSharedProps from "../../../HOCs/withSharedProps";
import { compose, graphql } from "react-apollo";

import {
	AlertConfirm,
	BasicButton,
	ButtonIcon,
	CardPageLayout,
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
import StatuteEditor from "./StatuteEditor";
import { getPrimary } from "../../../styles/colors";

class StatutesPage extends Component {
	openDeleteModal = ID => {
		this.setState({
			deleteModal: true,
			deleteID: ID
		});
	};
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
	};
	handleStatuteChange = index => {
		if (!this.state.unsavedChanges) {
			this.setState(
				{
					statute: null
				},
				() =>
					this.setState({
						selectedStatute: index,
						statute: {
							...this.props.data.companyStatutes[index]
						}
					})
			);
		} else {
			alert("tienes cambios sin guardar");
		}
	};
	showNewStatute = () => this.setState({ newStatute: true });

	constructor(props) {
		super(props);
		this.state = {
			selectedStatute: 0,
			newStatute: false,
			newStatuteName: "",
			statute: {},
			success: false,
			requestError: false,
			requesting: false,
			unsavedChanges: false,
			errors: {},
			deleteModal: false
		};
	}

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
		return false;
	}

	render() {
		const { loading, companyStatutes } = this.props.data;
		const { translate } = this.props;
		const { statute, errors, success } = this.state;

		if (loading) {
			return <LoadingSection />;
		}

		let tabs = [];
		for (let i = 0; i < companyStatutes.length; i++) {
			const companyStatute = companyStatutes[i];
			tabs.push({
				title: translate[companyStatute.title] || companyStatute.title,
				data: companyStatute,
				active: i === this.state.selectedStatute
			});
		}

		return (
			<CardPageLayout disableScroll={true} title={translate.statutes}>
				<VTabs
					tabs={tabs}
					changeTab={this.handleStatuteChange}
					additionalTab={{
						title: translate.add_council_type,
						action: this.showNewStatute
					}}
					deleteAction={this.openDeleteModal}
				>
					{!!statute && (
						<Fragment>
							<div className="container-fluid">
								<StatuteEditor
									companyStatutes={companyStatutes}
									statute={statute}
									company={this.props.company}
									translate={translate}
									updateState={this.updateState}
									errors={this.state.errors}
								/>
								<br />
								<BasicButton
									text={translate.save}
									color={success ? "green" : getPrimary()}
									textStyle={{
										color: "white",
										fontWeight: "700"
									}}
									floatRight
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
										value={statute.newStatuteName}
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
						</Fragment>
					)}
				</VTabs>
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
			</CardPageLayout>
		);
	}
}

export default withSharedProps()(
	withRouter(
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
		)(StatutesPage)
	)
);
