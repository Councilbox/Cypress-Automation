import React from 'react';
import { BasicButton } from '../../displayComponents';
import DocsLayout from './DocsLayout';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

const PlaygroundPage = ({ apiLogin, createUser }) => {
    const [loading, setLoading] = React.useState(false);

    //secret: uNyDzx6Hpj
    //apikey: F39D46293E996768


    const handleCreateUser = async () => {
        setLoading(true);
        const response = await createUser({
            variables: {
                user: {
                    email: 'aaron.fuentes.cocodin+568@gmail.com',
                    name: 'Aaron',
                    pwd: '1234',
                    surname: 'Fuentes',
                    preferredLanguage: 'es',
                    phone: '635480041'
                }
            }
        });

        setLoading(false);
    }


    return (
        <DocsLayout login>
            <BasicButton
                onClick={handleCreateUser}
                text="Crear"
                loading={loading}
            />
        </DocsLayout>
    )
}


const createUserMutation = gql`
    mutation CreateUser($user: UserInput!){
        createUser(user: $user){
            id
        }
    }
`;


export default compose(
    graphql(createUserMutation, {
        name: 'createUser'
    })
)(PlaygroundPage);