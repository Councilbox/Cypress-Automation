import React from "react";
import { Icon, LoadingSection, CollapsibleSection } from "../../../displayComponents";
import { darkGrey, getPrimary } from "../../../styles/colors";
import LiveUtil from "../../../utils/live";
import FontAwesome from "react-fontawesome";
//import VotesTable from "./VotesTable";
import AgendaRecount from '../agendas/AgendaRecount';
import { LIVE_COLLAPSIBLE_HEIGHT } from "../../../styles/constants";
import { canEditPresentVotings } from '../../../utils/CBX';

class RecountSection extends React.Component {
	state = {
		open: false
	};

	_button = () => {
		const { translate } = this.props;

		return (
			<div
				style={{
					height: LIVE_COLLAPSIBLE_HEIGHT,
					display: "flex",
					backgroundColor: 'lightgrey',
					justifyContent: "space-between",
					alignItems: "center"
				}}
			>
				<div
					style={{
						width: "25%",
						height: "3em",
						display: "flex",
						alignItems: "center",
						paddingLeft: "1.5em"
					}}
				>
					<Icon className="material-icons" style={{ color: "grey" }}>
						thumbs_up_down
					</Icon>
					<span
						style={{
							marginLeft: "0.7em",
							color: darkGrey,
							fontWeight: "700"
						}}
					>
						{translate.recount}
					</span>
				</div>
				<div
					style={{
						width: "25%",
						display: "flex",
						justifyContent: "flex-end",
						paddingRight: "2em"
					}}
				>
					<Icon className="material-icons" style={{ color: "grey" }}>
						keyboard_arrow_down
					</Icon>
				</div>
			</div>
		);
	};

	_section = () => {
/* 		if (this.props.data.loading) {
			return <LoadingSection />;
		} */

		const { translate, council, majorities, agenda } = this.props;
		//const recount = this.props.data.liveRecount[0];
		const primary = getPrimary();

		return (
			<div style={{backgroundColor: 'white'}}>
				<AgendaRecount
					agenda={agenda}
					council={council}
					translate={translate}
					editable={canEditPresentVotings(agenda)}
					refetch={this.props.refetch}
					recount={{}}
					majorityTypes={this.props.majorityTypes}
				/>
			</div>
		);
	};

	render() {
		return (
			<div
				style={{
					width: "100%",
					backgroundColor: 'white',
					position: "relative"
				}}
			>
				<CollapsibleSection trigger={this._button} collapse={this._section} />
			</div>
		);
	}
}

export default RecountSection;


{/* <div
					className="row"
					style={{
						border: `1px solid ${primary}`,
						margin: "0.6em"
					}}
				>
					<div
						className="col-lg-3 col-xs-3 col-md-3"
						style={{
							display: "flex",
							flexDirection: "column",
							border: "2px solid black"
						}}
					>
						<div>{translate.convene_census}</div>
						<div>{`${translate.participants}: ${recount.num_total ||
							0}`}</div>
						<div>{`${translate.votes}: ${recount.part_total ||
							0}`}</div>
						{council.quorum_prototype === 1 && (
							<div>{`${
								translate.social_capital
							}: ${recount.social_capital_total || 0}`}</div>
						)}
					</div>
					<div
						className="col-lg-3 col-xs-3 col-md-3"
						style={{
							display: "flex",
							flexDirection: "column",
							border: "2px solid black"
						}}
					>
						<div>{translate.present_census}</div>
						<div>{`${
							translate.participants
						}: ${recount.num_present || 0}`}</div>
						<div>{`${translate.votes}: ${recount.part_present ||
							0}`}</div>
						{council.quorum_prototype === 1 && (
							<React.Fragment>
								<div>
									{translate.social_capital}:{" "}
									{recount.social_capital_present || 0}{" "}
								</div>
								<div>
									{translate.percentage}:{" "}
									{(
										(recount.social_capital_present /
											recount.social_capital_total) *
										100
									).toFixed(3)}%
								</div>
							</React.Fragment>
						)}
					</div>
					<div
						className="col-lg-3 col-xs-3 col-md-3"
						style={{
							display: "flex",
							flexDirection: "column",
							border: "2px solid black"
						}}
					>
						<div>{translate.remote_census}</div>
						<div>{`${
							translate.participants
						}: ${recount.num_current_remote || 0}`}</div>
						<div>{`${
							translate.votes
						}: ${recount.part_current_remote || 0}`}</div>
						{council.quorum_prototype === 1 && (
							<React.Fragment>
								<div>
									{translate.social_capital}:{" "}
									{recount.social_capital_current_remote || 0}{" "}
								</div>
								<div>
									{translate.percentage}:{" "}
									{(
										(recount.social_capital_current_remote /
											recount.social_capital_total) *
										100
									).toFixed(3)}%
								</div>
							</React.Fragment>
						)}
					</div>
					<div
						className="col-lg-3 col-xs-3 col-md-3"
						style={{
							display: "flex",
							flexDirection: "column",
							border: "2px solid black"
						}}
					>
						<div>{translate.voting_rights_census}</div>
						<div>{`${
							translate.participants
						}: ${recount.num_right_voting || 0}`}</div>
						<div>{`${
							translate.votes
						}: ${recount.part_right_voting || 0}`}</div>
						{council.quorum_prototype === 1 && (
							<React.Fragment>
								<div>
									{translate.social_capital}:{" "}
									{recount.social_capital_rigth_voting || 0}{" "}
								</div>
								<div>
									{translate.percentage}:{" "}
									{(
										(recount.social_capital_right_voting /
											recount.social_capital_total) *
										100
									).toFixed(3)}%
								</div>
							</React.Fragment>
						)}
					</div>
				</div>
				<div className="row" style={{ border: `1px solid ${primary}` }}>
					<div
						className="col-lg-6 col-md-6 col-xs-6"
						style={{
							height: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						}}
					>
						{`${translate.majority_type}: ${
							translate[majorities[agenda.majority_type].label]
						}`}
					</div>
					<div
						className="col-lg-6 col-md-6 col-xs-6"
						style={{
							height: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						}}
					>
						{`${
							translate.votes_in_favor_for_approve
						}: ${LiveUtil.calculateMayorityAgenda(
							agenda,
							council,
							recount
						)}`}
						{LiveUtil.calculateMayorityAgenda(
							agenda,
							council,
							recount
						) >
						agenda.positive_votings + agenda.positive_manual ? (
							<FontAwesome
								name={"times"}
								style={{
									margin: "0.5em",
									color: "red",
									fontSize: "1.2em"
								}}
							/>
						) : (
							<FontAwesome
								name={"check"}
								style={{
									margin: "0.5em",
									color: primary,
									fontSize: "1.2em"
								}}
							/>
						)}
					</div>
					{LiveUtil.qualityVoteRequirements(agenda, council) && (
						<div
							className="col-lg-12 col-xs-12 col-md-12"
							style={{ alignText: "center" }}
						>
							{agenda.quality_vote_sense === 1
								? `${translate.approved} ${
										translate.by_quality_vote
								  }`
								: `${translate.not_approved} ${
										translate.by_quality_vote
								  }`}
						</div>
					)}
				</div>
				<div className="row">
					<div
						className="col-lg-12 col-md-12 col-xs-12"
						style={{ fontSize: "0.8em" }}
					>
						<VotesTable agenda={agenda} translate={translate} />
					</div>
				</div>
 */}