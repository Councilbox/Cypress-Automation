import React from "react";
import Moment from "react-moment";
import { moment } from '../containers/App';
Moment.globalMoment = moment;

const DateWrapper = ({ date, format, style }) => {
	if (!date) {
		const now = new Date();
		date = now.toISOString();
	}

	return <Moment format={format} style={style}>{date}</Moment>;
};

export default DateWrapper;
