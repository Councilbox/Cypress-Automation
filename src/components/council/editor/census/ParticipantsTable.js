import React from "react";
import { TableCell, TableRow } from "material-ui/Table";

import { getPrimary } from "../../../../styles/colors";
import * as CBX from "../../../../utils/CBX";
import { CloseIcon, EnhancedTable } from "../../../../displayComponents";
import { compose, graphql } from "react-apollo";
import {
	councilParticipants,
	deleteParticipant
} from "../../../../queries/councilParticipant";
import { PARTICIPANTS_LIMITS } from "../../../../constants";
import ChangeCensusMenu from "./ChangeCensusMenu";
import CouncilParticipantEditor from "./modals/CouncilParticipantEditor";

class ParticipantsTable extends React.Component {
	state = {
		editingParticipant: false,
		participant: {}
	};


	closeParticipantEditor = () => {
		this.setState({ editingParticipant: false });
	};
	deleteParticipant = async id => {
		const response = await this.props.mutate({
			variables: {
				participantId: id
			}
		});

		if (response) {
			this.table.refresh();
		}
	};


	_renderDeleteIcon(participantID) {
		const primary = getPrimary();

		return (
			<CloseIcon
				style={{ color: primary }}
				onClick={event => {
					event.stopPropagation();
					this.deleteParticipant(participantID);
				}}
			/>
		);
	}

	componentDidMount() {
		this.props.data.refetch();
	}

	render() {
		const {
			translate,
			totalVotes,
			totalSocialCapital,
			participations,
			council
		} = this.props;
		const { editingParticipant, participant } = this.state;
		const { loading, councilParticipants, refetch } = this.props.data;
		let headers = [
			{
				text: translate.name,
				name: "fullName",
				canOrder: true
			},
			{
				text: translate.dni,
				name: "dni",
				canOrder: true
			},
			{
				text: translate.position,
				name: "position",
				canOrder: true
			},
			{
				text: translate.votes,
				name: "numParticipations",
				canOrder: true
			}
		];

		if (participations) {
			headers.push({
				text: translate.census_type_social_capital,
				name: "socialCapital",
				canOrder: true
			});
		}
		headers.push({ text: translate.delete });

		return (
			<div style={{ width: "100%" }}>
				<ChangeCensusMenu
					translate={translate}
					council={council}
					participations={participations}
					refetch={refetch}
					handleCensusChange={this.props.handleCensusChange}
					showAddModal={this.props.showAddModal}
					censuses={this.props.censuses}
					totalVotes={this.props.totalVotes}
					totalSocialCapital={this.props.totalSocialCapital}
				/>
				<CouncilParticipantEditor
					translate={translate}
					close={this.closeParticipantEditor}
					councilId={council.id}
					participations={participations}
					participant={participant}
					opened={editingParticipant}
					refetch={refetch}
				/>
				{!!councilParticipants && (
					<React.Fragment>
						<EnhancedTable
							ref={table => (this.table = table)}
							translate={translate}
							defaultLimit={PARTICIPANTS_LIMITS[0]}
							defaultFilter={"fullName"}
							defaultOrder={["fullName", "asc"]}
							limits={PARTICIPANTS_LIMITS}
							page={1}
							loading={loading}
							length={councilParticipants.list.length}
							total={councilParticipants.total}
							refetch={this.props.data.refetch}
							action={this._renderDeleteIcon}
							fields={[
								{
									value: "fullName",
									translation: translate.participant_data
								},
								{
									value: "dni",
									translation: translate.dni
								},
								{
									value: "position",
									translation: translate.position
								}
							]}
							headers={headers}
						>
							{councilParticipants.list.map(
								(participant, index) => {
									return (
										<React.Fragment
											key={`participant${participant.id}`}
										>
											<TableRow
												hover={true}
												onClick={() =>
													this.setState({
														editingParticipant: true,
														participant: participant
													})
												}
												style={{
													cursor: "pointer",
													fontSize: "0.5em"
												}}
											>
												<TableCell>
													{`${participant.name} ${
														participant.surname
													}`}
												</TableCell>
												<TableCell>
													{participant.dni}
												</TableCell>
												<TableCell>
													{participant.position}
												</TableCell>
												<TableCell>
													{!CBX.isRepresentative(
														participant
													) &&
														`${
															participant.numParticipations
														} (${(
															(participant.numParticipations /
																totalVotes) *
															100
														).toFixed(2)}%)`}
												</TableCell>
												{this.props.participations && (
													<TableCell>
														{!CBX.isRepresentative(
															participant
														) &&
															`${
																participant.socialCapital
															} (${(
																(participant.socialCapital /
																	totalSocialCapital) *
																100
															).toFixed(2)}%)`}
													</TableCell>
												)}
												<TableCell>
													{!CBX.isRepresentative(
														participant
													) &&
														this._renderDeleteIcon(
															participant.id
														)}
												</TableCell>
											</TableRow>

											{!!participant.representative && (
												<TableRow
													hover={true}
													style={{
														cursor: "pointer",
														backgroundColor:
															"WhiteSmoke"
													}}
													onClick={() =>
														this.setState({
															editParticipant: true,
															editIndex: index
														})
													}
												>
													<TableCell>
														<div
															style={{
																fontSize:
																	"0.9em",
																width: "100%"
															}}
														>
															{`${
																translate.represented_by
															}: ${
																participant
																	.representative
																	.name
															} ${
																participant
																	.representative
																	.surname
															}`}
														</div>
													</TableCell>
													<TableCell>
														<div
															style={{
																fontSize:
																	"0.9em",
																width: "100%"
															}}
														>
															{
																participant
																	.representative
																	.dni
															}
														</div>
													</TableCell>
													<TableCell>
														<div
															style={{
																fontSize:
																	"0.9em",
																width: "100%"
															}}
														>
															{
																participant
																	.representative
																	.position
															}
														</div>
													</TableCell>
													{participations && (
														<TableCell />
													)}
													<TableCell />
													<TableCell />
												</TableRow>
											)}
										</React.Fragment>
									);
								}
							)}
						</EnhancedTable>
					</React.Fragment>
				)}
				{this.props.children}
			</div>
		);
	}
}

export default compose(
	graphql(deleteParticipant),
	graphql(councilParticipants, {
		options: props => ({
			variables: {
				councilId: props.council.id,
				options: {
					limit: PARTICIPANTS_LIMITS[0],
					offset: 0,
					orderBy: 'fullName',
					orderDirection: 'asc'
				}
			},
			forceFetch: true,
			notifyOnNetworkStatusChange: true
		})
	})
)(ParticipantsTable);
