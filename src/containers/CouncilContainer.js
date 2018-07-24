import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { TabsScreen, FabButton, Icon } from "../displayComponents";
import { Tooltip } from 'material-ui';
import Councils from "../components/dashboard/Councils";
import { lightGrey } from '../styles/colors';
import withWindowSize from '../HOCs/withWindowSize';
import { bHistory } from '../containers/App';

const CouncilContainer = ({ match, company, translate, windowSize }) => {
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
			text: 'Actas finalizadas', //TRADUCCION
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
						link={"/history"}
						title={translate.dashboard_historical}
						icon={"history"}
					/>
				);
			}
		}
	];

	return (
		<div
			style={{
				width: '100%',
				height: 'calc(100vh - 3em)',
				padding: '2em',
				position: 'relative',
				...(windowSize === 'xs'? { padding: 0, paddingTop: '1em', height: 'calc(100vh - 6.5em)' } : {}),
				backgroundColor: lightGrey
			}}
		>
			<TabsScreen
				tabsIndex={tabsIndex}
				tabsInfo={tabsInfo}
				controlled={true}
				linked={true}
				selected={match.params.section}
			/>
			<div
				style={{
					position: 'absolute',
					right: '5%',
					bottom: '5%'
				}}
			>
				<Tooltip title={`${translate.dashboard_new}`}>
					<div style={{ marginBottom: "0.3em" }}>
						<FabButton
							icon={
								<Icon className="material-icons">
									add
								</Icon>
							}
							updateState={this.updateState}
							onClick={() =>
								bHistory.push(`/company/${company.id}/council/new`)
							}
						/>
					</div>
				</Tooltip>
			</div>
		</div>
	);
};

const mapStateToProps = state => ({
	company: state.companies.list[state.companies.selected],
	translate: state.translate
});

export default connect(mapStateToProps)(withRouter(withWindowSize(CouncilContainer)));
