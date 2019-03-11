import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { moment } from '../../../containers/App';
import { MenuItem } from 'material-ui';
import { Card } from 'material-ui';
import { TextInput, SelectInput, BasicButton, Grid, GridItem, LoadingSection } from '../../../displayComponents';
import CouncilItem from '../councils/CouncilItem';
import withTranslations from '../../../HOCs/withTranslations';

const date = new moment();
const months = moment.months();
const years = [];
for(let i = 2015; i <= +date.format('Y'); i++){
    years.push(i);
}

const FinishedPage = ({ client, translate, ...props }) => {
    const [options, setOptions] = React.useState({
        month: +date.format('M'),
        year: +date.format('Y'),
        companyId: null
    });
    const [councils, setCouncils] = React.useState([]);
    const [loading, setLoading] = React.useState(false);


    const send = async () => {
        setLoading(true);
        const response = await client.query({
            query: finishedCouncils,
            variables: options
        });

        if(response.data.rootFinishedCouncils){
            setCouncils(response.data.rootFinishedCouncils);
        }
        setLoading(false);
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
                padding: '1em'
            }}
        >
            <Grid>
                <GridItem xs={12} md={3} lg={3}>
                    <SelectInput
                        floatingText='Mes'
                        value={options.month}
                        onChange={event => setOptions({ ...options, month: event.target.value })}
                    >
                        {months.map((month, index) => (
                            <MenuItem value={index + 1} key={`month_${month}`}>
                                {month}
                            </MenuItem>
                        ))}
                    </SelectInput>
                </GridItem>
                <GridItem xs={12} md={3} lg={3}>
                    <SelectInput
                        floatingText='Año'
                        value={options.year}
                        onChange={event => setOptions({ ...options, year: event.target.value })}
                    >
                        {years.map((year, index) => (
                            <MenuItem value={year} key={`year_${year}`}>
                                {year}
                            </MenuItem>
                        ))}
                    </SelectInput>
                </GridItem>
                <GridItem xs={12} md={3} lg={3}>
                    <TextInput
                        floatingText='Id de la compañía'
                        value={options.companyId}
                        onChange={event => setOptions({ ...options, companyId: event.target.value? +event.target.value : null })}
                    />
                </GridItem>
                <GridItem xs={12} md={3} lg={3}>
                    <BasicButton
                        text="Buscar"
                        onClick={send}
                    />
                </GridItem>
            </Grid>
            {loading?
                <LoadingSection />

            :
                councils.map(council => (
                    <Card style={{marginBottom: '1.2em'}}>
                        <CouncilItem
                            key={`council_${council.id}`}
                            council={council}
                            hideFixedUrl
                            translate={translate}
                        />
                    </Card>
                ))
            }
        </div>
    )

}

const finishedCouncils = gql`
    query rootFinishedCouncils($month: Int, $year: Int, $companyId: Int){
        rootFinishedCouncils(month: $month, year: $year, companyId: $companyId){
            id
            name
            state
            dateStart
            councilType
            prototype
            participants {
                id
            }
            company{
                id
                businessName
            }
        }
    }
`;

export default withTranslations()(withApollo(FinishedPage));