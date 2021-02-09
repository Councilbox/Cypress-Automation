const errorList = {
	601: 'register_exists_email'
};

const errorTranslator = code => errorList[code];

export default errorTranslator;
