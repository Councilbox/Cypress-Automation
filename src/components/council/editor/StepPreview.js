import React from "react";
import {
	AlertConfirm,
	BasicButton,
	DropDownMenu,
	Grid,
	GridItem,
	LoadingSection,
	TextInput,
	SuccessMessage
} from "../../../displayComponents";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { withRouter } from "react-router-dom";
import { compose, graphql } from "react-apollo";
import {
	councilStepSix
} from "../../../queries";
import {
	conveneWithNotice,
	conveneWithoutNotice,
	sendConveneTest,
	sendPreConvene
} from "../../../queries/council";
import { Icon, MenuItem, Paper, Typography } from "material-ui";
import FontAwesome from "react-fontawesome";
import { bHistory } from "../../../containers/App";
import * as CBX from "../../../utils/CBX";
import { checkValidEmail } from "../../../utils/validation";
import { toast } from "react-toastify";
import EditorStepLayout from './EditorStepLayout';
import { moment } from '../../../containers/App';


class StepPreview extends React.Component {

	state = {
		conveneTestModal: false,
		conveneTestSuccess: false,
		preConveneModal: false,
		preConveneSuccess: false,
		loading: false,
		success: false,
		sendConveneWithoutNoticeModal: false,
		conveneWithoutNoticeSuccess: false,
		data: {
			conveneTestEmail: ""
		},

		errors: {
			conveneTestEmail: ""
		}
	};

	componentDidMount() {
		this.props.data.refetch();
	}

	conveneWithNotice = async () => {
		const { __typename, ...council } = this.props.data.council;
		this.props.data.loading = true;
		this.setState({
			loading: true
		});
		const response = await this.props.conveneWithNotice({
			variables: {
				councilId: council.id,
				timezone: moment().utcOffset(),
			}
		});

		if(!response.errors){
			this.setState({
				loading: false
			});
			if (response.data.conveneWithNotice.success) {
				toast.success(this.props.translate.council_sended);
				bHistory.push(`/company/${this.props.company.id}/council/${council.id}/prepare`);
			}
		}
	};

	sendConveneTest = async () => {
		if (checkValidEmail(this.state.data.conveneTestEmail)) {
			this.setState({
				loading: true
			});
			const response = await this.props.sendConveneTest({
				variables: {
					councilId: this.props.data.council.id,
					email: this.state.data.conveneTestEmail,
					timezone: moment().utcOffset(),
				}
			});

			if (!response.errors) {
				this.setState({
					loading: false,
					conveneTestSuccess: true
				});
			}
		} else {
			this.setState({
				loading: false,
				errors: {
					...this.state.errors,
					conveneTestEmail: this.props.translate.tooltip_invalid_email_address
				}
			});
		}
	};

	conveneTestKeyUp = event => {
		if (event.nativeEvent.keyCode === 13) {
			this.sendConveneTest();
		}
	};

	updateState = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
			}
		});
	};

	resetConveneTestValues = () => {
		this.setState({
			conveneTestModal: false,
			conveneTestSuccess: false,
			errors: { conveneTestEmail: "" }
		});
		this.updateState({ conveneTestEmail: "" });
	};

	sendPreConvene = async () => {
		this.setState({
			loading: true
		});
		const response = await this.props.sendPreConvene({
			variables: {
				councilId: this.props.data.council.id,
				timezone: moment().utcOffset(),
			}
		});

		this.setState({
			loading: false
		});

		if (!response.errors) {
			this.setState({
				preConveneSuccess: true
			});
		}
	};

	sendConveneWithoutNotice = async () => {
		this.setState({
			loading: true
		});
		const response = await this.props.conveneWithoutNotice({
			variables: {
				councilId: this.props.data.council.id,
				timezone: moment().utcOffset(),
			}
		});

		this.setState({
			loading: false
		});
		if (!response.errors) {
			this.setState({
				conveneWithoutNoticeSuccess: true
			});
			if (response.data.conveneWithoutNotice.success) {
				toast.success(this.props.translate.changes_saved);
				bHistory.push(`/company/${this.props.company.id}/council/${this.props.council.id}/prepare`);
			}
		}
	};

	_renderPreConveneModalBody = () => {
		if (this.state.preConveneSuccess) {
			return <SuccessMessage message={this.props.translate.sent} />;
		}

		return (
			<div style={{ width: "500px" }}>
				{this.props.translate.send_preconvene_desc}
			</div>
		);
	};

	_renderSendConveneWithoutNoticeBody = () => {
		return <div>{this.props.translate.new_save_convene}</div>;
	};

	_renderConveneTestModalBody() {
		const { translate } = this.props;
		const { data, errors } = this.state;
		const texts = CBX.removeHTMLTags(
			translate.send_convene_test_email_modal_text
		).split(".");

		if (this.state.conveneTestSuccess) {
			return <SuccessMessage message={translate.sent} />;
		}

		return (
			<div style={{ width: "500px" }}>
				<Typography style={{ fontWeight: "700" }}>
					{texts[0]}
				</Typography>
				<Typography>{`${texts[1]}.`}</Typography>
				<div style={{ marginTop: "2em" }}>
					<TextInput
						required
						floatingText={translate.email}
						onKeyUp={this.conveneTestKeyUp}
						type="text"
						errorText={errors.conveneTestEmail}
						value={data.conveneTestEmail}
						onChange={event =>
							this.updateState({
								conveneTestEmail: event.nativeEvent.target.value
							})
						}
					/>
				</div>
			</div>
		);
	}

	render() {
		const { translate } = this.props;
		const primary = getPrimary();
		const secondary = getSecondary();

		if (this.props.data.loading) {
			return <LoadingSection />;
		}

		return (
			<EditorStepLayout
				body={
					<div
						style={{
							width: "100%",
							height: "100%",
							padding: '1.2em',
							paddingTop: '0.8em',
							display: 'flex',
							justifyContent: 'center'
						}}
					>
						<Paper className="htmlPreview">
							<div
								style={{
									padding: '2em',
								}}
								dangerouslySetInnerHTML={{
									__html: this.props.data.councilPreviewHTML
								}}
							/>
						</Paper>
						<AlertConfirm
							requestClose={this.resetConveneTestValues}
							open={this.state.conveneTestModal}
							loadingAction={this.state.loading}
							acceptAction={
								this.state.conveneTestSuccess
									? this.resetConveneTestValues
									: this.sendConveneTest
							}
							buttonAccept={
								this.state.conveneTestSuccess
									? translate.accept
									: translate.send
							}
							buttonCancel={translate.close}
							bodyText={this._renderConveneTestModalBody()}
							title={translate.send_test_convene}
						/>
						<AlertConfirm
							requestClose={() =>
								this.setState({
									preConveneModal: false,
									preConveneSuccess: false
								})
							}
							open={this.state.preConveneModal}
							loadingAction={this.state.loading}
							acceptAction={
								this.state.preConveneSuccess
									? () =>
											this.setState({
												preConveneSuccess: false,
												preConveneModal: false
											})
									: this.sendPreConvene
							}
							buttonAccept={
								this.state.preConveneSuccess
									? translate.accept
									: translate.send
							}
							buttonCancel={translate.close}
							bodyText={this._renderPreConveneModalBody()}
							title={translate.send_preconvene}
						/>
						<AlertConfirm
							requestClose={() =>
								this.setState({
									sendConveneWithoutNoticeModal: false,
									sendWithoutNoticeSuccess: false
								})
							}
							open={this.state.sendConveneWithoutNoticeModal}
							loadingAction={this.state.loading}
							acceptAction={
								this.state.sendWithoutNoticeSuccess
									? () => {
											this.setState(
												{
													sendConveneWithoutNoticeModal: false,
													sendWithoutNoticeSuccess: false
												},
												() => bHistory.push(`/`)
											);
									}
									: this.sendConveneWithoutNotice
							}
							buttonAccept={
								this.state.sendWithoutNoticeSuccess
									? translate.accept
									: translate.send
							}
							buttonCancel={translate.close}
							bodyText={this._renderSendConveneWithoutNoticeBody()}
							title={translate.send_preconvene}
						/>
					</div>
				}
				buttons={
					<Grid>
						<GridItem
							xs={12} lg={12} md={12}
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'flex-end'
							}}
						>
							<div>
								<div
									style={{
										float: "right"
									}}
								>
									<DropDownMenu
										color="transparent"
										Component={() =>
											<Paper
												elevation={1}
												style={{
													boxSizing: "border-box",
													padding: "0",
													width: '5em',
													height: '36px',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													border: `1px solid ${primary}`,
													marginLeft: "0.3em"
												}}
											>
												<MenuItem
													style={{
														width: '100%',
														height: '100%',
														margin: 0,
														padding: 0,
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center'
													}}
												>
													<FontAwesome
														name={"bars"}
														style={{
															cursor: "pointer",
															fontSize: "0.8em",
															height: "0.8em",
															color: primary
														}}
													/>
													<Icon
														className="material-icons"
														style={{ color: primary }}
													>
														keyboard_arrow_down
													</Icon>
												</MenuItem>
											</Paper>
										}
										textStyle={{ color: primary }}
										type="flat"
										items={
											<React.Fragment>
												<MenuItem
													onClick={() =>
														this.setState({
															conveneTestModal: true
														})
													}
												>
													<Icon
														className="fa fa-flask"
														style={{
															color: secondary,
															marginLeft: "0.4em",
															marginRight: '0.4em'
														}}
													>
														{" "}
													</Icon>
													{translate.send_test_convene}
												</MenuItem>
												<MenuItem
													onClick={() =>
														this.setState({
															preConveneModal: true
														})
													}
												>
													<Icon
														className="material-icons"
														style={{
															color: secondary,
															marginLeft: "0.4em",
															marginRight: '0.4em'
														}}
													>
														query_builder
													</Icon>
													{translate.send_preconvene}
												</MenuItem>
												<MenuItem
													onClick={() =>
														this.setState({
															sendConveneWithoutNoticeModal: true
														})
													}
												>
													<Icon
														className="material-icons"
														style={{
															color: secondary,
															marginLeft: "0.4em",
															marginRight: '0.4em'
														}}
													>
														notifications_off
													</Icon>
													{translate.new_save_convene}
												</MenuItem>
											</React.Fragment>
										}
									/>
								</div>
								<BasicButton
									text={translate.new_save_and_send}
									color={primary}
									textStyle={{
										color: "white",
										fontWeight: "700",
										marginLeft: "0.3em",
										fontSize: "0.9em",
										textTransform: "none"
									}}
									floatRight
									textPosition="after"
									onClick={this.conveneWithNotice}
								/>
								<BasicButton
									text={translate.previous}
									color={secondary}
									textStyle={{
										color: "white",
										fontWeight: "700",
										fontSize: "0.9em",
										textTransform: "none"
									}}
									floatRight
									textPosition="after"
									onClick={this.props.previousStep}
								/>
							</div>
						</GridItem>
					</Grid>
				}
			/>
		);
	}
}


export default compose(
	graphql(conveneWithNotice, {
		name: "conveneWithNotice"
	}),

	graphql(sendConveneTest, {
		name: "sendConveneTest"
	}),

	graphql(sendPreConvene, {
		name: "sendPreConvene"
	}),

	graphql(conveneWithoutNotice, {
		name: "conveneWithoutNotice",
		options: {
			errorPolicy: "all"
		}
	}),
	graphql(councilStepSix, {
		name: "data",
		options: props => ({
			variables: {
				id: props.councilID
			},
			notifyOnNetworkStatusChange: true
		})
	})
)(withRouter(StepPreview));
