import React from "react";
import {
	Block,
	Grid,
	GridItem,
	LoadingSection,
	AlertConfirm,
	Link,
	BasicButton
} from "../../displayComponents";
import { graphql, compose } from "react-apollo";
import { councils } from "../../queries.js";
import logo from '../../assets/img/logo-icono.png';
import CantCreateCouncilsModal from "./CantCreateCouncilsModal";
import { TRIAL_DAYS } from "../../config";
import { trialDaysLeft } from "../../utils/CBX";
import { moment } from "../../containers/App";
import BigCalendar from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getPrimary, getSecondary } from "../../styles/colors";
import CouncilDetails from '../../components/council/display/CouncilDetails'
import { Paper, Tooltip } from 'material-ui';
import gql from 'graphql-tag';
import AgendaEvent from './AgendaEvent';
import { isMobile } from "react-device-detect";



const primary = getPrimary();
const secondary = getSecondary();

class TopSectionBlocks extends React.Component {

	state = {
		open: false,
		modal: false,
		reunion: null
	}

	closeCouncilsModal = () => {
		this.setState({
			open: false
		})
	}

	showCouncilsModal = () => {
		this.setState({
			open: true
		});
	}

	selectEvent = (event) => {
		this.setState({
			modal: true,
			reunion: event
		})
	}

	closeModal = () => {
		this.setState({
			modal: false
		});
	}

	render() {
		const { translate, company } = this.props;
		const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer
		let allViews = ["agenda", "month"] // Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])
		const { loading, councils, error } = this.props.data;
		let eventos = [];
		if (!loading) {
			//Si la dateEnd existe ponerla
			eventos = councils.map(({ dateStart, dateEnd, name, state, step, id, __typename, companyId }) =>
				({ start: new Date(dateStart), end: new Date(dateStart), title: name, state, step, id, __typename, companyId }))
		}
		const messages = { //TRADUCCION
			allDay: 'Todo el dia',
			previous: '< Atrás',
			next: translate.next + ' >',
			today: 'Hoy',
			month: 'Mes',
			week: 'Semana',
			day: 'Día',
			agenda: translate.agenda,
			date: translate.date,
			time: 'Hora',
			event: 'Evento',
		}
		return (
			<Grid
				style={{
					width: "90%",
					marginTop: "4vh"
				}}
				spacing={8}
			>
				<CantCreateCouncilsModal
					open={this.state.open}
					requestClose={this.closeCouncilsModal}
					translate={translate}
				/>
				{isMobile &&
					<div style={{width: "100%"}}>
						<GridItem xs={12} md={3} lg={3} style={{marginBottom:"1em"}} >
							<Block
								link={`/company/${company.id}/statutes`}
								icon="gavel"
								id={'edit-statutes-block'}
								text={translate.council_types}
							/>
						</GridItem>


						<GridItem xs={12} md={3} lg={3} style={{marginBottom:"1em"}} >
							<Block
								link={`/company/${company.id}/book`}
								icon="contacts"
								id={'edit-company-block'}
								disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
								disabledOnClick={this.showCouncilsModal}
								text={translate.book}
							/>
						</GridItem>

						<GridItem xs={12} md={3} lg={3} style={{marginBottom:"1em"}}>
							<Block
								link={`/company/${company.id}/censuses`}
								icon="person"
								id={'edit-censuses-block'}
								text={translate.censuses}
							/>
						</GridItem>

						<GridItem xs={12} md={3} lg={3} style={{marginBottom:"1em"}}>
							<Block
								link={`/company/${company.id}/drafts`}
								icon="class"
								id={'edit-drafts-block'}
								text={translate.drafts}
							/>
						</GridItem>
						<GridItem xs={12} md={3} lg={3} style={{marginBottom:"1em"}}>
						</GridItem>

						<GridItem xs={12} md={3} lg={3} style={{marginBottom:"1em"}}>
							<Block
								link={`/company/${company.id}/council/new`}
								customIcon={<img src={logo} style={{ height: '7em', width: 'auto' }} alt="councilbox-logo" />}
								id={'create-council-block'}
								disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
								disabledOnClick={this.showCouncilsModal}
								text={translate.dashboard_new}
							/>
						</GridItem>
						<GridItem xs={12} md={3} lg={3} style={{marginBottom:"1em"}}>
							<Block
								link={`/company/${company.id}/meeting/new`}
								icon="video_call"
								id={'init-meeting-block'}
								text={translate.start_conference}
							/>
						</GridItem>
					</div>}
				{this.props.user.roles === 'devAdmin' &&
					<GridItem xs={12} md={3} lg={3}>
						<Block
							link={`/admin`}
							customIcon={<i className="fa fa-user-secret" aria-hidden="true" style={{ fontSize: '7em' }}></i>}
							id={'admin-panel'}
							text={'Panel devAdmin'}
						/>
					</GridItem>
				}
				{!isMobile &&
					<GridItem xs={12} md={12} lg={12} style={{ height: '580px' }}>
						<div style={{ height: '580px' }}>
							{loading ? (
								<div style={{
									width: '100%',
									marginTop: '8em',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
									<LoadingSection />
								</div>
							) : (

									<BigCalendar
										messages={messages}
										defaultDate={new Date()}
										defaultView="agenda"
										localizer={localizer}
										events={eventos}
										startAccessor="start"
										endAccessor="end"
										views={allViews}
										resizable
										onSelectEvent={this.selectEvent}
										components={{
											agenda: {
												event: AgendaEvent,
											}

										}}
										eventPropGetter={
											(event, start, end, isSelected) => {
												return {
													className: 'rbc-cell-' + event.state,
												};
											}
										}
									>
									</BigCalendar>
								)}
							<AlertConfirm
								requestClose={!!this.state.council ? this.closeCouncilDetails : this.closeModal}
								open={this.state.modal}
								bodyText={
									<CouncilDetails council={this.state.reunion} translate={this.props.translate} inIndex={true} />
								}
								title={translate.meeting_header}
								widthModal={{ width: "75%" }}
							/>
						</div>
					</GridItem>
				}
			</Grid >

		);
	}
}

const loadFromPreviousCouncil = gql`
    mutation LoadFromPreviousCouncil($councilId: Int!, $originId: Int!){
        loadFromAnotherCouncil(councilId: $councilId, originId: $originId){
            success
            message
        }
    }
`;

export default compose(
	graphql(loadFromPreviousCouncil, { name: 'loadFromPreviousCouncil' }),
	graphql(councils, {
		options: props => ({
			variables: {
				state: [5, 10, 20, 30],
				companyId: props.company.id,
				isMeeting: false,
				active: 1
			},
			errorPolicy: 'all'
		})
	})
)(TopSectionBlocks);