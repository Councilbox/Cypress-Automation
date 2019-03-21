import React from 'react';
import { hasSecondCall } from '../../../utils/CBX';
import { moment } from '../../../containers/App';
import { Card } from 'material-ui';


const CouncilInfo = ({ council, translate }) => (
    <div>
        <Card elevation={4} style={{ padding: "20px" }}>
            <b>{`${translate.new_location_of_celebrate}`}</b>: {`${council.street}, ${council.country}`}
            {hasSecondCall(council) ?
                <React.Fragment>
                    <p><b>{`${translate['1st_call_date']}`}</b>: {`${moment(council.dateStart).format('LLL')}`}</p>
                    <p><b>{`${translate['2nd_call_date']}`}</b>: {`${moment(council.dateStart2NdCall).format('LLL')}`}</p>
                </React.Fragment>
                :
                <p>
                    <b>{`${translate.celebration_date}`}</b>: {`${moment(council.dateStart).format('LLL')}`}
                </p>
            }
            {!!council.dateRealStart &&
                <p>
                    {`${translate.meeting_has_started_in} ${
                        council.firstOrSecondConvene === 1 ? translate.first_call : translate.second_call
                        } ${translate.the
                        } ${moment(council.dateRealStart).format('LLL')}`
                    }
                </p>
            }
        </Card>
    </div>
);

export default CouncilInfo;