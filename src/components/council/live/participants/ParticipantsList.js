import React from "react";
import { Grid } from "../../../../displayComponents";
import { LoadMoreButton, Scrollbar, LoadingSection, AlertConfirm } from "../../../../displayComponents";
import ParticipantItem from "./ParticipantItem";
import SignatureModal from "./modals/SignatureModal";
import LiveParticipantEditor from "./LiveParticipantEditor";
import { isMobile } from 'react-device-detect';

class ParticipantsList extends React.PureComponent {

	state = {
		showSignatureModal: false,
		participantToSign: null,
		editParticipant: null
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
			council,
			loadMore,
			loading,
			loadingMore,
			participants
		} = this.props;

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
												refetch={this.props.refetch}
												showSignatureModal={this.showSignatureModal(participant)}
												editParticipant={() => this.setState({
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
							{this.state.showSignatureModal &&
								<SignatureModal
									show={this.state.showSignatureModal}
									council={council}
									participant={this.state.participantToSign}
									refetch={this.props.refetch}
									requestClose={() => {
										this.setState({ showSignatureModal: false, participantToSign: null })}
									}
									translate={translate}
								/>
							}
							{this.state.editParticipant &&
								<AlertConfirm
									open={!!this.state.editParticipant}
									classNameDialog={isMobile? 'livePArticipants' : ""}
									bodyStyle={
										isMobile? { padding: '0.3em', maxWidth: "100%"} : { minWidth: "90vw",  overflowY: 'hidden' }
									}
									fullWidth={true}
									// fullScreen={true}
									requestClose={() => {
										this.setState({
											editParticipant: undefined
										});
										this.props.refetch();
									}}
									bodyText={
										<div style={{height: '70vh'}}>
											<LiveParticipantEditor
												translate={translate}
												council={council}
												refetch={this.props.refetch}
												id={this.state.editParticipant}

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
}

export default ParticipantsList;
