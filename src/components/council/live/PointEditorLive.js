import React from 'react';
import { MenuItem } from 'material-ui';
import { graphql } from 'react-apollo';
import {
	AlertConfirm, SelectInput, Grid, GridItem, MajorityInput
} from '../../../displayComponents';
import {
	filterAgendaVotingTypes, hasVotation, majorityNeedsInput, isCustomPoint
} from '../../../utils/CBX';
import { checkValidMajority } from '../../../utils/validation';
import { updateAgenda as updateAgendaMutation } from '../../../queries/agenda';
import { CUSTOM_AGENDA_VOTING_TYPES } from '../../../constants';
import { useOldState } from '../../../hooks';

const PointEditorLive = ({
	agenda, translate, council, ...props
}) => {
	const [state, setState] = useOldState({
		id: agenda.id,
		councilId: council.id,
		subjectType: agenda.subjectType,
		majorityType: agenda.majorityType,
		majority: agenda.majority,
		majorityDivider: agenda.majorityDivider
	});


	const updateState = object => {
		setState({
			...object,
			majorityError: ''
		});
	};

	const updateAgenda = async () => {
		const majorityCheckResult = checkValidMajority(state.majority, state.majorityDivider, state.majorityType, translate);
		if (majorityCheckResult.error) {
			setState({
				majorityError: majorityCheckResult.message
			});
			return;
		}
		const {
			majorityError, items, ballots, options, ...rest
		} = state;
		await props.updateAgenda({
			variables: {
				agenda: rest
			}
		});

		props.refetch();
		props.requestClose();
	};

	const renderModalBody = () => {
		const filteredTypes = filterAgendaVotingTypes(props.votingTypes, council.statute, council);

		if (isCustomPoint(agenda.subjectType)) {
			return (
				<SelectInput
					floatingText={translate.type}
					value={`${state.subjectType}`}
					onChange={event => updateState({ subjectType: +event.target.value })}
				>
					{Object.keys(CUSTOM_AGENDA_VOTING_TYPES).map(key => (
						<MenuItem
							value={`${CUSTOM_AGENDA_VOTING_TYPES[key].value}`}
							key={`voting${CUSTOM_AGENDA_VOTING_TYPES[key].value}`}
						>
							{translate[CUSTOM_AGENDA_VOTING_TYPES[key].label]}
						</MenuItem>
					))}
				</SelectInput>
			);
		}

		return (
			<React.Fragment>
				<SelectInput
					floatingText={translate.type}
					value={`${state.subjectType}`}
					onChange={event => updateState({ subjectType: +event.target.value })}
				>
					{filteredTypes.map(voting => (
						<MenuItem
							value={`${voting.value}`}
							key={`voting${voting.value}`}
						>
							{translate[voting.label]}
						</MenuItem>
					))}
				</SelectInput>
				{hasVotation(state.subjectType) && (
					<Grid>
						<GridItem xs={6} lg={3} md={3}>
							<SelectInput
								floatingText={translate.majority_label}
								value={`${state.majorityType}`}
								// errorText={errors.majorityType}
								onChange={event => updateState({
									majorityType: +event.target.value
								})
								}
								required
							>
								{props.majorityTypes.map(majority => (
									<MenuItem
										value={`${majority.value}`}
										key={`majorityType_${
											majority.value
										}`}
									>
										{translate[majority.label]}
									</MenuItem>
								))}
							</SelectInput>
						</GridItem>
						<GridItem xs={6} lg={3} md={3}>
							{majorityNeedsInput(state.majorityType) && (
								<MajorityInput
									type={state.majorityType}
									value={state.majority}
									divider={state.majorityDivider}
									onChange={value => updateState({
										majority: +value
									})
									}
									onChangeDivider={value => updateState({
										majorityDivider: +value
									})
									}
								/>
							)}
						</GridItem>
						{state.majorityError
&& <div>
	<span style={{ color: 'red' }}>{state.majorityError}</span>
</div>
						}
					</Grid>
				)}

			</React.Fragment>
		);
	};

	return (
		<AlertConfirm
			open={props.open}
			requestClose={props.requestClose}
			bodyText={renderModalBody()}
			title={translate.edit}
			buttonAccept={translate.save}
			buttonCancel={translate.cancel}
			acceptAction={updateAgenda}
			cancelAction={props.requestClose}
		/>
	);
};


export default graphql(updateAgendaMutation, {
	name: 'updateAgenda'
})(PointEditorLive);
