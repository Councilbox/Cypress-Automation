import React from "react";
import {
	Block,
	Grid,
	GridItem,
	Link,
} from "../../displayComponents";
import logo from '../../assets/img/logo-icono.png';
import { TRIAL_DAYS } from "../../config";
import { trialDaysLeft } from "../../utils/CBX";
import { moment } from "../../containers/App";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getPrimary, getSecondary, darkGrey } from "../../styles/colors";
import { Icon, Card, MenuItem } from "material-ui";



const ButtonsDirectAccess = ({ company, translate, isMobile }) => {

	let items = (
		<React.Fragment>
			<GridItem xs={12} md={3} lg={3} style={{ marginBottom: isMobile ? "1em" : "" }}>
				<Block
					link={`/company/${company.id}/statutes`}
					icon="gavel"
					id={'edit-statutes-block'}
					text={translate.council_types}
				/>
			</GridItem>

			<GridItem xs={12} md={3} lg={3} style={{ marginBottom: isMobile ? "1em" : "" }}>
				<Block
					link={`/company/${company.id}/book`}
					icon="contacts"
					id={'edit-company-block'}
					disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
					disabledOnClick={this.showCouncilsModal}
					text={translate.book}
				/>
			</GridItem>

			<GridItem xs={12} md={3} lg={3} style={{ marginBottom: isMobile ? "1em" : "" }}>
				<Block
					link={`/company/${company.id}/censuses`}
					icon="person"
					id={'edit-censuses-block'}
					text={translate.censuses}
				/>
			</GridItem>

			<GridItem xs={12} md={3} lg={3} style={{ marginBottom: isMobile ? "1em" : "" }}>
				<Block
					link={`/company/${company.id}/drafts`}
					icon="class"
					id={'edit-drafts-block'}
					text={translate.drafts}
				/>
			</GridItem>
			<GridItem xs={12} md={3} lg={3} style={{ marginBottom: isMobile ? "1em" : "" }}>
			</GridItem>

			<GridItem xs={12} md={3} lg={3} style={{ marginBottom: isMobile ? "1em" : "" }}>
				<Block
					link={`/company/${company.id}/council/new`}
					customIcon={<img src={logo} style={{ height: '7em', width: 'auto' }} alt="councilbox-logo" />}
					id={'create-council-block'}
					disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
					disabledOnClick={this.showCouncilsModal}
					text={translate.dashboard_new}
				/>
			</GridItem>
			<GridItem xs={12} md={3} lg={3} style={{ marginBottom: isMobile ? "1em" : "" }}>
				<Block
					link={`/company/${company.id}/meeting/new`}
					icon="video_call"
					id={'init-meeting-block'}
					text={translate.start_conference}
				/>
			</GridItem>
		</React.Fragment>
	);

	let itemsPc = (
		<React.Fragment >
			<GridItem xs={6} md={3} lg={2} style={{ marginBottom: isMobile ? "1em" : "", display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
					<Card elevation={6} style={{ width: "155px", borderRadius: "5px 5px 5px 5px", backgroundColor: "transparent" }} >
						<Link to={`/company/${company.id}/statutes`} >
							<div style={{ background: "#a0000b", maxWidth: "155px", padding: "1em", borderRadius: "5px 5px 0px 0px" }}>
								<Icon
									className="material-icons"
									style={{
										fontSize: "4em",
										color: "white"
									}}
								>
									{'gavel'}
								</Icon>
							</div>
							<div style={{ marginTop: "1px", background: darkGrey, maxWidth: "155px", padding: '1em', borderRadius: "0px 0px 5px 5px", color: 'white' }}>
								{translate.council_types}
							</div>
						</Link>
					</Card>
			</GridItem>

			<GridItem xs={6} md={3} lg={2} style={{ marginBottom: isMobile ? "1em" : "", display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
				<Card elevation={6} style={{ width: "155px", borderRadius: "5px 5px 5px 5px", backgroundColor: "transparent" }} >
					<Link to={`/company/${company.id}/book`} >
						<div style={{ background: "#005184", maxWidth: "155px", padding: "1em", borderRadius: "5px 5px 0px 0px" }}>
							<Icon
								className="material-icons"
								style={{
									fontSize: "4em",
									color: "white"
								}}
							>
								{'contacts'}
							</Icon>
						</div>
						<div style={{ marginTop: "1px", background: darkGrey, maxWidth: "155px", padding: '1em', borderRadius: "0px 0px 5px 5px", color: 'white' }}>
							{translate.book}
						</div>
					</Link>
				</Card>
			</GridItem>

			<GridItem xs={6} md={3} lg={2} style={{ marginBottom: isMobile ? "1em" : "", display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
				<Card elevation={6} style={{ width: "155px", borderRadius: "5px 5px 5px 5px", backgroundColor: "transparent" }} >
					<Link to={`/company/${company.id}/censuses`} >
						<div style={{ background: "#e66d24", maxWidth: "155px", padding: "1em", borderRadius: "5px 5px 0px 0px" }}>
							<Icon
								className="material-icons"
								style={{
									fontSize: "4em",
									color: "white"
								}}
							>
								{'person'}
							</Icon>
						</div>
						<div style={{ marginTop: "1px", background: darkGrey, maxWidth: "155px", padding: '1em', borderRadius: "0px 0px 5px 5px", color: 'white' }}>
							{translate.censuses}
						</div>
					</Link>
				</Card>
			</GridItem>

			<GridItem xs={6} md={3} lg={2} style={{ marginBottom: isMobile ? "1em" : "", display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
				<Card elevation={6} style={{ width: "155px", borderRadius: "5px 5px 5px 5px", background: "transparent" }} >
					<Link to={`/company/${company.id}/drafts`} >
						<div style={{ background: "#6c9c37", maxWidth: "155px", padding: "1em", borderRadius: "5px 5px 0px 0px" }}>
							<Icon
								className="material-icons"
								style={{
									fontSize: "4em",
									color: "white"
								}}
							>
								{'class'}
							</Icon>
						</div>
						<div style={{ marginTop: "1px", background: darkGrey, maxWidth: "155px", padding: '1em', borderRadius: "0px 0px 5px 5px", color: 'white' }}>
							{translate.drafts}
						</div>
					</Link>
				</Card>
			</GridItem>

			<GridItem xs={6} md={3} lg={2} style={{ marginBottom: isMobile ? "1em" : "", display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
				<Card elevation={6} style={{ width: "155px", borderRadius: "5px 5px 5px 5px", backgroundColor: "transparent" }} >
					<Link to={`/company/${company.id}/council/new`} >
						<div style={{ background: "#cecece", maxWidth: "155px", padding: "1em", borderRadius: "5px 5px 0px 0px" }}>
							<img src={logo} style={{ height: '4.4em', width: 'auto' }} alt="councilbox-logo" />
						</div>
						<div style={{ marginTop: "1px", background: darkGrey, maxWidth: "155px", padding: '1em', borderRadius: "0px 0px 5px 5px", color: 'white' }}>
							{translate.dashboard_new}
						</div>
					</Link>
				</Card>
			</GridItem>

			<GridItem xs={6} md={3} lg={2} style={{ marginBottom: isMobile ? "1em" : "", display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
				<Card elevation={6} style={{ width: "155px", borderRadius: "5px 5px 5px 5px", backgroundColor: "transparent" }} >
					<Link to={`/company/${company.id}/meeting/new`}>
						<div style={{ background: "#67379c", maxWidth: "155px", padding: "1em", borderRadius: "5px 5px 0px 0px" }}>
							<Icon
								className="material-icons"
								style={{
									fontSize: "4em",
									color: "white"
								}}
							>
								{'video_call'}
							</Icon>
						</div>
						<div style={{ marginTop: "1px", background: darkGrey, maxWidth: "155px", padding: '1em', borderRadius: "0px 0px 5px 5px", color: 'white' }}>
							{translate.start_conference}
						</div>
					</Link>
				</Card>
			</GridItem>
		</React.Fragment >
	);

	if (isMobile) {
		return (
			// <div style={{ width: "100%" }}>
			// 	{items}
			// </div>
			<React.Fragment>
				{itemsPc}
			</React.Fragment>
		)
	} else {
		return (
			<Grid
				style={{
					width: "100%",
				}}
				spacing={8}
			>
				{itemsPc}
			</Grid>
		);
	}
}

export default ButtonsDirectAccess;