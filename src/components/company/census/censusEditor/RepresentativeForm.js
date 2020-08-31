import React, { Fragment } from "react";
import {
	Checkbox,
	Grid,
	GridItem,
	SelectInput,
	TextInput,
	BasicButton,
	LoadingSection
} from "../../../../displayComponents";
import { MenuItem } from "material-ui";
import { Collapse } from "material-ui";
import { getSecondary } from "../../../../styles/colors";

const Action = ({ children, loading, onClick, disabled = false, styles }) => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				height: "37px",
				borderRadius: '4px',
				border: `solid 1px ${disabled? 'grey' : getSecondary()}` ,
				padding: "0.3em 1.3em",
				cursor: disabled? 'auto' : "pointer",
				marginRight: "0.5em",
				...styles
			}}
			onClick={!disabled ? onClick : () => {}}
		>
			{loading ? (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<LoadingSection size={20} />
				</div>
			) : (
					children
				)}
		</div>
	)
}


const RepresentativeForm = ({
	updateState,
	translate,
	state,
	checkEmail,
	errors,
	languages,
	disabled,
	setSelectRepresentative
}) => {
	const representative = state;
	return (
		<Grid>
			<GridItem xs={12} lg={12} md={12} style={{ display: 'flex' }}>
				<Action
					disabled={disabled}
					style={{ display: "flex", alignItems: "center", overflow: "hidden", cursor: "pointer" }}
					onClick={() =>
						updateState({
							hasRepresentative: !state.hasRepresentative
						})
					}
				>
					<div style={{ width: "3em", color: disabled? 'grey' : getSecondary() }}>
						<i className={'fa fa-plus'} style={{ position: "relative" }}></i>
						<i className={'fa fa-user-o'} style={{ position: "relative", fontSize: "20px" }}></i>
						<i className={'fa fa-user'} style={{ position: "relative", left: "-5px" }}></i>
					</div>
					<div style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: disabled? 'grey' : getSecondary() }}>
						<span style={{ fontSize: '0.9em' }}>{state.hasRepresentative? 'Quitar representante' : "Añadir representante" }</span>
					</div>
				</Action>
				<Action
					onClick={() => setSelectRepresentative(true)}
					disabled={disabled}
				>
					<div
						style={{ display: "flex", alignItems: "center", overflow: "hidden" }}
					>
						<div style={{ width: "3em", color: disabled? 'grey' : getSecondary() }}>
							<i className={'fa fa-plus'} style={{ position: "relative" }}></i>
							<i className={'fa fa-user-o'} style={{ position: "relative", fontSize: "20px" }}></i>
							<i className={'fa fa-user'} style={{ position: "relative", left: "-5px" }}></i>
						</div>
						<div style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: disabled? 'grey' : getSecondary() }}>
						<span style={{ fontSize: '0.9em' }}>{translate.select_representative}</span>
						</div>
					</div>
				</Action>	
			</GridItem>
			{disabled && 
				<div style={{ width: '100%', padding: '1em' }}>
					{translate.cant_add_representative}
				</div>
			}	
			<Collapse in={state.hasRepresentative} >
				{state.hasRepresentative && (
					<Grid >
						<GridItem xs={6} md={4} lg={3}>
							<TextInput
								floatingText={translate.name}
								type="text"
								errorText={errors.name}
								value={representative.name || ''}
								onChange={event =>
									updateState({
										name: event.nativeEvent.target.value
									})
								}
							/>
						</GridItem>
						<GridItem xs={6} md={4} lg={3}>
							<TextInput
								floatingText={translate.surname || ''}
								type="text"
								errorText={errors.surname || ''}
								value={representative.surname || ''}
								onChange={event =>
									updateState({
										surname: event.nativeEvent.target.value
									})
								}
							/>
						</GridItem>
						<GridItem xs={6} md={4} lg={3}>
							<TextInput
								floatingText={translate.new_dni}
								type="text"
								errorText={errors.dni}
								value={representative.dni || ''}
								onChange={event =>
									updateState({
										dni: event.nativeEvent.target.value
									})
								}
							/>
						</GridItem>
						<GridItem xs={8} lg={3} md={3}>
							<TextInput
								floatingText={translate.position}
								type="text"
								errorText={errors.position}
								value={representative.position || ''}
								onChange={event =>
									updateState({
										position: event.nativeEvent.target.value
									})
								}
							/>
						</GridItem>
						<GridItem xs={6} md={4} lg={3}>
							<TextInput
								{...(checkEmail ? { onKeyUp: (event) => checkEmail(event, 'representative') } : {})}
								floatingText={translate.email}
								type="text"
								errorText={errors.email}
								value={representative.email || ''}
								onChange={event =>
									updateState({
										email: event.nativeEvent.target.value
									})
								}
							/>
						</GridItem>
						<GridItem xs={6} md={4} lg={3}>
							<TextInput
								floatingText={translate.administrative_email}
								min={1}
								errorText={errors.secondaryEmail}
								value={representative.secondaryEmail}
								onChange={event => {
									updateState({
										secondaryEmail: event.target.value
									})
								}}
							/>
						</GridItem>
						<GridItem xs={6} md={4} lg={3}>
							<TextInput
								floatingText={translate.phone}
								type="text"
								errorText={errors.phone}
								value={representative.phone || ''}
								onChange={event =>
									updateState({
										phone: event.nativeEvent.target.value
									})
								}
							/>
						</GridItem>
						<GridItem xs={6} md={4} lg={3}>
							<SelectInput
								floatingText={translate.language}
								value={representative.language}
								onChange={event =>
									updateState({
										language: event.target.value
									})
								}
							>
								{languages.map(language => {
									return (
										<MenuItem
											value={language.columnName}
											key={`languagerepresentative_${
												language.columnName
												}`}
										>
											{language.desc}
										</MenuItem>
									);
								})}
							</SelectInput>
						</GridItem>
						<GridItem xs={6} md={4} lg={2}>
							<SelectInput
								floatingText={translate.participation_type}
								value={'' + representative.initialState}
								onChange={event =>
									updateState({
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
				)}
			</Collapse>
		</Grid>
	);
};

export default RepresentativeForm;
