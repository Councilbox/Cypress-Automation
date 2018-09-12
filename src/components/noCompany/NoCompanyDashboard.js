import React from "react";
import { darkGrey, lightGrey } from "../../styles/colors";
import { Block, Grid, GridItem } from '../../displayComponents';
import ToggleRecordings from './ToggleRecordings';
import ToggleVideo from './ToggleVideo';
import LogoutUser from './LogoutUser';
import RefreshUser from './RefreshUser';


const NoCompanyDashboard = ({ translate, company, user }) => {
	return (
		<div
			style={{
				overflowY: "auto",
				width: "100%",
				backgroundColor: "white",
				padding: 0,
				height: "100%",
				display: "flex",
				alignItems: "center",
				flexDirection: "column"
			}}
			className="container-fluid"
		>
			{user.email === 'aaron.fuentes.cocodin+2@gmail.com'?
				<Grid>
					<GridItem xs={12} md={12} lg={12}>
						<ToggleRecordings />
					</GridItem>
					<GridItem xs={12} md={12} lg={12}>
						<ToggleVideo />
					</GridItem>
					<GridItem xs={12} md={12} lg={12}>
						<LogoutUser />
					</GridItem>
					<GridItem xs={12} md={12} lg={12}>
						<RefreshUser />
					</GridItem>
				</Grid>
			:
				<div className="row" style={{ width: "100%" }}>
					<div
						style={{
							width: "100%",
							height: "calc(100vh - 3em)",
							backgroundColor: lightGrey,
							display: "flex",
							alignItems: "center",
							flexDirection: "column",
							paddingBottom: "5em"
						}}
					>
						<div
							style={{
								padding: "1em",
								paddingTop: "2em"
							}}
						>
							{translate.we_welcome}
						</div>
						<div
							style={{
								fontWeight: "700",
								color: darkGrey,
								padding: "2em",
								fontSize: "1em",
								paddingTop: "0.5em"
							}}
						>
							{translate.no_companies_desc}
						</div>
						<Grid
							style={{
								width: "90%",
								marginTop: "4vh"
							}}
							spacing={8}
						>
							<GridItem xs={12} md={6} lg={4}>
								<Block
									link={`/company/create`}
									icon="add"
									text={translate.companies_add}
								/>
							</GridItem>

							<GridItem xs={12} md={6} lg={4}>
								<Block
									link={`/company/link`}
									icon="link"
									text={translate.companies_link}
								/>
							</GridItem>

							<GridItem xs={12} md={6} lg={4}>
								<Block
									link={`/meeting/new`}
									icon="video_call"
									text={translate.start_conference}
								/>
							</GridItem>

						</Grid>
					</div>
				</div>
			}
		</div>
	);
}

export default NoCompanyDashboard;
