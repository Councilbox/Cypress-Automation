import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { TabsScreen, FabButton, Icon } from "../displayComponents";
import { Tooltip } from 'material-ui';
import Councils from "../components/dashboard/Councils";
import { lightGrey } from '../styles/colors';
import withWindowSize from '../HOCs/withWindowSize';
import { bHistory } from '../containers/App';
import { TRIAL_DAYS } from "../config";
import { trialDaysLeft } from "../utils/CBX";
import { moment } from "./App";
import { isLandscape } from '../utils/screen';
import CantCreateCouncilsModal from "../components/dashboard/CantCreateCouncilsModal";

class CouncilContainer extends React.Component {

	state = {
		noPremiumModal: false
	}

	showCantAccessPremiumModal = () => {
		this.setState({
			noPremiumModal: true
		})
	}

	closeCantAccessPremiumModal = () => {
		this.setState({
			noPremiumModal: false
		})
	}

	render () {
		const { match, company, translate, windowSize } = this.props;
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
			<div
				style={{
					width: '100%',
					height: 'calc(100vh - 3em)',
					padding: windowSize === 'xs' ? '0.8em' : '2em',
					position: 'relative',
					...(windowSize === 'xs' && !isLandscape()? { padding: 0, paddingTop: '1em', height: 'calc(100vh - 6.5em)' } : {}),
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
						right: '3%',
						bottom: '5%'
					}}
				>
					<Tooltip title={`${translate.dashboard_new}`}>
						<div style={{ marginBottom: "0.3em" }}>
							<FabButton
								{...(cantAccessPremium? { color: 'grey'} : {})}
								icon={
									<Icon className="material-icons">
										add
									</Icon>
								}
								onClick={() =>
									cantAccessPremium?
										this.showCantAccessPremiumModal()
									:
										bHistory.push(`/company/${company.id}/council/new`)
								}
							/>
						</div>
					</Tooltip>
				</div>
				<CantCreateCouncilsModal
					open={this.state.noPremiumModal}
					requestClose={this.closeCantAccessPremiumModal}
					translate={translate}
				/>
			</div>
		);
	}
};

const mapStateToProps = state => ({
	company: state.companies.list[state.companies.selected],
	translate: state.translate
});

export default connect(mapStateToProps)(withRouter(withWindowSize(CouncilContainer)));
