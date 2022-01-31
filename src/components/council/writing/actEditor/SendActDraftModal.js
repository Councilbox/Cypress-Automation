/* eslint-disable max-classes-per-file */
import React from 'react';
import {
	Typography, TableRow, Table, TableCell
} from 'material-ui';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import FontAwesome from 'react-fontawesome';
import {
	AlertConfirm,
	Icon,
	LoadingSection,
	TextInput,
	Scrollbar,
	BasicButton,
	ButtonIcon,
	CollapsibleSection,
	SuccessMessage,
	Checkbox
} from '../../../../displayComponents';
import { DELEGATION_USERS_LOAD } from '../../../../constants';
import { getPrimary, secondary, getSecondary } from '../../../../styles/colors';
import { checkValidEmail } from '../../../../utils/validation';
import { sendActDraft, councilParticipantsActSends } from '../../../../queries';


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
					offset: this.props.data.councilParticipantsActSends.list
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
					councilParticipantsActSends: {
						...prev.councilParticipantsActSends,
						list: [
							...prev.councilParticipantsActSends.list,
							...fetchMoreResult.councilParticipantsActSends
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
			checked
		});
	};

	isChecked = id => {
		const item = this.state.checked.find(selection => selection === id);
		return !!item;
	}

	updateFilterText = async text => {
		await this.props.data.refetch({
			filters: [
				{
					field: 'fullName',
					text
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
					newEmail: this.props.translate.email_not_valid
				}
			});
		}
	};

	deleteEmailFromList = email => {
		const list = this.state.emailList;
		const { checked } = this.state;
		const index = list.find(item => email === item);
		list.splice(index, 1);
		checked.splice(index, 1);
		this.setState({
			emailList: list,
			checked
			// emailList: [...list],
			// checked: [...checked]
		});
	}

	section = () => (
		<div style={{
			width: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '1.5em', border: `1px solid ${getSecondary()}`, borderRadius: '4px', padding: '1em', marginTop: '1em'
		}}>
			<div style={{
				width: '100%', paddingTop: '1em', paddingBottom: '1em', display: 'flex', flexDirection: 'row'
			}}>
				<div style={{ width: '75%', marginRight: '0.8em' }}>
					<TextInput
						value={this.state.newEmail}
						onChange={event => this.setState({
							newEmail: event.nativeEvent.target.value
						})}
						errorText={this.state.errors.newEmail}
					/>
				</div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<BasicButton
						text={this.props.translate.add_email}
						textStyle={{
							textTransform: 'none', color: 'white', fontSize: '700', boxShadow: 'none', borderRadius: '4px'
						}}
						color={getPrimary()}
						onClick={() => this.addEmail()}
					/>
				</div>
			</div>
			<div style={{
				display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
			}}>
				{this.renderEmails()}
			</div>
		</div>

	)

	renderEmails = () => (
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
				: <div>
					{this.props.translate.not_added}
				</div>
			}
		</div>

	)

	button = () => {
		const primary = getPrimary();

		return (
			<BasicButton
				text={this.props.translate.add_email}
				color={'white'}
				textStyle={{
					color: primary,
					fontWeight: '700',
					fontSize: '0.9em',
					textTransform: 'none'
				}}
				textPosition="after"
				icon={<ButtonIcon type="add" color={primary} />}
				onClick={() => this.setState({ modal: true })}
				buttonStyle={{
					marginRight: '1em',
					border: `1px solid ${primary}`,
					borderRadius: '4px',
					boxShadow: 'none'
				}}
			/>
		);
	}

	sendActDraft = async () => {
		await this.props.updateAct();
		const response = await this.props.sendActDraft({
			variables: {
				councilId: this.props.council.id,
				emailList: this.state.emailList
			}
		});

		if (response) {
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
		const emails = [];
		emails.push(...this.state.emailList);
		for (let i = 0; i < filteredEmails.length; i++) {
			if (emails.findIndex(email => email === filteredEmails[i]) === -1) {
				emails.push(filteredEmails[i]);
			}
		}
		this.setState({
			emailList: emails,
			step: 2
		});
	}

	cambiarCheck = mail => {
		let isChecked = this.isChecked(mail);
		if (isChecked) {
			isChecked = false;
		} else {
			isChecked = true;
		}
		this.checkRow(mail, isChecked);
	}

	modalBody() {
		const { translate } = this.props;
		const { loading } = this.props.data;

		const participants = loading ?
			[]
			: this.props.data.councilParticipantsActSends.list;
		const { total } = loading ?
			0
			: this.props.data.councilParticipantsActSends;
		const rest = total - participants.length - 1;

		if (this.state.step === 1) {
			return (
				<div style={{}}>
					{/* width: isMobile ? "" : "600px"  */}
					<CollapsibleSection
						trigger={this.button}
						collapse={this.section}
					/>
					<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<div style={{ width: '200px' }}>
							<TextInput
								adornment={<Icon style={{
									background: '#f0f3f6', paddingLeft: '5px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'
								}}>search</Icon>}
								floatingText={' '}
								type="text"
								value={this.state.filterText}
								onChange={event => {
									this.updateFilterText(event.target.value);
								}}
								disableUnderline={true}
								styleInInput={{
									fontSize: '12px', color: 'rgba(0, 0, 0, 0.54)', background: '#f0f3f6', marginLeft: '0', paddingLeft: '8px'
								}}
								stylesAdornment={{ background: '#f0f3f6', marginLeft: '0', paddingLeft: '8px' }}
								placeholder={translate.search}
							/>
						</div>
					</div>
					<div
						style={{
							height: '300px',
							overflow: 'hidden',
							position: 'relative',
						}}
					>

						<Table style={{ width: '600px', margin: '0 auto' }}>
							<TableRow>
								<TableCell style={{ width: '50px', padding: '0px', paddingLeft: '10px' }}></TableCell>
								<TableCell style={{ width: '305px' }}>{translate.participant_data}</TableCell>
								<TableCell>{translate.email}</TableCell>
							</TableRow>
						</Table>

						{loading ? (
							<LoadingSection />
						) : (
							<div style={{
								height: 'calc( 100% - 4em )', marginBottom: '0.5em', width: '600px', margin: '0 auto'
							}}>
								<Scrollbar option={{ suppressScrollX: true }}>
									<Table style={{ marginBottom: '1em', width: '600px', margin: '0 auto' }}>
										{participants.length > 0 ? (
											participants.filter(p => !!p.email).map(participant => (
												<TableRow key={`participant_${participant.id}`}>
													<TableCell style={{ width: '50px', padding: '0px', paddingLeft: '10px' }}>
														<Checkbox
															value={this.isChecked(participant.email)}
															onChange={(event, isInputChecked) => this.checkRow(participant.email, isInputChecked)
															}
														/>
													</TableCell>
													<TableCell style={{ width: '305px' }}>
														<div style={{
															whiteSpace: 'nowrap',
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															width: '200px',
														}}>
															{`${participant.name} ${participant.surname || ''}`}
														</div>
													</TableCell>
													<TableCell>
														<div style={{
															whiteSpace: 'nowrap',
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															width: '200px',
														}}>
															{participant.email}
														</div>
													</TableCell>
												</TableRow>
											))) : (
											<Typography>{translate.no_results}</Typography>
										)
										}
									</Table>
								</Scrollbar>
							</div>
						)}
					</div>
					{(participants.length > 0 && (
						participants.length < total - 1 && (
							<div
								style={{
									width: '100%',
									display: 'flex',
									justifyContent: 'flex-end'
								}}
							>
								<BasicButton
									text={
										`DESCARGAR ${rest > DELEGATION_USERS_LOAD ?
											`${DELEGATION_USERS_LOAD} de ${rest} RESTANTES`
											: translate.all_plural.toLowerCase()
										}`
									}
									color={secondary}
									onClick={this.loadMore}
									textStyle={{ color: 'white' }}
								/>
							</div>
						)
					))}
				</div>
			);
		}

		if (this.state.success) {
			return (
				<SuccessMessage
					changeImage={true}
					message={translate.email_sent_success}
				/>
			);
		}

		return (
			<div style={{ width: '600px' }}>
				{this.renderEmails()}
			</div>
		);
	}

	render() {
		const { translate } = this.props;
		const sylesSend = this.state.success ? {
			height: '100%',
			paddingTop: '24px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		} : {};

		return (
			<AlertConfirm
				bodyStyle={{ minHeight: '430px', paddingTop: this.state.step === 2 ? '5px' : '0', ...sylesSend }}
				requestClose={this.close}
				open={this.props.show}
				acceptAction={this.state.step === 1 ? this.secondStep : this.sendActDraft}
				hideAccept={(this.state.step === 2 && this.state.emailList.length < 1) || this.state.success}
				buttonAccept={this.state.step === 1 ? translate.continue : translate.send}
				cancelAction={this.state.step !== 1 ? () => this.setState({ step: 1, success: false }) : null}
				buttonCancel={this.state.step === 1 ? translate.close : translate.back}
				bodyText={this.modalBody()}
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
		});
	}

	mouseLeaveHandler = () => {
		this.setState({
			showActions: false
		});
	}

	render() {
		const { email, index, deleteEmailFromList } = this.props;
		return (
			< div
				onMouseOver={this.mouseEnterHandler}
				onMouseLeave={this.mouseLeaveHandler}
				className={'hoverEnTabla'}
				style={{ display: 'flex', padding: '15px', background: (index % 2) ? '' : '#f2f2f2' }}
			>
				<div style={{ width: '80%' }}>
					{email}
				</div>
				<div style={{ width: '20%', textAlign: 'center' }}>
					{this.state.showActions && (
						< FontAwesome
							name={'times'}
							style={{
								fontSize: '1.2em',
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
	graphql(councilParticipantsActSends, {
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
