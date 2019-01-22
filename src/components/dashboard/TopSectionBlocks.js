import React from "react";
import {
	Block,
	Grid,
	GridItem,
	LoadingSection,
	AlertConfirm,
	Link
} from "../../displayComponents";
import { graphql } from "react-apollo";
import { councils } from "../../queries.js";
import logo from '../../assets/img/logo-icono.png';
import CantCreateCouncilsModal from "./CantCreateCouncilsModal";
import { TRIAL_DAYS } from "../../config";
import { trialDaysLeft } from "../../utils/CBX";
import { moment } from "../../containers/App";
import BigCalendar from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";

const messages = {
	// allDay: 'journée',
	previous: '< Atrás',
	next: 'Siguiente >',
	today: 'Hoy',
	month: 'Mes',
	// week: 'semaine',
	// day: 'jour',
	agenda: 'Agenda',
	// date: 'date',
	// time: 'heure',
	// event: 'événement', // Or anything you want
	// showMore: total => `+ ${total} événement(s) supplémentaire(s)`
  }

class TopSectionBlocks extends React.Component {

	state = {
		open: false,
		modal: false,
		datosModal: false
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
		console.log(event)
		this.setState({
			modal: true,
			datosModal: event //mirar para que sea la info este en modal - null y dato
		})
	}

	_renderBodyModal = () => {
		let datosEvento = this.state.modal;
		console.log(datosEvento);
		return (
			<div style={{ minWidth: "800px" }}>
			asdasdasdasdasdasdws
				{/* <CensusInfoForm
					translate={this.props.translate}
					errors={this.state.errors}
					updateState={this.updateState}
					census={this.state.data}
				/> */}
			</div>
		);
	};

	render() {
		const { translate, company } = this.props;
		const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer
		let allViews = ["month", "agenda"] // Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])
		const { loading, councils, error } = this.props.data;
		let eventos = [];
		if (!loading) {
			//Si la dateEnd existe ponerla
			eventos = councils.map(({ dateStart, dateEnd, name, state, step, id, __typename, companyId }) =>
				({ start: new Date(dateStart), end: new Date(dateStart), title: name, state, step, id, __typename, companyId }))
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
				<GridItem xs={12} md={3} lg={3}>
					<Block
						link={`/company/${company.id}/statutes`}
						icon="gavel"
						id={'edit-statutes-block'}
						text={translate.council_types}
					/>
				</GridItem>

				<GridItem xs={12} md={3} lg={3}>
					<Block
						link={`/company/${company.id}/book`}
						icon="contacts"
						id={'edit-company-block'}
						disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
						disabledOnClick={this.showCouncilsModal}
						text={translate.book}
					/>
				</GridItem>

				<GridItem xs={12} md={3} lg={3}>
					<Block
						link={`/company/${company.id}/censuses`}
						icon="person"
						id={'edit-censuses-block'}
						text={translate.censuses}
					/>
				</GridItem>

				<GridItem xs={12} md={3} lg={3}>
					<Block
						link={`/company/${company.id}/drafts`}
						icon="class"
						id={'edit-drafts-block'}
						text={translate.drafts}
					/>
				</GridItem>
				<GridItem xs={12} md={3} lg={3}>
				</GridItem>

				<GridItem xs={12} md={3} lg={3}>
					<Block
						link={`/company/${company.id}/council/new`}
						customIcon={<img src={logo} style={{ height: '7em', width: 'auto' }} alt="councilbox-logo" />}
						id={'create-council-block'}
						disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
						disabledOnClick={this.showCouncilsModal}
						text={translate.dashboard_new}
					/>
				</GridItem>
				<GridItem xs={12} md={3} lg={3}>
					<Block
						link={`/company/${company.id}/meeting/new`}
						icon="video_call"
						id={'init-meeting-block'}
						text={translate.start_conference}
					/>
				</GridItem>
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
									defaultView="month"
									localizer={localizer}
									events={eventos}
									startAccessor="start"
									endAccessor="end"
									views={allViews}
									resizable
									onSelectEvent={this.selectEvent}
								>
								</BigCalendar>
							)}
						{/* crear modal para mostrar bien todo */}
						<AlertConfirm
							requestClose={() => this.setState({ modal: false })}
							open={this.state.modal}
							title={this.state.datosModal.title}
							// acceptAction={this.createCensus}
							// buttonAccept={translate.accept}
							// buttonCancel={translate.cancel}
							bodyText={this._renderBodyModal()}
							// title={translate.census}
						/>
					</div>
				</GridItem>
			</Grid >

		);
	}
}


export default graphql(councils, {
	options: props => ({
		variables: {
			state: [5, 10, 20],
			companyId: props.company.id,
			isMeeting: false,
			active: 1
		},
		errorPolicy: 'all'
	})
})(TopSectionBlocks);

