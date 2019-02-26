import React from 'react';
import DocsLayout from './DocsLayout';
import { withApollo } from 'react-apollo';
import { DocsContext } from './DocsLayout';
import { Card } from 'material-ui';
import PlaygroundSideMenu from './PlaygroundSideMenu';
import Playground from './Playground';
import gql from 'graphql-tag';
export const PlaygroundContext = React.createContext();


const PlaygroundPage = ({ apiLogin, createUser, client }) => {
    const [loading, setLoading] = React.useState(false);
    const [operation, setOperation] = React.useState(null);
    //secret: uNyDzx6Hpj
    //apikey: F39D46293E996768

    console.log(operation);

    const setVariables = variables => {
        if(operation){
            setOperation({
                ...operation,
                variables
            });
        }
    }


    const sendOperation = async () => {
        const request = gql`${operation.query}`;
        const operationName = request.definitions["0"].name.value;

        try {
            let response;
            if(request.definitions[0].operation === 'query'){
                response = await client.query({
                    query: request,
                    variables: JSON.parse(operation.variables),
                    errorPolicy: 'all'
                });
            } else {
                response = await client.mutate({
                    mutation: request,
                    variables: JSON.parse(operation.variables),
                    errorPolicy: 'all'
                });
            }
            console.log(response);


            if(response.data[operationName]){
                setOperation({
                    ...operation,
                    response: JSON.stringify(response.data[operationName])
                });
            }
            if(response.errors){
                setOperation({
                    ...operation,
                    response: JSON.stringify(response.errors)
                });
            }
        } catch (e){
            setOperation({
                ...operation,
                response: e.message
            })
        }
    }

    const value = {
        operation,
        setOperation,
        setVariables,
        sendOperation
    };

    return (
        <DocsLayout login>
            <DocsContext.Consumer>
                {docsContext => (
                    docsContext.login?
                        <PlaygroundContext.Provider value={value}>
                            <div style={{width: '100%', height: '100%', display: 'flex'}}>
                                <PlaygroundSideMenu />
                                <Playground />
                            </div>
                            {/* <BasicButton
                                onClick={handleCreateUser}
                                text="Crear"
                                loading={loading}
                            /> */}
                        </PlaygroundContext.Provider>
                    :
                        <div style={{width: '100%', height: '100%', padding: '1em', paddingTop: '3em'}}>
                            <Card style={{
                                backgroundColor: '#212121',
                                padding: '2em'
                            }}>
                                Para interactuar con esta sección necesita loguearse con una API key subministrada por Councilbox
                            </Card>
                        </div>
                )}
            </DocsContext.Consumer>
        </DocsLayout>
    )
}





export default withApollo(PlaygroundPage);