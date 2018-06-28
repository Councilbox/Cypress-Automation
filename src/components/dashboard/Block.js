import React from 'react';
import { Link, Icon } from '../../displayComponents';
import { getSecondary, darkGrey } from '../../styles/colors';
import { Card, MenuItem } from 'material-ui';

const Block = ({ button, link, icon, text }) => (
	<React.Fragment>
		<Link to={link}>
			<Card
				elevation={5}
				style={{
					height: "10em",
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
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							width: "100%",
							color: 'white',
							fontWeight: "700",
							fontSize: "0.9em"
						}}
					>
						<Icon
							className="material-icons"
							style={{
								fontSize: "7em",
								color: getSecondary()
							}}
						>
							{icon}
						</Icon>
						{text}
					</div>
				</MenuItem>
			</Card>
		</Link>
		{button && (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					fontWeight: "700",
					marginTop: '0.8em'
				}}
			>
				{button}
			</div>
		)}
	</React.Fragment>
);

export default Block;