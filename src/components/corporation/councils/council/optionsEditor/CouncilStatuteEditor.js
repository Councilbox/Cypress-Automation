import gql from 'graphql-tag';
import { MenuItem } from 'material-ui';
import React from 'react';
import { withApollo } from 'react-apollo';
import { Grid, GridItem, Checkbox, SelectInput, TextInput } from '../../../../../displayComponents';


const CouncilStatuteEditor = ({
	statute, translate, client, council, refetch
}) => {
	const updateState = async object => {
		await client.mutate({
			mutation: gql`
				mutation UpdateCouncilStatute($councilId: Int!, $statute: CouncilOptions!){
					updateCouncilStatute(councilId: $councilId, statute: $statute){
						id
						canEarlyVote
					}
				}
			`,
			variables: {
				councilId: council.id,
				statute: object
			}
		});
		refetch();
	};

	const updateCouncil = async object => {
		await client.mutate({
			mutation: gql`
				mutation UpdateCouncil($council: CouncilInput!){
					updateCouncil(council: $council){
						id
					}
				}
			`,
			variables: {
				council: {
					...object,
					id: council.id
				}
			}
		});
		refetch();
	};


	return (
		<Grid style={{ overflow: 'hidden' }}>
			<GridItem xs={12} md={7} lg={7}>
				<Checkbox
					label={translate.exists_delegated_vote}
					value={statute.existsDelegatedVote === 1}
					onChange={(event, isInputChecked) => updateState({
						existsDelegatedVote: isInputChecked ? 1 : 0
					})
					}
				/>
			</GridItem>
			<GridItem xs={12} md={7} lg={7}>
				<Checkbox
					label={translate.agenda_can_be_modified}
					value={statute.canAddPoints === 1}
					onChange={(event, isInputChecked) => updateState({
						canAddPoints: isInputChecked ? 1 : 0
					})
					}
				/>
			</GridItem>
			<GridItem xs={12} md={7} lg={7}>
				<Checkbox
					label={translate.can_reorder_points}
					value={statute.canReorderPoints === 1}
					onChange={(event, isInputChecked) => updateState({
						canReorderPoints: isInputChecked ? 1 : 0
					})
					}
				/>
			</GridItem>
			<GridItem xs={10} md={6} lg={6} style={{ display: 'flex', alignItems: 'center' }}>
				<Checkbox
					id="council-type-limited-access"
					label={translate.exists_limited_access_room}
					helpPopover={false}
					helpTitle={translate.exists_limited_access_room}
					helpDescription={translate.cant_access_after_start_desc}
					value={statute.existsLimitedAccessRoom === 1}
					onChange={(event, isInputChecked) => updateState({
						existsLimitedAccessRoom: isInputChecked ?
							1
							: 0
					})
					}
				/>
			</GridItem>
			<GridItem xs={2} md={2} lg={2} style={{ display: 'flex', alignItems: 'center' }}>
				{statute.existsLimitedAccessRoom === 1 && (
					<DigitsInput
						updateAction={value => updateState({ limitedAccessRoomMinutes: value })}
						value={statute.limitedAccessRoomMinutes}
						translate={translate}
						id="council-type-limited-access-minutes"
						text={translate.minutes}
					/>
				)}
			</GridItem>
			<GridItem xs={12} md={7} lg={7}>
				<Checkbox
					label={translate.hide_votings_recount}
					value={statute.hideVotingsRecountFinished === 1}
					onChange={(event, isInputChecked) => updateState({
						hideVotingsRecountFinished: isInputChecked ? 1 : 0
					})}
				/>
			</GridItem>
			<GridItem xs={12} md={7} lg={7}>
				<Checkbox
					label={'Activar solicitudes'}
					value={statute.shareholdersPortal === 1}
					onChange={(event, isInputChecked) => updateState({
						shareholdersPortal: isInputChecked ? 1 : 0
					})}
				/>
			</GridItem>
			<GridItem xs={12} md={7} lg={7}>
				<DigitsInput
					updateAction={value => updateState({ decimalDigits: value })}
					value={statute.decimalDigits}
					translate={translate}
					id="council-type-decimal-digits"
					text={'Número de decimales'}
				/>
			</GridItem>
			<GridItem xs={12} md={7} lg={7}>
				<Checkbox
					label={translate.exists_comments}
					value={statute.existsComments === 1}
					onChange={(event, isInputChecked) => updateState({
						existsComments: isInputChecked ? 1 : 0
					})
					}
				/>
			</GridItem>
			<GridItem xs={12} md={7} lg={7}>
				<Checkbox
					label={translate.wall}
					value={council.wallActive === 1}
					onChange={(event, isInputChecked) => updateCouncil({
						wallActive: isInputChecked ? 1 : 0
					})
					}
				/>
			</GridItem>
			<GridItem xs={12} md={7} lg={7}>
				<Checkbox
					label={translate.can_ask_word}
					value={council.askWordMenu}
					onChange={(event, isInputChecked) => updateCouncil({
						askWordMenu: isInputChecked
					})
					}
				/>
			</GridItem>
			<GridItem xs={12} md={7} lg={7}>
				<SelectInput
					floatingText={translate.security}
					value={`${council.securityType}`}
					onChange={event => updateCouncil({
						securityType: +event.target.value
					})
					}
				>
					<MenuItem
						value={'0'}
					>
						{translate.new_security_none}
					</MenuItem>
					<MenuItem
						value={'1'}
					>
						{translate.new_security_email}
					</MenuItem>
					<MenuItem
						value={'2'}
					>
						{translate.new_security_sms}
					</MenuItem>
					<MenuItem
						value={'3'}
					>
						{translate.council_security_cert}
					</MenuItem>
				</SelectInput>
			</GridItem>
			<GridItem xs={12} md={7} lg={7}>
				<SelectInput
					floatingText={translate.default_vote}
					value={statute.defaultVote}
					onChange={event => updateState({
						defaultVote: event.target.value
					})
					}
				>
					<MenuItem
						value={-1}
					>
						{translate.dont_vote}
					</MenuItem>
					<MenuItem
						value={0}
					>
						{translate.against_btn}
					</MenuItem>
					<MenuItem
						value={1}
					>
						{translate.in_favor_btn}
					</MenuItem>
					<MenuItem
						value={2}
					>
						{translate.abstention_btn}
					</MenuItem>
				</SelectInput>
			</GridItem>
		</Grid>
	);
};

const DigitsInput = ({ value, updateAction, text, id }) => {
	const [internalValue, setInternalValue] = React.useState(value);

	React.useEffect(() => {
		let timeout;

		if (internalValue !== value) {
			timeout = setTimeout(() => {
				updateAction(internalValue);
			}, 400);
		}

		return () => clearTimeout(timeout);
	}, [internalValue]);

	return (
		<TextInput
			floatingText={text}
			id={id}
			value={internalValue}
			type="number"
			onChange={event => setInternalValue(Number(event.target.value || 0))}
		/>
	);
};

export default withApollo(CouncilStatuteEditor);
