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
	Checkbox,
} from "../../../../../displayComponents";
import { getPrimary } from "../../../../../styles/colors";
import { canBePresentWithRemoteVote } from "../../../../../utils/CBX";
import { PARTICIPANT_STATES } from "../../../../../constants";

class SignatureModal extends Component {
	state = {
		success: "",
		loading: false,
		errors: {},
		liveParticipantSignature: {},
		participant: {},
		participantState: PARTICIPANT_STATES.PHYSICALLY_PRESENT
	};

	signature = null;

	close = () => {
		this.props.requestClose();
	};


	componentDidUpdate(prevProps) {
		if(!this.props.data.loading){
			this.setSignature();
		}
	}

	save = async () => {
		let signatureData = this.signature.toDataURL();
		const response = await this.props.setLiveParticipantSignature({
			variables: {
				signature: {
					...(this.props.data.liveParticipantSignature? { id: this.props.data.liveParticipantSignature.id } : {}),
					data: signatureData,
					participantId: this.props.participant.id
				},
				state: this.state.participantState
			}
		});
		if (!response.errors) {
			this.props.data.refetch();
			this.props.refetch();
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
		if (data.liveParticipantSignature && data.liveParticipantSignature.data) {
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

		const maxWidth = 600;
		const minWidth = window.innerWidth * 0.7;
		let width = minWidth;

		if(minWidth > maxWidth){
			width = maxWidth;
		}

		const height = width * 0.41;

		return (
			<Fragment>
				<CustomDialog
					title={translate.to_sign_and_confirm}
					requestClose={this.close}
					open={this.props.show}
					onEntered={this.setSignature}
					disableBackdropClick
					actions={
						<Fragment>
							<BasicButton
								text={translate.clean}
								type="flat"
								color="transparent"
								textStyle={{
									textTransform: "none",
									fontWeight: "700"
								}}
								onClick={this.clear}
							/>
							<BasicButton
								text={translate.cancel}
								type="flat"
								color="transparent"
								buttonStyle={{marginLeft: '0.6em'}}
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
					<div style={{ width: `calc(${width}px +  2em)`}}>
						<div
							style={{
								height: "400px",
								width: '100%',
								display: 'flex',
								alignItems: 'center',
								flexDirection: 'column',
								position: "relative"
							}}
						>
							<ParticipantDisplay
								participant={participant}
								translate={translate}
								delegate={true}
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
							<div style={{ width: 'calc(100% - 2em)', display: 'flex', justifyContent: 'center' }}>
								<ReactSignature
									height={height}
									width={width}
									dotSize={1}
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
			notifyOnNetworkStatusChange: true,
			fetchPolicy: 'network-only'
		})
	}),
	graphql(setLiveParticipantSignature, {
		name: "setLiveParticipantSignature",
		options: {
			errorPolicy: "all"
		}
	})
)(SignatureModal);
