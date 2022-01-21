import React from 'react';
import { LoadingSection } from '.';

const StatusIcon = ({ status }) => {
	if (status === 'LOADING') return <LoadingSection size={14} />;
	if (status === 'DONE') return <i className="fa fa-check" style={{ color: 'green' }}></i>;
	if (status === 'FAILED') return <i className="fa fa-times" style={{ color: 'red' }}></i>;
	return <span />;
};

export default StatusIcon;
