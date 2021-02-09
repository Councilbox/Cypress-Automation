import React from 'react';
import ConvenedParticipantsTable from '../../prepare/ConvenedParticipantsTable';
import { hasParticipations } from '../../../../utils/CBX';
import { Scrollbar } from '../../../../displayComponents';

const ActConvenedParticipants = ({ council, translate, totalVotes, socialCapital }) => (
        <div style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
            <Scrollbar>
                <div style={{ padding: '1.5em', overflow: 'hidden' }}>
                    <ConvenedParticipantsTable
                        council={council}
                        participations={hasParticipations(council)}
                        cantEdit={true}
                        cbxData={true}
                        totalVotes={totalVotes}
                        socialCapital={socialCapital}
                        hideNotifications={true}
                        hideAddParticipant={true}
                        translate={translate}
                    />
                </div>
            </Scrollbar>
        </div>

    );

export default ActConvenedParticipants;
