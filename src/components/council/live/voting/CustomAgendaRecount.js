import React from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import {
 Table, TableCell, TableRow, TableHead, TableBody
} from 'material-ui';
import { Grid, GridItem } from '../../../../displayComponents';
import { showNumParticipations } from '../../../../utils/CBX';


const CustomAgendaRecount = ({
 agenda, translate, council, company
}) => {
    const data = formatDataFromAgenda(agenda);
    return (
        <Grid>
            <GridItem lg={4} md={6} xs={12}>
                <div >
                    <HorizontalBar
                        data={data}
                        height={160}
                        width={130}
                        options={{
                            maintainAspectRatio: false,
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        min: 0
                                    }
                                }]
                            }
                        }}
                    />
                </div>
            </GridItem>
            <GridItem lg={8} md={6} xs={12} style={{ paddingLeft: '1em' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <span style={{ fontWeight: '700' }}>{translate.options}</span>
                            </TableCell>
                            <TableCell >
                                <span style={{ fontWeight: '700' }}>{translate.votes}</span>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {agenda.items.map(item => (
                            <TableRow key={`custom_item_${item.id}`}>
                                <TableCell style={{ whiteSpace: 'pre-wrap' }}>
                                    {item.value}
                                </TableCell>
                                <TableCell >
                                    {` ${showNumParticipations(
                                        agenda.votingsRecount[item.id],
                                        company,
                                        council.statute
                                    )}`}
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell>
                                {translate.abstention_btn}
                            </TableCell>
                            <TableCell>
                                {`${showNumParticipations(
                                    agenda.votingsRecount.abstention,
                                    company,
                                    council.statute
                                )}`}
                            </TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell >
                                {translate.no_vote_lowercase}
                            </TableCell>
                            <TableCell >
                                {`${showNumParticipations(
                                    agenda.votingsRecount.noVote,
                                    company,
                                    council.statute
                                )}`}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </GridItem>
        </Grid>
    );
};

const formatDataFromAgenda = agenda => {
    const labels = agenda.items.map(item => item.value);
    const colors = ['#E8B745', '#D1DE3B', '#6AD132', '#2AC26D', '#246FB0', '#721E9C', '#871A1C', '#6EA85D', '#9DAA49', '#CDA645'];
    const dataSet = agenda.items.map(item => agenda.votingsRecount[item.id]);

    const data = {
        labels,
        datasets: [{
            label: 'Votaciones',
            data: dataSet,
            backgroundColor: colors,
            hoverBackgroundColor: colors,
        }]
    };

    return data;
};

export default CustomAgendaRecount;
