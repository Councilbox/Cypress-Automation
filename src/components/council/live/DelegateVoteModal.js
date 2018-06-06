import React, { Component } from "react";
import {
	AlertConfirm,
	Icon,
	LoadingSection,
	ParticipantRow,
	TextInput
} from "../../../displayComponents";
import { Typography } from "material-ui";
import { compose, graphql } from "react-apollo";
import { participantsWhoCanDelegate } from "../../../queries";
import { DELEGATION_USERS_LOAD } from "../../../constants";
import Scrollbar from "react-perfect-scrollbar";

class DelegateVoteModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			success: "",
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
	};
	loadMore = () => {
		this.props.data.fetchMore({
			variables: {
				options: {
					offset: this.props.data.liveParticipantsWhoCanDelegate.list
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
					liveParticipantsWhoCanDelegate: {
						...prev.liveParticipantsWhoCanDelegate,
						list: [
							...prev.liveParticipantsWhoCanDelegate.list,
							...fetchMoreResult.liveParticipantsWhoCanDelegate
								.list
						]
					}
				};
			}
		});
	};
	delegateVote = id => {
		this.props.delegateVote(4, 5, this.props.participant.id, id);
		this.close();
	};
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

	_modalBody() {
		const { translate } = this.props;
		const { loading } = this.props.data;

		const participants = loading
			? []
			: this.props.data.liveParticipantsWhoCanDelegate.list;
		const { total } = loading
			? 0
			: this.props.data.liveParticipantsWhoCanDelegate;
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
						<Scrollbar>
							{participants.length > 0 ? (
								<React.Fragment>
									{participants.map(participant => {
										if (
											participant.id !==
											this.props.participant.id
										) {
											return (
												<ParticipantRow
													key={`delegateParticipant_${
														participant.id
													}`}
													participant={participant}
													onClick={() =>
														this.delegateVote(
															participant.id
														)
													}
												/>
											);
										}
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
				bodyText={this._modalBody()}
				title={translate.to_delegate_vote}
			/>
		);
	}
}

export default compose(
	graphql(participantsWhoCanDelegate, {
		options: props => ({
			variables: {
				councilId: props.council.id,
				options: {
					limit: DELEGATION_USERS_LOAD,
					offset: 0
				}
			}
		})
	})
)(DelegateVoteModal);
