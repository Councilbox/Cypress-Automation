import React, { Fragment } from 'react';
import { AgendaNumber } from '../displayComponents';
import { primary, secondary } from '../../styles/colors';


const AgendaSelector = ( { agendas, onClick, selected }) => (
    <div style={{width: '100%', flexDirection: 'column', display: 'flex', alignItems: 'center', paddingTop: '1.2em'}}>
        {agendas.map((agenda, index) => {
            return(
                <Fragment key={`agendaSelector${agenda.id}`}>
                    {index > 0 &&
                        <div style={{margin: 0, padding: 0, width: '1px', borderRight: `2px solid ${secondary}`, height: '0.8em'}} />
                    }
                    <AgendaNumber
                        key={`agendaIndex${agenda.id}`}
                        index={index + 1}
                        active={selected === index}
                        activeColor={primary}
                        secondaryColor={secondary}
                        onClick={() => onClick(index)}
                    />
                </Fragment>
            )
        })
        }
    </div>
)

export default AgendaSelector;