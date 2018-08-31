import React from "react";
import {
	BasicButton,
	ButtonIcon,
	Scrollbar,
	Grid,
	GridItem,
	CustomDialog,
	FileUploadButton
} from "../../../displayComponents";
import { Paper } from 'material-ui';
import { graphql, compose, withApollo } from "react-apollo";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { importCensus, getCensusTemplate, checkUniqueCensusEmails } from "../../../queries/census";
import { checkValidEmail } from "../../../utils";
import { downloadFile } from "../../../utils/CBX";
import FontAwesome from 'react-fontawesome';
let XLSX;
import('xlsx').then(data => XLSX = data);

const excelToDBColumns = {
	NOMBRE: "name",
	APELLIDOS: "surname",
	DNI: "dni",
	CARGO: "position",
	EMAIL: "email",
	TELÉFONO: "phone",
	IDIOMA: "language_TEXT",
	"Nº VOTOS": "numParticipations",
	"Nº PARTICIPACIONES": "socialCapital",
	"RAZÓN SOCIAL": "r_name",
	CIF: "r_dni",
	"EMAIL RAZÓN SOCIAL": "r_email",
	"TELÉFONO RAZÓN SOCIAL": "r_phone",
	NAME: "name",
	SURNAME: "surname",
	POSITION: "position",
	PHONE: "phone",
	LANGUAGE: "language_TEXT",
	"No. VOTES": "numParticipations",
	"No. SHARES": "socialCapital",
	"BUSINESS NAME": "r_name",
	"EMAIL BUSINESS NAME": "r_email",
	"PHONE BUSINESS NAME": "r_phone",
	NOM: "name",
	COGNOMS: "surname",
	CÀRREC: "position",
	TELÉFON: "phone",
	LLENGUA: "language_TEXT",
	"Nº VOTS": "numParticipations",
	"Nº PARTICIPACIONS": "socialCapital",
	"RAÓ SOCIAL": "r_name",
	"EMAIL RAÓ SOCIAL": "r_email",
	"TELÉFON RAÓ SOCIAL": "r_phone",
	NOME: "name",
	SOBRENOME: "surname",
	"Nº AÇÕES": "numParticipations",
	"RAZÃO SOCIAL": "r_name",
	"EMAIL RAZÃO SOCIAL": "r_email",
	"TELÉFONO RAZÃO SOCIAL": "r_phone",
	APELIDOS: "surname",
	"Nº PARTICIPACIÓNS": "socialCapital"
};

const languages = {
	español: "es",
	english: "en",
	português: "pt",
	català: "cat",
	galego: "gal"
};

function to_json(workbook) {
	let result = {};
	workbook.SheetNames.forEach(sheetName => {
		let roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if (roa.length > 0) {
			result[sheetName] = roa;
		}
	});
	return result;
}

class ImportCensusButton extends React.Component {
	state = {
		step: 1,
		modal: false,
		data: [],
		errors: {},
		loading: false,
		processing: false,
		sending: false
	};

	initialState = this.state;

	getCensusTemplate = async () => {
		const { selectedLanguage: language } = this.props.translate;
		this.setState({ downloading: true });

		const response = await this.props.getCensusTemplate({
			variables: {
				language: language
			}
		});

		if (response) {
			if (response.data) {
				downloadFile(
					response.data.getCensusTemplate,
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
					`censusTemplate.xlsx`
				);
				this.setState({
					downloading: false
				});
			}
		}
	};

	read = workbook => {
		const wb = XLSX.read(workbook, { type: 'binary' });
		return to_json(wb);
	};

	close = () => {
		this.setState(this.initialState);
	}

	checkUniqueEmails = async (participants) => {
		let uniqueEmails = new Map();
		let duplicatedEmails = new Map();
		participants.forEach((censusP, index) => {
			console.log(censusP);
			if(censusP.participant.email){
				if (uniqueEmails.get(censusP.participant.email)) {
					duplicatedEmails.set(censusP.participant.email, [index + 2]);
				} else {
					uniqueEmails.set(censusP.participant.email, index + 2);
				}
			}


			if (censusP.representative) {
				if(censusP.representative.email){
					if (uniqueEmails.get(censusP.representative.email)) {
						duplicatedEmails.set(censusP.representative.email, [index + 2]);
					} else {
						uniqueEmails.set(censusP.representative.email, index + 2);
					}
				}
			}
		});

		if (duplicatedEmails.size > 0) {
			const emails = [];
			duplicatedEmails.forEach((value, key) => emails.push([key, value]));
			return {
				emails,
				type: 'File'
			};
		}

		const emails = [];
		uniqueEmails.forEach((value, key, map) => emails.push(key));

		const response = await this.props.client.query({
			query: checkUniqueCensusEmails,
			variables: {
				censusId: this.props.censusId,
				emailList: emails
			}
		});

		if (!response.data.checkUniqueCensusEmails.success) {
			const json = JSON.parse(response.data.checkUniqueCensusEmails.message);
			console.log(JSON);
			const dEmails = [];
			json.duplicatedEmails.forEach(email => dEmails.push([email, uniqueEmails.get(email)]));
			dEmails.sort((a, b) => a[1] - b[1]);
			return {
				emails: dEmails,
				type: 'DB'
			};
		}

		return false;
	}

	sendImportedParticipants = async () => {
		const response = await this.props.importCensus({
			variables: {
				importList: this.state.readedParticipants
			}
		});

		if (response) {
			this.props.refetch();
			this.setState({
				modal: false,
				loading: false,
				processing: false,
				step: 1
			});
		}
	}

	handleFile = async event => {
		const file = event.nativeEvent.target.files[0];
		if (!file) {
			return;
		}

		this.setState({
			loading: true,
			processed: 0
		});

		let reader = new FileReader();
		reader.readAsBinaryString(file);

		reader.onload = async () => {
			const result = await this.read(reader.result);
			const pages = Object.keys(result);
			this.setState({
				processing: result.census.length
			});
			if (pages.length >= 1) {
				const participants = await this.prepareParticipants(result["census"]);
				if (participants) {
					if (participants.length > 0) {
						this.setState({
							processing: false,
							loading: false,
							readedParticipants: participants,
							step: 3
						});
					} else {
						this.setState({
							processing: false,
							loading: false,
							step: 2
						})
					}
				}

			} else {
				console.error(result);
			}
		};
	};

	prepareParticipants = async participants => {
		let preparedParticipants = [];
		let invalidEmails = [];

		if (participants) {
			for (var i = 0; i < participants.length; i++) {
				let participant = this.prepareParticipant(participants[i]);
				if (participant.hasError) {
					participant.line = i + 2;
					invalidEmails.push(participant);
				} else {
					preparedParticipants.push(participant);
				}
			}
		}

		if (invalidEmails.length > 0) {
			this.setState({
				step: 4,
				invalidEmails: invalidEmails
			});
			return;
		}

		const duplicatedEmails = await this.checkUniqueEmails(preparedParticipants);

		if (!duplicatedEmails) {
			if (preparedParticipants.length > 0) {
				if (preparedParticipants[0].participant.email === "example@councilbox.com") {
					preparedParticipants.splice(0, 1);
				}
			}
			return preparedParticipants;
		} else {
			this.setState({
				step: 5,
				invalidEmails: duplicatedEmails.emails,
				duplicatedType: duplicatedEmails.type
			});
		}
	};

	prepareParticipant = _participant => {
		let { selectedLanguage: language } = this.props.translate;

		var keys = Object.keys(_participant);

		let participant = {
			companyId: this.props.companyId,
			censusId: this.props.censusId
		};

		for (var j = 0; j < keys.length; j++) {
			var key = keys[j];
			if (excelToDBColumns[key]) {
				participant[excelToDBColumns[key]] = '' + _participant[key].trim();
			}
		}

		if (!participant.language_TEXT) {
			participant.language = language;
		} else if (languages[participant.language_TEXT.toLowerCase()]) {
			participant.language =
				languages[participant.language_TEXT.toLowerCase()];
		} else {
			participant.language = language;
		}
		delete participant.language_TEXT;

		if(participant.r_name){
			return this.checkEntityParticipant(participant);
		}else{
			return  this.checkPersonParticipant(participant);
		}
	};

	updateState = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
			}
		});
	};

	checkEntityParticipant = participant => {
		let errors = {};
		const mappedParticipant = {};
		if(participant.name){
			const participantError = this.checkRequiredFields(participant, false);
			if (participantError) {
				errors = participantError;
			} else {
				mappedParticipant.representative = {
					companyId: this.props.companyId,
					censusId: this.props.censusId,
					name: participant.name,
					surname: participant.surname,
					email: participant.email.toLowerCase(),
					dni: participant.dni,
					phone: participant.phone,
					language: participant.language,
				}
			}
		}
		const participantError = this.checkRequiredFields(participant, true);
		if (participantError) {
			return { ...errors, ...participantError};
		}
		return {
			participant: {
				companyId: this.props.companyId,
				censusId: this.props.censusId,
				name: participant.r_name,
				email: participant.r_email.toLowerCase(),
				dni: participant.r_dni,
				phone: participant.r_phone,
				personOrEntity: 1,
				language: participant.language,
				numParticipations: participant.numParticipations,
				socialCapital: participant.socialCapital,
				position: participant.position,
			},
			...mappedParticipant
		};

	}

	checkPersonParticipant = participant => {
		const participantError = this.checkRequiredFields(participant, false);
		if (participantError) {
			console.log('participant error');
			return participantError;
		}
		return { participant: participant }
	}

	checkRequiredFields = (participant, isEntity) => {
		 const required = 'required'

		let errors = {
			name: '',
			surname: '',
			dni: '',
			phone: '',
			language: '',
			r_name: '',
			hasError: false,
			r_dni: '',
			r_phone: ''
		}

		if (!isEntity) {
			if(!checkValidEmail(participant.email)){
				errors.email = required;
				errors.hasError = true;
			}

			if (!participant.name) {
				errors.name = required;
				errors.hasError = true;
			}

			if (!participant.surname) {
				errors.surname = required;
				errors.hasError = true;
			}

			if (!participant.dni) {
				errors.dni = required;
				errors.hasError = true;
			}

			if (!participant.phone) {
				errors.phone = required;
				errors.hasError = true;
			}

			if (!participant.language) {
				errors.dni = required;
				errors.hasError = true;
			}
		} else {
			if(!checkValidEmail(participant.r_email)){
				errors.r_email = required;
				errors.hasError = true;
			}

			if (!participant.r_name) {
				errors.r_name = required;
				errors.hasError = true;
			}

			if (!participant.r_dni) {
				errors.r_dni = required;
				errors.hasError = true;
			}

			if (!participant.r_phone) {
				errors.r_phone = required;
				errors.hasError = true;
			}
		}

		return errors.hasError ? errors : false;
	}

	buildErrorString = (errors) => {
		const translate = this.props.translate;

		let string = `Entrada: ${
			errors.line}: ${
			errors.name ? `${translate.name}, ` : ''}${
			errors.surname ? `${translate.new_surname}, ` : ''}${
			errors.dni ? `${translate.dni}, ` : ''}${
			errors.phone ? `${translate.phone}, ` : ''}${
			errors.email ? `${translate.login_email}, ` : ''}${
			errors.r_name ? `nombre de la entidad, ` /*TRADUCCION*/ : ''}${
			errors.r_dni ? `CIF de la entidad, ` /*TRADUCCION*/ : ''}${
			errors.r_phone ? `nº de teléfono de la entidad, ` /*TRADUCCION*/ : ''}${
			errors.r_email ? `email de la entidad, ` /*TRADUCCION*/ : ''
			}`;
		if (string.charAt(string.length - 2) === ',') {
			string = string.substr(0, string.length - 2) + '.';
		}

		return string;
	}

	render() {
		const { translate } = this.props;
		const { step, downloading } = this.state;
		const primary = getPrimary();
		const secondary = getSecondary();

		return (
			<React.Fragment>
				<BasicButton
					text={translate.import_census}
					color={secondary}
					textStyle={{
						color: 'white',
						fontWeight: "700",
						fontSize: "0.9em",
						textTransform: "none"
					}}
					textPosition="after"
					icon={<ButtonIcon type="import_export" color="white" />}
					onClick={() => this.setState({ modal: true })}
					buttonStyle={{
						marginRight: "1em",
					}}
				/>

				<CustomDialog
					requestClose={this.close}
					open={this.state.modal}
					title={translate.import_census}
					{...(step === 3 ? {
						actions:
							<BasicButton
								text={translate.send}
								color={primary}
								icon={<ButtonIcon type="send" color="white" />}
								textStyle={{ fontWeight: '700', color: 'white', textTransform: 'none' }}
								onClick={this.sendImportedParticipants}
							/>
					} : {})}
				>
					{step === 1 && (
						<React.Fragment>
							<Grid>
								<GridItem xs={6} md={6} lg={6} style={{ display: 'flex', justifyContent: 'center' }}>
									<div>
										<BasicButton
											text={translate.download_template}
											color={secondary}
											disabled={this.state.loading}
											textStyle={{
												color: 'white',
												fontWeight: "700",
												fontSize: "0.9em",
												textTransform: "none"
											}}
											loading={downloading}
											textPosition="after"
											icon={<ButtonIcon type="add" color="white" />}
											onClick={this.getCensusTemplate}
											buttonStyle={{
												marginRight: "1em",
											}}
										/>
									</div>
								</GridItem>
								<GridItem xs={6} md={6} lg={6}>
									<FileUploadButton
										accept=".xlsx"
										loading={this.state.loading}
										text={translate.import_template}
										style={{
											width: "100%"
										}}
										buttonStyle={{ width: "100%" }}
										color={primary}
										textStyle={{
											color: "white",
											fontWeight: "700",
											fontSize: "0.9em",
											textTransform: "none"
										}}
										loading={this.state.loading}
										icon={
											<ButtonIcon type="publish" color="white" />
										}
										onChange={this.handleFile}
									/>
									{this.state.loading &&
										<span style={{ fontSize: '0.85em' }}>
											{this.state.processing ? `Procesando ${this.state.processing} participantes` : 'Cargando archivo'}
										</span>
									}
								</GridItem>
							</Grid>
						</React.Fragment>
					)}
					{step === 2 && (
						<div
							style={{ height: '100px' }}
						>
							No hay ningún participante válido en el archivo. {/*TRADUCCION*/}
						</div>
					)}
					{step === 3 && (
						<div
							style={{ height: '70vh' }}
						>
							Resultado de la lectura, pulse enviar para confirmar:{/*TRADUCCION*/}
							<Scrollbar>
								<div
									style={{ width: '100%' }}
								>
									{this.state.readedParticipants.map((item, index) => (
										<Paper
											style={{ margin: '0.4em', marginBottom: 0, fontSize: '14px', padding: '0.4em' }}
											key={`excelParticipant_${index}`}
										>
											<FontAwesome
												name={"tag"}
												style={{
													color: secondary,
													fontSize: "0.8em",
													marginRight: '0.3em'
												}}
											/>{`${item.participant.name} ${item.participant.surname ? item.participant.surname : ''} - ${item.participant.dni}`}<br />
											<FontAwesome
												name={"at"}
												style={{
													color: secondary,
													fontSize: "0.8em",
													marginRight: '0.3em'
												}}
											/>{`${item.participant.email}`}<br />
											{!!item.representative &&
												<React.Fragment>
													{`${translate.represented_by}: ${item.representative.name} ${item.representative.surname}`}
													<br />
												</React.Fragment>
											}
										</Paper>
									))}
								</div>
							</Scrollbar>
						</div>
					)}
					{step === 4 && (
						<div style={{ minHeight: '10em', overflow: 'hidden', position: 'relative', maxWidth: '700px' }}>
							<div
								style={{
									fontSize: '1.2em',
									color: primary,
									fontWeight: '700',
								}}
							>
								{translate.attention}
							</div>
							No se puede realizar la importación.<br />
							Por favor corrija los errores siguientes y vuelva a enviar el archivo.{/*TRADUCCION*/}
							<div
								style={{ width: '100%' }}
							>
								{this.state.invalidEmails.map((item, index) => (
									<React.Fragment key={`invalidEmails_${item.line}`}>
										{this.buildErrorString(item)}<br />
									</React.Fragment>
								))}
							</div>
						</div>
					)}
					{step === 5 && (
						<div style={{ minHeight: '10em', overflow: 'hidden', position: 'relative', maxWidth: '700px' }}>
							<div
								style={{
									fontSize: '1.2em',
									color: primary,
									fontWeight: '700',
								}}
							>
								{translate.attention}
							</div>
							No se puede realizar la importación.<br />
							{this.state.duplicatedType === 'DB' ?
								'Los siguientes emails ya están presentes en el censo actual:'
								:
								'Los siguientes emails están duplicados en el archivo enviado:' /*TRADUCCION*/
							}
							<div
								style={{ width: '100%' }}
							>
								{this.state.invalidEmails.map((item, index) => (
									<React.Fragment key={`invalidEmails_${item[0]}`}>
										{`Entrada ${item[1]}: ${item[0]}`}<br />
									</React.Fragment>
								))}
							</div>
						</div>
					)}
				</CustomDialog>
			</React.Fragment>
		);
	}
}

export default compose(
	graphql(getCensusTemplate, {
		name: "getCensusTemplate"
	}),
	graphql(importCensus, {
		name: "importCensus"
	})
)(withApollo(ImportCensusButton));



/* if (participant.email) {
	if (!checkValidEmail(participant.email)) {
		return {hasError: true, email: 'Invalid'};
	}
	if (participant.r_email) {
		if (!checkValidEmail(participant.r_email)) {
			return {hasError: true, r_email: 'Invalid'};;
		} else {
			participant = {
				participant: {
					companyId: this.props.companyId,
					censusId: this.props.censusId,
					name: participant.r_name,
					email: participant.r_email.toLowerCase(),
					dni: participant.r_dni,
					phone: participant.r_phone,
					personOrEntity: 1,
					language: participant.language,
					numParticipations: participant.numParticipations,
					socialCapital: participant.socialCapital,
					position: participant.position,
				},
				representative: {
					companyId: this.props.companyId,
					censusId: this.props.censusId,
					name: participant.name,
					surname: participant.surname,
					email: participant.email.toLowerCase(),
					dni: participant.dni,
					phone: participant.phone,
					language: participant.language,
				}
			}

			const participantError = this.checkRequiredFields(participant.representative, false);
			if (participantError) {
				return participantError;
			}
			const entityError = this.checkRequiredFields(participant.participant, true);
			return entityError ? entityError : participant;
		}
	}
	const participantError = this.checkRequiredFields(participant, false);
	return participantError ? participantError : { participant: { ...participant, email: participant.email.toLowerCase() } };
} else {
	//Es una entidad sin representante
	if (!!participant.r_email) {
		if (!checkValidEmail(participant.r_email)) {
			return {hasError: true, r_email: 'Invalid'};
		}
		var entity = {
			participant: {
				companyId: this.props.companyId,
				censusId: this.props.censusId,
				name: participant.r_name,
				email: participant.r_email.toLowerCase(),
				dni: participant.r_dni,
				phone: participant.r_phone,
				personOrEntity: 1,
				language: participant.language,
				numParticipations: participant.numParticipations,
				socialCapital: participant.socialCapital,
				position: participant.position,
			}
		};
		const entityError = this.checkRequiredFields(entity, true);
		return entityError ? entityError : { entity };
	}
	return {hasError: true};
} */