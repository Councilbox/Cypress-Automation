import React from "react";
import {
	AlertConfirm,
	Icon,
	LoadingSection,
	ParticipantRow,
	TextInput,
	BasicButton,
	ButtonIcon,
	CollapsibleSection,
	SuccessMessage
} from "../../../../displayComponents";
import { Typography, Card } from "material-ui";
import { compose, graphql } from "react-apollo";
import { councilParticipants } from "../../../../queries/councilParticipant";
import { DELEGATION_USERS_LOAD } from "../../../../constants";
import Scrollbar from "react-perfect-scrollbar";
import { getPrimary } from '../../../../styles/colors';
import { checkValidEmail } from '../../../../utils/validation';
import FontAwesome from 'react-fontawesome';
import { sendActDraft } from '../../../../queries';
import { isMobile } from "react-device-detect";



class SendActDraftModal extends React.Component {
	state = {
		checked: [],
		newEmail: '',
		step: 1,
		success: false,
		emailList: [],
		loading: false,
		errors: {},
	};

	componentDidUpdate(prevProps) {
		if (!prevProps.show && this.props.show) {
			this.props.data.refetch();
		}
	}

	close = () => {
		this.props.requestClose();
		this.setState({
			success: false,
			loading: false,
			emailList: [],
			errors: {},
			step: 1,
			checked: []
		});

	};

	loadMore = () => {
		this.props.data.fetchMore({
			variables: {
				options: {
					offset: this.props.data.councilParticipants.list
						.length,
					limit: DELEGATION_USERS_LOAD
				}
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!fetchMoreResult) {
					return prev;
				}
				return {
					...prev,
					councilParticipants: {
						...prev.councilParticipants,
						list: [
							...prev.councilParticipants.list,
							...fetchMoreResult.councilParticipants
								.list
						]
					}
				};
			}
		});
	};

	checkRow = (email, check) => {
		let checked = [...this.state.checked];
		if (check) {
			checked = [...checked, email];
		} else {
			const index = checked.findIndex(item => item === email);
			checked.splice(index, 1);
		}
		this.setState({
			checked: checked
		});
	};

	isChecked = id => {
		const item = this.state.checked.find(item => item === id);
		return !!item;
	}

	updateFilterText = async text => {
		await this.props.data.refetch({
			filters: [
				{
					field: "fullName",
					text: text
				}
			]
		});
	};

	addEmail = () => {
		if (checkValidEmail(this.state.newEmail)) {
			if (this.state.emailList.findIndex(item => item === this.state.newEmail) === -1) {
				this.setState({
					emailList: [...this.state.emailList, this.state.newEmail],
					newEmail: ''
				});
			} else {
				this.setState({
					errors: {
						newEmail: this.props.translate.repeated_email
					}
				});
			}
		} else {
			this.setState({
				errors: {
					newEmail: this.props.translate.tooltip_invalid_email_address
				}
			})
		}
	};

	deleteEmailFromList = (email) => {
		const list = this.state.emailList;
		const checked = this.state.checked;
		const index = list.find(item => email === item);
		list.splice(index, 1);
		checked.splice(index, 1);
		this.setState({
			emailList: list,
			checked: checked
			// emailList: [...list],
			// checked: [...checked]
		});
	}

	_section = () => {
		return (
			<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
				<div style={{ width: '100%', paddingTop: '1em', paddingBottom: '1em', display: 'flex', flexDirection: 'row' }}>
					<div style={{ width: '75%', marginRight: '0.8em' }}>
						<TextInput
							value={this.state.newEmail}
							onChange={(event) => this.setState({
								newEmail: event.nativeEvent.target.value
							})}
							errorText={this.state.errors.newEmail}
						/>
					</div>
					<BasicButton
						text={this.props.translate.add_email}
						textStyle={{ textTransform: 'none', color: 'white', fontSize: '700' }}
						color={getPrimary()}
						onClick={() => this.addEmail()}
					/>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
					{this._renderEmails()}
				</div>
			</div>

		)
	}

	_renderEmails = () => {
		return (
			<div style={{ width: '100%' }}>
				{this.state.emailList.length > 0 ?
					this.state.emailList.map((email, index) => (
						<div key={`emailList_${email}_${index}`}>
							<RowTabla
								email={email}
								index={index}
								deleteEmailFromList={this.deleteEmailFromList}
							/>
						</div>
					))
					:
					<div>
						{this.props.translate.not_added}
					</div>
				}
			</div>

		)
	}

	_button = () => {
		const primary = getPrimary();

		return (
			<BasicButton
				text={this.props.translate.add_email}
				color={"white"}
				textStyle={{
					color: primary,
					fontWeight: "700",
					fontSize: "0.9em",
					textTransform: "none"
				}}
				textPosition="after"
				icon={<ButtonIcon type="add" color={primary} />}
				onClick={() => this.setState({ modal: true })}
				buttonStyle={{
					marginRight: "1em",
					border: `2px solid ${primary}`
				}}
			/>
		)
	}

	sendActDraft = async () => {
		const response = await this.props.sendActDraft({
			variables: {
				councilId: this.props.council.id,
				emailList: this.state.emailList
			}
		});

		if (!!response) {
			if (!response.data.errors) {
				this.setState({
					success: true
				});

			}
			this.props.data.refetch();
		}
	}

	secondStep = () => {
		const filteredEmails = this.state.checked.filter(item => {
			const index = this.state.emailList.findIndex(email => email === item);
			return !!index;
		});
		let emails=[]
		emails.push(...this.state.emailList)
		for (let i = 0; i < filteredEmails.length; i++) {
			if(emails.findIndex(email => email === filteredEmails[i])===-1){
				emails.push(filteredEmails[i])
			}
		}
		this.setState({
			emailList: emails,
			step: 2
		});
	}

	cambiarCheck = (mail) => {
		let isChecked = this.isChecked(mail);
		if (isChecked) {
			isChecked = false
		} else {
			isChecked = true
		}
		this.checkRow(mail, isChecked)
	}

	_modalBody() {
		const { translate } = this.props;
		const { loading } = this.props.data;

		const participants = loading
			? []
			: this.props.data.councilParticipants.list;
		const { total } = loading
			? 0
			: this.props.data.councilParticipants;
		const rest = total - participants.length - 1;
		
		if (this.state.step === 1) {
			return (
				<div style={{ width: isMobile ? "" : "600px" }}>
					<CollapsibleSection
						trigger={this._button}
						collapse={this._section}
					/>
					<TextInput
						adornment={<Icon>search</Icon>}
						floatingText={" "}
						type="text"
						value={this.state.filterText}
						onChange={event => {
							this.updateFilterText(event.target.value);
						}}
					/>
					<div
						style={{
							height: "300px",
							overflow: "hidden",
							position: "relative"
						}}
					>
						{loading ? (
							<LoadingSection />
						) : (
								<Scrollbar style={{ height: "100%", marginBottom: '0.5em' }} option={{ suppressScrollX: true }}>
									{participants.length > 0 ? (
										<div style={{ marginTop: '1em' }}>
											{participants.map(participant => {
												return (
													<div onClick={() => this.cambiarCheck(participant.email)} style={{ display: 'flex', flexDirection: 'row', width: '99.7%', margin: '0 auto', }} key={`participant_${participant.id}`}>
														<ParticipantRow
															stylesPaper={{ marginTop: "10px", marginBottom: "10px" }}
															checkBox={true}
															selected={this.isChecked(participant.email)}
															onChange={(event, isInputChecked) =>
																this.checkRow(participant.email, isInputChecked)
															}
															participant={participant}
														/>
													</div>
												);
											})}
											{participants.length < total - 1 && (
												<div onClick={this.loadMore}>
													{`DESCARGAR ${
														rest > DELEGATION_USERS_LOAD
															? `${DELEGATION_USERS_LOAD} de ${rest} RESTANTES`
															: translate.all_plural.toLowerCase()
														}`}
												</div>
											)}
										</div>
									) : (
											<Typography>{translate.no_results}</Typography>
										)}
								</Scrollbar>
							)}
					</div>
				</div>
			);
		}

		if (this.state.success) {
			return (
				<SuccessMessage
					changeImage={true}
					message={translate.email_sent_success}
				/>
			)
		}

		return (
			<div style={{ width: "600px" }}>
				{this._renderEmails()}
			</div>
		)
	}

	render() {
		const { translate } = this.props;
		let sylesSend = this.state.success ? {
			height: '100%',
			paddingTop: '24px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		} : {};

		return (
			<AlertConfirm
				bodyStyle={{ minHeight: "430px", paddingTop: this.state.step === 2 ? "5px" : "0", ...sylesSend }}
				requestClose={this.close}
				open={this.props.show}
				acceptAction={this.state.step === 1 ? this.secondStep : this.sendActDraft}
				hideAccept={(this.state.step === 2 && this.state.emailList.length < 1) || this.state.success}
				buttonAccept={this.state.step === 1 ? translate.continue : translate.send}
				cancelAction={this.state.step !== 1 ? () => this.setState({ step: 1, success: false }) : null}
				buttonCancel={this.state.step === 1 ? translate.close : translate.back}
				bodyText={this._modalBody()}
				title={translate.send_draft_act_review}
			/>
		);
	}
}

class RowTabla extends React.Component {

	state = {
		showActions: false
	}

	mouseEnterHandler = () => {
		this.setState({
			showActions: true
		})
	}

	mouseLeaveHandler = () => {
		this.setState({
			showActions: false
		})
	}

	render() {
		const { email, index, deleteEmailFromList } = this.props;
		return (
			< div
				onMouseOver={this.mouseEnterHandler}
				onMouseLeave={this.mouseLeaveHandler}
				className={"hoverEnTabla"}
				style={{ display: 'flex', padding: '15px', background: (index % 2) ? "" : "#f2f2f2", }}
			>
				<div style={{ width: "80%" }}>
					{email}
				</div>
				<div style={{ width: "20%", textAlign: "center" }}>
					{this.state.showActions && (
						< FontAwesome
							name={"times"}
							style={{
								fontSize: "1.2em",
								color: 'red',
								cursor: 'pointer'
							}}
							onClick={() => deleteEmailFromList(email)}
						/>
					)}
				</div>
			</div>
		);
	}
}

export default compose(
	graphql(councilParticipants, {
		options: props => ({
			variables: {
				councilId: props.council.id,
				options: {
					limit: DELEGATION_USERS_LOAD,
					offset: 0
				}
			}
		})
	}),

	graphql(sendActDraft, {
		name: 'sendActDraft'
	})
)(SendActDraftModal);
