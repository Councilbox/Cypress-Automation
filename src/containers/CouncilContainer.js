import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FabButton, Icon, CardPageLayout } from "../displayComponents";
import { Tooltip } from 'material-ui';
import Councils from "../components/dashboard/Councils";
import withWindowSize from '../HOCs/withWindowSize';
import { bHistory } from '../containers/App';
import { TRIAL_DAYS } from "../config";
import { trialDaysLeft } from "../utils/CBX";
import { moment } from "./App";
import { isMobile } from 'react-device-detect';
import CantCreateCouncilsModal from "../components/dashboard/CantCreateCouncilsModal";
import { sendGAevent } from "../utils/analytics";


const CouncilContainer = ({ match, company, translate, windowSize }) => {
	const [noPremiumModal, setNoPremiumModal] = React.useState(false);

	const showCantAccessPremiumModal = () => {
		setNoPremiumModal(true);
	}

	const closeCantAccessPremiumModal = () => {
		setNoPremiumModal(false);
	}

	const getSectionTranslation = type => {
		const texts = {
			drafts: translate.companies_draft,
			calendar: translate.companies_calendar,
			live: translate.companies_live,
			act: translate.companies_writing,
			confirmed: translate.act_book,
			history: translate.dashboard_historical
		}

		return texts[type];
	}

	React.useEffect(() => {
		sendGAevent({
			category: 'Reuniones',
			action: `${getSectionTranslation(match.params.section)} - Listado`,
			label: company.businessName
		})
	}, [match.params.section]);
	const cantAccessPremium = company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0;

	return (
		<CardPageLayout title={translate.councils_sidebar} disableScroll>
			<div
				style={{
					height: '100%',
					fontSize: "13px", padding: '1.5em 1.5em 1.5em',
					height: '100%'
				}}
			>
				<div style={{ height: '100%', width: '98%', margin: '0 auto' }}>
					<Councils
						company={company}
						translate={translate}
						state={[-1, 40, 60, 70, 80, 90]}
						link={"/history"}
						title={translate.dashboard_historical}
						icon={"history"}
					/>
					{!isMobile &&
						<div
							style={{
								position: 'absolute',
								right: '3%',
								bottom: '5%'
							}}
						>
							<Tooltip title={`${translate.dashboard_new}`}>
								<div style={{ marginBottom: "0.3em" }}>
									<FabButton
										{...(cantAccessPremium ? { color: 'grey' } : {})}
										icon={
											<Icon className="material-icons">
												add
											</Icon>
										}
										onClick={() =>
											cantAccessPremium ?
												showCantAccessPremiumModal()
												:
												bHistory.push(`/company/${company.id}/council/new`)
										}
									/>
								</div>
							</Tooltip>
						</div>
					}
					<CantCreateCouncilsModal
						open={noPremiumModal}
						requestClose={closeCantAccessPremiumModal}
						translate={translate}
					/>
				</div>
			</div>
		</CardPageLayout>
	);
}




const mapStateToProps = state => ({
	company: state.companies.list[state.companies.selected],
	translate: state.translate
});

export default connect(mapStateToProps)(withRouter(withWindowSize(CouncilContainer)));
