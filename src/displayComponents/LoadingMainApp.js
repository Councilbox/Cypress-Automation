import React from 'react';

const LoadingMainApp = ({ message, error }) => {
	if (error) {
		window.location.reload();
	}

	return (
		<div
			style={{
				display: 'flex',
				height: '100vh',
				width: '100vw',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column'
			}}
		>
			<img src="/img/logo-icono.png" className="element-animation" alt="councilbox logo"></img>
			<div>
				{message}
			</div>
		</div>
	);
};

export default LoadingMainApp;
