import React from "react";
import {
	BasicButton,
	ButtonIcon,
	Scrollbar,
	CustomDialog,
	FileUploadButton
} from "../../../displayComponents";
import { Paper } from 'material-ui';
import { graphql, compose } from "react-apollo";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { importCensus, getCensusTemplate } from "../../../queries/census";
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
	var result = {};
	var index = 1;
	workbook.SheetNames.forEach(function(sheetName) {
		index++;
		var roa = XLSX.utils.sheet_to_row_object_array(
			workbook.Sheets[sheetName]
		);
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
					step: 2,
					downloading: false
				});
			}
		}
	};

	read = (workbook) => {
        const wb = XLSX.read(workbook, {type:'binary'});
        const participantsData = to_json(wb);
        console.log(participantsData);
		const pages = Object.keys(participantsData);
		this.setState({
			processing: participantsData.census.length
		});
		if (pages.length >= 1) {
			const participants = this.prepareParticipants(
				participantsData["census"]
			);
			if(participants){
				this.setState({
					processing: false,
					loading: false,
					readedParticipants: participants,
					step: 3
				});
			}
		} else {
			//console.error(workbook);
			//console.error(participantsData);
		}
	};

	sendImportedParticipants = async () => {
		const response = await this.props.importCensus({
			variables: {
				importList: this.state.readedParticipants
			}
		});

		if (response) {
			console.log(response);
			this.props.refetch();
			this.setState({
				modal: false,
				loading: false,
				processing: false,
				step: 1
			});
		}
	}


    handleFile = event => {
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
			let fileInfo = {
				filename: file.name,
				filetype: file.type,
				filesize: Math.round(file.size / 1000),
				base64: reader.result,
            };
            this.read(reader.result);
		};
	};

	prepareParticipants = participants => {
		//let { numInvalidEmails, validParticipants } = this.state;
		let preparedParticipants = [];
		let invalidEmails = [];

		if (participants) {
			for (var i = 1; i < participants.length; i++) {
				let participant = this.prepareParticipant(participants[i]);
				console.log(participant);
				if(participant.hasError){
					participant.line = i;
					invalidEmails.push(participant);
				}else{
					preparedParticipants.push(participant);
				}
			}
		}
		if(preparedParticipants.length > 0){
			if (preparedParticipants[0].email === "example@councilbox.com") {
				preparedParticipants.splice(0, 1);
			}
		}

		if (invalidEmails.length > 0) {
			this.setState({
				step: 4,
				invalidEmails: invalidEmails
			});
			return;
		}
		return preparedParticipants;
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
				participant[excelToDBColumns[key]] = ''+_participant[key].trim();
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

		//TODO parche para importar censos sin email
		// if(!participant.email){
		//     participant.email = (index++) + '@fake.com';
		// }

		if (participant.email) {
			if (!checkValidEmail(participant.email)) {
				return 'invalid';
			}
			if (participant.r_email) {
				if (!checkValidEmail(participant.r_email)) {
					return 'invalid';
				}else{
                    participant = {
                        participant: {
							companyId: this.props.companyId,
							censusId: this.props.censusId,
							name: participant.r_name,
                            email: participant.r_email,
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
                            email: participant.email,
                            dni: participant.dni,
                            phone: participant.phone,
                            language: participant.language,
                        }
					}

					const participantError = this.checkRequiredFields(participant.representative, false);
					if(participantError){
						return participantError;
					}
					const entityError = this.checkRequiredFields(participant.participant, true);
					return entityError? entityError : participant;
                }
			}
			const participantError = this.checkRequiredFields(participant, false);
			participant.dni = participant.dni.toString(10);
			return participantError? participantError : { participant };
		} else {
			//Es una entidad sin representante
			if(!!participant.r_email){
				if (!checkValidEmail(participant.r_email)) {
					return 'invalid';
				}
				var entity = {
					participant: {
						companyId: this.props.companyId,
						censusId: this.props.censusId,
						name: participant.r_name,
						email: participant.r_email,
						dni: participant.r_dni,
						phone: participant.r_phone,
						personOrEntity: 1,
						language: participant.language,
						numParticipations: participant.numParticipations,
						socialCapital: participant.socialCapital,
						position: participant.position,
					}
				};
				const entityError = this.checkRequiredFields(entity,  true);
				return entityError? entityError : { entity };
				return entity;
			}
			return 'invalid';
		}
	};

	checkRequiredFields = (participant, isEntity) => {
		const required = this.props.translate.required_field;

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

		let hasError = false;

		if(!isEntity){
			if(!participant.name){
				errors.name = required;
				errors.hasError = true;
			}

			if(!participant.surname){
				errors.surname = required;
				errors.hasError = true;
			}

			if(!participant.dni){
				errors.dni = required;
				errors.hasError = true;
			}

			if(!participant.phone){
				errors.phone = required;
				errors.hasError = true;
			}

			if(!participant.language){
				errors.dni = required;
				errors.hasError = true;
			}
		}else{
			if(!participant.name){
				errors.r_name = required;
				errors.hasError = true;
			}

			if(!participant.dni){
				errors.r_dni = required;
				errors.hasError = true;
			}

			if(!participant.phone){
				errors.r_phone = required;
				errors.hasError = true;
			}
		}

		return errors.hasError? errors : false;
	}

	updateState = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
			}
		});
	};

	buildErrorString = (errors) => {
		const translate = this.props.translate;

		let string = `Linea: ${
			errors.line}: ${
			errors.name? `${translate.name}, ` : ''}${
			errors.surname? `${translate.new_surname}, ` : ''}${
			errors.dni? `${translate.dni}, ` : ''}${
			errors.phone? `${translate.phone}, ` : ''}${
			errors.email? `${translate.login_email}, ` : ''}${
			errors.r_name? `nombre de la entidad, ` /*TRADUCCION*/ : ''}${
			errors.r_dni? `CIF de la entidad, ` /*TRADUCCION*/ : ''}${
			errors.r_phone? `nº de teléfono de la entidad, ` /*TRADUCCION*/ : ''}${
			errors.r_email? `email de la entidad, ` /*TRADUCCION*/ : ''
		}`;
		if(string.charAt(string.length - 2) === ','){
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
					requestClose={() => this.setState({ modal: false, step: 1 })}
					open={this.state.modal}
					title={translate.import_census}
					{...(step === 3? {
						actions:
							<BasicButton
								text={translate.send}
								color={primary}
								icon={<ButtonIcon type="send" color="white" />}
								textStyle={{fontWeight: '700', color: 'white', textTransform: 'none'}}
								onClick={this.sendImportedParticipants}
							/>
					} : {})}
				>
					{step === 1 && (
						<React.Fragment>
							<h4>{translate.download_template_desc}</h4>
							<BasicButton
								text={translate.download_template}
								color={secondary}
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
							<BasicButton
								text={translate.skip}
								color={secondary}
								textStyle={{
									color: 'white',
									fontWeight: "700",
									fontSize: "0.9em",
									textTransform: "none"
								}}
								textPosition="after"
								icon={<ButtonIcon type="add" color="white" />}
								onClick={() => this.setState({ step: 2 })}
								buttonStyle={{
									marginRight: "1em",
								}}
							/>
						</React.Fragment>
					)}
					{step === 2 && (
						<React.Fragment>
							<h4>{translate.import_template_desc}</h4>
							<FileUploadButton
								accept=".xlsx"
								text={translate.import_template}
								style={{
									marginTop: "2em",
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
								<span style={{fontSize: '0.85em'}}>
									{this.state.processing? `Procesando ${this.state.processing} participantes`: 'Cargando archivo'}
								</span>
							}
						</React.Fragment>
					)}
					{step === 3 && (
						<div
							style={{height: '70vh'}}
						>
							Resultado de la lectura, pulse enviar para confirmar:{/*TRADUCCION*/}
							<Scrollbar>
								<div
									style={{width: '100%'}}
								>
									{this.state.readedParticipants.map((item, index) => (
										<Paper
											style={{margin: '0.4em', marginBottom: 0, fontSize: '14px', padding: '0.4em'}}
											key={`excelParticipant_${index}`}
										>
											<FontAwesome
												name={"tag"}
												style={{
													color: secondary,
													fontSize: "0.8em",
													marginRight: '0.3em'
												}}
											/>{`${item.participant.name} ${item.participant.surname? item.participant.surname : ''} - ${item.participant.dni}`}<br/>
											<FontAwesome
												name={"at"}
												style={{
													color: secondary,
													fontSize: "0.8em",
													marginRight: '0.3em'
												}}
											/>{`${item.participant.email}`}<br />
											{!!item.representative && [
												`${translate.represented_by}: ${item.representative.name} ${item.representative.surname}`, <br />]
											}
										</Paper>
									))}
								</div>
							</Scrollbar>
						</div>
					)}
					{step === 4 && (
						<div style={{minHeight: '10em', overflow: 'hidden', position: 'relative', maxWidth: '700px'}}>
							<div
								style={{
									fontSize: '1.2em',
									color: primary,
									fontWeight: '700',
								}}
							>
								{translate.attention}
							</div>
							No se puede realizar la importación.<br/>
							Por favor corrija los errores siguientes y vuelva a enviar el archivo.{/*TRADUCCION*/}
								<div
									style={{width: '100%'}}
								>
									{this.state.invalidEmails.map((item, index) => (
										<React.Fragment key={`invalidEmails_${item.line}`}>
											{this.buildErrorString(item)}<br/>
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
)(ImportCensusButton);