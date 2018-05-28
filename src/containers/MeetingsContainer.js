import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { TabsScreen } from "../displayComponents";
import Meetings from "../components/dashboard/Meetings";

const MeetingsContainer = ({ main, company, user, match, translate }) => {
	const tabsIndex = {
		drafts: 0,
		live: 1,
		trash: 2
	};

	const tabsInfo = [
		{
			text: translate.companies_draft,
			link: `/company/${company.id}/meetings/drafts`,
			component: () => {
				return (
					<Meetings
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
			text: translate.companies_live,
			link: `/company/${company.id}/meetings/live`,
			component: () => {
				return (
					<Meetings
						company={company}
						translate={translate}
						state={[20]}
						link={"/live"}
						title={translate.companies_live}
						desc={translate.companies_live_desc}
						icon={"users"}
					/>
				);
			}
		},
		{
			text: `${translate.dashboard_new_meeting}`,
			link: `/company/${company.id}/meeting/new`,
			add: true
		}
	];

	return (
		<div
			style={{
				height: "100vh",
				width: "100%",
				display: "flex"
			}}
		>
			<TabsScreen
				tabsIndex={tabsIndex}
				tabsInfo={tabsInfo}
				selected={match.params.section}
			/>
		</div>
	);
};

const mapStateToProps = state => ({
	main: state.main,
	company: state.companies.list[state.companies.selected],
	user: state.user,
	translate: state.translate
});

export default connect(mapStateToProps)(withRouter(MeetingsContainer));
