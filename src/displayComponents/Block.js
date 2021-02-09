import React from 'react';
import { Card, MenuItem } from 'material-ui';
import { Icon } from '.';
import { getSecondary, darkGrey } from '../styles/colors';
import { sendGAevent } from '../utils/analytics';
import { bHistory } from '../containers/App';
import withSharedProps from '../HOCs/withSharedProps';

const Block = withSharedProps()(({ button, link, icon, text, id, customIcon, disabled, disabledOnClick, company }) => {
	const followLink = () => {
		sendGAevent({
			category: 'Dashboard',
			action: text,
			label: company ? company.businessName : 'Sin compañía'
		});
		bHistory.push(link);
	};

	const card = <Card
		id={id}
		elevation={6}
		style={{
			height: '10em',
			borderRadius: '5px',
			backgroundColor: darkGrey,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		}}
	>
		<MenuItem
			style={{
				width: '100%',
				height: '10em',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					width: '100%',
					color: 'white',
					fontWeight: '700',
					fontSize: '0.9em',
					...(!disabled ? {} : { filter: 'grayscale(100%)' })
				}}
			>
				{customIcon || <Icon
						className="material-icons"
						style={{
							fontSize: '7em',
							color: getSecondary()
						}}
					>
						{icon}
					</Icon>
				}

				<span style={{ fontSize: '13px' }}>{text}</span>
			</div>
		</MenuItem>
	</Card>;

	return (
		<React.Fragment>
			{disabled ?
				<div onClick={disabledOnClick}>
					{card}
				</div>
			:
				<div onClick={followLink}>
					{card}
				</div>
			}

			{button && (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						fontWeight: '700',
						marginTop: '0.8em'
					}}
				>
					{button}
				</div>
			)}
		</React.Fragment>
	);
});

export default Block;
