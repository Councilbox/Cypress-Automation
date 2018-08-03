import React from "react";
import {
	Grid,
	GridItem,
	Radio,
	SelectInput,
	TextInput
} from "../../../displayComponents";
import { MenuItem } from "material-ui";

const ParticipantForm = ({
	type,
	participant,
	errors,
	updateState,
	checkEmail,
	participations,
	translate,
	languages
}) => {
	return (
		<Grid>
			{!participant.id && (
				<GridItem xs={12} md={12} lg={12}>
					<Radio
						checked={participant.personOrEntity === 0}
						label={translate.person}
						onChange={event =>
							updateState({
								personOrEntity: parseInt(
									event.nativeEvent.target.value,
									10
								)
							})
						}
						value="0"
						name="personOrEntity"
					/>
					<Radio
						checked={participant.personOrEntity === 1}
						label={translate.entity}
						onChange={event =>
							updateState({
								personOrEntity: parseInt(
									event.nativeEvent.target.value,
									10
								),
								surname: ""
							})
						}
						value="1"
						name="personOrEntity"
					/>
				</GridItem>
			)}
			{participant.personOrEntity ? (
				<GridItem xs={6} md={8} lg={6}>
					<TextInput
						floatingText={translate.entity_name}
						type="text"
						errorText={errors.name}
						value={participant.name}
						onChange={event =>
							updateState({
								name: event.nativeEvent.target.value
							})
						}
					/>
				</GridItem>
			) : (
				<React.Fragment>
					<GridItem xs={6} md={4} lg={3}>
						<TextInput
							floatingText={translate.name}
							type="text"
							errorText={errors.name}
							value={participant.name}
							onChange={event =>
								updateState({
									name: event.nativeEvent.target.value
								})
							}
						/>
					</GridItem>
					<GridItem xs={6} md={4} lg={3}>
						<TextInput
							floatingText={translate.surname}
							type="text"
							errorText={errors.surname}
							value={participant.surname}
							onChange={event =>
								updateState({
									surname: event.nativeEvent.target.value
								})
							}
						/>
					</GridItem>
				</React.Fragment>
			)}

			<GridItem xs={6} md={4} lg={3}>
				<TextInput
					floatingText={participant.personOrEntity === 1? translate.cif : translate.dni}
					type="text"
					errorText={errors.dni}
					value={participant.dni}
					onChange={event =>
						updateState({
							dni: event.nativeEvent.target.value
						})
					}
				/>
			</GridItem>
			<GridItem xs={6} md={4} lg={3}>
				<TextInput
					floatingText={translate.position}
					type="text"
					errorText={errors.position}
					value={participant.position}
					onChange={event =>
						updateState({
							position: event.nativeEvent.target.value
						})
					}
				/>
			</GridItem>
			<GridItem xs={6} md={4} lg={3}>
				<TextInput
					floatingText={translate.email}
					{...(checkEmail? {onKeyUp: (event) => checkEmail(event, 'participant')} : {})}
					type="text"
					errorText={errors.email}
					value={participant.email}
					onChange={event =>
						updateState({
							email: event.nativeEvent.target.value
						})
					}
				/>
			</GridItem>
			<GridItem xs={6} md={4} lg={3}>
				<TextInput
					floatingText={translate.phone}
					type="text"
					errorText={errors.phone}
					value={participant.phone}
					onChange={event =>
						updateState({
							phone: event.nativeEvent.target.value
						})
					}
				/>
			</GridItem>
			<GridItem xs={6} md={4} lg={2}>
				<SelectInput
					floatingText={translate.language}
					value={participant.language}
					onChange={event =>
						updateState({
							language: event.target.value
						})
					}
				>
					{languages.map(language => {
						return (
							<MenuItem
								value={
									language.columnName
										? language.columnName
										: language.column_name
								}
								key={`language_${
									language.columnName
										? language.columnName
										: language.column_name
								}`}
							>
								{language.desc}
							</MenuItem>
						);
					})}
				</SelectInput>
			</GridItem>
			<GridItem xs={6} md={4} lg={2}>
				<TextInput
					floatingText={translate.votes}
					type="tel"
					min={1}
					errorText={errors.numParticipations}
					value={participant.numParticipations}
					onChange={event => {
						if(!isNaN(event.target.value) || +event.target.value > 0){
							updateState({
								numParticipations: event.target.value
							})
						}
					}}
				/>
			</GridItem>
			<GridItem xs={6} md={4} lg={2}>
				{participations && (
					<TextInput
						floatingText={translate.social_capital}
						type="tel"
						min={1}
						errorText={errors.socialCapital}
						value={participant.socialCapital}
						onChange={event => {
							if(!isNaN(event.target.value) || +event.target.value > 0){
								updateState({
									socialCapital: event.target.value
								})
							}
						}}
					/>
				)}
			</GridItem>
		</Grid>
	);
};

export default ParticipantForm;
