import gql from "graphql-tag";

export const userAndCompanySignUp = gql`
    mutation userAndCompanySignUp($language: String!, $type: Int!, $businessName: String!, $cif: String!, $address: String!, $city: String!, $country: String!, $zipCode: String!, $name: String!, $surname: String!, $phone: String!, $email: String!, $pwd: String!, $countryState: String!, $suscriptionType: String, $iban: String, $code: String) {
        userAndCompanySignUp(language:$language, type:$type, businessName:$businessName, cif:$cif, address:$address, city:$city, country:$country, zipCode:$zipCode, name:$name, surname:$surname, phone:$phone, email:$email, pwd:$pwd, countryState:$countryState, suscriptionType:$suscriptionType, iban:$iban, code:$code) {
            success
        }
    }
`;

export const checkEmailExists = gql`
    query checkEmailExists($email: String!) {
      checkEmailExists(email: $email) {
           success
        }
    }
`;

export const checkCifExists = gql`
    query checkCifExists($cif: String!) {
      checkCifExists(cif: $cif) {
           success
        }
    }
`;