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
import Block from './Block';

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
