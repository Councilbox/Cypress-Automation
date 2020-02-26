import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';


const DelegationDocuments = ({ council }) => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const getData = React.useCallback(async () => {

    }, [council.id]);

    React.useEffect(() => {
        getData();
    }, [getData]);


    return (
        <div>
            AQUI VAN A IR LOS DOCUMENTOS DE DELEGACION
        </div>
    )
}

export default withApollo(DelegationDocuments);