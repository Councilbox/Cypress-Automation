import React, { Component, Fragment } from "react";
import { compose, graphql } from "react-apollo";
import { liveParticipantSignature, setLiveParticipantSignature } from "../../../../../queries/liveParticipant";
import { CustomDialog, BasicButton, LoadingSection, ReactSignature } from "../../../../../displayComponents";
import { getPrimary } from "../../../../../styles/colors";


class SignatureModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			success: "",
			loading: false,
			errors: {},
			liveParticipantSignature: {},
			participant: {}
		};
		this.signature = null;
	}

	close = () => {
		this.setState({ modal: false })
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		if (!nextProps.data.loading) {
			if (nextProps.data.liveParticipantSignature) {
				return {
					liveParticipantSignature: nextProps.data.liveParticipantSignature
				};
			}
		}
		return { liveParticipantSignature: { participantId: nextProps.participant.id } };
	}


	save = async () => {
		let signatureData = this.signature.toDataURL();
		let { __typename, ...liveParticipantSignature } = this.state.liveParticipantSignature;
		liveParticipantSignature.data = signatureData;

		const response = await this.props.setLiveParticipantSignature({
			variables: {
				signature: liveParticipantSignature
			}
		});
		if (!response.errors) {
			this.props.data.refetch();
			this.close();
		}
	}

	openModal = () => {
		this.setState({ modal: true })
	}

	setSignature = () => {
		let data = this.props.data;
		if (data.liveParticipantSignature && data.liveParticipantSignature.data) {
			this.signature.fromDataURL(data.liveParticipantSignature.data)
		}
	}

	render() {
		const { translate, council } = this.props;
		const { participant } = this.state;
		const { loading } = this.props.data;
		const primary = getPrimary()

		return (
			<Fragment>
				<button onClick={this.openModal}> ABRIR FIRMA</button>
				<CustomDialog
					title={translate.add_participant}
					requestClose={this.close}
					open={this.state.modal}
					onEntered={this.setSignature}
					actions={
						<Fragment>
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
					}>
					<div style={{ width: "600px" }}>
						<div
							style={{
								height: "300px",
								overflow: "hidden",
								position: "relative"
							}}
						>
							<div style={{ width: '50vw', minWidth: '600px' }}>
								<ReactSignature height={298} width={598} style={{ border: 'solid 1px' }} ref={ref => this.signature = ref} />
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
				participantId: props.participant.id,
			},
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(setLiveParticipantSignature, {
		name: 'setLiveParticipantSignature',
		options: {
			errorPolicy: "all"
		}
	}),
)(SignatureModal);
