import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TabsScreen from "../displayComponents/TabsScreen";
import Councils from "../components/dashboard/Councils";

const CouncilContainer = ({ match, company, translate }) => {
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
						state={[0]}
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
			text: 'ACTAS FINALIZADAS',
			link: `/company/${company.id}/councils/confirmed`,
			component: () => {
				return (
					<Councils
						company={company}
						translate={translate}
						state={[60, 70]}
						link={"/finished"}
						title={translate.companies_docu}
						desc={translate.companies_docu_desc}
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
						state={[70, 80, 90]}
						link={"/finished"}
						title={translate.dashboard_historical}
						icon={"history"}
					/>
				);
			}
		},
		{
			text: `${translate.dashboard_new}`,
			link: `/company/${company.id}/council/new`,
			add: true
		}
	];

	return (
		<TabsScreen
			tabsIndex={tabsIndex}
			tabsInfo={tabsInfo}
			selected={match.params.section}
		/>
	);
};

const mapStateToProps = state => ({
	company: state.companies.list[state.companies.selected],
	translate: state.translate
});

export default connect(mapStateToProps)(withRouter(CouncilContainer));
