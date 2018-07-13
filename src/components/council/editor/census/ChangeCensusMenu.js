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

const ChangeCensusMenu = ({
	showAddModal,
	handleCensusChange,
	reloadCensus,
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
			<span>La entidad no tiene ningún censo{/*TRADUCCION*/}</span>
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
			<Tooltip title="Volver a cargar el censo seleccionado" /*TRADUCCION*/>
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
				height: "4em",
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
);

export default ChangeCensusMenu;
