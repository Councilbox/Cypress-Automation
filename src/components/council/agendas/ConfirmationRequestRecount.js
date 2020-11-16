import { Tooltip } from 'material-ui';
import React from 'react';
import { withApollo } from 'react-apollo';
import { useHoverRow, usePolling } from '../../../hooks';
import { agendaVotingsOpened } from '../../../utils/CBX';
import { agendaRecountQuery } from '../live/ActAgreements';



const ConfirmationRequestRecount = ({ translate, agenda, recount, client }) => {
    const [data, setData] = React.useState(null);

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: agendaRecountQuery,
            variables: {
                agendaId: agenda.id
            }
        });
        setData(response.data.agendaRecount)
    }, [agenda.id]);

    React.useEffect(() => {
        getData();
    }, [getData])

    usePolling(getData, 10000);

    if(!data) return null;

    const positivePercentage = (data.numPositive / recount.numRightVoting) * 100;
    const negativePercentage = (data.numNegative / recount.numRightVoting) * 100;
    const noVotePercentage = (data.numNoVote / recount.numRightVoting) * 100;

    return (
        <div>
            {agendaVotingsOpened(agenda) &&
                <div style={{ display: 'flex', width: '100%', border: '1px solid grey', height: '1.6em', borderRadius: '2px'}}>
                    <PercentageSection
                        tooltip={`Aceptan: ${data.numPositive} (${positivePercentage}%)`}
                        value={positivePercentage}
                        color="green"
                        text={`${positivePercentage}%`}
                    />
                    <PercentageSection
                        tooltip={`Rechazan: ${data.numNegative} (${negativePercentage}%)`}
                        value={negativePercentage}
                        color="red"
                        text={`${negativePercentage}%`}
                    />
                    <PercentageSection
                        tooltip={`No han seleccionado: ${data.numNoVote} (${noVotePercentage}%)`}
                        value={noVotePercentage}
                        color="lightgrey"
                        text={`${noVotePercentage}%`}
                        textColor='black'
                    />
                </div>

            }
        </div>
    )
}

const PercentageSection = ({ value, color, tooltip, text = '', textColor = 'white' }) => {
    const [showValue, setShowValue] = React.useState(false);
    const block = React.useRef();
    const [showActions, { onMouseOver, onMouseLeave }] = useHoverRow();

    React.useLayoutEffect(() => {
        setTimeout(() => {
            if(block.current && block.current.clientWidth > 70){
                setShowValue(true);
            } else {
                setShowValue(false);
            }
        }, 800);
    }, [value, block.current])


    const renderSection = () => (
        <div
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            ref={block}
            style={{
                width: `${value}%`,
                backgroundColor: color,
                fontSize: '12px',
                height: '100%',
                color: textColor,
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'width 0.8s',
                transitionTimingFunction: 'ease',
                ...(showActions ? {
                    border: '2px solid blue'
                } : {})
            }}
        >
            {(text && showValue) && text}
        </div>
    )

    if(tooltip && showValue){
        return (
            <Tooltip title={tooltip}>
                {renderSection()}
            </Tooltip>
        )
    }

    return renderSection();
} 

export default withApollo(ConfirmationRequestRecount);