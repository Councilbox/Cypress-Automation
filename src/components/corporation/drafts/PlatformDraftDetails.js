import React from "react";
import { Typography } from "material-ui";
import { graphql } from "react-apollo";
import {
	BasicButton,
	ButtonIcon,
	Grid,
	GridItem,
	LoadingSection
} from "../../../displayComponents";
import { getPrimary } from "../../../styles/colors";
import { draftDetails } from "../../../queries";
import { hasVotation } from "../../../utils/CBX";

const PlatformDraftDetails = ({ translate, draft, close, data }) => {
	if (data.loading) {
		return <LoadingSection />;
	}

	const findMajorityLabel = () => {
		const result = data.majorityTypes.find(
			majority => majority.value === draft.majorityType
		);
		return result ? result.label : "-";
	};

	const findVotationLabel = () => {
		const result = data.votingTypes.find(
			voting => voting.value === draft.votationType
		);
		return result ? result.label : "-";
	};

	return (
		<div>
			<Typography variant="title" style={{ color: getPrimary() }}>
				{translate.draft_preview}
			</Typography>
			<BasicButton
				text={translate.back}
				color={getPrimary()}
				textStyle={{
					color: "white",
					fontWeight: "700"
				}}
				onClick={() => close()}
				icon={<ButtonIcon type="keyboard_arrow_left" color="white" />}
			/>
			<Grid style={{ marginTop: "1em" }}>
				<GridItem xs={12} md={4} lg={4}>
					<Typography variant="body2">{translate.title}</Typography>
					<Typography variant="caption">{draft.title}</Typography>
				</GridItem>
				<GridItem xs={12} md={2} lg={2}>
					<Typography variant="body2">
						{translate.company_type}
					</Typography>
					<Typography variant="caption">
						{draft.companyType
							? translate[
									data.companyTypes[draft.companyType].label
							  ]
							: "-"}
					</Typography>
				</GridItem>
				<GridItem xs={12} md={2} lg={2}>
					<Typography variant="body2">
						{translate.council_type}
					</Typography>
					<Typography variant="caption">
						{draft.prototype
							? translate[
									councilTypes[draft.prototype - 1].title
							  ]
							: "-"}
					</Typography>
				</GridItem>
				<GridItem xs={12} md={2} lg={2}>
					<Typography variant="body2">
						{translate.draft_type}
					</Typography>
					<Typography variant="caption">
						{translate[data.draftTypes[draft.type].label]}
					</Typography>
				</GridItem>
				{draft.type === 1 && (
					<GridItem xs={12} md={2} lg={2}>
						<Typography variant="body2">
							{translate.votation_type}
						</Typography>
						<Typography variant="caption">
							{translate[findVotationLabel()] || "-"}
						</Typography>
					</GridItem>
				)}
				<GridItem xs={12} md={12} lg={12}>
					<Typography variant="body2">
						{translate.description}
					</Typography>
					<Typography variant="caption">
						{draft.description}
					</Typography>
				</GridItem>

				{hasVotation(draft.votationType) && (
					<GridItem xs={12} md={12} lg={12}>
						<Typography variant="body2">
							{translate.majority_label}
						</Typography>
						<Typography variant="caption">
							{translate[findMajorityLabel() || "-"]}
						</Typography>
					</GridItem>
				)}
			</Grid>
		</div>
	);
};

export default graphql(draftDetails)(PlatformDraftDetails);

const councilTypes = [
	{
		prototype: 1,
		title: "ordinary_general_assembly",
		company_type: 0
	},
	{
		prototype: 2,
		title: "special_general_assembly",
		company_type: 0
	},
	{
		prototype: 3,
		title: "board_of_directors",
		company_type: 0
	},
	{
		prototype: 4,
		title: "ordinary_general_assembly",
		company_type: 1
	},
	{
		prototype: 5,
		title: "special_general_assembly",
		company_type: 1
	},
	{
		prototype: 6,
		title: "board_of_directors",
		company_type: 1
	},
	{
		prototype: 4,
		title: "ordinary_general_assembly",
		company_type: 2
	},
	{
		prototype: 5,
		title: "special_general_assembly",
		company_type: 2
	},
	{
		prototype: 6,
		title: "board_of_directors",
		company_type: 2
	},
	{
		prototype: 10,
		title: "ordinary_general_assembly_association",
		company_type: 3
	},
	{
		prototype: 11,
		title: "special_general_assembly_association",
		company_type: 3
	},
	{
		prototype: 12,
		title: "council_of_directors_association",
		company_type: 3
	},
	{
		prototype: 13,
		title: "executive_committee",
		company_type: 3
	},
	{
		prototype: 14,
		title: "ordinary_general_assembly_association",
		company_type: 4
	},
	{
		prototype: 15,
		title: "special_general_assembly_association",
		company_type: 4
	},
	{
		prototype: 16,
		title: "council_of_directors_association",
		company_type: 4
	},
	{
		prototype: 17,
		title: "executive_committee",
		company_type: 4
	},
	{
		prototype: 18,
		title: "council",
		company_type: 5
	}
];
