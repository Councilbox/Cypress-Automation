import React from 'react';
import { BasicButton, DropDownMenu, TextInput } from '../../displayComponents';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { primary } from '../../styles/colors';


const ApiKeyLogin = ({ apiLogin }) => {
    const [loading, setLoading] = React.useState(false);
    const [state, setState] = React.useState({
        apikey: '',
        secret: ''
    });

    const updateApikey = event => {
        setState({
            ...state,
            apikey: event.target.value
        });
    }

    const updateSecret = event => {
        setState({
            ...state,
            secret: event.target.value
        });
    }

    const login = async () => {
        setLoading(true);
        const response = await apiLogin({
            variables: {
                ...state
            }
        })

        console.log(response);

        if(response.data.apiLogin){
            sessionStorage.setItem("token", response.data.apiLogin.token);
            sessionStorage.setItem("refreshToken", response.data.apiLogin.refreshToken);
        }

        setLoading(false);
    }

    return (
        <div>
            <DropDownMenu
                color="transparent"
                Component={() =>
                    <BasicButton
                        type="flat"
                        color="transparent"
                        text="Login"
                        textStyle={{color: 'white', fontWeight: '700'}}
                        buttonStyle={{border: '1px solid white'}}
                    />
                }
                type="flat"
                persistent
                items={
                    <div style={{padding: '1em'}}>
                        <TextInput
                            floatingText="Apikey"
                            value={state.apikey}
                            onChange={updateApikey}
                        />
                        <TextInput
                            floatingText="Secret"
                            value={state.secret}
                            onChange={updateSecret}
                        />
                        <BasicButton
                            color={primary}
                            text="Enviar"
                            onClick={login}
                            textStyle={{color: 'white', fontWeight: '700'}}
                            buttonStyle={{border: '1px solid white'}}
                        />
                    </div>
                }
            />
        </div>
    )
}

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
})(ApiKeyLogin);