import { DatePicker } from 'antd';
import gql from 'graphql-tag';
import React from 'react';
import { withApollo } from 'react-apollo';
import withSharedProps from '../../HOCs/withSharedProps';
import CouncilsByRange from './CouncilsByRange';

const KPI = ({ translate, client }) => {
    const [dateStart, setDateStart] = React.useState('');
    const [dateEnd, setDateEnd] = React.useState('');
    const [KPI, setKPI] = React.useState(null);

    const getData = React.useCallback(async () => {
        if(!dateStart || !dateEnd){
            return;
        }

        const response = await client.query({
            query: gql`
                query KPI($dateStart: String!, $dateEnd: String!){
                    kpi(dateStart: $dateStart, dateEnd: $dateEnd)
                }
            `,
            variables: {
                dateStart: dateStart.format('YYYY/MM/DD'),
                dateEnd: dateEnd.format('YYYY/MM/DD'),
            }
        });
        setKPI(response.data.kpi);
    }, [dateStart, dateEnd]);

    React.useEffect(() => {
        getData();
    }, [getData])

    return (
        <div style={{ padding: '2em' }}>
            <DatePicker onChange={value => setDateStart(value)} placeholder={'Fecha inicial'} />
            <DatePicker onChange={value => setDateEnd(value)} placeholder={'Fecha final'} style={{ marginLeft: '1em'}} />
            {KPI &&
                <div style={{ marginTop: '1em' }}>
                    {Object.keys(KPI).map((key, index) => (
                        <div key={`${key}_${index}`}>
                            {key}: {KPI[key]}
                        </div>
                    ))}
                </div>
            }
            <CouncilsByRange
                dateStart={dateStart}
                dateEnd={dateEnd}
                translate={translate}
            />
        </div>
    )
}

export default withSharedProps()(withApollo(KPI));