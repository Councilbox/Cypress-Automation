import React from 'react';
import { MenuItem, Collapse } from 'material-ui';

import {
	Grid,
	GridItem,
	SelectInput,
	TextInput,
	LoadingSection
} from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';
import { isMobile } from '../../../../utils/screen';
import withWindowSize from '../../../../HOCs/withWindowSize';

const Action = ({
	children, loading, onClick, disabled = false, styles, id
}) => (
	<div
		id={id}
		style={{
			display: 'flex',
			alignItems: 'center',
			height: '37px',
			borderRadius: '4px',
			border: `solid 1px ${disabled ? 'grey' : getSecondary()}`,
			padding: isMobile ? '0.3em 0.3em' : '0.3em 1.3em',
			cursor: disabled ? 'auto' : 'pointer',
			marginRight: '0.5em',
			marginBottom: isMobile && '0.5em',
			...styles
		}}
		onClick={!disabled ? onClick : () => { }}
	>
		{loading ? (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<LoadingSection size={20} />
			</div>
		) : (
			children
		)}
	</div>
);


const RepresentativeForm = ({
	updateState,
	translate,
	state,
	checkEmail,
	errors,
	languages,
	disabled,
	setSelectRepresentative,
	windowSize
}) => {
	const representative = state;

	return (
		<Grid>
			<GridItem xs={12} lg={12} md={12} style={{ display: isMobile && windowSize === 'xs' ? '' : 'flex' }}>
				<Action
					disabled={disabled}
					styles={{ justifyContent: 'center', gap: '4px' }}
					id={state.hasRepresentative ? 'remove-representative-button' : 'add-representative-button'}
					onClick={() => updateState({
						hasRepresentative: !state.hasRepresentative
					})}
				>
					<div style={{ width: '3em', color: disabled ? 'grey' : getSecondary() }}>
						<i className={'fa fa-plus'} style={{ position: 'relative' }}></i>
						<i className={'fa fa-user-o'} style={{ position: 'relative', fontSize: '20px' }}></i>
						<i className={'fa fa-user'} style={{ position: 'relative', left: '-5px' }}></i>
					</div>
					<div style={{
						display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: disabled ? 'grey' : getSecondary()
					}}>
						<span style={{ fontSize: '0.9em' }}>{state.hasRepresentative ? translate.remove_representative : translate.add_representative}</span>
					</div>
				</Action>
				<Action
					onClick={() => setSelectRepresentative(true)}
					disabled={disabled}
					id="select-representative-button"
					styles={{ justifyContent: 'center', gap: '4px' }}
				>
					<div style={{ width: '3em', color: disabled ? 'grey' : getSecondary() }}>
						<i className={'fa fa-plus'} style={{ position: 'relative' }}></i>
						<i className={'fa fa-user-o'} style={{ position: 'relative', fontSize: '20px' }}></i>
						<i className={'fa fa-user'} style={{ position: 'relative', left: '-5px' }}></i>
					</div>
					<div style={{
						display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: disabled ? 'grey' : getSecondary()
					}}>
						<span style={{ fontSize: '0.9em' }}>{translate.select_representative}</span>
					</div>
				</Action>
			</GridItem>
			{disabled
				&& <div style={{ width: '100%', padding: '1em' }}>
					{translate.cant_add_representative}
				</div>
			}
			<Collapse in={state.hasRepresentative} style={{ width: '100%' }} >
				{state.hasRepresentative && (
					<Grid >
						<GridItem xs={6} md={4} lg={3}>
							<TextInput
								required
								floatingText={translate.name}
								type="text"
								onBlur={() => updateState({
									name: representative.name?.trim()
								})}
								id="representative-name-input"
								errorText={errors.name}
								value={representative.name || ''}
								onChange={event => updateState({
									name: event.nativeEvent.target.value
								})
								}
							/>
						</GridItem>
						<GridItem xs={6} md={4} lg={3}>
							<TextInput
								required
								id="representative-surname-input"
								floatingText={translate.surname || ''}
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
						<GridItem xs={6} md={4} lg={3}>
							<TextInput
								required
								id="representative-dni-input"
								floatingText={translate.new_dni}
								type="text"
								onBlur={() => updateState({
									dni: representative.dni?.trim()
								})}
								errorText={errors.dni}
								value={representative.dni || ''}
								onChange={event => updateState({
									dni: event.nativeEvent.target.value
								})
								}
							/>
						</GridItem>
						<GridItem xs={6} md={4} lg={3}>
							<TextInput
								id="representative-position-input"
								floatingText={translate.position}
								type="text"
								onBlur={() => updateState({
									position: representative.position?.trim()
								})}
								errorText={errors.position}
								value={representative.position || ''}
								onChange={event => updateState({
									position: event.nativeEvent.target.value
								})
								}
							/>
						</GridItem>
						<GridItem xs={6} md={4} lg={3}>
							<TextInput
								required
								id="representative-email-input"
								{...(checkEmail ? { onKeyUp: event => checkEmail(event, 'representative') } : {})}
								floatingText={translate.email}
								type="text"
								onBlur={() => updateState({
									email: representative.email?.trim()
								})}
								errorText={errors.email}
								value={representative.email || ''}
								onChange={event => updateState({
									email: event.nativeEvent.target.value
								})
								}
							/>
						</GridItem>
						<GridItem xs={6} md={4} lg={3}>
							<TextInput
								id="representative-administrative-email-input"
								floatingText={translate.administrative_email}
								min={1}
								onBlur={() => updateState({
									secondaryEmail: representative.secondaryEmail?.trim()
								})}
								errorText={errors.secondaryEmail}
								value={representative.secondaryEmail}
								onChange={event => {
									updateState({
										secondaryEmail: event.target.value
									});
								}}
							/>
						</GridItem>
						<GridItem xs={6} md={4} lg={3}>
							<TextInput
								id="representative-phone-input"
								floatingText={translate.phone}
								type="text"
								errorText={errors.phone}
								value={representative.phone || ''}
								onChange={event => updateState({
									phone: event.nativeEvent.target.value
								})
								}
							/>
						</GridItem>
						<GridItem xs={6} md={4} lg={3}>
							<SelectInput
								id="representative-language-select"
								floatingText={translate.language}
								value={representative.language}
								onChange={event => updateState({
									language: event.target.value
								})
								}
							>
								{languages.map(language => (
									<MenuItem
										id={`participant-language-${language.columnName}`}
										value={language.columnName}
										key={`languagerepresentative_${language.columnName
											}`}
									>
										{language.desc}
									</MenuItem>
								))}
							</SelectInput>
						</GridItem>
						<GridItem xs={6} md={4} lg={3}>
							<SelectInput
								id="participant-participation-type-select"
								floatingText={translate.participation_type}
								errorText={errors.initialState}
								value={`${representative.initialState}`}
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
									value={'2'}
									id="participant-participation-granted-word"
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
									id="participant-participation-waiting-room"
									value={'3'}
								>
									{translate.waiting_room}
								</MenuItem>
							</SelectInput>
						</GridItem>
					</Grid>
				)}
			</Collapse>
		</Grid>
	);
};

export default withWindowSize(RepresentativeForm);
