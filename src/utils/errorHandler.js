
const errorList = {
    '601': 'register_exists_email'
}



const errorTranslator = (code) => {
    return errorList[code];
}

export default errorTranslator;