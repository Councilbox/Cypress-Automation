import React from 'react';
import { lightGrey } from '../../styles/colors';
import { Card, CardContent } from 'material-ui';

const CardPageLayout = ({ children, title }) => (
    <div style = {{display: 'flex', flexDirection: 'column', backgroundColor: lightGrey, height: '100%', alignItems: 'center', justifyContent: 'flex'}} >
        <h3>{title}</h3>
        <Card style={{width: '95%', padding: 0, borderRadius: '0.3em', overflow: 'auto'}}>
            <CardContent style={{padding: 0}}>
                {children}
            </CardContent>
        </Card>    
    </div>
)

export default CardPageLayout;