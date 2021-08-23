/* eslint-disable max-classes-per-file */
import React from 'react';
import { TableCell, TableRow, Card } from 'material-ui';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import {
	CloseIcon, EnhancedTable, Grid, GridItem, BasicButton, Checkbox, AlertConfirm
} from '../../../../displayComponents';
import * as CBX from '../../../../utils/CBX';
import { censusParticipants as censusParticipantsQuery } from '../../../../queries/census';
import AddCensusParticipantButton from './modals/AddCensusParticipantButton';
import { PARTICIPANTS_LIMITS } from '../../../../constants';
import CensusParticipantEditor from './modals/CensusParticipantEditor';
import ImportCensusExcel from '../ImportCensusExcel';
import { isMobile } from '../../../../utils/screen';

class CensusParticipants extends React.Component {
	state = {
		editingParticipant: false,
		participant: {},
		deleteModal: false,
		singleId: null,
		selectedIds: new Map()
	};

	closeParticipantEditor = () => {
		this.setState({ editingParticipant: false });
	};

	select = id => {
		if (this.state.selectedIds.has(id)) {
			this.state.selectedIds.delete(id);
		} else {
			this.state.selectedIds.set(id, 'selected');
		}

		this.setState({
			selectedIds: new Map(this.state.selectedIds)
		});
	}

	selectAll = () => {
		const newSelected = new Map();
		if (this.state.selectedIds.size !== this.props.data.censusParticipants.list.length) {
			this.props.data.censusParticipants.list.forEach(participant => {
				newSelected.set(participant.id, 'selected');
			});
		}

		this.setState({
			selectedIds: newSelected
		});
	}

	editParticipant = participant => {
		this.setState({
			editingParticipant: true,
			participant
		});
	};

	deleteParticipant = async () => {
		let toDelete;
		if (Number.isInteger(this.state.singleId)) {
			toDelete = [this.state.singleId];
		} else {
			toDelete = Array.from(this.state.selectedIds.keys());
		}
		const response = await this.props.deleteCensusParticipant({
			variables: {
				ids: toDelete,
				censusId: this.props.census.id
			}
		});

		if (response) {
			this.setState({
				selectedIds: new Map(),
				singleId: null,
				deleteModal: false
			});
			this.props.data.refetch();
			this.props.refetch();
		}
	};

	openDeleteModal = () => {
		this.setState({
			deleteModal: true
		});
	}

	closeModal = () => {
		this.setState({
			deleteModal: false,
			singleId: null
		});
	}


	renderDeleteIcon = participantID => {
		const primary = getPrimary();

		return (
			<CloseIcon
				id={`delete-participant-button-${participantID}`}
				style={{ color: primary }}
				onClick={event => {
					event.stopPropagation();
					this.setState({
						singleId: participantID,
						deleteModal: true
					});
				}}
			/>
		);
	}

	refresh = () => {
		this.props.data.refetch();
		this.props.refetch();
	}

	render() {
		const { translate, census } = this.props;
		const { loading, censusParticipants } = this.props.data;

		const headers = [
			{
				selectAll: <Checkbox onChange={this.selectAll} value={this.state.selectedIds.size > 0 && this.state.selectedIds.size === (censusParticipants.list ? censusParticipants.list.length : -1)} />
			},
			{
				name: 'name',
				text: translate.participant_data,
				canOrder: true
			},
			{
				name: 'dni',
				text: translate.dni,
				canOrder: true
			},
			{
				name: 'position',
				text: translate.position,
				canOrder: true
			},
			{
				name: 'numParticipations',
				text: translate.votes,
				canOrder: true
			}
		];
		if (census.quorumPrototype === 1) {
			headers.push({
				text: translate.social_capital,
				name: 'socialCapital',
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
						<div style={{
							display: 'flex',
							justifyContent: isMobile ? 'space-between' : 'flex-start',
							gap: '2rem',
							marginBottom: '0.6em'
						}}>
							<AddCensusParticipantButton
								translate={translate}
								company={this.props.company}
								census={this.props.census}
								refetch={this.refresh}
							/>
							<ImportCensusExcel
								translate={translate}
								censusId={census.id}
								companyId={this.props.company.id}
								refetch={this.props.data.refetch}
							/>
						</div>
						<span style={{ fontWeight: '700', fontSize: '0.9em' }}>
							{`${translate.total_votes}: ${this.props.recount.numParticipations || 0}`}
						</span>
						{CBX.hasParticipations({ quorumPrototype: this.props.census.quorumPrototype })
							&& <span style={{ marginLeft: '1em', fontWeight: '700', fontSize: '0.9em' }}>
								{`${translate.total_social_capital}: ${this.props.recount.socialCapital || 0}`}
							</span>
						}
					</GridItem>
				</Grid>
				{!!censusParticipants && (
					<EnhancedTable
						headers={headers}
						translate={translate}
						defaultFilter={'fullName'}
						defaultLimit={PARTICIPANTS_LIMITS[0]}
						limits={PARTICIPANTS_LIMITS}
						page={1}
						menuButtons={
							this.state.selectedIds.size > 0
							&& <BasicButton
								text={this.state.selectedIds.size === 1 ? translate.delete_one_item : `${translate.new_delete} ${this.state.selectedIds.size} ${translate.items}`}
								color={getSecondary()}
								buttonStyle={{ marginRight: '0.6em' }}
								textStyle={{ color: 'white', fontWeight: '700' }}
								onClick={this.openDeleteModal}
							/>
						}
						loading={loading}
						length={censusParticipants.list.length}
						total={censusParticipants.total}
						fields={[
							{
								value: 'fullName',
								translation: translate.participant_data
							},
							{
								value: 'dni',
								translation: translate.dni
							},
							{
								value: 'position',
								translation: translate.position
							}
						]}
						refetch={this.props.data.refetch}
						action={this.renderDeleteIcon}
					>
						{censusParticipants.list.map((participant, index) => (
							<React.Fragment key={`participant_${participant.id}`}>
								<HoverableRow
									participant={participant}
									translate={translate}
									id={`participant-row-${index}`}
									selected={this.state.selectedIds.has(participant.id)}
									select={this.select}
									census={census}
									participations={census.quorumPrototype === 1}
									representative={participant.representative}
									renderDeleteIcon={this.renderDeleteIcon}
									editParticipant={this.editParticipant}
								/>
							</React.Fragment>
						))}
					</EnhancedTable>
				)}
				{this.state.editingParticipant
					&& <CensusParticipantEditor
						translate={translate}
						key={this.state.participant.id}
						close={this.closeParticipantEditor}
						company={this.props.company}
						census={this.props.census}
						participant={this.state.participant}
						opened={this.state.editingParticipant}
						refetch={() => {
							this.props.data.refetch();
							this.props.refetch();
						}}
					/>
				}
				<AlertConfirm
					title={translate.send_to_trash}
					bodyText={translate.delete_items}
					open={this.state.deleteModal}
					buttonAccept={translate.send_to_trash}
					buttonCancel={translate.cancel}
					modal={true}
					acceptAction={this.deleteParticipant}
					requestClose={this.closeModal}
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
		});
	}

	mouseLeaveHandler = () => {
		this.setState({
			showActions: false
		});
	}


	render() {
		const {
			participant, renderDeleteIcon, representative, selected, translate
		} = this.props;

		if (isMobile) {
			return (
				<Card
					id={this.props.id}
					style={{ marginBottom: '0.5em', padding: '0.3em', position: 'relative' }}
					onClick={() => this.props.editParticipant(participant)
					}
				>
					<Grid>
						<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
							{translate.participant_data}
						</GridItem>
						<GridItem xs={7} md={7}>
							<span style={{ fontWeight: '700' }}>{`${participant.name} ${participant.surname || ''}`}</span>
							{!!representative
								&& <React.Fragment>
									<br />
									{`${this.props.translate.represented_by}: ${representative.name} ${representative.surname || ''}`}
								</React.Fragment>
							}
						</GridItem>
						<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
							{translate.dni}
						</GridItem>
						<GridItem xs={7} md={7}>
							{representative ?
								<React.Fragment>
									{representative.dni}
								</React.Fragment>
								: participant.dni
							}
						</GridItem>
						<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
							{translate.position}
						</GridItem>
						<GridItem xs={7} md={7}>
							{representative ?
								<React.Fragment>
									{representative.position}
								</React.Fragment>
								: participant.position
							}
						</GridItem>
						<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
							{translate.votes}
						</GridItem>
						<GridItem xs={7} md={7}>
							{!CBX.isRepresentative(
								participant
							)
								&& `${participant.numParticipations
								}`
							}
							{!!representative
								&& <br />
							}
						</GridItem>
						{this.props.participations && (
							<React.Fragment>
								{!CBX.isRepresentative(
									participant
								)
									&& `${participant.socialCapital
									}`
								}
								{!!representative
									&& <br />
								}
							</React.Fragment>
						)}
					</Grid>
					<div style={{ position: 'absolute', top: '5px', right: '5px' }}>
						{!CBX.isRepresentative(participant)
							&& renderDeleteIcon(participant.id)}
					</div>
				</Card>
			);
		}

		return (
			<TableRow
				hover={true}
				id={this.props.id}
				onMouseOver={this.mouseEnterHandler}
				onMouseLeave={this.mouseLeaveHandler}
				onClick={() => this.props.editParticipant(participant)
				}
				style={{
					cursor: 'pointer',
					fontSize: '0.5em'
				}}
			>
				<TableCell onClick={event => event.stopPropagation()} style={{ cursor: 'auto' }}>
					<div style={{ width: '2em' }}>
						{(this.state.showActions || selected)
							&& <Checkbox
								value={selected}
								onChange={() => this.props.select(participant.id)
								}
							/>
						}
					</div>
				</TableCell>
				<TableCell>
					<span style={{ fontWeight: '700' }}>{`${participant.name} ${participant.surname || ''}`}</span>
					{!!representative
						&& <React.Fragment>
							<br />
							{`${this.props.translate.represented_by}: ${representative.name} ${representative.surname || ''}`}
						</React.Fragment>
					}
				</TableCell>
				<TableCell>
					{participant.dni}
					{!!representative
						&& <React.Fragment>
							<br />
							{representative.dni}
						</React.Fragment>
					}
				</TableCell>
				<TableCell>
					{participant.position}
					{!!representative
						&& <React.Fragment>
							<br />
							{representative.position}
						</React.Fragment>
					}
				</TableCell>
				<TableCell>
					{!CBX.isRepresentative(
						participant
					)
						&& `${participant.numParticipations
						}`
					}
					{!!representative
						&& <br />
					}
				</TableCell>
				{this.props.participations && (
					<TableCell>
						{!CBX.isRepresentative(
							participant
						)
							&& `${participant.socialCapital
							}`
						}
						{!!representative
							&& <br />
						}
					</TableCell>
				)}
				<TableCell>
					<div style={{ width: '6em' }}>

						{this.state.showActions
							&& !CBX.isRepresentative(participant) && renderDeleteIcon(participant.id)
						}
						{!!representative
							&& <br />
						}
					</div>
				</TableCell>
			</TableRow>
		);
	}
}

const deleteCensusParticipant = gql`
	mutation DeleteParticipant($ids: [Int], $censusId: Int!) {
		deleteCensusParticipant(
			ids: $ids
			censusId: $censusId
		) {
			success
		}
	}
`;

export default compose(
	graphql(deleteCensusParticipant, {
		name: 'deleteCensusParticipant'
	}),
	graphql(censusParticipantsQuery, {
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
