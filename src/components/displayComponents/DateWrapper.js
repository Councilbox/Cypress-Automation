import React from 'react';
import moment from 'moment/min/moment-with-locales';
import Moment from 'react-moment';
Moment.globalMoment = moment; 
moment.locale('es');

const DateWrapper = ({ date, format }) => {
    if(!date){
        date = Date.now();
    }

    return(
        <Moment format={format}>{date}</Moment>
    )
};

export default DateWrapper;