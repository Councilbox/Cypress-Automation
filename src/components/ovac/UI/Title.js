import React from 'react';


const Title = ({ children, fontSize = '18px' }) => {
	return (
		<div
			style={{
				fontSize,
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
