import React from "react";
import {
	Block,
	Grid,
	GridItem
} from "../../displayComponents";
import logo from '../../assets/img/logo-icono.png';
import CantCreateCouncilsModal from "./CantCreateCouncilsModal";
import { TRIAL_DAYS } from "../../config";
import { trialDaysLeft } from "../../utils/CBX";
import { moment } from "../../containers/App";

class TopSectionBlocks extends React.Component {

	state = {
		open: false
	}

	closeCouncilsModal = () => {
		this.setState({
			open: false
		})
	}

	showCouncilsModal = () => {
		this.setState({
			open: true
		});
	}

	render(){
		const { translate, company } = this.props;

		return(
			<Grid
				style={{
					width: "90%",
					marginTop: "4vh"
				}}
				spacing={8}
			>
				<CantCreateCouncilsModal
					open={this.state.open}
					requestClose={this.closeCouncilsModal}
					translate={translate}
				/>
				<GridItem xs={12} md={3} lg={3}>
					<Block
						link={`/company/${company.id}/statutes`}
						icon="gavel"
						id={'edit-statutes-block'}
						text={translate.council_types}
					/>
				</GridItem>

				<GridItem xs={12} md={3} lg={3}>
					<Block
						link={`/company/${company.id}/book`}
						icon="contacts"
						id={'edit-company-block'}
						disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
						disabledOnClick={this.showCouncilsModal}
						text={translate.book}
					/>
				</GridItem>

				<GridItem xs={12} md={3} lg={3}>
					<Block
						link={`/company/${company.id}/censuses`}
						icon="person"
						id={'edit-censuses-block'}
						text={translate.censuses}
					/>
				</GridItem>

				<GridItem xs={12} md={3} lg={3}>
					<Block
						link={`/company/${company.id}/drafts`}
						icon="class"
						id={'edit-drafts-block'}
						text={translate.drafts}
					/>
				</GridItem>
				<GridItem xs={12} md={3} lg={3}>
				</GridItem>

				<GridItem xs={12} md={3} lg={3}>
					<Block
						link={`/company/${company.id}/council/new`}
						customIcon={<img src={logo} style={{height: '7em', width: 'auto'}} alt="councilbox-logo" />}
						id={'create-council-block'}
						disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
						disabledOnClick={this.showCouncilsModal}
						text={translate.dashboard_new}
					/>
				</GridItem>
				<GridItem xs={12} md={3} lg={3}>
					<Block
						link={`/company/${company.id}/meeting/new`}
						icon="video_call"
						id={'init-meeting-block'}
						text={translate.start_conference}
					/>
				</GridItem>
				{this.props.user.roles === 'devAdmin' &&
					<GridItem xs={12} md={3} lg={3}>
						
					</GridItem>
				}
			</Grid>
		);
	}
}

export default TopSectionBlocks;
