import React from 'react';
import { CUSTOM_AGENDA_VOTING_TYPES } from '../../../../constants';
import { Pie, Polar, HorizontalBar } from 'react-chartjs-2';
import { Grid, GridItem } from '../../../../displayComponents';
import { Table, TableCell, TableRow, TableHead } from 'material-ui';


const CustomAgendaRecount = ({ agenda }) => {
    const data = formatDataFromAgenda(agenda);
    return (
        <Grid>
            <GridItem lg={4} md={6} xs={12}>
                <div >
                    <HorizontalBar
                        data={data}
                        height={120}
                        width={120}
                        options={{ maintainAspectRatio: false }}
                    />
                </div>
            </GridItem>
            <GridItem lg={8} md={6} xs={12}>
                <Table>
                    <TableRow>
                        <TableCell>
                            <span style={{fontWeight: "700"}}> Opciones</span>
                        </TableCell>
                        <TableCell >
                            <span style={{fontWeight: "700"}}>Votos</span>
                        </TableCell>
                    </TableRow>
                    {agenda.items.map(item => (
                        <TableRow key={`custom_item_${item.id}`}>
                            <TableCell >
                                {/* <div key={`custom_item_${item.id}`}> */}
                                {item.value}
                                {/* </div> */}
                            </TableCell>
                            <TableCell >
                                {/* <div key={`custom_item_${item.id}`}> */}
                                {` ${agenda.ballots.filter(ballot => ballot.itemId === item.id).reduce((a, b) => a + b.weight, 0)}`}
                                {/* </div> */}
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>

                <div key={`custom_item_abstention_votes`} style={{fontWeight: "700"}}>
                    {`${'Abstención'}: ${agenda.ballots.filter(ballot => ballot.itemId === -1).reduce((a, b) => a + b.weight, 0)}`}
                </div>

            </GridItem>
        </Grid>
    )
}

const formatDataFromAgenda = agenda => {
    const labels = agenda.items.map(item => item.value);
    const colors = ['#2AC26D', '#E8B745', '#D1DE3B', '#6AD132', '#246FB0', '#721E9C', '#871A1C', '#6EA85D', '#9DAA49', '#CDA645']

    const dataSet = agenda.items.map(item => agenda.ballots.filter(ballot => ballot.itemId === item.id).reduce((a, b) => a + b.weight, 0));

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