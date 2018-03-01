import React from 'react';
import { getSecondary } from '../../styles/colors';
import { DateWrapper } from '../displayComponents';

const DateHeader = ({ title, date, button }) => (
    <div style={{border: `1px solid ${getSecondary()}`, height: '5em', padding: '1em', display: 'flex', flexDirection: 'row'}}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <h5>{title}</h5>
            <DateWrapper date={date} format="DD/MM/YYYY HH:mm" />
        </div>
        {button}
    </div>
);

export default DateHeader;