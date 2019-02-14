import React from 'react';
import { ProgressBar } from '../../../../displayComponents';


const CustomPointVotingsLive = ({ agenda, council, recount, translate, refetch, ...props}) => {

    //console.log(agenda.items);

    const totalParticipations = 100;

    const ballots = [
        {
            itemId: 228,
            agendaId: '',
            numParticipations: 8,
        },
        {
            itemId: 228,
            numParticipations: 8,
        },
        {
            itemId: 228,
            numParticipations: 4,
        },
        {
            itemId: 229,
            numParticipations: 12,
        },
        {
            itemId: 229,
            numParticipations: 12,
        },
        {
            itemId: 229,
            numParticipations: 6,
        },
        {
            itemId: 230,
            numParticipations: 25,
        },
        {
            itemId: 230,
            numParticipations: 25,
        },
    ]

    const itemsWithBallots = agenda.items.map(item => {
        return {
            ...item,
            ballots: ballots.filter(ballot => ballot.itemId === item.id),
        }
    });

    console.log(itemsWithBallots);

    return (
        <div>
            {agenda.agendaSubject}
            {itemsWithBallots.map(item => (
                <div key={`custom_item_${item.id}`}>
                    <ProgressBar value={item.ballots.reduce((a, b) => {
                        return a + b.numParticipations
                    }, 0) / totalParticipations * 100} />
                    {`${item.value} - ${item.id}`} Votos {`${item.ballots.reduce((a, b) => {
                        return a + b.numParticipations
                    }, 0)}`}
                </div>
            ))}
        </div>
    )
}

export default CustomPointVotingsLive;