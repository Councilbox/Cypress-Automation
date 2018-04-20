import gql from "graphql-tag";

export const restorePwd = gql`
    mutation restorePwd($language: String!, $type: Integer!, $businessName: String!, $cif: String!, $address: String!, $city: String!, $country: String!, $zipcode: String!, $name: String!, $surname: String!, $phone: String!, $email: String!, $usr: String!, $pwd: String!, $countryState: String!, $suscriptionType: String, $iban: String, $code: String) {
        restorePwd(language:$language, type:$type, businessName:$businessName, cif:$cif, address:$address, city:$city, country:$country, zipcode:$zipcode, name:$name, surname:$surname, phone:$phone, email:$email, usr:$usr, pwd:$pwd, countryState:$countryState, suscriptionType:$suscriptionType, iban:$iban, code:$code) {
            success
        }
    }
`;
