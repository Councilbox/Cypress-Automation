import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Typography } from 'material-ui';
import { getPrimary } from '../styles/colors';
import { isLandscape, isMobile } from '../utils/screen';


const MainTitle = ({
	icon, title, subtitle, size
}) => (
	size === 'xs' && isLandscape() ?
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				height: '2em',
				paddingLeft: '2em',
				borderBottom: '1px solid gainsboro',
				alignItems: 'center',
			}}
		>
			<FontAwesome
				name={icon}
				color={getPrimary()}
				style={{
					margin: '0.2em 0.4em',
					color: getPrimary(),
					fontSize: '1.75em'
				}}
			/>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column'
				}}
			>
				<h5 style={{ fontWeight: '700' }}><Typography>{title}</Typography></h5>
			</div>
		</div>
		: <div
			style={{
				display: 'flex',
				flexDirection: 'row',
				height: '8em',
				paddingLeft: isMobile ? '' : '2em',
				borderBottom: '1px solid gainsboro',
				alignItems: 'center',
			}}
		>
			<FontAwesome
				name={icon}
				color={getPrimary()}
				style={{
					margin: !isMobile ? '0.2em 0.4em' : '0.2em 0.2em',
					color: getPrimary(),
					fontSize: '4em'
				}}
			/>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden'
				}}
			>
				<h3 style={{
					fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%'
				}}>{title}</h3>
				{!isMobile
&& <Typography style={{ fontSize: '13px' }}>{subtitle}</Typography>
				}
			</div>
		</div>
);

export default MainTitle;
