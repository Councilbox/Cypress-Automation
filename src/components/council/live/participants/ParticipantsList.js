import React from "react";
import { Grid } from "../../../../displayComponents";
import { LoadMoreButton, Scrollbar, LoadingSection, AlertConfirm } from "../../../../displayComponents";
import ParticipantItem from "./ParticipantItem";
import SignatureModal from "./modals/SignatureModal";
import LiveParticipantEditor from "./LiveParticipantEditor";
import { isMobile } from 'react-device-detect';
import { useOldState } from "../../../../hooks";
import { PARTICIPANT_STATES } from "../../../../constants";
import { getMainRepresentative } from "../../../../utils/CBX";

const ParticipantsList = ({ mode, translate, layout, council, refetch, loadMore, loading, loadingMore, participants }) => {
	const [state, setState] = useOldState({
		showSignatureModal: false,
		participantToSign: null,
		editParticipant: null
	});

	const showSignatureModal = participant => () => {
		setState({
			showSignatureModal: true,
			participantToSign: getSignatureParticipant(participant)
		});
	}

	const getSignatureParticipant = participant => {
		if (participant.state === PARTICIPANT_STATES.REPRESENTATED) {
			return getMainRepresentative(participant);
		}
		return participant;
	}

	return (
		<React.Fragment>
			{loading && false ?
				<div
					style={{
						marginTop: "5em",
						width: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center"
					}}
				>
					<LoadingSection />
				</div>

				:
				participants.list.length > 0 ? (
					<Scrollbar>
						<Grid spacing={0} style={{ paddingBottom: '6em', padding: '1em' }}>
							{participants.list.map(
								participant =>
									<React.Fragment key={`participant_${participant.id}`}>
										<ParticipantItem
											layout={layout}
											key={`participant_${participant.id}`}
											participant={participant}
											translate={translate}
											mode={mode}
											refetch={refetch}
											showSignatureModal={showSignatureModal(participant)}
											editParticipant={() => setState({
												editParticipant: participant.id
											})}
											council={council}
										/>
									</React.Fragment>
							)}
							{participants.list.length <
								participants.total && (
									<LoadMoreButton
										onClick={loadMore}
										loading={loadingMore}
									/>
								)}
						</Grid>
						{state.showSignatureModal &&
							<SignatureModal
								show={state.showSignatureModal}
								council={council}
								participant={state.participantToSign}
								refetch={refetch}
								requestClose={() => {
									setState({ showSignatureModal: false, participantToSign: null })
								}
								}
								translate={translate}
							/>
						}
						{state.editParticipant &&
							<AlertConfirm
								open={!!state.editParticipant}
								// classNameDialog={isMobile? 'livePArticipants' : ""}
								bodyStyle={
									isMobile ? { padding: '0.3em', } : { overflowY: 'hidden' }
								}
								bodyStyle={{ minWidth: "70vw" }}
								// fullScreen={true}
								requestClose={() => {
									setState({
										editParticipant: undefined
									});
									refetch();
								}}
								bodyText={
									<div style={{ height: "40vh" }}>
										<LiveParticipantEditor
											translate={translate}
											council={council}
											refetch={refetch}
											id={state.editParticipant}

										/>
									</div>
								}

							/>
						}
					</Scrollbar>
				)
					:
					(
						<div style={{ marginLeft: "2em" }}>
							{translate.no_results}
						</div>
					)
			}
		</React.Fragment>
	);
}


export default ParticipantsList;
