import React from 'react';
import { ListItem } from 'material-ui';
import { Icon } from '../../displayComponents';
import { bHistory } from '../../containers/App';

const LateralOption = ({
	icon, text, link, customIcon, style, id
}) => {
	const followLink = path => {
		bHistory.push(path);
	};

	return (
		<div
			className={'links'}
			style={{
				padding: '0px',
				display: 'flex',
				width: '90%',
				borderRadius: '3px',
				alignItems: 'center',
				justifyContent: 'center',
				...style
			}}
			id={id}
			onClick={() => followLink(link)}
		>
			<ListItem
				button
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '0px',
				}}
			>
				<div
					style={{
						width: '100%',
						height: '60px',
						textAlign: 'center',
						marginTop: '0.5em',
						padding: '0px',
						borderRadius: '3px'
					}}
				>
					<div style={{
						textAlign: 'center', alignItems: 'center', justifyContent: 'center', display: 'flex',
					}}>
						{!customIcon ? (
							<Icon
								className="material-icons"
								style={{
									color: '#ffffffcc',
								}}
							>
								{icon}
							</Icon>
						) : (
							<div
								style={{
									alignItems: 'center',
									justifyContent: 'center',
									display: 'flex',
									width: '1em',
									height: '1em',
									overflow: 'hidden',
									fontSize: '24px',
									userSelect: 'none',
								}}
							>
								{customIcon}
							</div>
						)}
					</div>
					<div style={{
						marginTop: '10px',
						fontSize: '0.55em',
						color: '#ffffffcc'
					}}>
						{text}
					</div>
				</div>
			</ListItem>
		</div>
	);
};


export default LateralOption;
