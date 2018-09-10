import React from "react";
import { Grid } from "../../../../displayComponents";
import { LoadMoreButton, Scrollbar, LoadingSection } from "../../../../displayComponents";
import ParticipantItem from "./ParticipantItem";

class ParticipantsList extends React.PureComponent {
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
							<Grid spacing={0}>
								{participants.list.map(
									participant =>
										<ParticipantItem
											layout={layout}
											key={`participant_${
												participant.id
												}`}
											participant={participant}
											translate={translate}
											mode={mode}
											editParticipant={editParticipant}
											council={council}
										/>
								)}
								{participants.list.length <
									participants.total && (
										<LoadMoreButton
											onClick={loadMore}
											loading={loadingMore}
										/>
									)}
							</Grid>
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
