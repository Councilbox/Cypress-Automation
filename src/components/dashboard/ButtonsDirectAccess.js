import React from 'react';
import {
	Block,
	Grid,
	GridItem,
	Link,
} from '../../displayComponents';
import logo from '../../assets/img/logo-icono.png';
import { TRIAL_DAYS } from '../../config';
import { trialDaysLeft } from '../../utils/CBX';
import { moment } from '../../containers/App';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getPrimary, getSecondary, darkGrey } from '../../styles/colors';
import { Icon, Card, MenuItem } from 'material-ui';
import CantCreateCouncilsModal from './CantCreateCouncilsModal';
import ContentButtonDirectAccess from './ContentButtonDirectAccess';


class ButtonsDirectAccess extends React.Component {
	state = {
		open: false,
	}

	closeCouncilsModal = () => {
		this.setState({
			open: false
		});
	}

	showCouncilsModal = () => {
		this.setState({
			open: true
		});
	}

	render() {
		const { company, translate, isMobile } = this.props;
		const itemsPc = (
			<React.Fragment>
				<CantCreateCouncilsModal
					open={this.state.open}
					requestClose={this.closeCouncilsModal}
					translate={translate}
				/>
				<GridItem xs={6} md={3} lg={2} style={{ marginBottom: isMobile ? '1em' : '', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
					<Card elevation={6} style={{ width: '155px', borderRadius: '5px 5px 5px 5px', backgroundColor: 'transparent' }} >
						<Link to={`/company/${company.id}/statutes`}>
							<div style={{ background: '#a0000b', maxWidth: '155px', padding: '1em', borderRadius: '5px 5px 0px 0px' }}>
								<Icon
									className="material-icons"
									style={{
										fontSize: '4em',
										color: 'white'
									}}
								>
									{'gavel'}
								</Icon>
							</div>
							<div style={{ marginTop: '1px', background: darkGrey, maxWidth: '155px', padding: '1em', borderRadius: '0px 0px 5px 5px', color: 'white' }}>
								{translate.council_types}
							</div>
						</Link>
					</Card>
				</GridItem>

				<GridItem xs={6} md={3} lg={2} style={{ marginBottom: isMobile ? '1em' : '', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
					<Card elevation={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0 ? 0 : 6} style={{ width: '155px', borderRadius: '5px 5px 5px 5px', backgroundColor: 'transparent' }} >
						<ContentButtonDirectAccess
							link={`/company/${company.id}/book`}
							disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
							disabledOnClick={this.showCouncilsModal}
						>
							<div style={{ background: company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0 ? '#0051844a' : '#005184', maxWidth: '155px', padding: '1em', borderRadius: '5px 5px 0px 0px' }}>
								<Icon
									className="material-icons"
									style={{
										fontSize: '4em',
										color: 'white'
									}}
								>
									{'contacts'}
								</Icon>
							</div>
							<div style={{ marginTop: '1px', background: company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0 ? '#3b3b3b4a' : darkGrey, maxWidth: '155px', padding: '1em', borderRadius: '0px 0px 5px 5px', color: 'white' }}>
								{translate.book}
							</div>
						</ContentButtonDirectAccess>
					</Card>
				</GridItem>

				<GridItem xs={6} md={3} lg={2} style={{ marginBottom: isMobile ? '1em' : '', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
					<Card elevation={6} style={{ width: '155px', borderRadius: '5px 5px 5px 5px', backgroundColor: 'transparent' }} >
						<Link to={`/company/${company.id}/censuses`} >
							<div style={{ background: '#e66d24', maxWidth: '155px', padding: '1em', borderRadius: '5px 5px 0px 0px' }}>
								<Icon
									className="material-icons"
									style={{
										fontSize: '4em',
										color: 'white'
									}}
								>
									{'person'}
								</Icon>
							</div>
							<div style={{ marginTop: '1px', background: darkGrey, maxWidth: '155px', padding: '1em', borderRadius: '0px 0px 5px 5px', color: 'white' }}>
								{translate.censuses}
							</div>
						</Link>
					</Card>
				</GridItem>

				<GridItem xs={6} md={3} lg={2} style={{ marginBottom: isMobile ? '1em' : '', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
					<Card elevation={6} style={{ width: '155px', borderRadius: '5px 5px 5px 5px', background: 'transparent' }} >
						<Link to={`/company/${company.id}/drafts`} >
							<div style={{ background: '#6c9c37', maxWidth: '155px', padding: '1em', borderRadius: '5px 5px 0px 0px' }}>
								<Icon
									className="material-icons"
									style={{
										fontSize: '4em',
										color: 'white'
									}}
								>
									{'class'}
								</Icon>
							</div>
							<div style={{ marginTop: '1px', background: darkGrey, maxWidth: '155px', padding: '1em', borderRadius: '0px 0px 5px 5px', color: 'white' }}>
								{translate.drafts}
							</div>
						</Link>
					</Card>
				</GridItem>

				<GridItem xs={6} md={3} lg={2} style={{ marginBottom: isMobile ? '1em' : '', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
					<Card elevation={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0 ? 0 : 6} style={{ width: '155px', borderRadius: '5px 5px 5px 5px', backgroundColor: 'transparent' }} >
						<ContentButtonDirectAccess
							link={`/company/${company.id}/book`}
							disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
							disabledOnClick={this.showCouncilsModal}
						>
							<div style={{ background: company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0 ? '#cecece4a' : '#cecece', maxWidth: '155px', padding: '1em', borderRadius: '5px 5px 0px 0px' }}>
								<img src={logo} style={{
									height: '4.4em',
									 width: 'auto',
									 opacity: company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0 ? '0.5' : '1'
								}}
									alt="councilbox-logo" />
							</div>
							<div style={{ marginTop: '1px', background: company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0 ? '#3b3b3b4a' : darkGrey, maxWidth: '155px', padding: '1em', borderRadius: '0px 0px 5px 5px', color: 'white' }}>
								{translate.dashboard_new}
							</div>

						</ContentButtonDirectAccess>
					</Card>
				</GridItem>

				<GridItem xs={6} md={3} lg={2} style={{ marginBottom: isMobile ? '1em' : '', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
					<Card elevation={6} style={{ width: '155px', borderRadius: '5px 5px 5px 5px', backgroundColor: 'transparent' }} >
						<Link to={`/company/${company.id}/meeting/new`}>
							<div style={{ background: '#67379c', maxWidth: '155px', padding: '1em', borderRadius: '5px 5px 0px 0px' }}>
								<Icon
									className="material-icons"
									style={{
										fontSize: '4em',
										color: 'white'
									}}
								>
									{'video_call'}
								</Icon>
							</div>
							<div style={{ marginTop: '1px', background: darkGrey, maxWidth: '155px', padding: '1em', borderRadius: '0px 0px 5px 5px', color: 'white' }}>
								{translate.start_conference}
							</div>
						</Link>
					</Card>
				</GridItem>
			</React.Fragment>
		);

		if (isMobile) {
			return (
				<React.Fragment>
					{itemsPc}
				</React.Fragment>
			);
		}
			return (
				<Grid
					style={{
						width: '100%',
					}}
					spacing={8}
				>
					{itemsPc}
				</Grid>
			);
	}
}

export default ButtonsDirectAccess;
