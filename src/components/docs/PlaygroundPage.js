import React from 'react';
import { withApollo } from 'react-apollo';
import { Card } from 'material-ui';
import gql from 'graphql-tag';
import DocsLayout, { DocsContext } from './DocsLayout';
import PlaygroundSideMenu from './PlaygroundSideMenu';
import Playground from './Playground';

export const PlaygroundContext = React.createContext();

const PlaygroundPage = ({ client }) => {
	const [operation, setOperation] = React.useState(null);

	const setVariables = variables => {
		if (operation) {
			setOperation({
				...operation,
				variables
			});
		}
	};


	const sendOperation = async () => {
		const request = gql`${operation.query}`;
		const operationName = request.definitions['0'].name.value;

		try {
			let response;
			if (request.definitions[0].operation === 'query') {
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

			if (response.data[operationName]) {
				setOperation({
					...operation,
					response: JSON.stringify(response.data[operationName])
				});
			}
			if (response.errors) {
				setOperation({
					...operation,
					response: JSON.stringify(response.errors)
				});
			}
		} catch (e) {
			setOperation({
				...operation,
				response: e.message
			});
		}
	};

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
					docsContext.login ?
						<PlaygroundContext.Provider value={value}>
							<div style={{ width: '100%', height: '100%', display: 'flex' }}>
								<PlaygroundSideMenu />
								<Playground />
							</div>
							{/* <BasicButton
                                onClick={handleCreateUser}
                                text="Crear"
                                loading={loading}
                            /> */}
						</PlaygroundContext.Provider>
						: <div style={{
							width: '100%', height: '100%', padding: '1em', paddingTop: '3em'
						}}>
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
	);
};


export default withApollo(PlaygroundPage);
