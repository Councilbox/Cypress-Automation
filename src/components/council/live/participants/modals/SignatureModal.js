import React, { Fragment } from "react";
import { compose, graphql } from "react-apollo";
import { liveParticipantSignature, setLiveParticipantSignature } from "../../../../../queries/liveParticipant";
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
import gql from "graphql-tag";
import { useOldState } from "../../../../../hooks";
import { isMobile } from "../../../../../utils/screen";

const SignatureModal = ({ data, translate, council, participant, ...props }) => {
	const [state, setState] = useOldState({
		success: "",
		errors: {},
		liveParticipantSignature: {},
		participant: {},
		clean: true,
		participantState: PARTICIPANT_STATES.PHYSICALLY_PRESENT
	});
	const [saving, setSaving] = React.useState(false);

	const signature = React.useRef(null);
	const primary = getPrimary();

	const close = () => {
		props.requestClose();
	};

	React.useLayoutEffect(() => {
		if (signature.current && !data.loading) {
			setSignature();
		}
	}, [data.loading]);


	const save = async () => {
		if(saving){
			return;
		}

		setSaving(true);
		let signatureData = signature.current.toDataURL();
		let response;

		if (state.clean) {
			response = await props.removeLiveParticipantSignature({
				variables: {
					participantId: participant.id
				}
			});
		} else {
			response = await props.setLiveParticipantSignature({
				variables: {
					signature: {
						...(data.liveParticipantSignature ? { id: data.liveParticipantSignature.id } : {}),
						data: signatureData,
						participantId: participant.id
					},
					state: state.participantState
				}
			});
		}

		if (!response.errors) {
			setSaving(false);
			await data.refetch();
			await props.refetch();
			close();
		}
	};

	const clear = () => {
		setState({
			clean: true
		});
		signature.current.clear();
	};

	const setSignature = () => {
		if (data.liveParticipantSignature && data.liveParticipantSignature.data) {
			signature.current.fromDataURL(data.liveParticipantSignature.data);
			setState({ clean: false });
		}
	};

	const { participantState } = state;

	const _canBePresentWithRemoteVote = canBePresentWithRemoteVote(
		council.statute
	);

	const maxWidth = 600;
	const minWidth = window.innerWidth * 0.7;
	let width = minWidth;

	if (minWidth > maxWidth) {
		width = maxWidth;
	}

	const height = width * 0.41;

	return (
		<Fragment>
			<CustomDialog
				title={translate.to_sign_and_confirm}
				requestClose={close}
				open={props.show}
				onEntered={setSignature}
				disableBackdropClick
				dialogActionsStyles={{ padding: "0px", marginRight: isMobile ? "" : "1em" }}
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
							onClick={clear}
						/>
						<BasicButton
							text={translate.cancel}
							type="flat"
							color="transparent"
							// buttonStyle={{marginLeft: '0.6em'}}
							textStyle={{
								textTransform: "none",
								fontWeight: "700"
							}}
							onClick={close}
						/>
						<BasicButton
							loading={saving}
							text={translate.save_changes}
							textStyle={{
								color: "white",
								textTransform: "none",
								fontWeight: "700"
							}}
							// buttonStyle={{ marginLeft: "1em" }}
							color={primary}
							onClick={save}
						/>
					</Fragment>
				}
			>
				<div> {/**style={{ width: `calc(${width}px +  2em)`}} */}
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
						<div
							style={{
								width: '100%',
								textAlign: "left"
							}}
						>
							<ParticipantDisplay
								participant={participant}
								translate={translate}
								delegate={true}
								council={council}
							/>
						</div>
						{_canBePresentWithRemoteVote ? (
							<div>
								<Checkbox
									label={translate.has_remote_vote}
									value={
										participantState ===
										PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE
									}
									onChange={(event, isInputChecked) =>
										setState({
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
						<div
							style={{ width: 'calc(100% - 2em)', display: 'flex', justifyContent: 'center' }}
							onMouseDown={() => setState({ clean: false })}
							onTouchStart={() => setState({ clean: false })}
						>
							<ReactSignature
								height={height}
								width={width}
								dotSize={1}
								onEnd={() => setState({ clean: false })}
								style={{ border: "solid 1px" }}
								ref={signature}
							/>
						</div>
					</div>
				</div>
			</CustomDialog>
		</Fragment>
	);

}

export const removeLiveParticipantSignature = gql`
	mutation RemoveLiveParticipantSignature($participantId: Int!){
		removeLiveParticipantSignature(participantId: $participantId){
			success
			message
		}
	}
`;

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
	}),

	graphql(removeLiveParticipantSignature, {
		name: 'removeLiveParticipantSignature',
		options: {
			errorPolicy: "all"
		}
	})
)(SignatureModal);
