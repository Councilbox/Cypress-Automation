import { moment } from '../containers/App';

const DateWrapper = ({ date, format, style }) => {
	if (!date) {
		const now = new Date();
		date = now.toISOString();
	}

	return moment(new Date(date)).format(format);
};

export default DateWrapper;
