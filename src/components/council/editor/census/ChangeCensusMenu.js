import React from "react";
import {
	Grid,
	GridItem,
	SelectInput,
	ButtonIcon,
	BasicButton
} from "../../../../displayComponents/index";
import { MenuItem, Typography, Tooltip } from "material-ui";
import * as CBX from "../../../../utils/CBX";
import AddCouncilParticipantButton from "./modals/AddCouncilParticipantButton";
import { getSecondary } from "../../../../styles/colors";
import withSharedProps from "../../../../HOCs/withSharedProps";
import { GOVERNING_BODY_TYPES } from "../../../../constants";

const multipleGoverningBody = type => {
	return !![
		GOVERNING_BODY_TYPES.COUNCIL,
		GOVERNING_BODY_TYPES.JOINT_ADMIN,
		GOVERNING_BODY_TYPES.SOLIDARY_ADMIN
	].find(item => type === item.value);
}


const ChangeCensusMenu = ({
	showAddModal,
	handleCensusChange,
	reloadCensus,
	council,
	company,
	translate,
	censuses,
	totalVotes,
	totalSocialCapital,
	participations,
	refetch
}) => {

	console.log(company);
	console.log(multipleGoverningBody(company.governingBodyType));

	return (
		<Grid>
				<GridItem
					lg={3}
					md={3}
					xs={6}
					style={{
						height: "4em",
						verticalAlign: "middle"
					}}
				>
				{censuses && censuses.list && censuses.list.length > 0?
					<SelectInput
						floatingText={translate.current_census}
						value={council.selectedCensusId || '-3'}
						onChange={handleCensusChange}
					>
						{censuses.list.map(census => {
							return (
								<MenuItem
									value={parseInt(census.id, 10)}
									key={`census${census.id}`}
								>
									{census.censusName}
								</MenuItem>
							);
						})}
						{(multipleGoverningBody(company.governingBodyType) &&
							company.governingBodyData &&
							company.governingBodyData.list &&
							company.governingBodyData.list.length > 0) &&
								<MenuItem
									value={parseInt(-1, 10)}
								>
									{translate.governing_body}
								</MenuItem>
						}
					</SelectInput>
				:
					<span>{translate.empty_censuses}</span>
				}

				</GridItem>
				<GridItem
					lg={1}
					md={1}
					xs={6}
					style={{
						height: "4em",
						display: "flex",
						alignItems: "center"
					}}
				>
					<Tooltip title={translate.try_again_census} >
						<div>
							<BasicButton
								color={getSecondary()}
								buttonStyle={{
									margin: "0"
								}}
								icon={
									<ButtonIcon
										color="white"
										type="refresh"
									/>
								}
								textPosition="after"
								onClick={() =>
									reloadCensus()
								}
							/>
						</div>
					</Tooltip>
				</GridItem>
				<GridItem
					lg={5}
					md={5}
					xs={12}
					style={{
						height: "4em",
						display: "flex",
						alignItems: "center"
					}}
				>
					<Typography
						variant="body2"
						style={{
							padding: "1.1em 1em 0 1em",
							fontWeight: "600",
							fontSize: "1em"
						}}
					>
						{`${translate.total_votes}: ${totalVotes? totalVotes : 0}`}
					</Typography>
					{CBX.hasParticipations(council) &&
						<Typography
							variant="body2"
							style={{
								padding: "1.1em 1em 0 1em",
								fontWeight: "600",
								fontSize: "1em"
							}}
						>
							{`${translate.total_social_capital}: ${totalSocialCapital? totalSocialCapital : 0}`}
						</Typography>
					}
				</GridItem>
				<GridItem
					lg={3}
					md={3}
					xs={12}
					style={{
						height: "4em",
						display: 'flex',
						alignItems: "center"
					}}
				>
					<AddCouncilParticipantButton
						participations={participations}
						translate={translate}
						councilId={council.id}
						refetch={refetch}
					/>
				</GridItem>
		</Grid>
	)
}

export default withSharedProps()(ChangeCensusMenu);
