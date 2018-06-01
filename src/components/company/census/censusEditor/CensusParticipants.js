import React, { Component, Fragment } from "react";
import { getPrimary } from "../../../../styles/colors";
import { TableCell, TableRow } from "material-ui";
import {
	CloseIcon,
	EnhancedTable,
	Grid,
	GridItem
} from "../../../../displayComponents";
import { compose, graphql } from "react-apollo";
import { censusParticipants } from "../../../../queries/census";
import gql from "graphql-tag";
import AddCensusParticipantButton from "./modals/AddCensusParticipantButton";
import { PARTICIPANTS_LIMITS } from "../../../../constants";
import CensusParticipantEditor from "./modals/CensusParticipantEditor";

class CensusParticipants extends Component {
	closeParticipantEditor = () => {
		this.setState({ editingParticipant: false });
	};
	editParticipant = participant => {
		this.setState({
			editingParticipant: true,
			participant
		});
	};
	deleteParticipant = async id => {
		const response = await this.props.deleteCensusParticipant({
			variables: {
				participantId: id,
				censusId: this.props.census.id
			}
		});

		if (response) {
			this.props.data.refetch();
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			editingParticipant: false,
			participant: {}
		};
	}

	_renderDeleteIcon(participantID) {
		const primary = getPrimary();

		return (
			<CloseIcon
				style={{ color: primary }}
				onClick={() => this.deleteParticipant(participantID)}
			/>
		);
	}

	render() {
		const { translate, census } = this.props;
		const { loading, censusParticipants } = this.props.data;

		const headers = [
			{
				name: "name",
				text: translate.participant_data,
				canOrder: true
			},
			{
				name: "dni",
				text: translate.dni,
				canOrder: true
			},
			{
				name: "position",
				text: translate.position,
				canOrder: true
			},
			{
				name: "numParticipations",
				text: translate.votes,
				canOrder: true
			}
		];
		if (census.quorumPrototype === 1) {
			headers.push({
				text: translate.social_capital,
				name: "socialCapital",
				canOrder: true
			});
		}

		headers.push({
			text: translate.delete,
			canOrder: false
		});

		return (
			<Fragment>
				<Grid>
					<GridItem xs={12} md={3} lg={3}>
						<AddCensusParticipantButton
							translate={translate}
							company={this.props.company}
							census={this.props.census}
							refetch={this.props.data.refetch}
						/>
					</GridItem>
				</Grid>
				{!!censusParticipants && (
					<EnhancedTable
						headers={headers}
						translate={translate}
						defaultFilter={"fullName"}
						defaultLimit={PARTICIPANTS_LIMITS[0]}
						limits={PARTICIPANTS_LIMITS}
						page={1}
						loading={loading}
						length={censusParticipants.list.length}
						total={censusParticipants.total}
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
						refetch={this.props.data.refetch}
						action={this._renderDeleteIcon}
					>
						{censusParticipants.list.map(participant => {
							return (
								<Fragment>
									<TableRow
										onClick={() =>
											this.editParticipant(participant)
										}
										style={{ cursor: "pointer" }}
										key={`censusParticipant_${
											participant.id
										}`}
									>
										<TableCell>
											{`${participant.name} ${
												participant.surname
											}`}
										</TableCell>
										<TableCell>{participant.dni}</TableCell>
										{/*<TableCell>{participant.email}</TableCell>*/}
										{/*<TableCell>{participant.phone}</TableCell>*/}
										<TableCell>
											{participant.position}
										</TableCell>
										<TableCell>
											{participant.numParticipations}
										</TableCell>
										{census.quorumPrototype === 1 && (
											<TableCell>
												{participant.socialCapital}
											</TableCell>
										)}
										<TableCell>
											{this._renderDeleteIcon(
												participant.id
											)}
										</TableCell>
									</TableRow>
									{!!participant.representative && (
										<TableRow
											hover={true}
											style={{
												cursor: "pointer",
												backgroundColor: "WhiteSmoke"
											}}
											// onClick={() => this.setState({editParticipant: true, editIndex: index})}
										>
											<TableCell>
												<div
													style={{
														fontSize: "0.9em",
														width: "100%"
													}}
												>
													{`${
														translate.represented_by
													}: ${
														participant
															.representative.name
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
														fontSize: "0.9em",
														width: "100%"
													}}
												>
													{
														participant
															.representative.dni
													}
												</div>
											</TableCell>
											{/*<TableCell>*/}
											{/*<div style={{fontSize: '0.9em', width: '100%'}}>*/}
											{/*{participant.representative.email}*/}
											{/*</div>*/}
											{/*</TableCell>*/}
											{/*<TableCell>*/}
											{/*<div style={{fontSize: '0.9em', width: '100%'}}>*/}
											{/*{participant.representative.phone}*/}
											{/*</div>*/}
											{/*</TableCell>*/}
											<TableCell>
												<div
													style={{
														fontSize: "0.9em",
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
											<TableCell />
											<TableCell />
											{census.quorumPrototype === 1 && (
												<TableCell />
											)}
										</TableRow>
									)}
								</Fragment>
							);
						})}
					</EnhancedTable>
				)}
				<CensusParticipantEditor
					translate={translate}
					close={this.closeParticipantEditor}
					company={this.props.company}
					census={this.props.census}
					participant={this.state.participant}
					opened={this.state.editingParticipant}
					refetch={this.props.data.refetch}
				/>
			</Fragment>
		);
	}
}

const deleteCensusParticipant = gql`
	mutation DeleteParticipant($participantId: Int!, $censusId: Int!) {
		deleteCensusParticipant(
			participantId: $participantId
			censusId: $censusId
		)
	}
`;

export default compose(
	graphql(deleteCensusParticipant, {
		name: "deleteCensusParticipant"
	}),
	graphql(censusParticipants, {
		options: props => ({
			variables: {
				censusId: props.census.id,
				options: {
					limit: PARTICIPANTS_LIMITS[0],
					offset: 0
				}
			}
		})
	})
)(CensusParticipants);
