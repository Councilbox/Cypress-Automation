import { moment } from '../containers/App';

const DateWrapper = ({ date, format }) => {
	if (!date) {
		return '-'
	}

	return moment(new Date(date)).format(format);
};

export default DateWrapper;
