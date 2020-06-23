import { AGENDA_TYPES, MAJORITY_TYPES } from "../constants";
import { checkForUnclosedBraces } from './CBX';
import React from 'react';
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
			}
		}
	}

	if (type === MAJORITY_TYPES.FRACTION) {
		if ((majority / divider) > 1) {
			return {
				error: true,
				message: translate.fraction_values_error
			}
		}
	}

	return {
		error: false
	};
}

export const checkRequiredFieldsParticipant = (
	participant,
	translate,
	hasSocialCapital,
	company
) => {
	let errors = {
		name: "",
		surname: "",
		dni: "",
		email: "",
		phone: "",
		language: "",
		numParticipations: "",
		socialCapital: "",
		secondaryEmail: ""
	};

	let hasError = false;

	if (!participant.name) {
		hasError = true;
		errors.name = translate.field_required;
	}

	if (company && company.type !== 10) {
		if (!participant.surname && participant.personOrEntity === 0) {
			hasError = true;
			errors.surname = translate.field_required;
		}

		// if (!participant.dni) {
		// 	hasError = true;
		// 	errors.dni = translate.field_required;
		// }
		// Comprobamos que exista email para que no de error
		if (participant.secondaryEmail) {
			if (!checkValidEmail(participant.secondaryEmail.toLocaleLowerCase())) {
				hasError = true;
				errors.secondaryEmail = translate.valid_email_required;
			}
		}
		if (participant.email) {
			if (!checkValidEmail(participant.email.toLocaleLowerCase())) {
				hasError = true;
				errors.email = translate.valid_email_required;
			}
		} else {
			if (participant.personOrEntity === 0) {
				hasError = true;
				errors.email = translate.valid_email_required;
			}
		}

		// if (!participant.phone) {
		// 	hasError = true;
		// 	errors.phone = translate.field_required;
		// }

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
	let errors = {
		name: "",
		surname: "",
		dni: "",
		email: "",
		phone: "",
		language: ""
	};

	let hasError = false;

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

	// if (!participant.phone) {
	// 	hasError = true;
	// 	errors.phone = translate.field_required;
	// }

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
	let errors = {
		agendaSubject: "",
		subjectType: "",
		description: "",
		majorityType: "",
		majority: "",
		majorityDivider: ""
	};

	let hasError = false;

	if (!agenda.agendaSubject) {
		hasError = true;
		errors.agendaSubject = translate.field_required;
	}

	if (!agenda.subjectType && agenda.subjectType !== 0) {
		hasError = true;
		errors.subjectType = translate.field_required;
	}

	if (agenda.description) {
		if (checkForUnclosedBraces(agenda.description)) {
			hasError = true;
			errors.description = true;
			toast(
				<LiveToast
					message={translate.revise_text}
				/>, {
				position: toast.POSITION.TOP_RIGHT,
				autoClose: true,
				className: "errorToast"
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
			agenda.majorityType === 0 ||
			agenda.majorityType === 5 ||
			agenda.majorityType === 6
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
