import React from 'react';
import { Card, Typography } from 'material-ui';

const CouncilHeader = ({ council, translate }) => (
    <Card 
        style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '0.8em',
            margin: '1em'
        }}
    >
        <Typography variant="subheading" style={{fontWeight: '700'}}>
            {council.name}
        </Typography>
        <Typography variant="body2" style={{fontSize: '0.9em'}}>
            {council.remoteCelebration === 1? translate.remote_celebration : `${council.street}, ${council.country}`}
        </Typography>
    </Card>
)

export default CouncilHeader;