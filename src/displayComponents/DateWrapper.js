import React from "react";
import { moment } from '../containers/App';
import Moment from "react-moment";
Moment.globalMoment = moment;

const DateWrapper = ({ date, format, style }) => {
	if (!date) {
		const now = new Date();
		date = now.toISOString();
	}

	return <Moment format={format} style={style}>{date}</Moment>;
};

export default DateWrapper;
