import React from 'react';
import { hasSecondCall } from '../../../utils/CBX';
import { DateWrapper } from '../../../displayComponents';
import { moment } from '../../../containers/App';

const CouncilInfo = ({ council, translate }) => (
    <div>
        {`${translate.new_location_of_celebrate}: ${council.street}, ${council.country}`}
        {hasSecondCall(council)?
            <p>
                {`${translate.celebration_date}: ${moment(council.dateStart).format('LLL')}`}
            </p>
        :
            <React.Fragment>
                <p>{`${translate['1st_call_date']}: ${moment(council.dateStart).format('LLL')}`}</p>
                <p>{`${translate['2nd_call_date']}: ${moment(council.dateStart2NdCall).format('LLL')}`}</p>
            </React.Fragment>            
        }
        {!!council.dateRealStart &&
            <p>
                {`${translate.meeting_has_started_in} ${
                    council.firstOrSecondConvene === 1? translate.first_call : translate.second_call
                    } ${translate.the
                    } ${moment(council.dateRealStart).format('LLL')}`
                }
            </p>
        }

    </div>
);

export default CouncilInfo;