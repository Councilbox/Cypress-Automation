import React from "react";
import { getPrimary } from "../../../../styles/colors";
import { TableCell, TableRow } from "material-ui";
import { CloseIcon, EnhancedTable, Grid, GridItem } from "../../../../displayComponents";
import { hasParticipations } from '../../../../utils/CBX';
import { compose, graphql } from "react-apollo";
import { censusParticipants } from "../../../../queries/census";
import gql from "graphql-tag";
import AddCensusParticipantButton from "./modals/AddCensusParticipantButton";
import { PARTICIPANTS_LIMITS } from "../../../../constants";
import CensusParticipantEditor from "./modals/CensusParticipantEditor";
import ImportCensusExcel from '../ImportCensusExcel';

class CensusParticipants extends React.Component {
	state = {
		editingParticipant: false,
		participant: {}
	};

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


	_renderDeleteIcon = (participantID) => {
		const primary = getPrimary();

		return (
			<CloseIcon
				style={{ color: primary }}
				onClick={(event) => {
					event.stopPropagation();
					this.deleteParticipant(participantID);
				}}
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
			text: ''
		});

		return (
			<React.Fragment>
				<Grid>
					<GridItem xs={12} md={12} lg={12}>
						<AddCensusParticipantButton
							translate={translate}
							company={this.props.company}
							census={this.props.census}
							refetch={this.props.data.refetch}
						/>
						<ImportCensusExcel
							translate={translate}
							censusId={census.id}
							companyId={this.props.company.id}
							refetch={this.props.data.refetch}
						/>
						<span style={{fontWeight: '700', fontSize: '0.9em'}}>
							{`${translate.total_votes}: ${this.props.recount.numParticipations || 0}`}
						</span>
						{hasParticipations({ quorumPrototype: this.props.census.quorumPrototype }) &&
							<span style={{marginLeft: '1em', fontWeight: '700', fontSize: '0.9em'}}>
								{`${translate.total_social_capital}: ${this.props.recount.socialCapital || 0}`}
							</span>
						}
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
								<React.Fragment key={`participant_${participant.id}`}>
									<HoverableRow
										participant={participant}
										translate={translate}
										census={census}
										renderDeleteIcon={this._renderDeleteIcon}
										editParticipant={this.editParticipant}
									/>
									{!!participant.representative && (
										<TableRow
											hover={true}
											style={{
												cursor: "pointer",
												backgroundColor: "WhiteSmoke"
											}}
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
								</React.Fragment>
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
					refetch={() => {
						this.props.data.refetch();
						this.props.refetch()
					}}
				/>
			</React.Fragment>
		);
	}
}

class HoverableRow extends React.PureComponent {

	state = {
		showActions: false
	}

	mouseEnterHandler = () => {
		this.setState({
			showActions: true
		})
	}

	mouseLeaveHandler = () => {
		this.setState({
			showActions: false
		})
	}

	render() {
		const { participant, census } = this.props;
		return(
			<TableRow
				hover={true}
				onMouseEnter={this.mouseEnterHandler}
				onMouseLeave={this.mouseLeaveHandler}
				onClick={() =>
					this.props.editParticipant(participant)
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
					<div style={{width: '2em'}}>
						{this.state.showActions && this.props.renderDeleteIcon(
							participant.id
						)}
					</div>
				</TableCell>
			</TableRow>
		)
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
