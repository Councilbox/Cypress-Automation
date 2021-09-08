/* eslint-disable max-classes-per-file */
import React from 'react';
import {
	TableRow, TableCell, Card, Tooltip
} from 'material-ui';
import {
	Table, DateWrapper, BasicButton, Grid, GridItem
} from '../../displayComponents';
import { bHistory, moment } from '../../containers/App';
import TableStyles from '../../styles/table';
import { getPrimary, getSecondary } from '../../styles/colors';
import { COUNCIL_STATES } from '../../constants';
import CantCreateCouncilsModal from './CantCreateCouncilsModal';
import { TRIAL_DAYS } from '../../config';
import { trialDaysLeft } from '../../utils/CBX';

import { isMobile } from '../../utils/screen';


const generateLink = (council, company) => `/company/${company.id}/council/${council.id}/finished`;

class CouncilsHistory extends React.Component {
	state = {
		open: false
	}

	openCantAccessModal = () => {
		this.setState({
			open: true
		});
	}

	closeCantAccessModal = () => {
		this.setState({
			open: false
		});
	}

	render() {
		const {
			councils, translate, openDeleteModal, company
		} = this.props;

		return (
			<Table
				headers={[
					{ name: translate.date_real_start },
					{ name: translate.name },
					{ name: translate.table_councils_duration },
					{ name: translate.state },
					{ name: translate.certificates }
				]}
				companyID={company.id}
			>
				{councils.map((council, index) => (
					<HoverableRow
						key={`council_${council.id}`}
						translate={translate}
						council={council}
						id={`councils-table-row-${index}`}
						disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
						openDeleteModal={openDeleteModal}
						company={company}
						showModal={this.openCantAccessModal}
					/>
				))}
				<CantCreateCouncilsModal
					translate={translate}
					open={this.state.open}
					requestClose={this.closeCantAccessModal}
				/>
			</Table>
		);
	}
}

class HoverableRow extends React.Component {
	state = {
		showActions: false
	}

	handleMouseEnter = () => {
		this.setState({
			showActions: true
		});
	}

	handleMouseLeave = () => {
		this.setState({
			showActions: false
		});
	}

	getCouncilState = state => {
		const { translate } = this.props;
		switch (state) {
			case COUNCIL_STATES.DRAFT:
			case COUNCIL_STATES.PRECONVENE:
				return translate.dasboard_draft;
			case COUNCIL_STATES.SAVED:
			case COUNCIL_STATES.PREPARING:
				return translate.convened;
			case COUNCIL_STATES.ROOM_OPENED:
			case COUNCIL_STATES.APPROVING_ACT_DRAFT:
				return translate.companies_live;
			case COUNCIL_STATES.NOT_CELEBRATED:
				return translate.not_held_council;
			case COUNCIL_STATES.FINISHED:
			case COUNCIL_STATES.FINISHED_WITHOUT_ACT:
				return translate.council_finished;
			case COUNCIL_STATES.APPROVED:
				return translate.minutes_not_sent;
			case COUNCIL_STATES.FINAL_ACT_SENT:
				return translate.minutes_sent;
			case COUNCIL_STATES.CANCELED:
				return translate.not_held_council;
			default:
				return translate.council_finished;
		}
	}

	render() {
		const { council, company, translate } = this.props;
		const primary = getPrimary();

		if (isMobile) {
			return (
				<Card
					style={{ marginBottom: '0.5em', padding: '0.3em', position: 'relative' }}
					id={this.props.id}
					onClick={() => {
						if (this.props.disabled) {
							this.props.showModal();
						} else {
							bHistory.push(generateLink(council, company));
						}
					}}
				>
					<Grid>
						<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
							{council.promoCode === 'COUNCILBOX'
								&& <Tooltip title={translate.test_meeting}>
									<span className="material-icons" style={{ color: getSecondary(), fontSize: '16px', marginRight: '0.5em' }}>
										miscellaneous_services
									</span>
								</Tooltip>
							}
							{translate.name}
						</GridItem>
						<GridItem xs={7} md={7}>
							{council.name || translate.dashboard_new}
						</GridItem>
						<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
							{translate.type}
						</GridItem>
						<GridItem xs={7} md={7}>
							{this.getCouncilState(council.state)}
						</GridItem>
						<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
							{translate.table_councils_duration}
						</GridItem>
						<GridItem xs={7} md={7}>
							<DateWrapper
								format="HH:mm"
								date={
									council.dateRealStart
								}
							/> {' - '}
							<DateWrapper
								format="HH:mm"
								date={
									council.dateEnd
								}
							/>
						</GridItem>
						<GridItem xs={12} md={12}>
							{(council.promoCode !== 'COUNCILBOX' && council.state >= 40)
								&& <div style={{
									display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px'
								}}>
									<BasicButton
										text={translate.certificates}
										color="white"
										textStyle={{ textTransform: 'none', fontWeight: '700', color: primary }}
										buttonStyle={{ border: `2px solid ${primary}` }}
										onClick={event => {
											bHistory.push(`/company/${company.id}/council/${council.id}/certificates`);
											event.stopPropagation();
										}}
									/>
								</div>
							}
						</GridItem>
					</Grid>
				</Card>
			);
		}

		return (
			<TableRow
				hover
				id={this.props.id}
				onMouseOver={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
				style={{ ...TableStyles.ROW, backgroundColor: this.props.disabled ? 'whiteSmoke' : 'inherit' }}
				key={`council${council.id}`}
				onClick={() => {
					if (this.props.disabled) {
						this.props.showModal();
					} else {
						bHistory.push(generateLink(council, company));
					}
				}}
			>
				<TableCell
					style={TableStyles.TD}
				>
					<DateWrapper
						format="DD/MM/YYYY"
						date={
							council.dateStart
						}
					/>
				</TableCell>
				<TableCell
					style={{
						...TableStyles.TD,
						width: '35%'
					}}
				>
					{council.promoCode === 'COUNCILBOX'
						&& <Tooltip title={translate.test_meeting}>
							<span className="material-icons" style={{ color: getSecondary(), fontSize: '16px', marginRight: '0.5em' }}>
								miscellaneous_services
							</span>
						</Tooltip>
					}
					{council.name || translate.dashboard_new}
				</TableCell>
				<TableCell
					style={TableStyles.TD}
				>
					<div style={{ width: '10em', display: 'flex', flexDirection: 'row' }}>
						{council.dateEnd
							&& <>
								<DateWrapper
									format="HH:mm"
									date={council.dateRealStart}
								/>

								{' - '}
								<DateWrapper
									format="HH:mm"
									date={council.dateEnd}
								/>
							</>

						}
					</div>
				</TableCell>
				<TableCell>
					<div style={{ minWidth: '12em' }}>
						{this.getCouncilState(council.state)}
					</div>
				</TableCell>
				<TableCell
					style={TableStyles.TD}
				>
					<div style={{ width: '12em' }}>
						{(this.state.showActions && council.promoCode !== 'COUNCILBOX' && council.state >= 40)
							&& <BasicButton
								text={translate.certificates}
								color="white"
								textStyle={{ textTransform: 'none', fontWeight: '700', color: primary }}
								buttonStyle={{ border: `2px solid ${primary}` }}
								onClick={event => {
									bHistory.push(`/company/${company.id}/council/${council.id}/certificates`);
									event.stopPropagation();
								}}
							/>
						}
					</div>
				</TableCell>
			</TableRow>
		);
	}
}

export default CouncilsHistory;
