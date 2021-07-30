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
	updateState,
	translate,
	languages,
	guest
}) => (
	<Grid>
		<GridItem xs={6} md={4} lg={4}>
			<TextInput
				required
				floatingText={translate.name}
				type="text"
				errorText={errors.name}
				value={representative.name}
				onChange={event => updateState({
					name: event.nativeEvent.target.value
				})
				}
			/>
		</GridItem>
		<GridItem xs={6} md={4} lg={4}>
			<TextInput
				required
				floatingText={translate.surname || ''}
				type="text"
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
				type="text"
				errorText={errors.dni}
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
					type="text"
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
				type="text"
				{...(checkEmail ? { onKeyUp: event => checkEmail(event, 'representative') } : {})}
				errorText={errors.email}
				value={representative.email}
				onChange={event => updateState({
					email: event.nativeEvent.target.value
				})
				}
			/>
		</GridItem>
		<GridItem xs={6} md={4} lg={4}>
			<TextInput
				floatingText={translate.administrative_email || ''}
				min={1}
				errorText={errors.secondaryEmail}
				value={representative.secondaryEmail}
				onChange={event => {
					updateState({
						secondaryEmail: event.target.value
					});
				}}
			/>
		</GridItem>
		<GridItem xs={6} md={4} lg={4}>
			<TextInput
				required
				floatingText={translate.phone}
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
		<GridItem xs={6} md={4} lg={4}>
			<SelectInput
				floatingText={translate.participation_type}
				value={`${representative.initialState}`}
				onChange={event => updateState({
					initialState: +event.target.value
				})
				}
			>
				<MenuItem
					value={'0'}
				>
					{translate.viewer}
				</MenuItem>
				<MenuItem
					value={'2'}
				>
					{translate.granted_word}
				</MenuItem>
				<MenuItem
					value={'4'}
				>
					{translate.cant_ask_word}
				</MenuItem>
				<MenuItem
					value={'3'}
				>
					{translate.waiting_room}
				</MenuItem>
			</SelectInput>
		</GridItem>
	</Grid>
);

export default RepresentativeForm;
