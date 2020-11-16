import { Tooltip } from 'material-ui';
import React from 'react';
import { withApollo } from 'react-apollo';
import { useHoverRow, usePolling } from '../../../hooks';
import { agendaVotingsOpened, getPercentage } from '../../../utils/CBX';
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

    const positivePercentage = getPercentage(data.numPositive, data.numTotal, 2);
    const negativePercentage = getPercentage(data.numNegative, data.numTotal, 2);
    const noVotePercentage = getPercentage(data.numNoVote, data.numTotal, 2);

    return (
        <div>
            {agendaVotingsOpened(agenda) &&
                <div style={{ display: 'flex', width: '100%', border: '1px solid grey', height: '1.6em', borderRadius: '2px'}}>
                    <PercentageSection
                        tooltip={`Aceptan: ${data.numPositive} (${positivePercentage}%)`}
                        value={positivePercentage}
                        color='rgba(0, 128, 0, 0.5)'
                        text={`${positivePercentage}%`}
                    />
                    <PercentageSection
                        tooltip={`Rechazan: ${data.numNegative} (${negativePercentage}%)`}
                        value={negativePercentage}
                        color='rgba(200, 0, 0, 0.6)'
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

    if(tooltip && value > 0){
        return (
            <Tooltip title={tooltip}>
                {renderSection()}
            </Tooltip>
        )
    }

    return renderSection();
} 

export default withApollo(ConfirmationRequestRecount);