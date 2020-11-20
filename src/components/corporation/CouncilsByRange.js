import gql from 'graphql-tag';
import React from 'react';
import { withApollo } from 'react-apollo';


const CouncilsByRange = ({ client, dateStart, dateEnd }) => {
    const [data, setData] = React.useState(null);

    const getData = React.useCallback(async () => {
        if(!dateStart || !dateEnd){
            return;
        }

        const response = await client.query({
            query: gql`
                query KpiCouncils($dateStart: String!, $dateEnd: String!, $options: OptionsInput){
                    kpiCouncils(dateStart: $dateStart, dateEnd: $dateEnd, options: $options)
                }
            `,
            variables: {
                dateStart,
                dateEnd,
                options: {
                    limit: 20,
                    offset: 0
                }
            }
        });
        setData(response.data.kpiCouncils)
    }, [dateStart, dateEnd])

    React.useEffect(() => {
        getData();
    }, [getData])

    if(!data){
        return <span/>
    }

    return (
        <div>
            {data.map(council => (
                <div style={{ display: 'flex' }}>
                    <div>
                        {council.customer_code}
                    </div>
                    <div>
                        {council.business_name}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default withApollo(CouncilsByRange);