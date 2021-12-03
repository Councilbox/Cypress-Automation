import React from 'react';
import { AGENDA_TYPES, INPUT_REGEX, MAJORITY_TYPES } from '../constants';
import { checkForUnclosedBraces, majorityNeedsInput } from './CBX';
import { LiveToast } from '../displayComponents';

export const checkValidEmail = email => {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email) && !/\'|\"|\\|\//.test(email);
};


export const checkValidMajority = (majority, divider, type, translate) => {
	if (type === MAJORITY_TYPES.PERCENTAGE) {
		if (majority > 100) {
			return {
				error: true,
				message: translate.percentage_error
			};
		}
	}

	if (type === MAJORITY_TYPES.FRACTION) {
		if ((majority / divider) > 1) {
			return {
				error: true,
				message: translate.fraction_values_error
			};
		}
	}

	return {
		error: false
	};
};

export const checkRequiredFieldsParticipant = (
	participant,
	translate,
	hasSocialCapital,
	company
) => {
	const errors = {
		name: '',
		surname: '',
		dni: '',
		email: '',
		phone: '',
		language: '',
		numParticipations: '',
		socialCapital: '',
		secondaryEmail: ''
	};

	let hasError = false;

	if (!participant.name || !participant.name.trim()) {
		hasError = true;
		errors.name = translate.field_required;
	}

	if (company && company.type !== 10) {
		if (!participant.surname && !participant.surname.trim() && participant.personOrEntity === 0) {
			hasError = true;
			errors.surname = translate.field_required;
		}

		if (participant.secondaryEmail) {
			if (!checkValidEmail(participant.secondaryEmail.toLocaleLowerCase())) {
				hasError = true;
				errors.secondaryEmail = translate.tooltip_invalid_email_address;
			}
		}
		if (participant.email) {
			if (!checkValidEmail(participant.email.toLocaleLowerCase())) {
				hasError = true;
				errors.email = translate.valid_email_required;
			}
		} else {
			hasError = true;
			errors.email = translate.valid_email_required;
		}

		if (participant.phone) {
			const test = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
			if (!test.test(participant.phone)) {
				errors.phone = translate.invalid_field;
				hasError = true;
			}
		}

		if (!participant.language) {
			hasError = true;
			errors.language = translate.field_required;
		}

		if (!participant.numParticipations && participant.numParticipations !== 0) {
			hasError = true;
			errors.numParticipations = translate.field_required;
		}

		if (hasSocialCapital && !participant.socialCapital && participant.socialCapital !== 0) {
			hasError = true;
			errors.socialCapital = translate.field_required;
		}
	}

	return {
		errors,
		hasError
	};
};

export const checkRequiredFieldsRepresentative = (participant, translate) => {
	const errors = {
		name: '',
		surname: '',
		dni: '',
		email: '',
		phone: '',
		language: ''
	};

	let hasError = false;
	const regex = INPUT_REGEX;

	if (participant.name) {
		if (!(regex.test(participant.name)) || !participant.name.trim()) {
			errors.name = translate.invalid_field;
			hasError = true;
		}
	}
	if (participant.surname) {
		if (!(regex.test(participant.surname)) || !participant.surname.trim()) {
			errors.surname = translate.invalid_field;
			hasError = true;
		}
	}

	if (participant.dni) {
		if (!(regex.test(participant.dni)) || !participant.dni.trim()) {
			errors.dni = translate.invalid_field;
			hasError = true;
		}
	}

	if (!participant.name) {
		hasError = true;
		errors.name = translate.field_required;
	}

	if (!participant.surname) {
		hasError = true;
		errors.surname = translate.field_required;
	}

	if (!participant.dni) {
		hasError = true;
		errors.dni = translate.field_required;
	}

	if (!checkValidEmail(participant.email.toLocaleLowerCase())) {
		hasError = true;
		errors.email = translate.valid_email_required;
	}

	if (participant.secondaryEmail && !!participant.secondaryEmail.trim()) {
		if (!checkValidEmail(participant.secondaryEmail.toLocaleLowerCase())) {
			hasError = true;
			errors.secondaryEmail = translate.tooltip_invalid_email_address;
		}
	}

	if (participant.phone) {
		const test = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
		if (!test.test(participant.phone)) {
			errors.phone = translate.invalid_field;
			hasError = true;
		}
	}

	if (!participant.language) {
		hasError = true;
		errors.language = translate.field_required;
	}

	return {
		errors,
		hasError
	};
};

export const checkRequiredFieldsAgenda = (agenda, translate, toast) => {
	const errors = {
		agendaSubject: '',
		subjectType: '',
		description: '',
		majorityType: '',
		majority: '',
		majorityDivider: ''
	};

	let hasError = false;
	const regex = INPUT_REGEX;

	if (agenda.agendaSubject) {
		if (!(regex.test(agenda.agendaSubject)) || !agenda.agendaSubject.trim()) {
			hasError = true;
			errors.agendaSubject = translate.invalid_field;
		}
	}

	if (!agenda.agendaSubject) {
		hasError = true;
		errors.agendaSubject = translate.field_required;
	}

	if (!agenda.subjectType && agenda.subjectType !== 0) {
		hasError = true;
		errors.subjectType = translate.field_required;
	}

	if (majorityNeedsInput(agenda) && !agenda.majority && agenda.majority !== 0) {
		hasError = true;
		errors.majority = translate.field_required;
	}

	if (agenda.description) {
		if (checkForUnclosedBraces(agenda.description)) {
			hasError = true;
			errors.description = true;
			toast(
				<LiveToast
					message={translate.revise_text}
					id="error-toast"
				/>, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,
					className: 'errorToast'
				}
			);
		}
	}

	if (agenda.subjectType !== AGENDA_TYPES.INFORMATIVE) {
		if (!agenda.majorityType && agenda.majorityType !== 0) {
			hasError = true;
			errors.majorityType = translate.field_required;
		}
		if (
			agenda.majorityType === 0
|| agenda.majorityType === 5
|| agenda.majorityType === 6
		) {
			if (!agenda.majority) {
				hasError = true;
				errors.majority = translate.field_required;
			}
			if (agenda.majorityType === 5) {
				if (!agenda.majorityDivider) {
					hasError = true;
					errors.majorityDivider = translate.field_required;
				}
			}
		}
	}

	return {
		errors,
		hasError
	};
};
