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
import Grafica from "./Grafica";
import UltimasAcciones from "./UltimasAcciones";
import ButtonsDirectAccess from "./ButtonsDirectAccess";




const primary = getPrimary();
const secondary = getSecondary();

const stylesGrafica = {
	contenedor: {
		border: "1px solid #ddd",
		background: "white",
		boxShadow: "rgba(0, 0, 0, 0.2) 0px 2px 4px",
		borderRadius: "3px",
		padding: "1.2em",
		position: "relative",
		marginBottom: '1em',
		marginTop: "2em",
		marginRight: '2em',
	},
	grafica: {
		display: 'inline-flex',
		justifyContent: 'center',
		alignItems: 'center',
	}
}

class TopSectionBlocks extends React.Component {

	state = {
		open: false,
		modal: false,
		reunion: null,
		modalAcciones: false
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
		const { translate, company, editMode, statesItems } = this.props;
		const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer
		let allViews = ["agenda", "month"] // Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])
		const { loading, councils, error, } = this.props.data;
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
			noEventsInRange: 'No hay eventos en este rango.',

		}
		// console.log(councils)

		const numReunion = []
		const numMes = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0 }



		let conf = [];
		let totalReuniones = 0;
		let info = [];
		if (!loading) {
			councils.forEach(reunion => numReunion.push(
				new Date(reunion.dateStart).getMonth()
			))
			for (let i = 0; i < numReunion.length; i++) {
				numMes[numReunion[i]]++
			}
			info = Object.values(numMes);
			for (let i = 0; i < info.length; i++) {
				totalReuniones = parseInt(info[i]) + parseInt(totalReuniones)
			}
		}

		const anoActual = new Date().getFullYear();

		return (
			<Grid
				style={{
					width: "90%",
					// marginTop: "4vh"
				}}
				spacing={8}
			>
				<CantCreateCouncilsModal
					open={this.state.open}
					requestClose={this.closeCouncilsModal}
					translate={translate}
				/>
				{isMobile &&
					<ButtonsDirectAccess
						company={company}
						translate={translate}
						isMobile={isMobile}
					/>
				}
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
					<GridItem xs={12} md={12} lg={12} style={{ height: '100%' }}>
						{statesItems.buttons && (
							<div style={{ ...stylesGrafica.contenedor }} className={editMode ? "shakeItems" : ""}>
								{editMode && (
									<div className={'shakeIcon'} onClick={() => this.props.itemStorage("buttons", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer" }}>
										<i className={"fa fa-times"}></i>
									</div>
								)}
								<div style={{ marginBottom: "1em", marginTop: "0.5em" }}><b> Quick Links </b></div> {/*TRADUCCION*/}
								<ButtonsDirectAccess
									company={company}
									translate={translate}
									isMobile={isMobile}
								/>

							</div>
						)}
						<div style={{ display: 'flex' }}>
							<Grid>
								<GridItem xs={12} md={2} lg={2}  style={{maxWidth: "220px",marginRight: '2em',}}>
									<div>
										{statesItems.reuniones && (
											<div style={{ overflow: "hidden", width: "220px", height: '300px', ...stylesGrafica.contenedor }} className={editMode ? "shakeItemSmall" : ""}>
												{editMode && (
													<div className={'shakeIcon'} onClick={() => this.props.itemStorage("reuniones", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer" }} >
														<i className={"fa fa-times"}></i>
													</div>
												)}
												<div style={{ marginBottom: "0.5em", marginTop: "0.5em" }}><b> Reuniones </b></div> {/*TRADUCCION*/}
												<div style={{}}> Año: {anoActual} </div> {/*TRADUCCION*/}
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
														<Grafica textCentral={"Reuniones"} styles={stylesGrafica.grafica} translate={translate} info={info} totalReuniones={totalReuniones} />//TRADUCCION
													)
												}
											</div>
										)}
									</div>
								</GridItem>
								<GridItem xs={12} md={4} lg={4} style={{maxWidth: "420px",marginRight: '2em',}}>
									<div>
										{statesItems.lastActions && (
											<div style={{ overflow: "hidden", width: "420px", height: '475px', ...stylesGrafica.contenedor }} className={editMode ? "shakeItemSmall" : ""}>
												{editMode && (
													<div className={'shakeIcon'} onClick={() => this.props.itemStorage("lastActions", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer" }} >
														<i className={"fa fa-times"}></i>
													</div>
												)}
												<div style={{ marginBottom: "0.5em", marginTop: "0.5em" }}><b>Ultimas Acciones</b></div> {/*TRADUCCION*/}
												{loading ? (
													<div style={{
														width: '100%',
														marginTop: '8em',
													}}>
														<LoadingSection />
													</div>
												) : (
														<div>
															<UltimasAcciones
																translate={translate}
																reuniones={councils}
															/>
														</div>

													)
												}
											</div>
										)}
									</div>
								</GridItem>
								<GridItem xs={12} md={2} lg={2} style={{maxWidth: "220px",marginRight: '2em',}} >
									<div>
										{statesItems.noSession && (
											<div style={{ overflow: "hidden", width: "220px", height: '300px', ...stylesGrafica.contenedor }} className={editMode ? "shakeItemSmall" : ""}>
												{editMode && (
													<div className={'shakeIcon'} onClick={() => this.props.itemStorage("noSession", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer" }} >
														<i className={"fa fa-times"}></i>
													</div>
												)}
												<div style={{ marginBottom: "0.5em", marginTop: "0.5em" }}><b> Reuniones sin sesión </b></div> {/*TRADUCCION*/}
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
														<div style={{ width: "170px", height: '220px', ...stylesGrafica.grafica }}>
															{/* <Grafica textCentral={"Reuniones"} translate={translate} info={info} totalReuniones={totalReuniones}></Grafica>TRADUCCION */}
														</div>

													)
												}
											</div>
										)}
									</div>
								</GridItem>

							</Grid>
						</div>
						{statesItems.calendar && (
							<div style={{ height: '100%' }} className={editMode ? "shakeItems" : ""}>
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
										<React.Fragment>
											<div style={{ ...stylesGrafica.contenedor, minHeight: "580px" }}>
												{editMode && (
													<div className={'shakeIcon'} onClick={() => this.props.itemStorage("calendar", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer" }}>
														<i className={"fa fa-times"}></i>
													</div>
												)}
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
													style={{ height: "580px" }}
													eventPropGetter={
														(event, start, end, isSelected) => {
															return {
																className: 'rbc-cell-' + event.state,
															};
														}
													}

												>
												</BigCalendar>
											</div>
										</React.Fragment>
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
						)}
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