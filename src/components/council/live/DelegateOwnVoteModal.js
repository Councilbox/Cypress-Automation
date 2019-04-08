import React from "react";
import {
	AlertConfirm,
	Icon,
	LoadingSection,
	ParticipantRow,
	TextInput,
	LiveToast
} from "../../../displayComponents";
import { Typography } from "material-ui";
import { compose, graphql } from "react-apollo";
import { participantsToDelegate } from "../../../queries";
import { DELEGATION_USERS_LOAD } from "../../../constants";
import Scrollbar from "react-perfect-scrollbar";
import { addDelegation } from "../../../queries/liveParticipant";
import { toast } from "react-toastify";

class DelegateOwnVoteModal extends React.Component {
	state = {
		success: "",
		errors: {}
	};

	componentDidUpdate(prevProps) {
		if (!prevProps.show && this.props.show) {
			this.props.data.refetch();
		}
	}

	loadMore = () => {
		this.props.data.fetchMore({
			variables: {
				options: {
					offset: this.props.data.liveParticipantsToDelegate.list
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
					liveParticipantsToDelegate: {
						...prev.liveParticipantsToDelegate,
						list: [
							...prev.liveParticipantsToDelegate.list,
							...fetchMoreResult.liveParticipantsToDelegate.list
						]
					}
				};
			}
		});
	};

	close = () => {
		this.props.requestClose();
	};

	delegateVote = async id => {
		//For attendance
		if (this.props.addRepresentative) {
			this.props.addRepresentative(id);
		} else {
			let response = await this.props.delegateVote(
				{
					variables: {
						participantId: this.props.participant.id,
						delegateId: id
					}
				}
			);
			if (!response.errors) {
				this.props.refetch();
				this.close();
			} else if (response.errors[0].code === 710) {
				toast(
					<LiveToast
						message={this.props.translate.just_delegate_vote}
					/>, {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: true,
						className: "errorToast"
					}
				)
			} else if (response.errors[0].code === 711) {
				toast(
					<LiveToast
						message={this.props.translate.number_of_delegated_votes_exceeded}
					/>, {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: true,
						className: "errorToast"
					}
				)
			} else if (response.errors[0].code === 715) {
				toast(
					<LiveToast
						message={this.props.translate.cant_delegate_has_delegated_votes}
					/>, {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: true,
						className: "errorToast"
					}
				)
			}
		}
	};

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

	_renderBody() {
		const { translate } = this.props;
		const { loading } = this.props.data;

		const participants = loading
			? []
			: this.props.data.liveParticipantsToDelegate.list;
		const { total } = loading
			? 0
			: this.props.data.liveParticipantsToDelegate;
		const rest = total - participants.length - 1;

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
							<Scrollbar option={{ suppressScrollX: true }}>
								{participants.length > 0 ? (
									<React.Fragment>
										{participants.map(participant => {
											if (
												participant.id !==
												this.props.participant.id
											) {
												return (
													<ParticipantRow
														key={`delegateVote_${
															participant.id
															}`}
														council={this.props.council}
														toDelegate={true}
														participant={participant}
														onClick={() =>
															this.delegateVote(
																participant.id
															)
														}
													/>
												);
											}
											return false;
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
									</React.Fragment>
								) : (
										<Typography>{translate.no_results}</Typography>
									)}
							</Scrollbar>
						)}
				</div>
			</div>
		);
	}

	render() {
		const { translate } = this.props;

		return (
			<AlertConfirm
				requestClose={this.close}
				open={this.props.show}
				acceptAction={this.delegateVote}
				buttonAccept={translate.send}
				buttonCancel={translate.close}
				bodyText={this._renderBody()}
				title={translate.to_delegate_vote}
			/>
		);
	}
}

export default compose(
	graphql(participantsToDelegate, {
		options: props => ({
			variables: {
				councilId: props.council.id,
				participantId: props.participant.id
			}
		})
	}),
	graphql(addDelegation, {
		name: "delegateVote"
	})
)(DelegateOwnVoteModal);
