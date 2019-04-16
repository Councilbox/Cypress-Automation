import React from 'react';
import OpenRoomButton from "./OpenRoomButton";
import StartCouncilButton from "./StartCouncilButton";
import EndCouncilButton from "./EndCouncilButton";
import { councilStarted } from "../../../../utils/CBX";
import { moment } from '../../../../containers/App';
import { BasicButton } from '../../../../displayComponents';

const CouncilStateButton = ({ translate, council, participants, refetch, agendas, recount, ...props }) => {

    //TRADUCCION
    if(council.councilType > 1){
        if(councilStarted(council)){
            if(council.councilType === 3){
                return (
                    <div>
                        <EndCouncilButton
                            council={{
                                ...council,
                                agendas
                            }}
                            translate={translate}
                        />
                    </div>
                )
            }
            return (
                <div style={{fontSize: '0.9em', padding: '0.3em', display: 'flex'}}>
                    <div>
                        {`La reunión se cerrará automáticamente: ${moment(council.closeDate).format('LLL')}`}
                    </div>
                    <div style={{minWidth: '10em'}}>
                        <EndCouncilButton
                            council={{
                                ...council,
                                agendas
                            }}
                            translate={translate}
                        />
                    </div>
                </div>
            )
        }
        return (
            <div style={{fontSize: '0.9em', padding: '0.3em', display: 'flex'}}>
                <div>
                    {`La reunión comenzará automáticamente: ${moment(council.dateStart).format('LLL')}`}
                </div>
                <div style={{minWidth: '10em'}}>
                    <StartCouncilButton
                        recount={recount}
                        council={council}
                        translate={translate}
                        participants={participants}
                        refetch={refetch}
                    />
                </div>
            </div>
        )
    }

    return (
        council.state === 20 || council.state === 30 ? (
            !councilStarted(council) ? (
                <div>
                    <StartCouncilButton
                        recount={recount}
                        council={council}
                        translate={translate}
                        participants={participants}
                        refetch={refetch}
                    />
                </div>
            ) : (
                    <div>
                        <EndCouncilButton
                            council={{
                                ...council,
                                agendas
                            }}
                            translate={translate}
                        />
                    </div>
                )
        ) : (
                <OpenRoomButton
                    translate={translate}
                    council={council}
                    refetch={refetch}
                />
            )
    )
}

export default CouncilStateButton;