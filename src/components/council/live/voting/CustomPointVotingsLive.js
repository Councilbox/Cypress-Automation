import React from 'react';
import { Grid, GridItem } from '../../../../displayComponents';
import VotingsTableFiltersContainer from './VotingsTableFiltersContainer';
import CustomAgendaRecount from './CustomAgendaRecount';
import PrivateRecountMessage from './PrivateRecountMessage';
import { AGENDA_STATES } from '../../../../constants';
import withSharedProps from '../../../../HOCs/withSharedProps';

const CustomPointVotingsLive = ({ agenda, council, recount, translate, refetch, data: fetchedData, company, ...props }) => (
        <div>
            <Grid style={{ width: '100%', display: 'flex' }}>
                {agenda.subjectType === 7 && agenda.votingState !== AGENDA_STATES.CLOSED ?
					<PrivateRecountMessage translate={translate} />
				:
                    <CustomAgendaRecount
                        agenda={agenda}
                        translate={translate}
                        company={company}
                        council={council}
                    />
                }
                <GridItem xs={12} md={12} lg={12}>
                    <VotingsTableFiltersContainer
                        recount={recount}
                        council={council}
                        translate={translate}
                        changeEditedVotings={props.changeEditedVotings}
                        agenda={agenda}
                    />
                </GridItem>
            </Grid>
        </div>
    )

export default withSharedProps()(CustomPointVotingsLive);
