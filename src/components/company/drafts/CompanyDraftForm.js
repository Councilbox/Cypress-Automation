import React, { Fragment } from "react";
import {
	Grid,
	GridItem,
	MajorityInput,
	SelectInput,
	TextInput,
	Scrollbar
} from "../../../displayComponents";
import RichTextInput from "../../../displayComponents/RichTextInput";
import { MenuItem, TextField, Input, Icon, Collapse } from "material-ui";
import * as CBX from "../../../utils/CBX";
import { GOVERNING_BODY_TYPES } from "../../../constants";
import TextArea from "antd/lib/input/TextArea";



const levelColor = ['#b47fb6', '#7fa5b6', '#7f94b6'];

const CompanyDraftForm = ({ translate, draft, errors, updateState, companyStatutes, draftTypes, rootStatutes, languages, votingTypes, majorityTypes, companyTypes }) => {
	const [title, setTitle] = React.useState('');
	const [search, setSearch] = React.useState('');
	const [description, setDescription] = React.useState('Añadir una descripcion detallada');
	const [newTag, setNewTag] = React.useState('Crear etiqueta nueva');
	const [infoText, setInfoText] = React.useState('');
	// const [title, setTitle] = React.useState(false);
	console.log(draft)
	console.log(errors)
	console.log(companyStatutes)
	console.log(draftTypes)
	console.log(rootStatutes)
	console.log(languages)
	console.log(votingTypes)
	console.log(majorityTypes)
	console.log(companyTypes)

	return (
		<Grid spacing={16} style={{ height: "100%" }}>
			<GridItem xs={12} lg={8} md={8} style={{ height: "100%" }}>
				<Grid spacing={16} style={{ height: "100%" }}>
					<GridItem xs={12} lg={12} md={12} >
						<div style={{ fontSize: "18px" }}>Titulo</div>
						<div>
							<Input
								placeholder={"Titulo"}
								disableUnderline={true}
								style={{
									color: "rgba(0, 0, 0, 0.36)",
									fontSize: '15px',
									boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
									border: "1px solid #d7d7d7",
									width: "100%",
									padding: '.5em 1.6em',
									marginTop: "1em"
								}}
								value={title}
								onChange={event => setTitle(event.target.value)}
							>
							</Input>

						</div>
					</GridItem>
					<GridItem xs={12} lg={12} md={12} style={{ marginTop: " 1em" }}>
						<div style={{ display: "flex", color: "#ffffff", fontSize: "12px", marginBottom: "0.5em " }}>
							<EtiquetaBase
								text={"Texto 1"}
								color={'#b47fb6'}
							/>
							<EtiquetaBase
								text={"Texto 2"}
								color={'#7fa5b6'}
							/>
							<EtiquetaBase
								text={"Texto 2"}
								color={'#7f94b6'}
							/>
						</div>
						<div style={{ display: "flex", color: "#ffffff", fontSize: "12px", marginBottom: "0.5em " }}>
							<EtiquetaBase
								text={"Texto 1"}
								color={'#b47fb6'}
							/>
							<EtiquetaBase
								text={"Texto 2"}
								color={'#7fa5b6'}
							/>
						</div>
					</GridItem>
					<GridItem xs={12} lg={12} md={12}>
						<div style={{ fontSize: "18px" }}>Descripcion</div>
						<div>
							<textarea
								style={{
									color: "rgba(0, 0, 0, 0.36)",
									fontSize: '18px',
									boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
									border: "1px solid #d7d7d7",
									width: "100%",
									padding: '.5em 1.6em',
									marginTop: "1em",
									minHeight: "86px",
									resize: 'none',
								}}
								value={description}
								onChange={event => setDescription(event.target.value)}
							/>
						</div>
					</GridItem>
					<GridItem xs={12} lg={12} md={12}>
						<div>
							<RichTextInput
								type="text"
								translate={translate}
								value={infoText}
								onChange={value => { setInfoText(value) }}
							/>
						</div>
					</GridItem>
				</Grid>
			</GridItem>
			<GridItem xs={12} lg={4} md={4} style={{ height: "100%" }}>
				<div style={{ fontSize: "18px", display: "flex" }}>
					<div style={{ marginRight: "0.6em" }}>Etiquetas</div>
					<div>
						<i className="material-icons" style={{ transform: 'scaleX(-1)', fontSize: "20px" }}>
							local_offer
						</i>
					</div>
				</div>
				<div style={{ boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)', border: 'solid 1px #d7d7d7', marginTop: "1em", }}>
					<div style={{ paddingLeft: "1em", paddingRight: "1em" }}>
						<div style={{ marginBottom: "1em" }}>
							<TextInput
								placeholder={"Busca una etiqueta"}
								adornment={<Icon>search</Icon>}
								type="text"
								value={search}
								styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.36)" }}
								onChange={event => {
									setSearch(event.target.value);
								}}
							/>
						</div>
						<div style={{}}	>
							<ContenedorEtiquetas
								color={'#b47fb6'}
								stylesContent={{
									border: '1px solid #c196c3',
									color: '#b47fb6',
								}}
							/>
							<ContenedorEtiquetas
								color={'#7fa5b6'}
								stylesContent={{
									border: '1px solid #7fa5b6',
									color: '#7fa5b6',
								}}
							/>
							<ContenedorEtiquetas
								color={'#7f94b6'}
								stylesContent={{
									border: '1px solid #7f94b6',
									color: '#7f94b6',
								}}
								last={true}
							/>
						</div>
						<div style={{ marginBottom: "1em" }}>
							<TextInput
								type="text"
								value={newTag}
								styleInInput={{ minHeight: '2.5em', paddingLeft: "0.4em", paddingRight: "0.4em", fontSize: "12px", color: "rgba(0, 0, 0, 0.36)", background: "#f2f4f7" }}
								onChange={event => {
									setNewTag(event.target.value);
								}}
							/>
						</div>
					</div>
				</div>
			</GridItem>
		</Grid>
	);
}


const ContenedorEtiquetas = ({ stylesContent, color, last }) => {
	const [open, setOpen] = React.useState(false);

	return (
		<div style={{
			boxShadow: ' 0 2px 1px 0 rgba(0, 0, 0, 0.25)',
			marginBottom: !last && "1em",
			fontSize: "12px",
			paddingRight: "1em",
			paddingLeft: "1em",
			minHeight: "3.5em",
			...stylesContent
		}}
		>
			<div style={{ alignItems: "center", justifyContent: "space-between", display: "flex", width: "100%", cursor: "pointer", }} onClick={() => setOpen(!open)}>
				<div>Tipo de Runion</div>
				<div style={{ display: "flex", alignItems: "center" }}>
					{open ?
						<i className="material-icons" style={{ fontSize: "40px" }}>
							arrow_drop_up
						</i>
						:
						<i className="material-icons" style={{ fontSize: "40px" }}>
							arrow_drop_down
					</i>
					}
				</div>
			</div>
			<Collapse in={open} timeout="auto" unmountOnExit >
				<div style={{ marginBottom: "1em" }}>
					<div style={{}}>
						<Etiqueta
							text={"Cabecera de convocatoria"}
							color={color}
						/>
						<Etiqueta
							text={"Cabecera"}
							color={color}
						/>
						<Etiqueta
							text={"Convocatoria"}
							color={color}
							moreEtiquetas={true}
						/>

					</div>
					{/* <div style={{ boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)', border: `solid 1px ${color}`, borderRadius: '4px' }}>
						<div style={{}}>Informativo</div>
					</div> */}
				</div>
			</Collapse>

		</div >
	);
}


const Etiqueta = ({ text, color, moreEtiquetas }) => {
	const [open, setOpen] = React.useState(false);

	const styles = {
		borderRadius: '14px',
		border: `solid 1px ${color}`,
		padding: "4px 0.8em",
		display: open ? "block" : "inline-block",
		marginRight: "0.5em",

		marginTop: "0.25em",
		marginBottom: "0.25em",
	}
	if (moreEtiquetas) {
		return (
			<div style={{ ...styles }} >
				<div style={{}}>
					<div style={{ display: "flex", justifyContent: open && "space-between", cursor: "pointer", }} onClick={() => setOpen(!open)} >
						<div>{text}</div>
						<div style={{ marginTop: '-5px', height: "5px" }}>
							{open ?
								<i className="material-icons" style={{ fontSize: "27px" }} >
									arrow_drop_up
						</i>
								:
								<i className="material-icons" style={{ fontSize: "27px" }}>
									arrow_drop_down
					</i>
							}
						</div>
					</div>
					{moreEtiquetas &&
						<Collapse in={open} timeout="auto" unmountOnExit >
							<div>
								<Etiqueta
									text={"Cabecera"}
									color={color}
								/>
							</div>
						</Collapse>
					}
				</div>
			</div>
		)
	} else {
		return (
			<div style={{ ...styles }}>
				{text}
			</div>
		)
	}

}

const EtiquetaBase = ({ text, color }) => {

	return (
		<div
			style={{
				borderRadius: '20px',
				border: `solid 1px ${color}`,
				background: color,
				padding: "0 0.5em",
				display: "inline-block",
				marginRight: "0.5em",
				marginTop: "0.25em",
				marginBottom: "0.25em",
				color: "white",
				padding: "8px"
			}}
		>
			<div style={{ display: "flex" }}>
				<div style={{ paddingRight: "0.5em" }}>{/*text*/}Junta General Extraod.</div>
				<div><i className="fa fa-times" style={{ cursor: 'pointer', background: " #ffffff", color: color, borderRadius: "6px", padding: "0em 1px" }} aria-hidden="true"></i></div>
			</div>
		</div>
	)

}


export default CompanyDraftForm;



// <GridItem xs={12} lg={3} md={3}>
// 			<TextInput
// 				floatingText={translate.title}
// 				type="text"
// 				required
// 				errorText={errors.title}
// 				value={draft.title}
// 				onChange={event =>
// 					updateState({
// 						title: event.nativeEvent.target.value
// 					})
// 				}
// 			/>
// 		</GridItem>
// 		{!!rootStatutes &&
// 			<GridItem xs={12} lg={3} md={3}>
// 				<SelectInput
// 					floatingText={translate.council_type}
// 					value={draft['prototype'] || 0}
// 					errorText={errors['prototype']}
// 					onChange={event =>
// 						updateState({
// 							prototype: event.target.value
// 						})
// 					}
// 				>
// 					{rootStatutes.map(council => {
// 						return (
// 							<MenuItem
// 								value={council['prototype']}
// 								key={`counciltype_${council['prototype']}`}
// 							>
// 								{translate[council.title] || council.title}
// 							</MenuItem>
// 						);
// 					})}
// 				</SelectInput>
// 			</GridItem>
// 		}
// 		{!!companyStatutes &&
// 			<GridItem xs={12} lg={3} md={3}>
// 				<SelectInput
// 					floatingText={translate.council_type}
// 					value={draft.statuteId || 0}
// 					errorText={errors.statuteId}
// 					onChange={event =>
// 						updateState({
// 							statuteId: event.target.value
// 						})
// 					}
// 				>
// 					{companyStatutes.map(council => {
// 						return (
// 							<MenuItem
// 								value={council.id}
// 								key={`counciltype_${council.id}`}
// 							>
// 								{translate[council.title] || council.title}
// 							</MenuItem>
// 						);
// 					})}
// 				</SelectInput>
// 			</GridItem>
// 		}
// 		{!!companyTypes &&
// 			<GridItem xs={12} lg={3} md={3}>
// 				<SelectInput
// 					floatingText={translate.company_type}
// 					value={draft.companyType || 0}
// 					errorText={errors.companyType}
// 					onChange={event =>
// 						updateState({
// 							companyType: event.target.value
// 						})
// 					}
// 				>
// 					{companyTypes.map(companyType => {
// 						return (
// 							<MenuItem
// 								key={companyType.label}
// 								value={companyType.value}
// 							>
// 								{translate[companyType.label]}
// 							</MenuItem>
// 						);
// 					})}
// 				</SelectInput>
// 			</GridItem>
// 		}
// 		<GridItem xs={12} lg={3} md={3}>
// 			<SelectInput
// 				floatingText={'Órgano de gobierno'}
// 				value={draft.governingBodyType || 0}
// 				errorText={errors.governingBodyType}
// 				onChange={event =>
// 					updateState({
// 						governingBodyType: event.target.value
// 					})
// 				}
// 			>
// 			    {Object.keys(GOVERNING_BODY_TYPES).map(key => (
//                     <MenuItem
//                         value={GOVERNING_BODY_TYPES[key].value}
//                         key={GOVERNING_BODY_TYPES[key].value}
//                     >
//                         {translate[GOVERNING_BODY_TYPES[key].label] || GOVERNING_BODY_TYPES[key].label}
//                     </MenuItem>
//                 ))}
// 			</SelectInput>
// 		</GridItem>
// 		{!!languages &&
// 			<GridItem xs={12} lg={3} md={3}>
// 				<SelectInput
// 					floatingText={translate.language}
// 					value={draft.language}
// 					errorText={errors.language}
// 					onChange={event =>
// 						updateState({
// 							language: event.target.value
// 						})
// 					}
// 				>
// 					{languages.map(language => {
// 						return (
// 							<MenuItem value={language.columnName} key={`language_${language.columnName}`}>
// 								{language.desc}
// 							</MenuItem>
// 						);
// 					})}
// 				</SelectInput>
// 			</GridItem>
// 		}
// 		{!!draftTypes &&
// 			<GridItem xs={12} lg={3} md={3}>
// 				<SelectInput
// 					floatingText={translate.draft_type}
// 					value={"" + draft.type}
// 					errorText={errors.type}
// 					onChange={event =>
// 						updateState({
// 							type: +event.target.value,
// 							votationType: 0
// 						})
// 					}
// 				>
// 					{draftTypes.map(draft => {
// 						return (
// 							<MenuItem
// 								value={"" + draft.value}
// 								key={`draftType_${draft.value}`}
// 							>
// 								{translate[draft.label]}
// 							</MenuItem>
// 						);
// 					})}
// 				</SelectInput>
// 			</GridItem>
// 		}
// 		<GridItem xs={12} lg={3} md={3}>
// 			{draft.type === 1 && (
// 				<SelectInput
// 					floatingText={translate.point_type}
// 					value={"" + draft.votationType}
// 					errorText={errors.votationType}
// 					onChange={event =>
// 						updateState({
// 							votationType: +event.target.value
// 						})
// 					}
// 				>
// 					{CBX.filterAgendaVotingTypes(votingTypes).map(votingType => {
// 						return (
// 							<MenuItem
// 								value={"" + votingType.value}
// 								key={`votingTypeType_${votingType.value}`}
// 							>
// 								{translate[votingType.label]}
// 							</MenuItem>
// 						);
// 					})}
// 				</SelectInput>
// 			)}
// 		</GridItem>
// 		<GridItem xs={11} lg={12} md={12}>
// 			<TextInput
// 				floatingText={translate.description}
// 				type="text"
// 				errorText={errors.description}
// 				value={draft.description}
// 				onChange={event =>
// 					updateState({
// 						description: event.nativeEvent.target.value
// 					})
// 				}
// 			/>
// 		</GridItem>
// 		{(CBX.hasVotation(draft.votationType) && draft.type === 1) && (
// 			<Fragment>
// 				<GridItem xs={6} lg={3} md={3}>
// 					<SelectInput
// 						floatingText={translate.majority_label}
// 						value={"" + draft.majorityType || 1}
// 						errorText={errors.majorityType}
// 						onChange={event =>
// 							updateState({
// 								majorityType: +event.target.value
// 							})
// 						}
// 					>
// 						{majorityTypes.map(majority => {
// 							return (
// 								<MenuItem
// 									value={"" + majority.value}
// 									key={`majorityType_${majority.value}`}
// 								>
// 									{translate[majority.label]}
// 								</MenuItem>
// 							);
// 						})}
// 					</SelectInput>
// 				</GridItem>
// 				<GridItem xs={6} lg={3} md={3}>
// 					{CBX.majorityNeedsInput(draft.majorityType) && (
// 						<MajorityInput
// 							type={draft.majorityType}
// 							value={draft.majority}
// 							divider={draft.majorityDivider}
// 							majorityError={errors.majority}
// 							dividerError={errors.majorityDivider}
// 							onChange={value =>
// 								updateState({
// 									majority: +value
// 								})
// 							}
// 							onChangeDivider={value =>
// 								updateState({
// 									majorityDivider: +value
// 								})
// 							}
// 						/>
// 					)}
// 				</GridItem>
// 			</Fragment>
// 		)}
// 		<GridItem xs={11} lg={12} md={12}>
// 			<RichTextInput
// 				value={draft.text || ""}
// 				errorText={errors.text}
// 				translate={translate}
// 				onChange={value =>
// 					updateState({
// 						text: value
// 					})
// 				}
// 				tags={CBX.getTagVariablesByDraftType(draft.type, translate)}
// 			/>
// 		</GridItem>