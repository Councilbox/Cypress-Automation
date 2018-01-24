
/*const apiURLs = {
    prod: {
        url: 'https://video.councilbox.com/#/login/',
        api: 'https://app.councilbox.com/server/api/'
    },

    beta: {
        url: 'https://videobeta.councilbox.com/#/login/',
        api: 'https://beta.councilbox.com/server/api/'
    }
}*/

class CouncilboxApi {
    static login(userData) {
        const request = new Request(`https://beta.councilbox.com/server/api/login?where=%7B"user":"${userData.user}","password":"${userData.password}"%7D`, {
            method: 'GET'
        });
        return fetch(request).then(response => {return response.json()});
    }

    static async getCompanyTypes(){
        const request = new Request(`https://beta.councilbox.com/server/api/company_types`, {
            method: 'GET'
        });
        const response = await fetch(request);
        const data = await response.json();
        return data.result;
    }

    static async getCountries(){
        const request = new Request(`https://beta.councilbox.com/server/api/countries`, {
            method: 'GET'
        });
        const response = await fetch(request);
        const data = await response.json();
        return data.result.data;
    }

    static async getProvinces(countryID){
        const request = new Request(`https://beta.councilbox.com/server/api/provinces?where=%7B"country_id":${countryID}%7D`, {
            method: 'GET'
        });
        const response = await fetch(request);
        const data = await response.json();
        return data.result.data;
    }

    static async getSubscriptions(){
        return Promise.resolve([
            'LITE - 25 €/mes',
            'LITE - 240 €/año',
            'BASIC - 50 €/mes',
            'BASIC - 480 €/año', 
            'PRO - 100 €/mes',
            'PRO - 960 €/año',
            'BUSINESS - 180 €/mes',
            'BUSINESS - 1.800 €/año',
            'TARIFA PAGO POR USO *consultar condiciones',
            'Otra'
        ]);
    }

    static createCompany(company){
        const body = {
            "preferred_language": 'es',
            "type": company.type,
            "country": company.country,
            "subscription_type": company.subscription,
            "business_name": company.name,
            "cif": company.code,
            "city": company.city,
            "country_state": company.province,
            "zipcode": company.zipcode,
            "iban": company.IBAN,
            "name": company.firstName,
            "surname": company.lastName,
            "phone": company.phoneNumber,
            "email": company.email,
            "usr": company.username,
            "pwd": company.password,
            "repeatPwd": company.password,
            "terms": 1,
            "census_name": "Por defecto",
            "census_description": "Primer censo creado automáticamente cuando se crea la sociedad"
        }
        let formBody = [];

        for (let property in body) {
            let encodedKey = encodeURIComponent("data[" + property + "]");
            let encodedValue = encodeURIComponent(body[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        /*const request = new Request('https://beta.councilbox.com/server/api/societyUp', {
            method: 'POST',
            headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'}),
            body: formBody
        });

        return fetch(request).then(response => {
            return response.json();
        }).catch( error => {
            throw error;
        });*/
        return Promise.resolve({code: 200});
        //return Promise.reject({code: 602})
    }

    static async getTranslations(language){
        const request = new Request(`https://beta.councilbox.com/server/api/translations?language=${language}`, {
            method: 'GET'
        });
        const response = await fetch(request);
        const data = await response.json();
        return data.result.data;
    }

    static async getCompany(){
        const request = new Request(`https://beta.councilbox.com/server/api/dashboard/getCompanies`, {
            method: 'GET',
            headers: new Headers({
                "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                "x-jwt-token": sessionStorage.getItem('token')
            })
        });
        const response = await fetch(request);
        const data = await response.json();
        return data.result.data;
    }

    static async getRecount(companyID){
        const request = new Request(`https://beta.councilbox.com/server/api/dashboard/getRecount?data=%7B%22company_id%22:%22${companyID}%22%7D`, {
            method: 'GET',
            headers: new Headers({
                "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                "x-jwt-token": sessionStorage.getItem('token')
            })
        });
        const response = await fetch(request);
        const data = await response.json();
        return data.result.data;
    }

}

export default CouncilboxApi;