import React, { Component, Fragment } from "react";
import { compose, graphql } from "react-apollo";
import {
	liveParticipantSignature,
	setLiveParticipantSignature
} from "../../../../../queries/liveParticipant";
import {
	CustomDialog,
	BasicButton,
	ReactSignature,
	ParticipantDisplay,
	Checkbox
} from "../../../../../displayComponents";
import { getPrimary } from "../../../../../styles/colors";
import { canBePresentWithRemoteVote } from "../../../../../utils/CBX";
import { PARTICIPANT_STATES } from "../../../../../constants";

class SignatureModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			success: "",
			loading: false,
			errors: {},
			liveParticipantSignature: {},
			participant: {},
			participantState: PARTICIPANT_STATES.PHYSICALLY_PRESENT
		};
		this.signature = null;
	}

	close = () => {
		this.setState({ modal: false });
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		if (!nextProps.data.loading) {
			if (nextProps.data.liveParticipantSignature) {
				return {
					liveParticipantSignature:
						nextProps.data.liveParticipantSignature
				};
			}
		}
		return {
			liveParticipantSignature: {
				participantId: nextProps.participant.id
			}
		};
	}

	save = async () => {
		let signatureData = this.signature.toDataURL();
		let {
			__typename,
			...liveParticipantSignature
		} = this.state.liveParticipantSignature;
		liveParticipantSignature.data = signatureData;

		const response = await this.props.setLiveParticipantSignature({
			variables: {
				signature: liveParticipantSignature,
				state: this.state.participantState
			}
		});
		if (!response.errors) {
			this.props.data.refetch();
			this.close();
		}
	};

	openModal = () => {
		this.setState({ modal: true });
	};

	clear = () => {
		this.signature.clear();
	};

	setSignature = () => {
		let data = this.props.data;
		if (
			data.liveParticipantSignature &&
			data.liveParticipantSignature.data
		) {
			this.signature.fromDataURL(data.liveParticipantSignature.data);
		}
	};

	render() {
		const { translate, council, participant } = this.props;
		const { participantState } = this.state;
		const primary = getPrimary();
		const _canBePresentWithRemoteVote = canBePresentWithRemoteVote(
			council.statute
		);

		return (
			<Fragment>
				<button onClick={this.openModal}> ABRIR FIRMA</button>
				<CustomDialog
					title={translate.to_sign_and_confirm}
					requestClose={this.close}
					open={this.state.modal}
					onEntered={this.setSignature}
					disableBackdropClick
					actions={
						<Fragment>
							<BasicButton
								text={translate.clean}
								textStyle={{
									textTransform: "none",
									fontWeight: "700"
								}}
								onClick={this.clear}
							/>
							<BasicButton
								text={translate.cancel}
								textStyle={{
									textTransform: "none",
									fontWeight: "700"
								}}
								onClick={this.close}
							/>
							<BasicButton
								text={translate.save_changes}
								textStyle={{
									color: "white",
									textTransform: "none",
									fontWeight: "700"
								}}
								buttonStyle={{ marginLeft: "1em" }}
								color={primary}
								onClick={() => {
									this.save();
								}}
							/>
						</Fragment>
					}
				>
					<div style={{ width: "600px" }}>
						<div
							style={{
								height: "400px",
								overflow: "hidden",
								position: "relative"
							}}
						>
							<ParticipantDisplay
								participant={participant}
								translate={translate}
								delegate={false}
								council={council}
							/>
							{_canBePresentWithRemoteVote ? (
								<div>
									<Checkbox
										label={translate.has_remote_vote}
										value={
											participantState ===
											PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
										}
										onChange={(event, isInputChecked) =>
											this.setState({
												participantState: isInputChecked
													? PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
													: PARTICIPANT_STATES.PHYSICALLY_PRESENT
											})
										}
									/>
								</div>
							) : (
								<br />
							)}
							<div style={{ width: "50vw", minWidth: "600px" }}>
								<ReactSignature
									height={248}
									width={596}
									style={{ border: "solid 1px" }}
									ref={ref => (this.signature = ref)}
								/>
							</div>
						</div>
					</div>
				</CustomDialog>
			</Fragment>
		);
	}
}

export default compose(
	graphql(liveParticipantSignature, {
		options: props => ({
			variables: {
				participantId: props.participant.id
			},
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(setLiveParticipantSignature, {
		name: "setLiveParticipantSignature",
		options: {
			errorPolicy: "all"
		}
	})
)(SignatureModal);
