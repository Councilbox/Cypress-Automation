import React from 'react';
import { AlertConfirm, Grid, GridItem } from "../../../../displayComponents";
import moment from 'moment';
import { hasSecondCall } from '../../../../utils/CBX';


const CouncilInfoModal = ({ council, requestClose, show, translate }) => (<AlertConfirm
    requestClose={requestClose}
    open={show}
    bodyText={<Grid style={{ width: '560px' }}>
        <GridItem xs={12} lg={12} md={12}>
            {`${translate.new_location_of_celebrate}: ${council.street}, ${council.zipcode}, ${council.countryState}, (${council.country})`}
        </GridItem>
        <GridItem xs={12} lg={12} md={12}>
            {`${translate[ '1st_call_date' ]}: ${moment(council.dateStart).format('LLL')}`}
        </GridItem>
        <GridItem xs={12} lg={12} md={12}>
            {hasSecondCall(council.statute) && `${translate[ '2nd_call_date' ]}: ${moment(council.dateStart2NdCall).format('LLL')}`}
        </GridItem>
    </Grid>}
    title={translate.council_info}
/>)

export default CouncilInfoModal;