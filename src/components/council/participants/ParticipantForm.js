import React from 'react';
import { MenuItem } from 'material-ui';
import {
	Grid,
	GridItem,
	Radio,
	SelectInput,
	TextInput
} from '../../../displayComponents';
import { cleanVotesValue, participantIsGuest, participantIsTranslator } from '../../../utils/CBX';

const ParticipantForm = ({
	participant,
	errors,
	updateState,
	representative,
	checkEmail,
	isGuest = false,
	participations,
	hideVotingInputs,
	translate,
	languages
}) => (
	<Grid>
		{!participant.id && (
			<GridItem xs={12} md={12} lg={12}>
				<Radio
					checked={participant.personOrEntity === 0}
					label={translate.person}
					id="type-person"
					onChange={event => updateState({
						personOrEntity: parseInt(
							event.nativeEvent.target.value,
							10
						)
					})}
					value="0"
					name="personOrEntity"
				/>
				<Radio
					id="type-entity"
					checked={participant.personOrEntity === 1}
					label={translate.entity}
					onChange={event => updateState({
						personOrEntity: parseInt(
							event.nativeEvent.target.value,
							10
						),
						surname: ''
					})
					}
					value="1"
					name="personOrEntity"
				/>
			</GridItem>
		)}
		{participant.personOrEntity === 1 ? (
			<GridItem xs={6} md={8} lg={6}>
				<TextInput
					required
					floatingText={translate.entity_name}
					onBlur={() => updateState({
						name: participant.name?.trim()
					})}
					type="text"
					id="participant-entity-name-input"
					errorText={errors.name}
					value={participant.name}
					onChange={event => updateState({
						name: event.nativeEvent.target.value
					})}
				/>
			</GridItem>
		) : (
			<React.Fragment>
				<GridItem xs={6} md={4} lg={3}>
					<TextInput
						required
						floatingText={translate.name}
						type="text"
						id="participant-name-input"
						errorText={errors.name}
						onBlur={() => updateState({
							name: participant.name?.trim()
						})}
						value={participant.name}
						onChange={event => updateState({
							name: event.nativeEvent.target.value
						})
						}
					/>
				</GridItem>
				<GridItem xs={6} md={4} lg={3}>
					<TextInput
						required
						floatingText={translate.surname || ''}
						type="text"
						id="participant-surname-input"
						onBlur={() => updateState({
							surname: participant.surname?.trim()
						})}
						errorText={errors.surname || ''}
						value={participant.surname || ''}
						onChange={event => updateState({
							surname: event.nativeEvent.target.value
						})
						}
					/>
				</GridItem>
			</React.Fragment>
		)}

		<GridItem xs={6} md={4} lg={3}>
			<TextInput
				floatingText={participant.personOrEntity === 1 ? translate.cif : translate.dni}
				type="text"
				onBlur={() => updateState({
					dni: participant.dni?.trim()
				})}
				id="participant-dni-input"
				errorText={errors.dni}
				value={participant.dni}
				onChange={event => updateState({
					dni: event.nativeEvent.target.value
				})
				}
			/>
		</GridItem>
		{(participant.personOrEntity === 0 && !isGuest)
			&& <GridItem xs={6} md={4} lg={3}>
				<TextInput
					id="participant-position-input"
					floatingText={translate.position}
					type="text"
					onBlur={() => updateState({
						position: participant.position?.trim()
					})}
					errorText={errors.position}
					value={participant.position}
					onChange={event => updateState({
						position: event.nativeEvent.target.value
					})
					}
				/>
			</GridItem>
		}
		<GridItem xs={6} md={4} lg={3}>
			<TextInput
				required={participant?.personOrEntity === 0 || (participant?.personOrEntity === 1 && !representative?.hasRepresentative)}
				floatingText={translate.email}
				id="participant-email-input"
				{...(checkEmail ? { onKeyUp: event => checkEmail(event, 'participant') } : null)}
				type="text"
				onBlur={() => updateState({
					email: participant.email?.trim()
				})}
				errorText={errors.email}
				value={participant.email}
				onChange={event => updateState({
					email: event.nativeEvent.target.value
				})
				}
			/>
		</GridItem>
		{!participantIsGuest(participant)
			&& <GridItem xs={6} md={4} lg={3}>
				<TextInput
					id="participant-administrative-email-input"
					floatingText={translate.administrative_email}
					min={1}
					onBlur={() => updateState({
						secondaryEmail: participant.secondaryEmail?.trim()
					})}
					errorText={errors.secondaryEmail}
					value={participant.secondaryEmail || ''}
					onChange={event => {
						updateState({
							secondaryEmail: event.target.value
						});
					}}
				/>
			</GridItem>
		}
		<GridItem xs={6} md={4} lg={3}>
			<TextInput
				id="participant-phone-input"
				required={!representative?.hasRepresentative}
				floatingText={translate.phone}
				type="text"
				errorText={errors.phone}
				value={participant.phone}
				onChange={event => updateState({
					phone: event.nativeEvent.target.value
				})
				}
			/>
		</GridItem>
		<GridItem xs={6} md={4} lg={3}>
			<SelectInput
				id="participant-language-select"
				floatingText={translate.language}
				value={participant.language}
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
						id={`participant-language-${language.columnName}`}
						key={`language_${language.columnName ?
							language.columnName
							: language.column_name
							}`}
					>
						{language.desc}
					</MenuItem>
				))}
			</SelectInput>
		</GridItem>
		{(participant.personOrEntity === 0 && !participantIsTranslator(participant)) && (
			<GridItem xs={6} md={4} lg={3}>
				<SelectInput
					id="participant-participation-type-select"
					floatingText={translate.participation_type}
					errorText={errors.initialState}
					value={`${participant.initialState}`}
					onChange={event => updateState({
						initialState: +event.target.value
					})
					}
				>
					<MenuItem
						value={'0'}
						id="participant-participation-viewer"
					>
						{translate.viewer}
					</MenuItem>
					<MenuItem
						id="participant-participation-granted-word"
						value={'2'}
					>
						{translate.granted_word}
					</MenuItem>
					<MenuItem
						id="participant-participation-cant-ask-word"
						value={'4'}
					>
						{translate.cant_ask_word}
					</MenuItem>
					<MenuItem
						value={'3'}
						id="participant-participation-waiting-room"
					>
						{translate.waiting_room}
					</MenuItem>
				</SelectInput>
			</GridItem>
		)}
		{!hideVotingInputs
			&& <>
				<GridItem xs={6} md={4} lg={1}>
					<TextInput
						id="participant-votes-input"
						floatingText={translate.votes}
						type="num"
						min={1}
						errorText={errors.numParticipations}
						value={participant.numParticipations}
						onBlur={event => updateState({
							numParticipations: parseInt(event.target.value, 10) || 0
						})
						}
						onChange={event => {
							if (!Number.isNaN(Number(event.target.value)) && +event.target.value >= 0) {
								updateState({
									numParticipations: cleanVotesValue(event.target.value)
								});
							}
						}}
					/>
				</GridItem>
				<GridItem xs={6} md={4} lg={1}>
					{participations && (
						<TextInput
							id="participant-social-capital-input"
							floatingText={translate.social_capital}
							type="num"
							min={1}
							errorText={errors.socialCapital}
							value={participant.socialCapital}
							onBlur={event => updateState({
								socialCapital: parseInt(event.target.value, 10) || 0
							})
							}
							onChange={event => {
								if (!Number.isNaN(Number(event.target.value)) && +event.target.value >= 0) {
									updateState({
										socialCapital: cleanVotesValue(event.target.value)
									});
								}
							}}
						/>
					)}
				</GridItem>
			</>
		}
	</Grid>
);

export default ParticipantForm;
