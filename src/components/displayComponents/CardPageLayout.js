import React from 'react';
import { lightGrey } from '../../styles/colors';
import { Card, CardText } from 'material-ui';

const CardPageLayout = ({ children, title }) => (
    <div style = {{display: 'flex', flexDirection: 'column', backgroundColor: lightGrey, height: '100%', alignItems: 'center', justifyContent: 'flex'}} >
        <h3>{title}</h3>
        <Card style={{width: '95%', padding: 0, borderRadius: '0.3em', overflow: 'auto'}} containerStyle={{padding: 0}}>
            <CardText style={{padding: 0}}>
                {children}
            </CardText>
        </Card>    
    </div>
)

export default CardPageLayout;