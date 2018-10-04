import React from "react";
import { Grid } from "../../../../displayComponents";
import { LoadMoreButton, Scrollbar, LoadingSection } from "../../../../displayComponents";
import ParticipantItem from "./ParticipantItem";
import SignatureModal from "./modals/SignatureModal";
import AttendComment from "../../prepare/modals/AttendComment";

class ParticipantsList extends React.PureComponent {

	state = {
		showSignatureModal: false,
		participantToSign: null,
	}

	showSignatureModal = participant => () => {
		this.setState({
			showSignatureModal: true,
			participantToSign: participant
		})
	}


	render() {
		const {
			mode,
			translate,
			layout,
			editParticipant,
			council,
			loadMore,
			loading,
			loadingMore,
			participants
		} = this.props;

		console.log(this.state);

		return (
			<React.Fragment>
				{loading ?
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
							<Grid spacing={0} style={{paddingBottom: '6em', padding: '1em'}}>
								{participants.list.map(
									participant =>
										<React.Fragment key={`participant_${participant.id}`}>
											<ParticipantItem
												layout={layout}
												key={`participant_${participant.id}`}
												participant={participant}
												translate={translate}
												mode={mode}
												showSignatureModal={this.showSignatureModal(participant)}
												editParticipant={editParticipant}
												council={council}
											/>
											{/* <ParticipantItem
												layout={layout}
												key={`participant_${
													participant.id
													}`}
												participant={participant}
												translate={translate}
												showSignatureModal={this.showSignatureModal(participant)}
												mode={mode}
												editParticipant={editParticipant}
												council={council}
											/>
											<ParticipantItem
												layout={layout}
												key={`participant_${
													participant.id
													}`}
												participant={participant}
												showSignatureModal={this.showSignatureModal(participant)}
												translate={translate}
												mode={mode}
												editParticipant={editParticipant}
												council={council}
											/>
											<ParticipantItem
												layout={layout}
												key={`participant_${
													participant.id
													}`}
												participant={participant}
												translate={translate}
												showSignatureModal={this.showSignatureModal(participant)}
												mode={mode}
												editParticipant={editParticipant}
												council={council}
											/>
											<ParticipantItem
												layout={layout}
												key={`participant_${
													participant.id
													}`}
												participant={participant}
												showSignatureModal={this.showSignatureModal(participant)}
												translate={translate}
												mode={mode}
												editParticipant={editParticipant}
												council={council}
											/>
											<ParticipantItem
												layout={layout}
												key={`participant_${
													participant.id
													}`}
												participant={participant}
												showSignatureModal={this.showSignatureModal(participant)}
												translate={translate}
												mode={mode}
												editParticipant={editParticipant}
												council={council}
											/>
											<ParticipantItem
												layout={layout}
												key={`participant_${
													participant.id
													}`}
												participant={participant}
												translate={translate}
												mode={mode}
												showSignatureModal={this.showSignatureModal(participant)}
												editParticipant={editParticipant}
												council={council}
											/>
											<ParticipantItem
												layout={layout}
												key={`participant_${
													participant.id
													}`}
												participant={participant}
												translate={translate}
												mode={mode}
												showSignatureModal={this.showSignatureModal(participant)}
												editParticipant={editParticipant}
												council={council}
											/>
											<ParticipantItem
												layout={layout}
												key={`participant_${
													participant.id
													}`}
												participant={participant}
												translate={translate}
												showSignatureModal={this.showSignatureModal(participant)}
												mode={mode}
												editParticipant={editParticipant}
												council={council}
											/>
											<ParticipantItem
												layout={layout}
												key={`participant_${
													participant.id
													}`}
												participant={participant}
												translate={translate}
												mode={mode}
												showSignatureModal={this.showSignatureModal(participant)}
												editParticipant={editParticipant}
												council={council}
											/> */}
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
							{this.state.showSignatureModal &&
								<SignatureModal
									show={this.state.showSignatureModal}
									council={council}
									participant={this.state.participantToSign}
									refetch={this.props.refetch}
									requestClose={() => this.setState({ showSignatureModal: false, participantToSign: null })}
									translate={translate}
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
}

export default ParticipantsList;
