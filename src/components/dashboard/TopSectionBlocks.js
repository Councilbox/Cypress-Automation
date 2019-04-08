import React from "react";
import {
	Block,
	Grid,
	GridItem
} from "../../displayComponents";
import logo from '../../assets/img/logo-icono.png';
import { ConfigContext } from '../../containers/AppControl';
import CantCreateCouncilsModal from "./CantCreateCouncilsModal";
import { TRIAL_DAYS } from "../../config";
import { trialDaysLeft } from "../../utils/CBX";
import { moment } from "../../containers/App";

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

	const size = !hasBook? 4 : 3;
	const blankSize = !hasBook? 2 : 3;

	return(
		<Grid
			style={{
				width: "90%",
				marginTop: "4vh"
			}}
			spacing={8}
		>
			<CantCreateCouncilsModal
				open={open}
				requestClose={closeCouncilsModal}
				translate={translate}
			/>
			<GridItem xs={12} md={size} lg={size}>
				<Block
					link={`/company/${company.id}/statutes`}
					icon="gavel"
					id={'edit-statutes-block'}
					text={translate.council_types}
				/>
			</GridItem>
			{hasBook &&
				<GridItem xs={12} md={3} lg={3}>
					<Block
						link={`/company/${company.id}/book`}
						icon="contacts"
						id={'edit-company-block'}
						disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
						disabledOnClick={showCouncilsModal}
						text={translate.book}
					/>
				</GridItem>
			}

			<GridItem xs={12} md={size} lg={size}>
				<Block
					link={`/company/${company.id}/censuses`}
					icon="person"
					id={'edit-censuses-block'}
					text={translate.censuses}
				/>
			</GridItem>

			<GridItem xs={12} md={size} lg={size}>
				<Block
					link={`/company/${company.id}/drafts`}
					icon="class"
					id={'edit-drafts-block'}
					text={translate.drafts}
				/>
			</GridItem>
			<GridItem xs={12} md={blankSize} lg={blankSize}>
			</GridItem>

			<GridItem xs={12} md={size} lg={size}>
				<Block
					link={`/company/${company.id}/council/new`}
					customIcon={<img src={logo} style={{height: '7em', width: 'auto'}} alt="councilbox-logo" />}
					id={'create-council-block'}
					disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
					disabledOnClick={showCouncilsModal}
					text={translate.dashboard_new}
				/>
			</GridItem>
			<GridItem xs={12} md={size} lg={size}>
				<Block
					link={`/company/${company.id}/meeting/new`}
					icon="video_call"
					id={'init-meeting-block'}
					text={translate.start_conference}
				/>
			</GridItem>
			{user.roles === 'devAdmin' && false &&
				<GridItem xs={12} md={size} lg={size}>
					<Block
						link={`/admin`}
						customIcon={<i className="fa fa-user-secret" aria-hidden="true" style={{fontSize: '7em'}}></i>}
						id={'admin-panel'}
						text={'Panel devAdmin'}
					/>
				</GridItem>
			}
		</Grid>
	);
}


export default TopSectionBlocks;
