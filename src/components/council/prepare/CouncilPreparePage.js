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
import { useOldState } from "../../../hooks";
import { ConfigContext } from "../../../containers/AppControl";
import DelegationRestriction from "../editor/DelegationRestriction";

const CouncilPreparePage = ({ company, translate, data, ...props }) => {
	const [state, setState] = useOldState({
		participants: false,
		sendReminder: false,
		sendConvene: false,
		cancel: false,
		selectedTab: 2,
		rescheduleCouncil: false
	});
	const config = React.useContext(ConfigContext);

	const primary = getPrimary();
	const secondary = getSecondary();

	const goToPrepareRoom = () => {
		bHistory.push(
			`/company/${company.id}/council/${
				props.match.params.id
			}/live`
		);
	};

	const handleChange = tabIndex => {
		setState({
			selectedTab: tabIndex
		})
	}

	const { council, error, loading, refetch } = data;

	if (loading) {
		return <LoadingSection />;
	}

	if (error) {
		return <ErrorWrapper error={error} translate={translate} />;
	}

	const getTabs = () => {
		let tabs = [
			{
				text: translate.convene,
				component: () => {
					return (
						<div style={{height: 'calc(100% - 38px)'}}>
							<Scrollbar>
								<div style={{width: '100%', position: 'relative', padding: '1em', paddingBottom: '1.3em'}}>
									<Convene
										council={council}
										translate={translate}
									/>
								</div>
							</Scrollbar>
						</div>
					);
				}
			},
			{
				text: translate.new_list_called,
				component: () => {
					return (
						<div style={{height: 'calc(100% - 38px)'}}>
							<Scrollbar>
								<div
									style={{
										padding: '1.2em',
										height: '100%'
									}}
								>
									<ConvenedParticipantsTable
										council={council}
										totalVotes={data.councilTotalVotes}
										socialCapital={data.councilSocialCapital}
										participations={CBX.hasParticipations(council)}
										translate={translate}
										refetch={refetch}
									/>
								</div>
							</Scrollbar>
						</div>
					);
				}
			},
		];

		if(config.councilDelegates && council.statute.existsDelegatedVote){
			tabs.push({
				text: 'Delegación',
				component: () => {
					return (
						<div style={{height: 'calc(100% - 38px)'}}>
							<Scrollbar>
								<div
									style={{
										padding: '1.2em',
										height: '100%'
									}}
								>
									<DelegationRestriction translate={translate} council={council} fullScreen={true} />
								</div>
							</Scrollbar>
						</div>
					);
				}
			})
		}

		return tabs;
	}

	return (
		<CardPageLayout title={translate.prepare_room} disableScroll>
			<div style={{height: '100%'}}>
				<div style={{height: 'calc(100% - 3.5em)', padding: '1em', paddingTop: 0, paddingBottom: 0, overflow: 'hidden', position: 'relative'}}>
					<div style={{height: 'calc(100% - 1em)', borderBottom: '1px solid gainsboro'}}>
						<TabsScreen
							uncontrolled={true}
							tabsInfo={getTabs()}
						/>
					</div>
				</div>
				<ReminderModal
					show={state.sendReminder}
					council={council}
					requestClose={() => setState({ sendReminder: false })}
					translate={translate}
				/>
				<CancelModal
					show={state.cancel}
					council={council}
					requestClose={() => setState({ cancel: false })}
					translate={translate}
				/>
				<SendConveneModal
					show={state.sendConvene}
					council={council}
					refetch={refetch}
					requestClose={() => setState({ sendConvene: false })}
					translate={translate}
				/>
				<RescheduleModal
					show={state.rescheduleCouncil}
					council={council}
					requestClose={() =>
						setState({ rescheduleCouncil: false })
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
									margin: "0",
									minWidth: '12em'
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
								onClick={goToPrepareRoom}
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
												setState({
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
												setState({
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
											setState({
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
											setState({ cancel: true })
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

export default graphql(councilDetails, {
	name: "data",
	options: props => ({
		variables: {
			councilID: props.match.params.id
		}
	})
})(withApollo(withSharedProps()(withRouter(CouncilPreparePage))));
