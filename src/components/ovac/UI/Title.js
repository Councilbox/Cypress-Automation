import React from 'react';


const Title = ({ children }) => {
	return (
		<div
			style={{
				fontSize: '18px',
				fontWeight: 'bold',
				fontStretch: 'normal',
				fontStyle: 'normal',
				lineHeight: 'normal',
				letterSpacing: 'normal',
				color: 'var(--primary)'
			}}
		>
			{children}
		</div>
	);
};

export default Title;
