import { DatePicker } from 'antd';
import gql from 'graphql-tag';
import React from 'react';
import { withApollo } from 'react-apollo';
import withSharedProps from '../../HOCs/withSharedProps';
import { moment } from '../../containers/App';
import CouncilsByRange from './CouncilsByRange';

const KPI = ({ translate, client }) => {
    const month = new Date().getMonth();
    const [dateStart, setDateStart] = React.useState(moment(`2020/${month + 1}/01`));
    const [dateEnd, setDateEnd] = React.useState(moment(`2020/${((month + 1) % 12) + 1}/01`));
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
    }, [getData]);

    return (
        <div style={{ padding: '2em', overflow: 'auto', height: '100%' }}>
            <DatePicker onChange={value => setDateStart(value)} value={dateStart} placeholder={'Fecha inicial'} />
            <DatePicker onChange={value => setDateEnd(value)} value={dateEnd} placeholder={'Fecha final'} style={{ marginLeft: '1em' }} />
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
    );
};

export default withSharedProps()(withApollo(KPI));
