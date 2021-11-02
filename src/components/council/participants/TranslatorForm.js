import React from 'react';
import { MenuItem } from 'material-ui';
import {
	Grid,
	GridItem,
	SelectInput,
	TextInput
} from '../../../displayComponents';

const TranslatorForm = ({
	representative,
	errors,
	checkEmail,
	updateState,
	translate,
	languages
}) => (
	<Grid>
		<GridItem xs={12} md={12} lg={12}>
			<TextInput
				required
				floatingText={translate.name}
				type="text"
				helpPopover={true}
				helpTitle={translate.add_translator}
				helpDescription={translate.translator_name_tooltip}
				onBlur={() => updateState({
					name: representative.name?.trim()
				})}
				placeholder={translate.translator_name_placeholder}
				errorText={errors.name}
				value={representative.name}
				onChange={event => updateState({
					name: event.nativeEvent.target.value
				})
				}
			/>
		</GridItem>
		<GridItem xs={12} md={12} lg={12}>
			<TextInput
				required
				floatingText={translate.email}
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
		<GridItem xs={12} md={6} lg={6}>
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
		<GridItem xs={12} md={6} lg={6}>
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
	</Grid>
);

export default TranslatorForm;
