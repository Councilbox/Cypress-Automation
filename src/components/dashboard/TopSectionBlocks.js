import React from "react";
import {
	Block,
	Grid,
	GridItem
} from "../../displayComponents";
import logo from '../../assets/img/logo-icono.png';

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
				id={'edit-company-block'}
				text={translate.edit_company}
			/>
		</GridItem>

		<GridItem xs={12} md={6} lg={3}>
			<Block
				link={`/company/${company.id}/statutes`}
				icon="gavel"
				id={'edit-statutes-block'}
				text={translate.council_types}
			/>
		</GridItem>

		<GridItem xs={12} md={6} lg={3}>
			<Block
				link={`/company/${company.id}/censuses`}
				icon="person"
				id={'edit-censuses-block'}
				text={translate.censuses}
			/>
		</GridItem>

		<GridItem xs={12} md={6} lg={3}>
			<Block
				link={`/company/${company.id}/drafts`}
				icon="class"
				id={'edit-drafts-block'}
				text={translate.drafts}
			/>
		</GridItem>
		<GridItem xs={12} md={false} lg={3}>
		</GridItem>

		<GridItem xs={12} md={6} lg={3}>
			<Block
				link={`/company/${company.id}/council/new`}
				customIcon={<img src={logo} style={{height: '7em', width: 'auto'}} />}
				id={'create-council-block'}
				text={translate.dashboard_new}
			/>
		</GridItem>
		<GridItem xs={12} md={6} lg={3}>
			<Block
				link={`/company/${company.id}/meeting/new`}
				icon="video_call"
				id={'init-meeting-block'}
				text={translate.start_conference}
			/>
		</GridItem>
	</Grid>
);

export default TopSectionBlocks;
