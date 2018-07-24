import React from "react";
import {
	BasicButton,
	CardPageLayout,
	DropDownMenu,
	ErrorWrapper,
	Icon,
	Scrollbar,
	TabsScreen,
	LoadingSection
} from "../../../displayComponents";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { Divider, MenuItem, Paper } from "material-ui";
import { graphql, withApollo } from "react-apollo";
import { bHistory } from "../../../containers/App";
import { councilDetails } from "../../../queries";
import { withRouter } from 'react-router-dom';
import * as CBX from "../../../utils/CBX";
import ReminderModal from "./modals/ReminderModal";
import FontAwesome from "react-fontawesome";
import RescheduleModal from "./modals/RescheduleModal";
import SendConveneModal from "./modals/SendConveneModal";
import CancelModal from "./modals/CancelModal";
import Convene from "../convene/Convene";
import withSharedProps from '../../../HOCs/withSharedProps';
import ConvenedParticipantsTable from "./ConvenedParticipantsTable";

class CouncilPreparePage extends React.Component {
	state = {
		participants: false,
		sendReminder: false,
		sendConvene: false,
		cancel: false,
		selectedTab: 0,
		rescheduleCouncil: false
	};

	componentDidMount() {
		this.props.data.refetch();
	}

	goToPrepareRoom = () => {
		bHistory.push(
			`/company/${this.props.company.id}/council/${
				this.props.match.params.id
			}/live`
		);
	};

	handleChange = tabIndex => {
		this.setState({
			selectedTab: tabIndex
		})
	}

	render() {
		const {
			council,
			error,
			loading,
			refetch
		} = this.props.data;
		const { translate } = this.props;
		const primary = getPrimary();
		const secondary = getSecondary();

		if (loading) {
			return <LoadingSection />;
		}

		if (error) {
			return <ErrorWrapper error={error} translate={translate} />;
		}

		return (
			<CardPageLayout title={translate.prepare_room} disableScroll>
				<div style={{height: '100%'}}>
					<div style={{height: 'calc(100% - 3.5em)', padding: '1em', paddingTop: 0, overflow: 'hidden', position: 'relative'}}>
						<Scrollbar>
							<div>
								<TabsScreen
									uncontrolled={true}
									tabsInfo={[
										{
											text: translate.convene,
											component: () => {
												return (
													<div style={{width: '100%', position: 'relative', padding: '1em'}}>
														<Convene
															council={council}
															translate={translate}
														/>
													</div>
												);
											}
										},
										{
											text: translate.new_list_called,
											component: () => {
												return (
													<ConvenedParticipantsTable
														council={council}
														participations={CBX.hasParticipations(
															this.props.council
														)}
														translate={translate}
														refetch={refetch}
													/>
												);
											}
										},
									]}
								/>
							</div>
						</Scrollbar>
					</div>
					<ReminderModal
						show={this.state.sendReminder}
						council={council}
						requestClose={() => this.setState({ sendReminder: false })}
						translate={translate}
					/>
					<CancelModal
						show={this.state.cancel}
						council={council}
						requestClose={() => this.setState({ cancel: false })}
						translate={translate}
					/>
					<SendConveneModal
						show={this.state.sendConvene}
						council={council}
						refetch={refetch}
						requestClose={() => this.setState({ sendConvene: false })}
						translate={translate}
					/>
					<RescheduleModal
						show={this.state.rescheduleCouncil}
						council={council}
						requestClose={() =>
							this.setState({ rescheduleCouncil: false })
						}
						translate={translate}
					/>
					<div
						style={{
							height: '3.5em',
							width: '100%',
							display: 'flex',
							justifyContent: 'flex-end',
							paddingRight: '1.2em',
							alignItems: 'center',
							borderTop: '1px solid gainsboro'
						}}
					>
						<div style={{display: 'flex', alignItems: 'center'}}>
							<div>
								<BasicButton
									text={translate.prepare_room}
									color={primary}
									buttonStyle={{
										margin: "0"
									}}
									textStyle={{
										color: "white",
										fontWeight: "700",
										marginLeft: "0.3em",
										fontSize: "0.9em",
										textTransform: "none"
									}}
									icon={
										<FontAwesome
											name={"user-plus"}
											style={{
												fontSize: "1em",
												color: "white",
												marginLeft: "0.3em"
											}}
										/>
									}
									textPosition="after"
									onClick={this.goToPrepareRoom}
								/>
							</div>
							<DropDownMenu
								color="transparent"
								Component={() =>
									<Paper
										elevation={1}
										style={{
											boxSizing: "border-box",
											padding: "0",
											width: '5em',
											height: '36px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											border: `1px solid ${primary}`,
											marginLeft: "0.3em"
										}}
									>
										<MenuItem
											style={{
												width: '100%',
												height: '100%',
												margin: 0,
												padding: 0,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<FontAwesome
												name={"bars"}
												style={{
													cursor: "pointer",
													fontSize: "0.8em",
													height: "0.8em",
													color: primary
												}}
											/>
											<Icon
												className="material-icons"
												style={{ color: primary }}
											>
												keyboard_arrow_down
											</Icon>
										</MenuItem>
									</Paper>
								}
								textStyle={{ color: primary }}
								items={
									<React.Fragment>
										{CBX.councilIsNotified(council) ? (
											<MenuItem
												onClick={() =>
													this.setState({
														sendReminder: true
													})
												}
											>
												<Icon
													className="material-icons"
													style={{
														color: secondary,
														marginRight: "0.4em"
													}}
												>
													update
												</Icon>
												{translate.send_reminder}
											</MenuItem>
										) : (
											<MenuItem
												onClick={() =>
													this.setState({
														sendConvene: true
													})
												}
											>
												<Icon
													className="material-icons"
													style={{
														color: secondary,
														marginRight: "0.4em"
													}}
												>
													notifications
												</Icon>
												{translate.new_send}
											</MenuItem>
										)}
										<MenuItem
											onClick={() =>
												this.setState({
													rescheduleCouncil: true
												})
											}
										>
											<Icon
												className="material-icons"
												style={{
													color: secondary,
													marginRight: "0.4em"
												}}
											>
												schedule
											</Icon>
											{translate.reschedule_council}
										</MenuItem>
										<Divider light />
										<MenuItem
											onClick={() =>
												this.setState({ cancel: true })
											}
										>
											<Icon
												className="material-icons"
												style={{
													color: "red",
													marginRight: "0.4em"
												}}
											>
												highlight_off
											</Icon>
											{translate.cancel_council}
										</MenuItem>
									</React.Fragment>
								}
							/>
						</div>
					</div>
				</div>
			</CardPageLayout>
		);
	}
}

export default graphql(councilDetails, {
	name: "data",
	options: props => ({
		variables: {
			councilID: props.match.params.id
		}
	})
})(withApollo(withSharedProps()(withRouter(CouncilPreparePage))));
