import React from 'react';
import { Paper } from 'material-ui';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import FontAwesome from 'react-fontawesome';
import {
	BasicButton,
	ButtonIcon,
	Scrollbar,
	Grid,
	GridItem,
	FileUploadButton,
	AlertConfirm
} from '../../../displayComponents';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { importCensus, getCensusTemplate, checkUniqueCensusEmails } from '../../../queries/census';
import { checkValidEmail } from '../../../utils';
import { downloadFile } from '../../../utils/CBX';
import { isMobile } from '../../../utils/screen';

let XLSX;
import('xlsx').then(data => { XLSX = data; });

const original = {
	NOMBRE: 'name',
	APELLIDOS: 'surname',
	DNI: 'dni',
	CARGO: 'position',
	EMAIL: 'email',
	TELÉFONO: 'phone',
	IDIOMA: 'language_TEXT',
	'Nº VOTOS': 'numParticipations',
	'N votos': 'numParticipations',
	'N participaciones': 'socialCapital',
	'N participacións': 'socialCapital',
	'Nº PARTICIPACIONES': 'socialCapital',
	'RAZÓN SOCIAL': 'r_name',
	CIF: 'r_dni',
	'EMAIL RAZÓN SOCIAL': 'r_email',
	'TELÉFONO RAZÓN SOCIAL': 'r_phone',
	NAME: 'name',
	SURNAME: 'surname',
	POSITION: 'position',
	PHONE: 'phone',
	LANGUAGE: 'language_TEXT',
	'No. VOTES': 'numParticipations',
	'No. SHARES': 'socialCapital',
	'BUSINESS NAME': 'r_name',
	'EMAIL BUSINESS NAME': 'r_email',
	'PHONE BUSINESS NAME': 'r_phone',
	NOM: 'name',
	COGNOMS: 'surname',
	CÀRREC: 'position',
	TELÉFON: 'phone',
	LLENGUA: 'language_TEXT',
	'Nº VOTS': 'numParticipations',
	'Nº PARTICIPACIONS': 'socialCapital',
	'RAÓ SOCIAL': 'r_name',
	'EMAIL RAÓ SOCIAL': 'r_email',
	'TELÉFON RAÓ SOCIAL': 'r_phone',
	NOME: 'name',
	SOBRENOME: 'surname',
	'Nº AÇÕES': 'numParticipations',
	'RAZÃO SOCIAL': 'r_name',
	'EMAIL RAZÃO SOCIAL': 'r_email',
	'TELÉFONO RAZÃO SOCIAL': 'r_phone',
	APELIDOS: 'surname',
	'Nº PARTICIPACIÓNS': 'socialCapital'
};

const excelToDBColumns = Object.keys(original).reduce((acc, curr) => {
	acc[curr.toLowerCase()] = original[curr];
	return acc;
}, {});

const languages = {
	español: 'es',
	english: 'en',
	português: 'pt',
	català: 'cat',
	galego: 'gal'
};

function toJSON(workbook) {
	const result = {};
	workbook.SheetNames.forEach(sheetName => {
		const roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
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
				language
			}
		});

		if (response) {
			if (response.data) {
				downloadFile(
					response.data.getCensusTemplate,
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					'censusTemplate.xlsx'
				);
				this.setState({
					downloading: false
				});
			}
		}
	};

	read = workbook => {
		const wb = XLSX.read(workbook, { type: 'binary' });
		return toJSON(wb);
	};

	close = () => {
		this.setState(this.initialState);
	}

	checkUniqueEmails = async participants => {
		const uniqueEmails = new Map();
		const duplicatedEmails = new Map();
		participants.forEach((censusP, index) => {
			if (censusP.participant.email) {
				const item = uniqueEmails.get(censusP.participant.email);
				if (item) {
					if (item.name !== censusP.participant.name || item.surname !== censusP.participant.surname || item.dni !== censusP.participant.dni) {
						duplicatedEmails.set(censusP.participant.email, [index + 2]);
					}
				} else {
					uniqueEmails.set(censusP.participant.email, censusP.participant);
				}
			}


			if (censusP.representative) {
				if (censusP.representative.email) {
					const item = uniqueEmails.get(censusP.representative.email);
					if (item) {
						if (item.name !== censusP.representative.name || item.surname !== censusP.representative.surname || item.dni !== censusP.representative.dni) {
							duplicatedEmails.set(censusP.representative.email, [index + 2]);
						}
					} else {
						uniqueEmails.set(censusP.representative.email, censusP.representative);
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
		uniqueEmails.forEach((value, key) => emails.push(key));

		const response = await this.props.client.query({
			query: checkUniqueCensusEmails,
			variables: {
				censusId: this.props.censusId,
				emailList: emails
			}
		});

		if (!response.data.checkUniqueCensusEmails.success) {
			const json = JSON.parse(response.data.checkUniqueCensusEmails.message);
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

		const reader = new FileReader();
		reader.readAsBinaryString(file);

		reader.onload = async () => {
			const result = await this.read(reader.result);
			const pages = Object.keys(result);
			this.setState({
				processing: result[pages[0]].length
			});
			if (pages.length >= 1) {
				const participants = await this.prepareParticipants(result[pages[0]]);
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
						});
					}
				}
			}
		};
	};

	prepareParticipants = async participants => {
		const preparedParticipants = [];
		const invalidEmails = [];

		if (participants) {
			for (let i = 0; i < participants.length; i++) {
				const participant = this.prepareParticipant(participants[i]);
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
				invalidEmails
			});
			return;
		}

		const duplicatedEmails = await this.checkUniqueEmails(preparedParticipants);
		if (!duplicatedEmails) {
			if (preparedParticipants.length > 0) {
				if (preparedParticipants[0].participant.email === 'example@councilbox.com') {
					preparedParticipants.splice(0, 1);
				}
			}
			return preparedParticipants;
		}
		this.setState({
			step: 5,
			invalidEmails: duplicatedEmails.emails,
			duplicatedType: duplicatedEmails.type
		});
	};

	prepareParticipant = _participant => {
		const { selectedLanguage: language } = this.props.translate;

		const keys = Object.keys(_participant);

		const participant = {
			companyId: this.props.companyId,
			censusId: this.props.censusId
		};

		for (let j = 0; j < keys.length; j++) {
			const key = keys[j];
			if (excelToDBColumns[key.toLowerCase()]) {
				console.log(key.toLowerCase());
				if (key.toLowerCase() === 'email') {
					participant[excelToDBColumns[key.toLocaleLowerCase()]] = `${_participant[key].trim().toLowerCase()}`;
				} else {
					participant[excelToDBColumns[key.toLocaleLowerCase()]] = `${_participant[key].trim()}`;
				}
			}
		}

		if (!participant.language_TEXT) {
			participant.language = language;
		} else if (languages[participant.language_TEXT.toLowerCase()]) {
			participant.language = languages[participant.language_TEXT.toLowerCase()];
		} else {
			participant.language = language;
		}
		delete participant.language_TEXT;

		if (participant.r_name && participant.r_name !== '-') {
			return this.checkEntityParticipant(participant);
		}
		return this.checkPersonParticipant(participant);
	};

	updateState = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
			}
		});
	};


	cleanPhone = phone => {
		if (!phone) {
			return '';
		}

		return phone.replace(/\"/g, '');
	}


	checkEntityParticipant = participant => {
		let errors = null;
		const mappedParticipant = {};
		if (participant.name) {
			const participantError = this.checkRequiredFields(participant, false);
			errors = participantError;
			mappedParticipant.representative = {
				companyId: this.props.companyId,
				censusId: this.props.censusId,
				name: participant.name || '',
				position: participant.position || '',
				surname: participant.surname || '',
				email: participant.email ? participant.email.toLowerCase() : '',
				dni: participant.dni || '',
				phone: this.cleanPhone(participant.phone),
				language: participant.language,
			};
		}
		const participantError = this.checkRequiredFields(participant, true);
		if (participantError || errors) {
			return { ...errors, ...participantError };
		}

		const numParticipations = participant.numParticipations ?
			participant.numParticipations.replace(/[.,]/g, '')
			: participant.socialCapital ? participant.socialCapital.replace(/[.,]/g, '') : 0;

		return {
			participant: {
				companyId: this.props.companyId,
				censusId: this.props.censusId,
				name: participant.r_name || '',
				email: participant.r_email ? participant.r_email.toLowerCase() : null,
				dni: participant.r_dni || '',
				phone: this.cleanPhone(participant.r_phone),
				personOrEntity: 1,
				language: participant.language,
				numParticipations: +numParticipations,
				socialCapital: participant.socialCapital ? +participant.socialCapital.replace(/[.,]/g, '') : +numParticipations,
				position: participant.position,
			},
			...mappedParticipant
		};
	}

	checkPersonParticipant = participant => {
		const participantError = this.checkRequiredFields(participant, false);
		if (participantError) {
			return participantError;
		}
		const numParticipations = participant.numParticipations ?
			participant.numParticipations.replace(/[.,]/g, '')
			: participant.socialCapital ? participant.socialCapital.replace(/[.,]/g, '') : 0;


		return {
			participant: {
				companyId: this.props.companyId,
				censusId: this.props.censusId,
				name: participant.name,
				surname: participant.surname,
				dni: participant.dni,
				position: participant.position,
				email: participant.email,
				phone: this.cleanPhone(participant.phone),
				language: participant.language,
				numParticipations: +numParticipations,
				socialCapital: participant.socialCapital ? +participant.socialCapital.replace(/[.,]/g, '') : +numParticipations,
			}
		};
	}

	checkRequiredFields = (participant, isEntity) => {
		const required = 'required';

		const errors = {
			name: '',
			surname: '',
			dni: '',
			phone: '',
			language: '',
			r_name: '',
			hasError: false,
			r_dni: '',
			r_email: '',
			r_phone: ''
		};

		if (!isEntity) {
			if (!checkValidEmail(participant.email)) {
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
			if (!participant.r_name) {
				errors.r_name = required;
				errors.hasError = true;
			}
			if (participant.r_email) {
				if (!checkValidEmail(participant.r_email)) {
					errors.r_email = required;
					errors.hasError = true;
				}
			}
		}

		return errors.hasError ? errors : false;
	}

	buildErrorString = errors => {
		const { translate } = this.props;

		let string = `${translate.entry}: ${errors.line}: ${errors.name ? `${translate.name}, ` : ''}${errors.surname ? `${translate.new_surname}, ` : ''}${errors.dni ? `${translate.dni}, ` : ''}${errors.phone ? `${translate.phone}, ` : ''}${errors.email ? `${translate.login_email}, ` : ''}${errors.r_name ? `${translate.entity_name}, ` : ''}${errors.r_dni ? `${translate.entity_cif}, ` : ''}${errors.r_phone ? `${translate.entity_phone}, ` : ''}${errors.r_email ? `${translate.entity_email}, ` : ''
			}`;
		if (string.charAt(string.length - 2) === ',') {
			string = `${string.substr(0, string.length - 2)}.`;
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
					id="import-census-excel"
					color={secondary}
					textStyle={{
						color: 'white',
						fontWeight: '700',
						fontSize: isMobile ? '.75rem' : '.9rem',
						textTransform: 'none'
					}}
					textPosition="after"
					icon={<ButtonIcon style={{ fontSize: isMobile && '1rem' }} type="import_export" color="white" />}
					onClick={() => this.setState({ modal: true })}
					buttonStyle={{
						width: isMobile && '150px',
					}}
				/>
				<AlertConfirm
					bodyStyle={{ overflow: 'hidden' }}
					requestClose={this.close}
					open={this.state.modal}
					bodyText={
						<div>
							{step === 1 && (
								<React.Fragment>
									<Grid>
										<GridItem xs={12} md={6} lg={6} style={{ display: 'flex', justifyContent: 'center' }}>
											<div style={{ width: '100%' }}>
												<BasicButton
													text={translate.download_template}
													color={secondary}
													disabled={this.state.loading}
													textStyle={{
														color: 'white',
														fontWeight: '700',
														fontSize: '0.9em',
														textTransform: 'none',
														width: '100%'
													}}
													loading={downloading}
													textPosition="after"
													icon={<ButtonIcon type="add" color="white" />}
													onClick={this.getCensusTemplate}
													buttonStyle={{
														marginRight: '1em',
													}}
												/>
											</div>
										</GridItem>
										<GridItem xs={12} md={6} lg={6}>
											<FileUploadButton
												accept=".xlsx"
												loading={this.state.loading}
												text={translate.import_template}
												style={{
													width: '100%'
												}}
												buttonStyle={{ width: '100%' }}
												color={primary}
												textStyle={{
													color: 'white',
													fontWeight: '700',
													fontSize: '0.9em',
													textTransform: 'none'
												}}
												icon={
													<ButtonIcon type="publish" color="white" />
												}
												onChange={this.handleFile}
											/>
											{this.state.loading
												&& <span style={{ fontSize: '0.85em' }}>
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
									{translate.no_valid_participants}
								</div>
							)}
							{step === 3 && (
								<div>
									<div
										style={{ height: '70vh', overflow: 'hidden' }}
									>
										{translate.result_reading_press_confirm}:
										<div style={{ height: 'calc( 100% - 4em )' }}>
											<Scrollbar>
												<div
													style={{ width: '100%' }}
												>
													{this.state.readedParticipants.map((item, index) => (
														<Paper
															style={{
																margin: '0.4em', marginBottom: 0, fontSize: '14px', padding: '0.4em'
															}}
															key={`excelParticipant_${index}`}
														>
															<FontAwesome
																name={'tag'}
																style={{
																	color: secondary,
																	fontSize: '0.8em',
																	marginRight: '0.3em'
																}}
															/>{`${item.participant.name} ${item.participant.surname || ''} - ${item.participant.dni || ''}`}<br />
															<FontAwesome
																name={'at'}
																style={{
																	color: secondary,
																	fontSize: '0.8em',
																	marginRight: '0.3em'
																}}
															/>{`${item.participant.email || ''}`}<br />
															{!!item.representative
																&& <React.Fragment>
																	{`${translate.represented_by}: ${item.representative.name} ${item.representative.surname || ''}`}
																	<br />
																</React.Fragment>
															}
														</Paper>
													))}
												</div>
											</Scrollbar>
										</div>
									</div>
									<BasicButton
										text={translate.send}
										color={primary}
										icon={<ButtonIcon type="send" color="white" />}
										textStyle={{ fontWeight: '700', color: 'white', textTransform: 'none' }}
										onClick={this.sendImportedParticipants}
									/>
								</div>
							)}
							{step === 4 && (
								<div>
									<div style={{ height: '70vh', overflow: 'hidden' }}>
										<div style={{ height: 'calc( 100% - 4em )' }}>
											<Scrollbar>
												<div
													style={{
														fontSize: '1.2em',
														color: primary,
														fontWeight: '700',
													}}
												>
													{translate.attention}
												</div>
												{translate.import_can_not_be_done}<br />
												{translate.please_correct_errors_and_resend}
												<div
													style={{ width: '100%' }}
												>
													{this.state.invalidEmails.map(item => (
														<React.Fragment key={`invalidEmails_${item.line}`}>
															{this.buildErrorString(item)}<br />
														</React.Fragment>
													))}
												</div>
											</Scrollbar>
										</div>
									</div>
								</div>
							)}
							{step === 5 && (
								<div>
									<div style={{ height: '70vh', overflow: 'hidden' }}>
										<div style={{ height: 'calc(100%)' }}>
											<Scrollbar>
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
													translate.following_emails_already_present_in_current_census
													: translate.following_emails_are_duplicated_in_sent_file
												}
												<div
													style={{ width: '100%' }}
												>
													{this.state.invalidEmails.map(item => (
														<React.Fragment key={`invalidEmails_${item[0]}`}>
															{`${translate.entry} ${item[1]}: ${item[0]}`}<br />
														</React.Fragment>
													))}
												</div>
											</Scrollbar>
										</div>
									</div>
								</div>
							)}
						</div>
					}
					title={translate.import_census}
				/>
			</React.Fragment>
		);
	}
}

export default compose(
	graphql(getCensusTemplate, {
		name: 'getCensusTemplate'
	}),
	graphql(importCensus, {
		name: 'importCensus'
	})
)(withApollo(ImportCensusButton));
