import React, { Component, Fragment } from 'react';
import { AgendaNumber } from '../displayComponents';
import { getPrimary, getSecondary } from '../../styles/colors';
import NewAgendaPointModal from '../councilEditor/NewAgendaPointModal';
import ReorderPointsModal from './ReorderPointsModal';

class AgendaSelector extends Component {

    render(){
        const { agendas, translate, council, onClick, selected } = this.props;

        return(
            <div style={{width: '100%', paddingBottom: '5em', flexDirection: 'column', display: 'flex', alignItems: 'center', paddingTop: '1.2em'}}>
                {agendas.map((agenda, index) => {
                    return(
                        <Fragment key={`agendaSelector${agenda.id}`}>
                            {index > 0 &&
                                <div style={{margin: 0, padding: 0, width: '1px', borderRight: `3px solid ${getSecondary()}`, height: '0.8em'}} />
                            }
                            <AgendaNumber
                                index={index + 1}
                                open={agenda.point_state === 1}
                                active={selected === index}
                                activeColor={getPrimary()}
                                secondaryColor={getSecondary()}
                                onClick={() => onClick(index)}
                            />
                        </Fragment>
                    )
                })
                }
                <NewAgendaPointModal
                    translate={translate}
                    agendas={agendas}
                    councilID={this.props.councilID}
                    refetch={this.props.refetch}
                />
                {council.statutes[0].can_reorder_points === 1 &&
                    <ReorderPointsModal
                        translate={translate}
                        agendas={agendas}
                        councilID={this.props.councilID}
                        refetch={this.props.refetch}
                    />
                }

            </div>
        );
    }
}


export default AgendaSelector;