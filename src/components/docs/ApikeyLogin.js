import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, DropDownMenu, TextInput } from '../../displayComponents';
import { primary } from '../../styles/colors';
import { DocsContext } from './DocsLayout';

export const getApiAccount = gql`
    query TokenAccount {
        tokenAccount{
            name
            type
        }
    }
`;

const ApiKeyLogin = ({ apiLogin, client }) => {
    const [loading, setLoading] = React.useState(false);
    const apiToken = React.useRef(sessionStorage.getItem('apiToken'));
    const docsContext = React.useContext(DocsContext);
    const [state, setState] = React.useState({
        apikey: '',
        secret: ''
    });

    React.useEffect(() => {
        if (apiToken.current) {
            getAccountInfo();
        }
    }, apiToken.current);

    const getAccountInfo = async () => {
        const account = await client.query({
            query: getApiAccount,
            fetchPolicy: 'network-only'
        });
        docsContext.loginSuccess(account.data.tokenAccount);
    };

    const updateApikey = event => {
        setState({
            ...state,
            apikey: event.target.value
        });
    };

    const updateSecret = event => {
        setState({
            ...state,
            secret: event.target.value
        });
    };

    const login = async () => {
        setLoading(true);
        const response = await apiLogin({
            variables: {
                ...state
            }
        });

        if (response.data.apiLogin) {
            sessionStorage.removeItem('participantToken');
            sessionStorage.removeItem('token');
            sessionStorage.setItem('apiToken', response.data.apiLogin.token);
            sessionStorage.setItem('refreshToken', response.data.apiLogin.refreshToken);
            await getAccountInfo();
        }

        setLoading(false);
    };


    return (
        <div>
            {!docsContext.login ?
                <DropDownMenu
                    color="transparent"
                    Component={() => <BasicButton
                            type="flat"
                            color="transparent"
                            text="Login"
                            textStyle={{ color: 'white', fontWeight: '700' }}
                            buttonStyle={{ border: '1px solid white' }}
                        />
                    }
                    type="flat"
                    persistent
                    items={
                        <div style={{ padding: '1em' }}>
                            <TextInput
                                floatingText="Apikey"
                                value={state.apikey}
                                onChange={updateApikey}
                            />
                            <TextInput
                                floatingText="Secret"
                                type="password"
                                value={state.secret}
                                onChange={updateSecret}
                            />
                            <BasicButton
                                color={primary}
                                text="Enviar"
                                onClick={login}
                                textStyle={{ color: 'white', fontWeight: '700' }}
                            />
                        </div>
                    }
                />
            : <div>
                    <span style={{ fontWeight: '700', color: 'white', marginRight: '1em' }}>{docsContext.login.name}</span>
                    <BasicButton
                        type="flat"
                        color="transparent"
                        text="Logout"
                        onClick={docsContext.logout}
                        textStyle={{ color: 'white', fontWeight: '700' }}
                        buttonStyle={{ border: '1px solid white' }}
                    />
                </div>
            }

        </div>
    );
};

const apiKeyLogin = gql`
    mutation ApiLogin($apikey: String!, $secret: String!){
        apiLogin(secret: $secret, apikey: $apikey){
            token
            refreshToken
        }
    }
`;

export default graphql(apiKeyLogin, {
    name: 'apiLogin'
})(withApollo(ApiKeyLogin));
