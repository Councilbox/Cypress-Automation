import React from 'react';
import { Card, Typography } from 'material-ui';
import { Checkbox } from '../../../displayComponents';


const AgendaCheckItem = ({ agenda, translate, updatePoints, checked }) => (
    <Card style={{
        width: '100%',
        padding: '0.5em',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '0.8em'
    }}>
        <Checkbox
            value={checkIfSelected(agenda.id, checked)}
            onChange={(event, isInputChecked) => updatePoints(agenda.id, isInputChecked)
            }
        />
        <div style={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Typography variant="body1" style={{ fontWeight: '700' }}>
                {agenda.agendaSubject}
            </Typography>
            <Typography variant="body2" style={{ fontSize: '0.8em' }}>
                {agenda.description}
            </Typography>
        </div>
    </Card>
);

const checkIfSelected = (id, array) => !!array.find(item => item === id);

export default AgendaCheckItem;
