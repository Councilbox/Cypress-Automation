import React, { Component, Fragment } from 'react';
import { AgendaNumber } from '../../../displayComponents';
import { getPrimary, getSecondary } from '../../../styles/colors';
import NewAgendaPointModal from '../editor/agenda/NewAgendaPointModal';
import ReorderPointsModal from '../agendas/ReorderPointsModal';
import * as CBX from '../../../utils/CBX';
import icon from '../../../assets/img/reorder.PNG';

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
                                open={agenda.pointState === 1}
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
                    statute={council.statute}
                    votingTypes={this.props.votingTypes}
                    councilID={this.props.councilID}
                    refetch={this.props.refetch}
                >
                    <AgendaNumber
                        index={'+'}
                        active={false}
                        secondaryColor={'#888888'}
                    />
                </NewAgendaPointModal>
                {CBX.canReorderPoints(council) &&
                    <ReorderPointsModal
                        translate={translate}
                        agendas={agendas}
                        councilID={this.props.councilID}
                        refetch={this.props.refetch}
                    >
                        <AgendaNumber
                            index={<img src={icon} alt="reorder icon" style={{width: '1.2em', height: 'auto'}}/>}
                            active={false}
                            secondaryColor={'#888888'}
                        />
                    </ReorderPointsModal>
                }

            </div>
        );
    }
}


export default AgendaSelector;