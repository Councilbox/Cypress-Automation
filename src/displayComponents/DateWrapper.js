import React from 'react';
import moment from 'moment/min/moment-with-locales';
import Moment from 'react-moment';

Moment.globalMoment = moment;
moment.locale('es');

const DateWrapper = ({ date, format }) => {
    if (!date) {
        const now = new Date();
        date = now.toISOString();
    }

    return (<Moment format={format}>{date}</Moment>)
};

export default DateWrapper;