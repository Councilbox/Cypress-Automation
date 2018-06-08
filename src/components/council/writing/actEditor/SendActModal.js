import React, { Component } from "react";
import {
	AlertConfirm,
	Icon,
	LoadingSection,
	ParticipantRow,
	TextInput,
	SuccessMessage
} from "../../../../displayComponents";
import { Typography, Card } from "material-ui";
import { compose, graphql } from "react-apollo";
import { councilParticipantsActSends } from "../../../../queries";
import { DELEGATION_USERS_LOAD } from "../../../../constants";
import Scrollbar from "react-perfect-scrollbar";
import { checkValidEmail } from '../../../../utils/validation';
import FontAwesome from 'react-fontawesome';
import { sendAct } from '../../../../queries';


class SendActModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			checked: [],
			newEmail: '',
			step: 1,
			success: false,
			emailList: [],
			loading: false,
			errors: {}
		};
	}

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
		if(check){
			checked = [...checked, email];
		}else{
			const index = checked.findIndex(item => item === email);
			checked.splice(index, 1);
			console.log(checked);
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
		const response = await this.props.data.refetch({
			filters: [
				{
					field: "fullName",
					text: text
				}
			]
		});
	};

	addEmail = () => {
		if(checkValidEmail(this.state.newEmail)){
			if(this.state.emailList.findIndex(item => item === this.state.newEmail) === -1){
				this.setState({
					emailList: [...this.state.emailList, this.state.newEmail],
					newEmail: ''
				});
			}else{
				this.setState({
					errors: {
						newEmail: this.props.translate.repeated_email
					}
				});
			}
		}else{
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
			emailList: [...list],
			checked: [...checked]
		});
	}

	_renderEmails = () => {
		return(
			<div style={{width: '100%'}}>
				{this.state.emailList.length > 0?
					this.state.emailList.map((email, index) => (
						<Card
							style={{
								width: '98%',
								padding: '0.8em',
								margin: 'auto',
								marginBottom: '0.8em',
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								flexDirection: 'row'
							}}
							key={`emailList_${email}`}
							elevation={2}
						>
							{email}
							<FontAwesome
								name={"times"}
								style={{
									fontSize: "0.9em",
									color: 'red',
									cursor: 'pointer'
								}}
								onClick={() => this.deleteEmailFromList(email)}
							/>
						</Card>
					))
				:
					<div>
						{this.props.translate.not_added}
					</div>
				}
			</div>
	
		)
	}


	sendAct = async () => {
		const response = await this.props.sendAct({
			variables: {
				councilId: this.props.council.id,
				emailList: this.state.emailList
			}
		});

		if(response){
			if(!response.data.errors){
				this.setState({
					success: true
				});

			}
			this.props.refetch();
			this.props.data.refetch();
		}
	}

	secondStep = () => {
		const filteredEmails = this.state.checked.filter(item => {
			const index = this.state.emailList.findIndex(email => email === item);
			if(index){
				return item;
			}
		});
		const emails = [...this.state.emailList, ...filteredEmails];
		this.setState({
			emailList: emails,
			step: 2
		});
	}

	_modalBody() {
		const { translate } = this.props;
		const { loading } = this.props.data;

		const participants = loading
			? []
			: this.props.data.councilParticipantsActSends.list;
		const { total } = loading
			? 0
			: this.props.data.councilParticipantsActSends;
		const rest = total - participants.length - 1;

		if(this.state.step === 1){
			return (
				<div style={{ width: "600px" }}>
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
							<Scrollbar>
								{participants.length > 0 ? (
									<div style={{marginTop: '1.2em'}}>
										{participants.map(participant => {
											return (
												<div style={{display: 'flex', flexDirection: 'row'}} key={`participant_${participant.id}`}>
													<ParticipantRow
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

		if(this.state.success){
			return(
				<SuccessMessage />
			)
		}

		return(
			<div style={{ width: "600px" }}>
				{this._renderEmails()}
			</div>
		)

		
	}

	render() {
		const { translate } = this.props;

		return (
			<AlertConfirm
				requestClose={this.close}
				open={this.props.show}
				acceptAction={this.state.step === 1? this.secondStep : this.sendAct}
				hideAccept={this.state.success || this.state.step === 2 && this.state.emailList.length < 1}
				buttonAccept={this.state.step === 1? translate.continue : translate.send}
				cancelAction={this.state.success?
					this.close
				:
					this.state.step !== 1?
							() => this.setState({step: 1, success: false})
						:
							null
				}
				buttonCancel={this.state.success? 
					translate.close
				:
					this.state.step === 1? translate.close : translate.back}
				bodyText={this._modalBody()}
				title={translate.sending_the_minutes}
			/>
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

	graphql(sendAct, {
		name: 'sendAct'
	})
)(SendActModal);
