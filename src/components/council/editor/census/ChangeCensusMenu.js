import React from "react";
import {
	Grid,
	GridItem,
	SelectInput
} from "../../../../displayComponents/index";
import { MenuItem, Typography } from "material-ui";
import * as CBX from "../../../../utils/CBX";
import AddCouncilParticipantButton from "./modals/AddCouncilParticipantButton";

const ChangeCensusMenu = ({
	showAddModal,
	handleCensusChange,
	council,
	translate,
	censuses,
	totalVotes,
	totalSocialCapital,
	participations,
	refetch
}) => (
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
		{censuses.list.length > 0?
			<SelectInput
				floatingText={translate.current_census}
				value={council.selectedCensusId}
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
			</SelectInput>
		:
			<span>La entidad no tiene ningún censo</span>
		}

		</GridItem>
		<GridItem
			lg={3}
			md={3}
			xs={6}
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
		</GridItem>
		<GridItem
			lg={3}
			md={3}
			xs={6}
			style={{
				height: "4em",
				display: "flex",
				alignItems: "center"
			}}
		>
			{CBX.hasParticipations(council) &&
				<Typography
					variant="body2"
					style={{
						padding: "1.1em 1em 0 1em",
						fontWeight: "600",
						fontSize: "1em"
					}}
				>
					{`${translate.total_social_capital}: ${totalSocialCapital}`}
				</Typography>
			}
		</GridItem>
		<GridItem
			lg={3}
			md={3}
			xs={6}
			style={{
				marginTop: "1em",
				display: 'flex',
				justifyContent: 'flex-end'
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
);

export default ChangeCensusMenu;
