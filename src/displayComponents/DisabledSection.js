import React from 'react';


const DisabledSection = ({ children, fullScreen }) => {
	const renderChildren = () => (
		<div style={{
			padding: '3em', border: '2px solid black', backgroundColor: 'white', borderRadius: '8px'
		}}>
			{children}
		</div>
	);

	return (
		<div
			style={{
				position: 'absolute',
				top: '0',
				left: '0',
				width: '100%',
				height: '100%',
				zIndex: 100,
				backgroundColor: 'rgba(0, 0, 0, 0.26)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontWeight: '700',
				fontSize: '1.3em'
			}}
			onClick={event => event.stopPropagation()}
		>
			{fullScreen ?
				<div style={{
					position: 'fixed',
					left: '-1%',
					display: 'flex',
					justifyContent: 'center',
					width: '100%'
				}}>
					{renderChildren()}
				</div>
				: renderChildren()
			}

		</div>
	);
};

export default DisabledSection;
