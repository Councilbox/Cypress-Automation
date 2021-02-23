import React from 'react';
import {
	TableRow, TableCell, Tooltip, Card, CardHeader, CardContent, withStyles, Input
} from 'material-ui';
import { graphql } from 'react-apollo';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import { Grid, GridItem, Table } from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import { updateAgenda } from '../../../queries/agenda';
import * as CBX from '../../../utils/CBX';
import withSharedProps from '../../../HOCs/withSharedProps';
import { CONSENTIO_ID } from '../../../config';
import { isMobile } from '../../../utils/screen';

const columnStyle = {
	display: 'flex',
	fontWeight: '600',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0.4em',
	fontSize: '0.8em'
};

const itemStyle = {
	width: '100%',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center'
};

const AgendaRecount = ({
	agenda, recount, majorityTypes, council, company, editable, translate, classes
}) => {
	const agendaNeededMajority = CBX.calculateMajorityAgenda({
		...agenda,
		...agenda.votingsRecount
	}, company, council, recount);
	const activatePresentOneVote = false;
	const approvedByQualityVote = CBX.haveQualityVoteConditions(agenda, council) && CBX.approvedByQualityVote(agenda, council.qualityVoteId);

	const getPartTotal = () => {
		if (council.companyId === CONSENTIO_ID) {
			if (agenda.orderIndex >= 2 && agenda.orderIndex <= 9) {
				return `${translate.votes}: ${CBX.showNumParticipations(recount.weighedPartTotal, company, council.statute) || 0}`;
			}
		}
		return `${translate.votes}: ${CBX.showNumParticipations(recount.partTotal, company, council.statute) || 0}`;
	};

	const printPercentage = num => {
		if (company.type === 10) {
			return '';
		}

		// const total = council.statute.quorumPrototype === 0 ? (agenda.presentCensus + agenda.remoteCensus) : recount.partTotal;
		const total = agenda.presentCensus + agenda.remoteCensus;


		if (total === 0) {
			return '(0%)';
		}

		return `(${((num / total) * 100).toFixed(3)}%)`;
	};

	const renderTotal = () => (
		<>
			<div style={itemStyle}>
				{translate.convene_census}
			</div>
			<div style={itemStyle}>
				{`${translate.participants}: ${recount.numTotal || 0}`}
			</div>
			<div style={itemStyle}>
				{getPartTotal()}
			</div>
		</>
	);

	const printPositiveRemote = () => `${CBX.showNumParticipations(agenda.votingsRecount.positiveVotings, company, council.statute)} ${printPercentage(agenda.votingsRecount.positiveVotings)}`;

	const printNegativeRemote = () => `${CBX.showNumParticipations(agenda.votingsRecount.negativeVotings, company, council.statute)} ${printPercentage(agenda.votingsRecount.negativeVotings)}`;

	const printAbstentionRemote = () => `${CBX.showNumParticipations(agenda.votingsRecount.abstentionVotings, company, council.statute)} ${printPercentage(agenda.votingsRecount.abstentionVotings)}`;

	const printNoVoteRemote = () => `${CBX.showNumParticipations(agenda.votingsRecount.noVoteVotings, company, council.statute)} ${printPercentage(agenda.votingsRecount.noVoteVotings)}`;

	const printPositivePresent = () => `${CBX.showNumParticipations(agenda.votingsRecount.positiveManual, company, council.statute)} ${printPercentage(agenda.votingsRecount.positiveManual)}`;

	const printNegativePresent = () => `${CBX.showNumParticipations(agenda.votingsRecount.negativeManual, company, council.statute)} ${printPercentage(agenda.votingsRecount.negativeManual)}`;

	const printAbstentionPresent = () => `${CBX.showNumParticipations(agenda.votingsRecount.abstentionManual, company, council.statute)} ${printPercentage(agenda.votingsRecount.abstentionManual)}`;

	const printNoVotePresent = () => `${CBX.showNumParticipations(agenda.votingsRecount.noVoteManual, company, council.statute)} ${printPercentage(agenda.votingsRecount.noVoteManual)}`;

	const printPositiveTotal = () => `${CBX.showNumParticipations(agenda.votingsRecount.positiveVotings + agenda.votingsRecount.positiveManual, company, council.statute)} ${printPercentage(agenda.votingsRecount.positiveVotings + agenda.votingsRecount.positiveManual)}`;

	const printNegativeTotal = () => `${CBX.showNumParticipations(agenda.votingsRecount.negativeVotings + agenda.votingsRecount.negativeManual, company, council.statute)} ${printPercentage(agenda.votingsRecount.negativeVotings + agenda.votingsRecount.negativeManual)}`;

	const printAbstentionTotal = () => `${CBX.showNumParticipations(agenda.votingsRecount.abstentionVotings + agenda.votingsRecount.abstentionManual, company, council.statute)} ${printPercentage(agenda.votingsRecount.abstentionVotings + agenda.votingsRecount.abstentionManual)}`;

	const printNoVoteTotal = () => `${CBX.showNumParticipations(agenda.votingsRecount.noVoteVotings + agenda.votingsRecount.noVoteManual, company, council.statute)} ${printPercentage(agenda.votingsRecount.noVoteVotings + agenda.votingsRecount.noVoteManual)}`;


	const renderPresentTotal = () => (
		<>
			<div style={itemStyle}>
				{translate.present_census}
			</div>
			<div style={itemStyle}>
				{`${translate.participants}: ${agenda.numPresentCensus || 0}`}
			</div>
			<div style={itemStyle}>
				{`${translate.votes}: ${(editable && activatePresentOneVote) ?
					CBX.showNumParticipations(agenda.numPresentCensus, company, council.statute)
					: CBX.showNumParticipations(agenda.presentCensus, company, council.statute) || 0} ${printPercentage(agenda.presentCensus)}`}
			</div>
		</>
	);

	const renderRemoteTotal = () => (
		<>
			<div style={itemStyle}>
				{translate.current_remote_census}
			</div>
			<div style={itemStyle}>
				{`${translate.participants}: ${agenda.numCurrentRemoteCensus || 0}`}
			</div>
			<div style={itemStyle}>
				{`${translate.votes}: ${CBX.showNumParticipations(agenda.currentRemoteCensus, company, council.statute) || 0} ${printPercentage(agenda.currentRemoteCensus)}`}
			</div>
		</>
	);

	const renderCurrentTotal = () => {
		const totalCensus = agenda.presentCensus + agenda.currentRemoteCensus;
		return (
			<>
				<div style={itemStyle}>
					{translate.voting_rights_census}
				</div>
				<div style={itemStyle}>
					{`${translate.participants}: ${agenda.numCurrentRemoteCensus + agenda.numPresentCensus || 0}`}
				</div>
				<div style={itemStyle}>
					{`${translate.votes}: ${CBX.showNumParticipations(totalCensus, company, council.statute) || 0} ${printPercentage(totalCensus)}`}
				</div>
			</>
		);
	};


	if (isMobile) {
		return (
			<React.Fragment>
				<Grid style={{ border: `1px solid ${getSecondary()}`, margin: 'auto', marginTop: '1em' }}>
					<GridItem xs={3} lg={3} md={3} style={columnStyle}>
						{renderTotal()}
					</GridItem>
					<GridItem xs={3} lg={3} md={3} style={columnStyle}>
						{renderPresentTotal()}
					</GridItem>
					<GridItem xs={3} lg={3} md={3} style={columnStyle}>
						{renderRemoteTotal()}
					</GridItem>
					<GridItem xs={3} lg={3} md={3} style={{ ...columnStyle, backgroundColor: 'lightcyan' }}>
						{renderCurrentTotal()}
					</GridItem>
				</Grid>
				<Grid style={{ border: `1px solid ${getSecondary()}`, margin: 'auto', marginTop: '1em' }}>
					<GridItem xs={4} lg={4} md={4} style={columnStyle}>
						<div style={itemStyle}>
							{`${translate.majority_label}: ${translate[majorityTypes.find(item => agenda.majorityType === item.value).label]}`}
							{CBX.majorityNeedsInput(agenda.majorityType) && agenda.majority}
							{agenda.majorityType === 0 && '%'}
							{agenda.majorityType === 5 && `/ ${agenda.majorityDivider}`}
						</div>
					</GridItem>
					<GridItem xs={4} lg={4} md={4} style={columnStyle}>
						{CBX.haveQualityVoteConditions(agenda, council)
							&& <div style={itemStyle}>
								{approvedByQualityVote ?
									`${translate.approved} ${translate.by_quality_vote}`
									: `${translate.not_approved} ${translate.by_quality_vote}`
								}
							</div>
						}
					</GridItem>
					<GridItem xs={4} lg={4} md={4} style={columnStyle}>
						<div style={itemStyle}>
							{`${translate.votes_in_favor_for_approve}: ${agendaNeededMajority}`}
							{(agendaNeededMajority > (agenda.votingsRecount.positiveVotings + agenda.votingsRecount.positiveManual) && !approvedByQualityVote) ? (
								<FontAwesome
									name={'times'}
									style={{
										margin: '0.5em',
										color: 'red',
										fontSize: '1.2em'
									}}
								/>
							) : (
								<FontAwesome
									name={'check'}
									style={{
										margin: '0.5em',
										color: 'green',
										fontSize: '1.2em'
									}}
								/>
							)}
						</div>
					</GridItem>
				</Grid>
				<Card style={{ margin: '5px 0px 5px 0px', width: 'calc( 100% + 8px )' }}>
					<CardHeader
						classes={{
							title: classes.cardTitle,
						}}
						title={translate.remote_vote}
						style={{ paddingBottom: '0px' }}
					/>
					<CardContent style={{ paddingTop: '5px' }}>
						<div style={{ fontSize: '0.8em' }}>
							{translate.in_favor} : {printPositiveRemote()}
							<br></br>
							{translate.against} : {printNegativeRemote()}
							<br></br>
							{translate.abstentions} : {printAbstentionRemote()}
							<br></br>
							{translate.no_vote} : {printNoVoteRemote()}
						</div>
					</CardContent>
				</Card>
				<Card style={{ margin: '5px 0px 5px 0px', width: 'calc( 100% + 8px )' }}>
					<CardHeader
						classes={{
							title: classes.cardTitle,
						}}
						title={translate.present_vote}
						style={{ paddingBottom: '0px' }}
					/>
					<CardContent style={{ paddingTop: '5px' }}>
						<div style={{ fontSize: '0.8em' }}>
							{editable ?
								<React.Fragment>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										{translate.in_favor} :
										<EditableCell
											inCard={true}
											value={agenda.votingsRecount.positiveManual}
											translate={translate}
										/>
									</div>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										{translate.against} :
										<EditableCell
											inCard={true}
											value={agenda.votingsRecount.negativeManual}
											translate={translate}
										/>
									</div>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										{translate.abstentions} :
										<EditableCell
											inCard={true}
											value={agenda.abstentionManual}
											translate={translate}
										/>
									</div>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										{translate.no_vote} :
										<EditableCell
											inCard={true}
											value={agenda.noVoteManual}
											translate={translate}
										/>
									</div>
								</React.Fragment>
								: <React.Fragment>
									{translate.in_favor} : {printPositivePresent()}
									<br></br>
									{translate.against} : {printNegativePresent()}
									<br></br>
									{translate.abstentions} : {printAbstentionPresent()}
									<br></br>
									{translate.no_vote} : {printNoVotePresent()}
								</React.Fragment>
							}
						</div>
					</CardContent>
				</Card>
				<Card style={{ margin: '5px 0px 5px 0px', width: 'calc( 100% + 8px )' }}>
					<CardHeader
						classes={{
							title: classes.cardTitle,
						}}
						title={'Total'}
						style={{ paddingBottom: '0px' }}
					/>
					<CardContent style={{ paddingTop: '5px' }}>
						<div style={{ fontSize: '0.8em' }}>
							{translate.in_favor} : {printPositiveTotal()}
							<br></br>
							{translate.against} :  {printNegativeTotal()}
							<br></br>
							{translate.abstentions} : {printAbstentionTotal()}
							<br></br>
							{translate.no_vote} : {printNoVoteTotal()}
						</div>
					</CardContent>
				</Card>
			</React.Fragment>
		);
	}

	return (
		<React.Fragment>
			{council.autoClose !== 1
				&& <Grid style={{
					border: `1px solid ${getSecondary()}`, margin: 'auto', marginTop: '1em', marginBottom: '2em'
				}}>
					<GridItem xs={3} lg={3} md={3} style={columnStyle}>
						{renderTotal()}
					</GridItem>
					<GridItem xs={3} lg={3} md={3} style={columnStyle}>
						{renderPresentTotal()}
					</GridItem>
					<GridItem xs={3} lg={3} md={3} style={columnStyle}>
						{renderRemoteTotal()}
					</GridItem>
					<GridItem xs={3} lg={3} md={3} style={{ ...columnStyle, backgroundColor: 'lightcyan' }}>
						{renderCurrentTotal()}
					</GridItem>
				</Grid>
			}
			<Grid style={{ border: `1px solid ${getSecondary()}`, margin: 'auto', marginTop: '1em' }}>
				<GridItem xs={4} lg={4} md={4} style={columnStyle}>
					<div style={itemStyle}>
						{`${translate.majority_label}: ${translate[majorityTypes.find(item => agenda.majorityType === item.value).label]}`}
						{CBX.majorityNeedsInput(agenda.majorityType) && agenda.majority}
						{agenda.majorityType === 0 && '%'}
						{agenda.majorityType === 5 && `/ ${agenda.majorityDivider}`}
					</div>
				</GridItem>
				<GridItem xs={4} lg={4} md={4} style={columnStyle}>
					{CBX.haveQualityVoteConditions(agenda, council)
						&& <div style={itemStyle}>
							{CBX.approvedByQualityVote(agenda, council.qualityVoteId) ?
								`${translate.approved} ${translate.by_quality_vote}`
								: `${translate.not_approved} ${translate.by_quality_vote}`
							}
						</div>
					}
				</GridItem>
				<GridItem xs={4} lg={4} md={4} style={columnStyle}>
					<div style={itemStyle}>
						{`${translate.votes_in_favor_for_approve}: ${CBX.showNumParticipations(agendaNeededMajority, company, council.statute)}`}
						{(agendaNeededMajority > (agenda.votingsRecount.positiveVotings + agenda.votingsRecount.positiveManual) && !approvedByQualityVote) ? (
							<FontAwesome
								name={'times'}
								style={{
									margin: '0.5em',
									color: 'red',
									fontSize: '1.2em'
								}}
							/>
						) : (
							<FontAwesome
								name={'check'}
								style={{
									margin: '0.5em',
									color: 'green',
									fontSize: '1.2em'
								}}
							/>
						)}
					</div>
				</GridItem>
			</Grid>
			<Table
				forceMobileTable={true}
				headers={[
					{ name: '' },
					{ name: translate.in_favor },
					{ name: translate.against },
					{ name: translate.abstentions },
					{ name: translate.no_vote }
				]}
			>
				<TableRow>
					<TableCell>
						{translate.remote_vote}
					</TableCell>
					<TableCell>
						{printPositiveRemote()}
					</TableCell>
					<TableCell>
						{printNegativeRemote()}
					</TableCell>
					<TableCell>
						{printAbstentionRemote()}
					</TableCell>
					<TableCell>
						{printNoVoteRemote()}
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>
						{translate.present_vote}
					</TableCell>
					{editable ?
						<React.Fragment>
							<EditableCell
								value={agenda.votingsRecount.positiveManual}
								translate={translate}
							/>
							<EditableCell
								value={agenda.votingsRecount.negativeManual}
								translate={translate}
							/>
							<EditableCell
								value={agenda.votingsRecount.abstentionManual}
								translate={translate}
							/>
							<EditableCell
								value={agenda.noVoteManual}
								translate={translate}
							/>
						</React.Fragment>
						: <React.Fragment>
							<TableCell>
								{printPositivePresent()}
							</TableCell>
							<TableCell>
								{printNegativePresent()}
							</TableCell>
							<TableCell>
								{printAbstentionPresent()}
							</TableCell>
							<TableCell>
								{printNoVotePresent()}
							</TableCell>
						</React.Fragment>
					}
				</TableRow>
				<TableRow>
					<TableCell>
						Total
					</TableCell>
					<TableCell>
						{printPositiveTotal()}
					</TableCell>
					<TableCell>
						{printNegativeTotal()}
					</TableCell>
					<TableCell>
						{printAbstentionTotal()}
					</TableCell>
					<TableCell>
						{printNoVoteTotal()}
					</TableCell>
				</TableRow>
			</Table>
		</React.Fragment>
	);
};
const regularCardStyle = {
	cardTitle: {
		fontSize: '1em',
	},
};

export default withSharedProps()(graphql(updateAgenda, {
	name: 'updateAgenda'
})(withStyles(regularCardStyle)(AgendaRecount)));

class EditableCell extends React.Component {
	state = {
		showEdit: false,
		edit: false,
		tooltip: false,
		value: this.props.value
	}

	show = () => {
		this.setState({
			edit: true
		});
	}

	hide = () => {
		this.setState({
			showEdit: false
		});
	}

	toggleEdit = () => {
		this.setState({
			edit: !this.state.edit
		});
	}

	showTooltip = () => {
		this.setState({
			tooltip: true
		});
	}

	handleKeyUp = event => {
		const key = event.nativeEvent;

		if (key.keyCode === 13) {
			this.saveValue();
		}
	}

	saveValue = () => {
		if (this.state.value !== this.props.value) {
			this.props.blurAction(this.state.value);
		}
		this.toggleEdit();
	}

	render() {
		const { inCard } = this.props;
		if (inCard) {
			return (
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						paddingLeft: '2px'
					}}
					onMouseOver={this.show}
					onMouseLeave={this.hide}
				>
					{this.state.edit ?
						<Tooltip title={this.props.max === 0 ? this.props.translate.max_votes_reached : `${this.props.translate.enter_num_between_0_and} ${this.props.max}`}>
							<div style={{ width: '4em' }}>
								<Input
									type="number"
									fullWidth
									onKeyUp={this.handleKeyUp}
									max={this.props.max}
									min={0}
									onBlur={this.saveValue}
									value={this.state.value}
									onChange={event => {
										if (event.target.value >= 0 && event.target.value <= this.props.max) {
											this.setState({
												value: parseInt(event.target.value, 10)
											});
										} else {
											this.showTooltip();
										}
									}}
								/>
							</div>
						</Tooltip>

						: this.state.value
					}
				</div>
			);
		}
		return (
			<TableCell
				onMouseOver={this.show}
				onMouseLeave={this.hide}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
					}}
				>
					{this.state.edit ?
						<Tooltip title={this.props.max === 0 ? this.props.translate.max_votes_reached : `${this.props.translate.enter_num_between_0_and} ${this.props.max}`}>
							<div style={{ width: '4em' }}>
								<Input
									type="number"
									fullWidth
									onKeyUp={this.handleKeyUp}
									max={this.props.max}
									min={0}
									onBlur={this.saveValue}
									value={this.state.value}
									onChange={event => {
										if (event.target.value >= 0 && event.target.value <= this.props.max) {
											this.setState({
												value: parseInt(event.target.value, 10)
											});
										} else {
											this.showTooltip();
										}
									}}
								/>
							</div>
						</Tooltip>

						: this.state.value
					}

				</div>
			</TableCell>
		);
	}
}

AgendaRecount.propTypes = {
	classes: PropTypes.object.isRequired,
	cardTitle: PropTypes.node,
};
