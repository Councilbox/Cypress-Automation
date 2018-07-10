import React from 'react';
import ConvenedParticipantsTable from '../../prepare/ConvenedParticipantsTable';
import { hasParticipations } from '../../../../utils/CBX';
import Scrollbar from 'react-perfect-scrollbar';

const ActConvenedParticipants = ({ council, translate }) => {

    return(
        <div style={{ height: "100%", overflow: 'hidden', position: 'relative' }}>
            <Scrollbar option={{ suppressScrollX: true }}>
                <div style={{padding: '1.5em', overflow: 'hidden'}}>
                    <ConvenedParticipantsTable
                        council={council}
                        participations={hasParticipations(
                            council
                        )}
                        hideNotifications={true}
                        hideAddParticipant={true}
                        translate={translate}
                    />
                </div>
            </Scrollbar>
        </div>

    )
}

export default ActConvenedParticipants;