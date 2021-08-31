import React from 'react';
import { MenuItem, Card } from 'material-ui';
import { CUSTOM_AGENDA_VOTING_TYPES } from '../../../../../constants';
import {
	Radio, SectionTitle, TextInput, Grid, GridItem, SelectInput, BasicButton, Scrollbar
} from '../../../../../displayComponents';
import RichTextInput from '../../../../../displayComponents/RichTextInput';
import { getPrimary, getSecondary } from '../../../../../styles/colors';

const CustomPointForm = ({
	errors,
	translate,
	agenda,
	options,
	items,
	council,
	company,
	addOption,
	updateAgenda,
	updateOptions,
	updateItem,
	removeItem,
}) => {
	const editor = React.useRef();
	const validateNumber = number => {
		if (number < 0 || Number.isNaN(Number(number))) {
			const value = Math.abs(parseInt(number, 10));
			if (Number.isNaN(Number(value))) {
				return '';
			}
			return value;
		}
		return number;
	};

	const primary = getPrimary();
	const secondary = getSecondary();

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<Scrollbar>
				<div style={{ padding: '1em' }}>
					<Grid spacing={0}>
						<GridItem xs={12} md={9} lg={9}>
							<TextInput
								floatingText={translate.title}
								type="text"
								errorText={errors.agendaSubject}
								value={agenda.agendaSubject}
								onChange={event => updateAgenda({ agendaSubject: event.target.value })}
								required
							/>
						</GridItem>
						<GridItem xs={12} md={3} lg={3}>
							<SelectInput
								floatingText={translate.votation_type}
								value={`${agenda.subjectType}`}
								onChange={event => updateAgenda({
									subjectType: +event.target.value
								})
								}
								required
							>
								{council.councilType === 3 ?
									<MenuItem
										value={`${CUSTOM_AGENDA_VOTING_TYPES[1].value}`}
										key={`voting${CUSTOM_AGENDA_VOTING_TYPES[1].value}`}
									>
										{translate[CUSTOM_AGENDA_VOTING_TYPES[1].label]}
									</MenuItem>
									: Object.keys(CUSTOM_AGENDA_VOTING_TYPES).map(key => (
										<MenuItem
											value={`${CUSTOM_AGENDA_VOTING_TYPES[key].value}`}
											key={`voting${CUSTOM_AGENDA_VOTING_TYPES[key].value}`}
										>
											{translate[CUSTOM_AGENDA_VOTING_TYPES[key].label]}
										</MenuItem>
									))
								}
							</SelectInput>
						</GridItem>
						<RichTextInput
							ref={editor}
							floatingText={translate.description}
							translate={translate}
							type="text"
							tags={[
								{
									value: `${council.street}, ${council.country}`,
									label: translate.new_location_of_celebrate
								},
								{
									value: company.countryState,
									label: translate.company_new_country_state
								},
								{
									value: company.city,
									label: translate.company_new_locality
								}
							]}
							errorText={errors.description}
							value={agenda.description}
							onChange={value => updateAgenda({
								description: value
							})
							}
						/>
					</Grid>
					<SectionTitle
						text={translate.selection_type}
						color={primary}
						style={{
							marginTop: '1em'
						}}
					/>
					<div>
						<Radio
							checked={!!options.multiselect}
							onChange={() => updateOptions({
								multiselect: true,
								maxSelections: 2
							})}
							name="security"
							label={translate.multiple}
						/>
						<Radio
							checked={!options.multiselect}
							onChange={() => updateOptions({
								multiselect: false,
								maxSelections: 1
							})}
							name="security"
							label={translate.single}
						/>
					</div>
					{options.multiselect
						&& <React.Fragment>
							<TextInput
								floatingText={translate.max_selections}
								value={options.maxSelections}
								onChange={event => updateOptions({ maxSelections: validateNumber(+event.target.value) })}
							/>
							{errors.maxSelections
								&& <div style={{ color: 'red' }}>
									{errors.maxSelections}
								</div>
							}
							<TextInput
								floatingText={translate.minimum_selection}
								value={options.minSelections}
								onChange={event => updateOptions({ minSelections: validateNumber(+event.target.value) })}
							/>
							{errors.minSelections
								&& <div style={{ color: 'red' }}>
									{errors.minSelections}
								</div>
							}
						</React.Fragment>
					}
					<SectionTitle
						text={translate.choices}
						color={primary}
						style={{ marginTop: '1.3em' }}
					/>
					<BasicButton
						onClick={addOption}
						color="white"
						text={translate.add_choice}
						buttonStyle={{
							color: 'white',
							border: `1px solid ${secondary}`,
							marginBottom: '1em'
						}}
						textStyle={{
							fontWeight: '700',
							color: secondary
						}}
					/>
					<div style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '10px 0',
						alignItems: 'center',
						marginBottom: '.5rem'
					}}>
						{items.map((item, index) => (
							<Card
								key={`item_${index}`}
								style={{
									display: 'flex',
									padding: '0.6em',
									justifyContent: 'space-between',
									width: 'calc(100% - 32px)',
								}}
							>
								<TextInput
									value={item.value}
									// placeholder="Escribe el valor de la opción"
									floatingText={translate.value}
									multiline
									errorText={errors.items && errors.items[index] && errors.items[index].error}
									onChange={event => updateItem(index, event.target.value)}
								/>
								<i
									className="fa fa-times"
									aria-hidden="true"
									style={{ color: 'red', cursor: 'pointer' }}
									onClick={() => removeItem(index)}
								></i>
							</Card>
						))}
						{errors.itemsLength
							&& <div style={{ color: 'red' }}>
								{errors.itemsLength}
							</div>
						}

					</div>
				</div>
			</Scrollbar>
		</div>
	);
};

export default CustomPointForm;
