import React from 'react';
import { MenuItem } from 'material-ui';
import {
	Grid,
	GridItem,
	SelectInput,
	TextInput
} from '../../../displayComponents';

const RepresentativeForm = ({
	representative,
	errors,
	checkEmail,
	hideAdminEmail,
	updateState,
	requiredPhone,
	translate,
	hideInitialState,
	languages,
	guest
}) => (
	<Grid>
		<GridItem xs={6} md={4} lg={4}>
			<TextInput
				required
				floatingText={translate.name}
				type="text"
				id="participant-form-name"
				onBlur={() => updateState({
					name: representative.name?.trim()
				})}
				errorText={errors.name}
				value={representative.name}
				onChange={event => updateState({
					name: event.nativeEvent.target.value
				})}
			/>
		</GridItem>
		<GridItem xs={6} md={4} lg={4}>
			<TextInput
				required
				floatingText={translate.surname || ''}
				id="participant-form-surname"
				type="text"
				onBlur={() => updateState({
					surname: representative.surname?.trim()
				})}
				errorText={errors.surname || ''}
				value={representative.surname || ''}
				onChange={event => updateState({
					surname: event.nativeEvent.target.value
				})
				}
			/>
		</GridItem>
		<GridItem xs={6} md={4} lg={4}>
			<TextInput
				required
				floatingText={translate.new_dni}
				id="participant-form-card-id"
				type="text"
				errorText={errors.dni}
				onBlur={() => updateState({
					dni: representative.dni?.trim()
				})}
				value={representative.dni}
				onChange={event => updateState({
					dni: event.nativeEvent.target.value
				})
				}
			/>
		</GridItem>
		{!guest && (
			<GridItem xs={6} md={4} lg={4}>
				<TextInput
					floatingText={translate.position}
					id="participant-form-position"
					type="text"
					onBlur={() => updateState({
						position: representative.position?.trim()
					})}
					errorText={errors.position}
					value={representative.position}
					onChange={event => updateState({
						position: event.nativeEvent.target.value
					})
					}
				/>
			</GridItem>
		)}
		<GridItem xs={6} md={4} lg={4}>
			<TextInput
				required
				floatingText={translate.email}
				id="participant-form-email"
				type="text"
				{...(checkEmail ? { onKeyUp: event => checkEmail(event, 'representative') } : {})}
				errorText={errors.email}
				value={representative.email}
				onBlur={() => updateState({
					email: representative.email?.trim()
				})}
				onChange={event => updateState({
					email: event.nativeEvent.target.value
				})
				}
			/>
		</GridItem>
		{!hideAdminEmail &&
			<GridItem xs={6} md={4} lg={4}>
				<TextInput
					floatingText={translate.administrative_email || ''}
					id="participant-form-administrative-email"
					min={1}
					errorText={errors.secondaryEmail}
					onBlur={() => updateState({
						secondaryEmail: representative.secondaryEmail?.trim()
					})}
					value={representative.secondaryEmail}
					onChange={event => {
						updateState({
							secondaryEmail: event.target.value
						});
					}}
				/>
			</GridItem>
		}
		<GridItem xs={6} md={4} lg={4}>
			<TextInput
				required={requiredPhone}
				floatingText={translate.phone}
				id="participant-form-phone"
				type="text"
				errorText={errors.phone}
				value={representative.phone}
				onChange={event => updateState({
					phone: event.nativeEvent.target.value
				})
				}
			/>
		</GridItem>
		<GridItem xs={12} md={4} lg={4}>
			<SelectInput
				floatingText={translate.language}
				id="participant-form-language"
				value={representative.language}
				onChange={event => updateState({
					language: event.target.value
				})
				}
			>
				{languages.map(language => (
					<MenuItem
						value={
							language.columnName ?
								language.columnName
								: language.column_name
						}
						id={`participant-form-administrative-language-${language.columnName}`}
						key={`language${
							language.columnName ?
								language.columnName
								: language.column_name
						}`}
					>
						{language.desc}
					</MenuItem>
				))}
			</SelectInput>
		</GridItem>
		{!hideInitialState &&
			<GridItem xs={6} md={4} lg={4}>
				<SelectInput
					floatingText={translate.participation_type}
					id="participant-form-initial-state"
					value={`${representative.initialState}`}
					onChange={event => updateState({
						initialState: +event.target.value
					})
					}
				>
					<MenuItem
						value={'0'}
						id="participant-form-initial-state-viewer"
					>
						{translate.viewer}
					</MenuItem>
					<MenuItem
						id="participant-form-initial-state-granted-word"
						value={'2'}
					>
						{translate.granted_word}
					</MenuItem>
					<MenuItem
						id="participant-form-initial-state-cant-word"
						value={'4'}
					>
						{translate.cant_ask_word}
					</MenuItem>
					<MenuItem
						id="participant-form-initial-state-waiting-room"
						value={'3'}
					>
						{translate.waiting_room}
					</MenuItem>
				</SelectInput>
			</GridItem>
		}
	</Grid>
);

export default RepresentativeForm;
