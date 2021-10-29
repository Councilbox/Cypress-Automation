/* eslint-disable max-classes-per-file */
import React from 'react';
import { TableCell, TableRow, Card } from 'material-ui';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import {
	CloseIcon, EnhancedTable, Grid, GridItem, BasicButton, Checkbox, AlertConfirm, LoadingSection
} from '../../../../displayComponents';
import * as CBX from '../../../../utils/CBX';
import { censusParticipants as censusParticipantsQuery } from '../../../../queries/census';
import AddCensusParticipantButton from './modals/AddCensusParticipantButton';
import { PARTICIPANTS_LIMITS } from '../../../../constants';
import CensusParticipantEditor from './modals/CensusParticipantEditor';
import ImportCensusExcel from '../ImportCensusExcel';
import { isMobile } from '../../../../utils/screen';
import withWindowOrientation from '../../../../HOCs/withWindowOrientation';

const CensusParticipants = ({
	translate, census, client, ...props
}) => {
	const [state, setState] = React.useState({
		editingParticipant: false,
		participant: {},
		deleteModal: false,
		singleId: null,
		selectedIds: new Map(),
		filterText: '',
		inputSearch: ''
	});

	const closeParticipantEditor = () => {
		setState({ ...state, editingParticipant: false });
	};

	const select = id => {
		if (state.selectedIds.has(id)) {
			state.selectedIds.delete(id);
		} else {
			state.selectedIds.set(id, 'selected');
		}

		setState({
			...state,
			selectedIds: new Map(state.selectedIds)
		});
	};

	const selectAll = () => {
		const newSelected = new Map();
		if (state.selectedIds.size !== censusParticipants.list.length) {
			censusParticipants.list.forEach(participant => {
				newSelected.set(participant.id, 'selected');
			});
		}

		setState({
			...state,
			selectedIds: newSelected
		});
	};

	const editParticipant = participant => {
		setState({
			...state,
			editingParticipant: true,
			participant
		});
	};

	const deleteParticipant = async () => {
		let toDelete;
		if (Number.isInteger(state.singleId)) {
			toDelete = [state.singleId];
		} else {
			toDelete = Array.from(state.selectedIds.keys());
		}
		const response = await props.deleteCensusParticipant({
			variables: {
				ids: toDelete,
				censusId: census.id
			}
		});

		if (response) {
			setState({
				...state,
				selectedIds: new Map(),
				singleId: null,
				deleteModal: false
			});
			props.data.refetch();
			props.refetch();
		}
	};

	const openDeleteModal = () => {
		setState({
			...state,
			deleteModal: true
		});
	};

	const closeModal = () => {
		setState({
			...state,
			deleteModal: false,
			singleId: null
		});
	};


	const renderDeleteIcon = participantID => {
		const primary = getPrimary();

		return (
			<CloseIcon
				id={`delete-participant-button-${participantID}`}
				style={{ color: primary }}
				onClick={event => {
					event.stopPropagation();
					setState({
						...state,
						singleId: participantID,
						deleteModal: true
					});
				}}
			/>
		);
	};

	const refresh = () => {
		props.data.refetch();
		props.refetch();
	};

	const headers = [
		{
			selectAll: <Checkbox onChange={selectAll} value={state.selectedIds.size > 0 && state.selectedIds.size === (censusParticipants.list ? censusParticipants.list.length : -1)} />
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

	const { loading, censusParticipants } = props.data;

	if (loading) {
		return <LoadingSection />;
	}

	return (
		<React.Fragment>
			<Grid>
				<GridItem xs={12} md={12} lg={12}>
					<div style={{
						marginBottom: '0.6em',
					}}>
						<div style={{
							display: 'flex',
							justifyContent: 'flex-start',
							marginBottom: '0.6em',
							gap: '32px'
						}}>
							<AddCensusParticipantButton
								translate={translate}
								company={props.company}
								census={census}
								refetch={refresh}
							/>
							<ImportCensusExcel
								translate={translate}
								censusId={census.id}
								companyId={props.company.id}
								refetch={props.data.refetch}
							/>
						</div>
					</div>
					<span style={{ fontWeight: '700', fontSize: '0.9em' }}>
						{`${translate.total_votes}: `}
					</span>
					<span style={{ fontWeight: '700', fontSize: '0.9em' }} id="census-total-votes">
						{`${props.recount.numParticipations || 0}`}
					</span>
					{CBX.hasParticipations({ quorumPrototype: census.quorumPrototype })
						&& <>
							<span style={{ marginLeft: '1em', fontWeight: '700', fontSize: '0.9em' }}>
								{`${translate.total_social_capital}: `}
							</span>
							<span style={{ fontWeight: '700', fontSize: '0.9em' }} id="census-total-social-capital">
								{`${props.recount.socialCapital || 0}`}
							</span>
						</>
					}
				</GridItem>
			</Grid>
			{!!censusParticipants && (
				<EnhancedTable
					searchInMovil={isMobile}
					hideTextFilter={isMobile}
					headers={headers}
					translate={translate}
					defaultFilter={'fullName'}
					defaultLimit={PARTICIPANTS_LIMITS[0]}
					limits={PARTICIPANTS_LIMITS}
					page={1}
					menuButtons={
						state.selectedIds.size > 0
						&& <BasicButton
							text={state.selectedIds.size === 1 ? translate.delete_one_item : `${translate.new_delete} ${state.selectedIds.size} ${translate.items}`}
							color={getSecondary()}
							buttonStyle={{ marginRight: '0.6em' }}
							textStyle={{ color: 'white', fontWeight: '700' }}
							onClick={openDeleteModal}
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
					refetch={props.data.refetch}
					action={renderDeleteIcon}
				>
					{censusParticipants.list.map((participant, index) => (
						<React.Fragment key={`participant_${participant.id}`}>
							<HoverableRow
								participant={participant}
								translate={translate}
								id={`participant-row-${index}`}
								selected={state.selectedIds.has(participant.id)}
								select={select}
								census={census}
								participations={census.quorumPrototype === 1}
								representative={participant.representative}
								renderDeleteIcon={renderDeleteIcon}
								editParticipant={editParticipant}
							/>
						</React.Fragment>
					))}
				</EnhancedTable>
			)}
			{state.editingParticipant
				&& <CensusParticipantEditor
					translate={translate}
					key={state.participant.id}
					close={closeParticipantEditor}
					company={props.company}
					census={census}
					participant={state.participant}
					opened={state.editingParticipant}
					refetch={() => {
						props.data.refetch();
						props.refetch();
					}}
				/>
			}
			<AlertConfirm
				title={translate.send_to_trash}
				bodyText={translate.delete_items}
				open={state.deleteModal}
				buttonAccept={translate.send_to_trash}
				buttonCancel={translate.cancel}
				modal={true}
				acceptAction={deleteParticipant}
				requestClose={closeModal}
			/>
		</React.Fragment>
	);
};

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

export default withApollo(compose(
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
)(withWindowOrientation(CensusParticipants)));
