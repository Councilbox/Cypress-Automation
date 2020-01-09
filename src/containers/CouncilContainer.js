import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { TabsScreen, FabButton, Icon, CBXFooter, CardPageLayout, Scrollbar, Grid, PaginationFooter } from "../displayComponents";
import { Tooltip, Avatar } from 'material-ui';
import Councils from "../components/dashboard/Councils";
import { lightGrey, getPrimary } from '../styles/colors';
import withWindowSize from '../HOCs/withWindowSize';
import { bHistory } from '../containers/App';
import { TRIAL_DAYS } from "../config";
import { trialDaysLeft } from "../utils/CBX";
import { moment } from "./App";
import { isLandscape } from '../utils/screen';
import { isMobile } from 'react-device-detect';
import CantCreateCouncilsModal from "../components/dashboard/CantCreateCouncilsModal";
import { sendGAevent } from "../utils/analytics";
import MenuSuperiorTabs from "../components/dashboard/MenuSuperiorTabs";


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

	const tabsIndex = {
		drafts: 0,
		calendar: 1,
		live: 2,
		act: 3,
		confirmed: 4,
		history: 5
	};

	const tabsInfo = [
		{
			text: translate.companies_draft,
			link: `/company/${company.id}/councils/drafts`,
			component: () => {
				return (
					<Councils
						company={company}
						translate={translate}
						state={[0, 3]}
						link={""}
						title={translate.companies_draft}
						desc={translate.companies_draft_desc}
						icon={"pencil-square-o"}
					/>
				);
			}
		},
		{
			text: translate.companies_calendar,
			link: `/company/${company.id}/councils/calendar`,
			component: () => {
				return (
					<Councils
						company={company}
						translate={translate}
						state={[10, 5]}
						link={"/prepare"}
						title={translate.companies_calendar}
						desc={translate.companies_calendar_desc}
						icon={"calendar-o"}
					/>
				);
			}
		},
		{
			text: translate.companies_live,
			link: `/company/${company.id}/councils/live`,
			component: () => {
				return (
					<Councils
						company={company}
						translate={translate}
						state={[20, 30]}
						link={"/live"}
						title={translate.companies_live}
						desc={translate.companies_live_desc}
						icon={"users"}
					/>
				);
			}
		},
		{
			text: translate.companies_writing,
			link: `/company/${company.id}/councils/act`,
			component: () => {
				return (
					<Councils
						company={company}
						translate={translate}
						state={[40]}
						link={"/finished"}
						title={translate.companies_writing}
						desc={translate.companies_writing_desc}
						icon={"clipboard"}
					/>
				);
			}
		},
		{
			text: translate.act_book,
			link: `/company/${company.id}/councils/confirmed`,
			component: () => {
				return (
					<Councils
						company={company}
						translate={translate}
						state={[60, 70]}
						link={"/finished"}
						title={translate.act_book}
						desc={translate.finished_council_act_approved}
						icon={"clipboard"}
					/>
				);
			}
		},
		{
			text: translate.dashboard_historical,
			link: `/company/${company.id}/councils/history`,
			component: () => {
				return (
					<Councils
						company={company}
						translate={translate}
						state={[-1, 40, 60, 70, 80, 90]}
						link={"/history"}
						title={translate.dashboard_historical}
						icon={"history"}
					/>
				);
			}
		}
	];

	const cantAccessPremium = company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0;

	return (
		<CardPageLayout title={translate.councils_sidebar} disableScroll>
			<div
				style={{
					// width: '100%',
					height: '100%',
					// padding: windowSize === 'xs' ? '0.8em' : '1.6em',
					// position: 'relative',
					// ...(windowSize === 'xs' && !isLandscape() ? { padding: 0, paddingTop: '1em', height: '100%' } : {}),// height: 'calc(100vh - 6.5em)
					// backgroundColor: lightGrey,
					// paddingBottom: 0,
					fontSize: "13px", padding: '1.5em 1.5em 1.5em',
					height: '100%'
				}}
			>
				{/* <div style={{ height: 'calc(100% - 3.5rem)', marginBottom: '0.6em'}}> */}
				<div style={{ height: 'calc(100% - 1.6rem)', width: '98%', margin: '0 auto' }}>
					
					<Councils
						company={company}
						translate={translate}
						state={[-1, 40, 60, 70, 80, 90]}
						link={"/history"}
						title={translate.dashboard_historical}
						icon={"history"}
					/>
					{/* <TabsScreen
					tabsIndex={tabsIndex}
					tabsInfo={tabsInfo}
					controlled={true}
					linked={true}
					selected={match.params.section}
				/> */}
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
		</CardPageLayout >
	);
}




const mapStateToProps = state => ({
	company: state.companies.list[state.companies.selected],
	translate: state.translate
});

export default connect(mapStateToProps)(withRouter(withWindowSize(CouncilContainer)));
