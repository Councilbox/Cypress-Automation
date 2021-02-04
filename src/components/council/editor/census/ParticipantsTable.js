import React from "react";
import { TableCell, TableRow } from "material-ui/Table";
import { Card } from 'material-ui';
import { compose, graphql } from "react-apollo";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import * as CBX from "../../../../utils/CBX";
import { CloseIcon, EnhancedTable, BasicButton, Checkbox, Grid, GridItem, AlertConfirm } from "../../../../displayComponents";
import { deleteParticipant } from "../../../../queries/councilParticipant";
import { COUNCIL_TYPES, PARTICIPANTS_LIMITS } from "../../../../constants";
import ChangeCensusMenu from "./ChangeCensusMenu";
import CouncilParticipantEditor from "./modals/CouncilParticipantEditor";
import { useOldState, useHoverRow } from "../../../../hooks";
import { isMobile } from "../../../../utils/screen";


const ParticipantsTable = ({ translate, data, totalVotes, totalSocialCapital, participations, council, ...props }) => {
	const [state, setState] = useOldState({
		editingParticipant: false,
		participant: {},
		selectedIds: new Map(),
		deleteModal: false,
		singleId: null
	});
	const primary = getPrimary();
	const secondary = getSecondary();

	const closeParticipantEditor = () => {
		setState({ editingParticipant: false });
	};

	const select = id => {
        if(state.selectedIds.has(id)){
            state.selectedIds.delete(id);
        } else {
            state.selectedIds.set(id, 'selected');
        }

        setState({
            selectedIds: new Map(state.selectedIds)
        });
	}

	const selectAll = () => {
		const newSelected = new Map();
		if(state.selectedIds.size !== data.councilParticipants.list.length){
			data.councilParticipants.list.forEach(participant => {
				newSelected.set(participant.id, 'selected');
			})
		}

		setState({
			selectedIds: newSelected
		});
	}

	const deleteParticipant = async () => {
		let toDelete;
		if(Number.isInteger(state.singleId)){
			toDelete = [state.singleId];
		} else {
			toDelete = Array.from(state.selectedIds.keys());
		}
		const response = await props.mutate({
			variables: {
				participantId: toDelete
			}
		});

		if (response) {
			setState({
				selectedIds: new Map(),
				singleId: null,
				deleteModal: false
			})
			await props.refetch('delete');
		}
	};

	function _renderDeleteIcon(participantID) {
		return (
			<CloseIcon
				style={{ color: primary }}
				onClick={event => {
					event.stopPropagation();
					setState({
						singleId: participantID,
						deleteModal: true
					})
				}}
			/>
		);
	}

	const openDeleteModal = () => {
		setState({
			deleteModal: true
		})
	}

	const closeDeleteModal = () => {
		setState({
			deleteModal: false
		})
	}

	const refresh = async () => {
		props.refetch();
	}

	const { editingParticipant, participant } = state;
	const { councilParticipants } = data;

	const headers = [
		{
			selectAll:
				<Checkbox
					onChange={selectAll}
					value={state.selectedIds.size > 0 &&
						state.selectedIds.size === (councilParticipants.list ? councilParticipants.list.length : -1)}
				/>
		},
		{
			text: translate.participant_data,
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

	];

	if(council.councilType !== COUNCIL_TYPES.ONE_ON_ONE){
		headers.push({
			text: translate.votes,
			name: "numParticipations",
			canOrder: true
		});

		if (participations) {
			headers.push({
				text: translate.census_type_social_capital,
				name: "socialCapital",
				canOrder: true
			});
		}
	}

	headers.push({ text: '' });

	return (
		<div style={{ width: "100%" }}>
			<ChangeCensusMenu
				translate={translate}
				council={council}
				participations={participations}
				disabled={council.councilType === 5 && councilParticipants && councilParticipants.list.length > 0}
				refetch={refresh}
				handleCensusChange={props.handleCensusChange}
				reloadCensus={props.reloadCensus}
				showAddModal={props.showAddModal}
				censuses={props.censuses}
				totalVotes={totalVotes}
				totalSocialCapital={totalSocialCapital}
			/>
			<AlertConfirm
				title={translate.warning}
				bodyText={translate.delete_items}
				open={state.deleteModal}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				modal={true}
				acceptAction={deleteParticipant}
				requestClose={closeDeleteModal}
			/>

			{editingParticipant &&
				<CouncilParticipantEditor
					translate={translate}
					close={closeParticipantEditor}
					key={participant.id}
					council={council}
					participations={participations}
					participant={participant}
					opened={editingParticipant}
					refetch={refresh}
				/>
			}
			{!!councilParticipants && (
				<React.Fragment>
					<EnhancedTable
						translate={translate}
						defaultLimit={PARTICIPANTS_LIMITS[0]}
						defaultFilter={"fullName"}
						defaultOrder={["fullName", "asc"]}
						limits={PARTICIPANTS_LIMITS}
						page={1}
						searchInMovil={isMobile}
						hideTextFilter={isMobile}
						menuButtons={
							state.selectedIds.size > 0 &&
								<BasicButton
									text={state.selectedIds.size === 1 ? translate.remove_one_participant : translate.remove_one_participant.replace('1', state.selectedIds.size) + 's'}
									color={secondary}
									buttonStyle={{ marginRight: '0.6em' }}
									textStyle={{ color: 'white', fontWeight: '700' }}
									onClick={openDeleteModal}
								/>
						}
						loading={!councilParticipants}
						length={councilParticipants.list.length}
						total={councilParticipants.total}
						refetch={data.refetch}
						action={_renderDeleteIcon}
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
							participant => (
									<React.Fragment
										key={`participant${participant.id}`}
									>
										<HoverableRow
											participant={participant}
											editParticipant={() => setState({
												editingParticipant: true,
												participant
											})}
											select={select}
											selected={state.selectedIds.has(participant.id)}
											totalSocialCapital={totalSocialCapital}
											totalVotes={totalVotes}
											council={council}
											participations={participations}
											translate={translate}
											representative={participant.representative}
											_renderDeleteIcon={() => _renderDeleteIcon(participant.id)}
										/>
									</React.Fragment>
								)
						)}
					</EnhancedTable>
				</React.Fragment>
			)}
			{props.children}
		</div>
	);
}

const HoverableRow = ({ participant, editParticipant, _renderDeleteIcon, council, totalVotes, totalSocialCapital, representative, selected, translate, participations, ...props }) => {
	const [showActions, rowHandlers] = useHoverRow();

	if(isMobile){
		return(
			<Card
				style={{ marginBottom: '0.5em', padding: '0.3em', position: 'relative' }}
				onClick={editParticipant}
			>
				<Grid>
					<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
						{translate.participant_data}
					</GridItem>
					<GridItem xs={7} md={7}>
						<span style={{ fontWeight: '700' }}>{`${participant.name} ${participant.surname || ''}`}</span>
						{!!representative &&
							<React.Fragment>
								<br />
								{`${translate.represented_by}: ${representative.name} ${representative.surname || ''}`}
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
						:
							participant.dni
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
						:
							participant.position
						}
					</GridItem>
					<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
						{translate.votes}
					</GridItem>
					<GridItem xs={7} md={7}>
						{!CBX.isRepresentative(participant) &&
							`${
								participant.numParticipations
							} (${participant.numParticipations > 0 ? (
								(participant.numParticipations /
									totalVotes) *
								100
							).toFixed(2) : 0}%)`
						}
					</GridItem>
					{participations && (
						<React.Fragment>
							<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
								{translate.census_type_social_capital}
							</GridItem>
							<GridItem xs={7} md={7}>
								{!CBX.isRepresentative(participant) &&
									`${participant.socialCapital} (${participant.socialCapital > 0 ? (
									(participant.socialCapital /
										totalSocialCapital) *
									100).toFixed(2) : 0}%)`
								}

							</GridItem>
						</React.Fragment>
					)}
				</Grid>
				<div style={{ position: 'absolute', top: '5px', right: '5px' }}>
					{!CBX.isRepresentative(participant) &&
						_renderDeleteIcon(participant.id)}
				</div>
			</Card>
		)
	}

	return (
		<TableRow
			hover={true}
			{...rowHandlers}
			onClick={editParticipant}
			style={{
				cursor: "pointer",
				fontSize: "0.5em"
			}}
		>
			<TableCell onClick={event => event.stopPropagation()} style={{ cursor: 'auto' }}>
				<div style={{ width: '2em' }}>
					{(showActions || selected) &&
						<Checkbox
							value={selected}
							onChange={() => props.select(participant.id)
							}
						/>
					}
				</div>
			</TableCell>
			<TableCell>
				<span style={{ fontWeight: '700' }}>{`${participant.name} ${participant.surname || ''}`}</span>
				{!!representative &&
					<React.Fragment>
						<br/>
						{`${translate.represented_by}: ${representative.name} ${representative.surname || ''}`}
					</React.Fragment>
				}
			</TableCell>
			<TableCell>
				{participant.dni}
				{!!representative &&
					<React.Fragment>
						<br/>
						{representative.dni}
					</React.Fragment>
				}
			</TableCell>
			<TableCell>
				{participant.position}
				{!!representative &&
					<React.Fragment>
						<br/>
						{representative.position}
					</React.Fragment>
				}
			</TableCell>
			{council.councilType !== COUNCIL_TYPES.ONE_ON_ONE &&
				<>
					<TableCell>
						{!CBX.isRepresentative(
							participant
						) &&
							`${
								participant.numParticipations
							} (${participant.numParticipations > 0 ? (
								(participant.numParticipations /
									totalVotes) *
								100
							).toFixed(2) : 0}%)`
						}
						{!!representative &&
							<br/>
						}
					</TableCell>
					{participations && (
						<TableCell>
							{!CBX.isRepresentative(
								participant
							) &&
								`${
									participant.socialCapital
								} (${participant.socialCapital > 0 ? (
									(participant.socialCapital /
										totalSocialCapital) *
									100
								).toFixed(2) : 0}%)`
							}
							{!!representative &&
								<br/>
							}
						</TableCell>
					)}
				</>

			}

			<TableCell>
				<div style={{ width: '6em' }}>

					{showActions &&
						!CBX.isRepresentative(
							participant
						) &&
							_renderDeleteIcon(
								participant.id
							)
					}
					{!!representative &&
						<br/>
					}
				</div>
			</TableCell>
		</TableRow>
	)
}


export default compose(
	graphql(deleteParticipant)
)(ParticipantsTable);
