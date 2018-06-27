import React from "react";
import { darkGrey, getSecondary } from "../../styles/colors";
import {
	BasicButton,
	DropDownMenu,
	Grid,
	GridItem,
	Icon,
	Link,
	ButtonIcon
} from "../../displayComponents";
import { MenuItem, Card } from "material-ui";

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



const TopSectionBlocks = ({ translate, company }) => (
	<Grid
		style={{
			width: "90%",
			marginTop: "4vh"
		}}
		spacing={8}
	>
		<GridItem xs={12} md={6} lg={3}>
			<Block
				link={`/company/${company.id}/settings`}
				icon="work"
				text={translate.edit_company}
			/>
		</GridItem>

		<GridItem xs={12} md={6} lg={3}>
			<Block
				link={`/company/${company.id}/statutes`}
				icon="gavel"
				text={translate.statutes}
			/>
		</GridItem>

		<GridItem xs={12} md={6} lg={3}>
			<Block
				link={`/company/${company.id}/censuses`}
				icon="person"
				text={translate.censuses}
			/>
		</GridItem>

		<GridItem xs={12} md={6} lg={3}>
			<Block
				link={`/company/${company.id}/drafts`}
				icon="class"
				text={translate.drafts}
			/>
		</GridItem>
	</Grid>
);

export default TopSectionBlocks;
