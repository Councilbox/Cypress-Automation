import React from 'react';
import { PlaygroundContext } from './PlaygroundPage';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui';
import gql from 'graphql-tag';


const PlaygroundSideMenu = () => {
    const [expanded, setExpanded] = React.useState(null);
    const playgroundContext = React.useContext(PlaygroundContext);

    return (
        <div style={{
            width: '250px',
            height: '100%',
            borderRight: '2px solid white'
        }}>
            <ExpansionPanel
                square
                expanded={true}
                style={{
                    backgroundColor: '#212121'
                }}
                //onChange={() => setExpanded('panel1')}
            >
                <ExpansionPanelSummary>
                    Cuenta
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <li style={{cursor: 'pointer'}} onClick={() => playgroundContext.setOperation(operations.account)}>
                        Ver cuenta
                    </li>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
                square
                expanded={true}
                style={{
                    backgroundColor: '#212121'
                }}
                //onChange={() => setExpanded('panel1')}
            >
                <ExpansionPanelSummary>
                    Usuarios
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <li style={{cursor: 'pointer'}} onClick={() => playgroundContext.setOperation(operations.create)}>
                        Crear usuario
                    </li>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
                square
                expanded={true}
                style={{
                    backgroundColor: '#212121'
                }}
                //onChange={() => setExpanded('panel1')}
            >
                <ExpansionPanelSummary>
                    Compañías
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <ul>
                        <li style={{cursor: 'pointer'}} onClick={() => playgroundContext.setOperation(operations.createCompany)}>
                            Crear compañía
                        </li>
                        <li style={{cursor: 'pointer'}} onClick={() => playgroundContext.setOperation(operations.linkCompanyUser)}>
                            Vincular compañía / usuario
                        </li>
                    </ul>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    )
}

const createUser = `
mutation createUser($user: UserInput!){
    createUser(user: $user){
        id
        name
        surname
        email
    }
}`;

const userInput = JSON.stringify({
    user: {
        email: 'aaron.fuentes.cocodin+568@gmail.com',
        name: 'Aaron',
        pwd: '1234',
        surname: 'Fuentes',
        preferredLanguage: 'es',
        phone: '635480041'
    }
});

const companyInput = JSON.stringify({
    company: {
        tin: '',
        businessName: 'Councilbox',
        address: 'C/',
        city: 'SdC',
        zipcode: '15454',
        country: 'España',
        countryState: 'A coruña',
        linkKey: '1234',
        domain: 'www.councilbox.com',
        type: 1,
        language: 'es',
    }
});


const getAccount = `
query tokenAccount {
    tokenAccount{
        name
        type
    }
}
`;

const createCompany = `
    mutation createCompany($company: CompanyInput){
        createCompany(company: $company){
            id
            businessName
        }
    }
`;

const linkCompany = `
    mutation linkCompanyUser($companyTin: String!, $userId: Int!){
        linkCompanyUser(companyTin: $companyTin, userId: $userId){
            success
            message
        }
    }
`;

const operations = {
    account: {
        query: getAccount,
        variables: '{}'
    },
    create: {
        query: createUser,
        variables: userInput
    },
    createCompany: {
        query: createCompany,
        variables: companyInput
    },
    linkCompanyUser: {
        query: linkCompany,
        variables: JSON.stringify({
            userId: 0,
            companyTin: 0
        })
    }
}

export default PlaygroundSideMenu;