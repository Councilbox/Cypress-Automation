export const checkValidEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export const checkRequiredFieldsParticipant = (participant, translate, hasSocialCapital) =>{

    let errors = {
        name: '',
        surname: '',
        dni: '',
        position: '',
        email: '',
        phone: '',
        language: '',
        numParticipations: '',
        socialCapital: ''
    };

    let hasError = false;

    if (!participant.name) {
        hasError = true;
        errors.name = translate.field_required;
    }

    if (!participant.surname && participant.personOrEntity === 0) {
        hasError = true;
        errors.surname = translate.field_required;
    }

    if (!participant.dni) {
        hasError = true;
        errors.dni = translate.field_required;
    }

    if (!participant.position) {
        hasError = true;
        errors.position = translate.field_required;
    }

    if (!checkValidEmail(participant.email.toLocaleLowerCase())) {
        hasError = true;
        errors.email = 'Se requiere un email válido';
    }

    if (!participant.phone) {
        hasError = true;
        errors.phone = translate.field_required;
    }

    if (!participant.language) {
        hasError = true;
        errors.language = translate.field_required;
    }

    if (!participant.numParticipations) {
        hasError = true;
        errors.numParticipations = translate.field_required;
    }

    if (hasSocialCapital && !participant.socialCapital) {
        hasError = true;
        errors.socialCapital = translate.field_required;
    }

    return {
        errors,
        hasError
    };
};

export const checkRequiredFieldsRepresentative = (participant, translate) =>{

    let errors = {
        name: '',
        surname: '',
        dni: '',
        position: '',
        email: '',
        phone: '',
        language: ''
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

    if (!participant.position) {
        hasError = true;
        errors.position = translate.field_required;
    }

    if (!checkValidEmail(participant.email.toLocaleLowerCase())) {
        hasError = true;
        errors.email = 'Se requiere un email válido';
    }

    if (!participant.phone) {
        hasError = true;
        errors.phone = translate.field_required;
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