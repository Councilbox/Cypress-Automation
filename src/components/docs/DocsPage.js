import React from 'react';
import { BasicButton, Link } from '../../displayComponents';
import DocsLayout from './DocsLayout';
import { Card, CardHeader, CardContent } from 'material-ui';


const DocsPage = () => {

//HEADER #212121
    return (
        <DocsLayout>
            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                <Card
                    style={{
                        backgroundColor: '#212121',
                    }}
                >
                    <CardHeader
                        title={<span style={{color: 'white'}}>Bienvenido a la API GraphQL de Councilbox</span>}
                    ></CardHeader>
                    <CardContent>
                        Carácteristicas:<br/>
                        La API para desarrolladores de Councilbox usa el lenguaje de consulta y manipulación de datos <a href="https://www.graphql.org" rel="noreferrer noopener" target="_blank">GraphQL.</a>
                        <br/>
                        Sobre GraphQL:
                            <ul>Determina la validez de los esquemas y los esquemas definen las peticiones de la API</ul>
                            <ul>Las definición de los esquemas define un tipado fuerte entre los objetos y sus relaciones</ul>
                            <ul>La forma del esquema determina la forma del JSON por lo que se pueden pedir datos anidados en una sola petición</ul>

                        Ejemplo de petición en JavaScript (la misma petición puede ser realizada por POST o GET):
                            <ul>GET:</ul>
                            <div style={{backgroundColor:"#424242", color: 'white', padding: '1em'}}>
                                fetch('http://api-pre.councilbox.com/graphql?query=query%20%7B%0A%20%20languages%7B%0A%20%20%20%20columnName%0A%20%20%7D%0A%7D');
                            </div>

                            <ul style={{marginTop: '1em'}}>POST:</ul>
                            <div style={{backgroundColor:"#424242", color: 'white', padding: '1em'}}>
                                <pre style={{color: 'white'}}>
                                    {postRequest}
                                </pre>
                            </div>
                            <br/><br/>
                        Autenticación:<br/>
                        Para poder realizar peticiones a la API para desarroladores de Councilbox se requiere un token de acceso, el cual se obtiene a través de una petición enviando
                        la API key y el secreto subministrados. Esta petición devuelve un token y un refreshToken que servirá para obtener unos nuevos
                        cuando caduda el primero sin necesidad de volver a enviar la APIkey y el secreto. <br/>
                        Este token tiene que ser subministrado con cabecera "x-jwt-token".

                        <br/>Ejemplo:<br/>
                        <div style={{backgroundColor:"#424242", color: 'white', padding: '1em', marginBottom: '2em'}}>
                            <pre style={{color: 'white'}}>
                                {postRequest2}
                            </pre>
                        </div>

                        <Link to="/docs/tryit" >
                            <BasicButton
                                text="Ir a documentación interactiva"
                                color="transparent"
                                buttonStyle={{border: '1px solid white'}}
                                textStyle={{color: 'white'}}
                            />
                        </Link>

                    </CardContent>
                </Card>
            </div>
        </DocsLayout>
    )
}


const postRequest = `fetch('http://api-pre.councilbox.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: '{ languages { columnName } }' }),
});`

const postRequest2 = `fetch('http://api-pre.councilbox.com/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'authorization' 'Bearer asd1231lkasjd.asdlaksjdlaksjd'
    },
    body: JSON.stringify({ query: '{ languages { columnName } }' }),
});`


export default DocsPage;