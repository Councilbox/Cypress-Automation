import React from 'react';
import { AGENDA_TYPES, INPUT_REGEX, MAJORITY_TYPES } from '../constants';
import { checkForUnclosedBraces, majorityNeedsInput } from './CBX';
import { LiveToast } from '../displayComponents';

export const checkValidEmail = email => {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email) && !/\'|\"|\\|\//.test(email);
};

export const checkValidPhone = phone => {
	const re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
	return re.test(phone);
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
	representative,
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
	const regex = INPUT_REGEX;

	if (!participant.name) {
		hasError = true;
		errors.name = translate.field_required;
	} else if (!(regex.test(participant.name)) || !participant.name.trim()) {
		hasError = true;
		errors.name = translate.invalid_field;
	}

	if (company && company.type !== 10) {
		if (!participant.surname && participant.personOrEntity === 0) {
			hasError = true;
			errors.surname = translate.field_required;
		} else if ((!(regex.test(participant.surname)) || !participant.surname.trim()) && participant.personOrEntity === 0) {
			hasError = true;
			errors.surname = translate.invalid_field;
		}

		if (!participant.email && participant.personOrEntity === 0) {
			hasError = true;
			errors.email = translate.field_required;
		} else if (!checkValidEmail(participant?.email?.toLocaleLowerCase()) && !representative?.hasRepresentative) {
			hasError = true;
			errors.email = translate.tooltip_invalid_email_address;
		} else if (participant.email === representative?.email && !representative?.hasRepresentative) {
			hasError = true;
			errors.email = translate.repeated_email;
		}

		if (participant.secondaryEmail) {
			if (!checkValidEmail(participant.secondaryEmail.toLocaleLowerCase())) {
				hasError = true;
				errors.secondaryEmail = translate.tooltip_invalid_email_address;
			}
		}

		if (!participant.phone && !representative?.hasRepresentative) {
			errors.phone = translate.field_required;
			hasError = true;
		} else if (!checkValidPhone(participant.phone) && !representative?.hasRepresentative) {
			errors.phone = translate.invalid_field;
			hasError = true;
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

export const checkRequiredFieldsRepresentative = (representative, translate) => {
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

	if (!representative.name) {
		errors.name = translate.field_required;
		hasError = true;
	} else if (!(regex.test(representative.name)) || !representative.name.trim()) {
		errors.name = translate.invalid_field;
		hasError = true;
	}
	if (!representative.surname) {
		errors.surname = translate.field_required;
		hasError = true;
	} else if (!(regex.test(representative.surname)) || !representative.surname.trim()) {
		errors.surname = translate.invalid_field;
		hasError = true;
	}

	if (!representative.dni) {
		errors.dni = translate.field_required;
		hasError = true;
	} else if (!(regex.test(representative.dni)) || !representative.dni.trim()) {
		errors.dni = translate.invalid_field;
		hasError = true;
	}

	if (!representative.email) {
		hasError = true;
		errors.email = translate.field_required;
	} else if (!checkValidEmail(representative?.email?.toLocaleLowerCase())) {
		hasError = true;
		errors.email = translate.tooltip_invalid_email_address;
	}

	if (representative.secondaryEmail && !!representative.secondaryEmail.trim()) {
		if (!checkValidEmail(representative.secondaryEmail.toLocaleLowerCase())) {
			hasError = true;
			errors.secondaryEmail = translate.tooltip_invalid_email_address;
		}
	}
	if (!representative.phone) {
		errors.phone = translate.field_required;
		hasError = true;
	} else if (!checkValidPhone(representative.phone)) {
		errors.phone = translate.invalid_field;
		hasError = true;
	}
	if (!representative.language) {
		hasError = true;
		errors.language = translate.field_required;
	}

	return {
		errors,
		hasError
	};
};

export const checkRequiredFieldsAgenda = (agenda, translate, toast, attachments) => {
	const errors = {
		agendaSubject: '',
		subjectType: '',
		attached: '',
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

	if (attachments) {
		const fileNames = attachments?.map(item => item.filename);
		const isDuplicated = fileNames?.some((item, idx) => fileNames.indexOf(item) !== idx);
		if (isDuplicated) {
			hasError = true;
			errors.attached = translate.used_attachment_error;
		}
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

