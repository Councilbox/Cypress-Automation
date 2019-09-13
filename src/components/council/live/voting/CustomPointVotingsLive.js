import React from 'react';
import { Grid, GridItem } from '../../../../displayComponents';
import * as CBX from '../../../../utils/CBX';
import VotingsTableFiltersContainer from './VotingsTableFiltersContainer';
import CustomAgendaRecount from './CustomAgendaRecount';
import CustomAgendaManualVotings from './CustomAgendaManualVotings';
import PrivateRecountMessage from './PrivateRecountMessage';
import { AGENDA_STATES } from '../../../../constants';

const CustomPointVotingsLive = ({ agenda, council, recount, translate, refetch, data: fetchedData, ...props}) => {
    return (
        <div>
            <Grid style={{width: '100%', display: 'flex'}}>
                {agenda.subjectType === 7 && agenda.votingState !== AGENDA_STATES.CLOSED?
					<PrivateRecountMessage translate={translate} />
				:
                    <CustomAgendaRecount agenda={agenda} translate={translate} />
                }
                {((CBX.canEditPresentVotings(agenda) && CBX.agendaVotingsOpened(agenda) && council.councilType !== 3) || (council.councilType === 3 && agenda.votingState === 4)) &&
                    <CustomAgendaManualVotings
                        agenda={agenda}
                        translate={translate}
                        changeEditedVotings={props.changeEditedVotings}
                    />
				}

                <GridItem xs={12} md={12} lg={12}>
                    <VotingsTableFiltersContainer
                        recount={recount}
                        council={council}
                        translate={translate}
                        agenda={agenda}
                    />
                </GridItem>
            </Grid>
        </div>
    )
}

export default CustomPointVotingsLive;