import React from "react";
import {
	Block,
	Grid,
	GridItem,
	BasicButton,
	Scrollbar
} from "../../displayComponents";
import logo from '../../assets/img/logo-icono.png';
import { ConfigContext } from '../../containers/AppControl';
import CantCreateCouncilsModal from "./CantCreateCouncilsModal";
import { TRIAL_DAYS } from "../../config";
import { trialDaysLeft } from "../../utils/CBX";
import { moment } from "../../containers/App";
import { Avatar } from "antd";
import { primary } from "../../styles/colors";

const TopSectionBlocks = ({ translate, company, user }) => {
	const [open, setOpen] = React.useState(false);
	const config = React.useContext(ConfigContext);

	const closeCouncilsModal = () => {
		setOpen(false);
	}

	const showCouncilsModal = () => {
		setOpen(true);
	}

	const companyHasBook = () => {
		return company.category === 'society';
	}

	const hasBook = companyHasBook();

	const size = !hasBook ? 4 : 3;
	const blankSize = !hasBook ? 2 : 3;

	return (
		<div style={{ width: "100%" }}>
			<Grid style={{
				padding: "1em",
			}}>
				<Grid style={{
					background: "white",
					boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
					padding: "1em",
					borderRadius: "5px",
					textAlign: "left",
					overflow: "hidden"
				}}>
					<GridItem xs={8} md={8} lg={8} style={{ overflow: "hidden", minHeight: "100px" }}>
						<div style={{ marginBottom: "1em" }}>Reuniones en curso</div>
						<Grid style={{ overflow: "hidden", height: "200px", }}>
							<Scrollbar>
								<GridItem style={{ background: "#edf4fb", padding: "1em" }} xs={12} md={12} lg={12}>
									<Grid style={{ alignItems: "center" }} >
										<GridItem xs={1} md={1} lg={1}>
											<Avatar alt="Foto" />
										</GridItem>
										<GridItem xs={4} md={4} lg={4}>
											Olivo ventyres kunuted
									</GridItem>
										<GridItem xs={4} md={4} lg={4}>
											Junta general extraordinaria - /10/2019
									</GridItem>
										<GridItem xs={3} md={3} lg={3} style={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
											<BasicButton
												text="Convocatoria enviada"
												//  onClick={create}
												textStyle={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: primary, }}
												backgroundColor={{ backgroundColor: "white", borderRadius: "4px" }}
											>
											</BasicButton>
										</GridItem>
									</Grid>
								</GridItem>
								<GridItem style={{ background: "", padding: "1em" }} xs={12} md={12} lg={12}>
									<Grid style={{ alignItems: "center" }}>
										<GridItem xs={1} md={1} lg={1}>
											<Avatar alt="Foto" />
										</GridItem>
										<GridItem xs={4} md={4} lg={4}>
											Olivo ventyres kunuted
									</GridItem>
										<GridItem xs={4} md={4} lg={4}>
											Junta general extraordinaria - /10/2019
									</GridItem>
										<GridItem xs={3} md={3} lg={3} style={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
											<BasicButton
												text="Convocatoria enviada"
												//  onClick={create}
												textStyle={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: primary, }}
												backgroundColor={{ backgroundColor: "white", borderRadius: "4px" }}
											>
											</BasicButton>
										</GridItem>
									</Grid>
								</GridItem>
								<GridItem style={{ background: "#edf4fb", padding: "1em" }} xs={12} md={12} lg={12}>
									<Grid style={{ alignItems: "center" }} >
										<GridItem xs={1} md={1} lg={1}>
											<Avatar alt="Foto" />
										</GridItem>
										<GridItem xs={4} md={4} lg={4}>
											Olivo ventyres kunuted
									</GridItem>
										<GridItem xs={4} md={4} lg={4}>
											Junta general extraordinaria - /10/2019
									</GridItem>
										<GridItem xs={3} md={3} lg={3} style={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
											<BasicButton
												text="Convocatoria enviada"
												//  onClick={create}
												textStyle={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: primary, }}
												backgroundColor={{ backgroundColor: "white", borderRadius: "4px" }}
											>
											</BasicButton>
										</GridItem>
									</Grid>
								</GridItem>
							</Scrollbar>
						</Grid>
					</GridItem>
					<GridItem xs={4} md={4} lg={4}>
						<div>Calendario</div>
						<div>asdassdas</div>
					</GridItem>
				</Grid>
				<Grid
					style={{
						marginTop: '2em',
						display: "flex",
						justifyContent: 'space-between'
					}}>
					<GridItem xs={4} md={4} lg={4} style={{
						background: "white",
						boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
						padding: "1em",
						borderRadius: "5px"
					}}>
						<div>Calendario</div>
						<div>asdassdas</div>
					</GridItem>
					<GridItem xs={7} md={7} lg={7} style={{
						background: "white",
						boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
						padding: "1em",
						borderRadius: "5px"
					}}>
						<div>Reuniones en curso</div>
						<div>asdasdasdasdas</div>
					</GridItem>
				</Grid>

			</Grid>
		</div>
		// <Grid
		// 	style={{
		// 		width: "90%",
		// 		marginTop: "4vh"
		// 	}}
		// 	spacing={8}
		// >
		// 	<CantCreateCouncilsModal
		// 		open={open}
		// 		requestClose={closeCouncilsModal}
		// 		translate={translate}
		// 	/>
		// 	<GridItem xs={12} md={size} lg={size}>
		// 		<Block
		// 			link={`/company/${company.id}/statutes`}
		// 			icon="gavel"
		// 			id={'edit-statutes-block'}
		// 			text={translate.council_types}
		// 		/>
		// 	</GridItem>
		// 	{hasBook &&
		// 		<GridItem xs={12} md={3} lg={3}>
		// 			<Block
		// 				link={`/company/${company.id}/book`}
		// 				icon="contacts"
		// 				id={'edit-company-block'}
		// 				disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
		// 				disabledOnClick={showCouncilsModal}
		// 				text={translate.book}
		// 			/>
		// 		</GridItem>
		// 	}

		// 	<GridItem xs={12} md={size} lg={size}>
		// 		<Block
		// 			link={`/company/${company.id}/censuses`}
		// 			icon="person"
		// 			id={'edit-censuses-block'}
		// 			text={translate.censuses}
		// 		/>
		// 	</GridItem>

		// 	<GridItem xs={12} md={size} lg={size}>
		// 		<Block
		// 			link={`/company/${company.id}/drafts`}
		// 			icon="class"
		// 			id={'edit-drafts-block'}
		// 			text={translate.drafts}
		// 		/>
		// 	</GridItem>
		// 	<GridItem xs={12} md={blankSize} lg={blankSize}>
		// 	</GridItem>

		// 	<GridItem xs={12} md={size} lg={size}>
		// 		<Block
		// 			link={`/company/${company.id}/council/new`}
		// 			customIcon={<img src={logo} style={{height: '7em', width: 'auto'}} alt="councilbox-logo" />}
		// 			id={'create-council-block'}
		// 			disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
		// 			disabledOnClick={showCouncilsModal}
		// 			text={translate.dashboard_new}
		// 		/>
		// 	</GridItem>
		// 	<GridItem xs={12} md={size} lg={size}>
		// 		<Block
		// 			link={`/company/${company.id}/meeting/new`}
		// 			icon="video_call"
		// 			id={'init-meeting-block'}
		// 			text={translate.start_conference}
		// 		/>
		// 	</GridItem>
		// 	{user.roles === 'devAdmin' && false &&
		// 		<GridItem xs={12} md={size} lg={size}>
		// 			<Block
		// 				link={`/admin`}
		// 				customIcon={<i className="fa fa-user-secret" aria-hidden="true" style={{fontSize: '7em'}}></i>}
		// 				id={'admin-panel'}
		// 				text={'Panel devAdmin'}
		// 			/>
		// 		</GridItem>
		// 	}
		// </Grid>
	);
}


export default TopSectionBlocks;
