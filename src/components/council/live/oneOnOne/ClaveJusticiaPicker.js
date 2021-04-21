import React from 'react';
import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/es_ES';
import 'moment/locale/es';


const ClaveJusticiaPicker = ({ error, date, onChange, placeholder }) => (
	<>
		<DatePicker
			format={'DD-MM-yyyy'}
			locale={locale}
			style={{
				width: '100%'
			}}
			placeholder={placeholder}
			showToday={false}
			defaultValue={date}
			onChange={onChange}
		/>
		<span style={{ color: 'red' }}>
			{error}
		</span>
	</>
);

export default ClaveJusticiaPicker;
