import React from 'react';
import { Card } from 'material-ui';
import { DateWrapper } from '../../../displayComponents';
import { hasSecondCall } from '../../../utils/CBX';

const CouncilHeader = ({ council, translate }) => (
    <Card elevation={0} style={{padding: '0.5em', paddingLeft: 0, marginBottom: '0.8em', fontWeight: '700'}}>
        {`${translate.table_councils_name}: ${council.name}`}
    </Card>
)

export default CouncilHeader;