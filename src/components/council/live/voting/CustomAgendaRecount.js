import React from 'react';
import { CUSTOM_AGENDA_VOTING_TYPES } from '../../../../constants';
import { Pie, Polar, HorizontalBar } from 'react-chartjs-2';
import { Grid, GridItem } from '../../../../displayComponents';

const CustomAgendaRecount = ({ agenda }) => {
    const data = formatDataFromAgenda(agenda);
    return (
        <Grid>
            <GridItem lg={4} md={6} xs={12}>
                <HorizontalBar
                    data={data}
                    height={120}
                    width={120}
                    options={{
                        maintainAspectRatio: false
                    }}
                />
            </GridItem>
            <GridItem lg={8} md={6} xs={12}>
                {agenda.items.map(item => (
                    <div key={`custom_item_${item.id}`}>
                        {`${item.value}: Votos ${agenda.ballots.filter(ballot => ballot.itemId === item.id).length}`}
                    </div>
                ))}

            </GridItem>
        </Grid>
    )
}

const formatDataFromAgenda = agenda => {
    const labels = agenda.items.map(item => item.value);
    const colors = ['#E8B745', '#D1DE3B', '#6AD132', '#2AC26D', '#246FB0', '#721E9C', '#871A1C', '#6EA85D', '#9DAA49', '#CDA645']

    const dataSet = agenda.items.map(item => agenda.ballots.filter(ballot => ballot.itemId === item.id).length);

    const data = {
        labels,
        datasets: [{
            label: 'Votaciones',
            data: dataSet,
            backgroundColor: colors,
            hoverBackgroundColor: colors
        }]
    }

    return data;
}

export default CustomAgendaRecount;