import React from "react";
import {
	Block, Grid, GridItem, LoadingSection, AlertConfirm, Link, BasicButton
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
import Draggable, { DraggableCore } from "react-draggable";
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';

const ReactGridLayout = WidthProvider(RGL);

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
		modalAcciones: false,
		activeDrags: 0,
		desactiveItem: false
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

	handleStart = (layout, oldItem, newItem, placeholder, e, element, grid) => {
		e.preventDefault()
		e.stopPropagation()
	}

	handleStop = (layout, oldItem, newItem, placeholder, e, element, grid) => {
		e.preventDefault()
		e.stopPropagation()
		this.props.itemStorage("", "", layout, grid);
	}
	stopPropagation = (event) => {
		event.stopPropagation();
	};

	onLayoutChange = (layout, layouts) => {
		this.setState({ layout: this.props.statesItems });
		this.state.onLayoutChange(this.state.layout[1]);
		// this.props.itemStorage("", "", layout, 1);
	};


	render() {
		const { translate, company, editMode, statesItems } = this.props;
		const localizer = BigCalendar.momentLocalizer(moment)
		let allViews = ["agenda", "month"]
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


		var layouts = {
			lg: [
				{ i: 'reuniones', x: 9, y: 0, w: 2.3, h: 2.2, },
				{ i: 'lastActions', x: 3.3, y: 0, w: 4.2, h: 3.3, },
				{ i: 'noSession', x: 6, y: 0, w: 2.4, h: 2.2, },
			], md: statesItems[2]
		};

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

					<GridItem xs={12} md={12} lg={12} style={{ height: '100%', }}>
						<ReactGridLayout
							onDragStop={(layout, oldItem, newItem, placeholder, e, element) => this.handleStop(layout, oldItem, newItem, placeholder, e, element, 1)}
							isDraggable={editMode}
							className={"layout"}
							layout={statesItems[1]}
							style={{ overflow: "hidden", }}
						>
							<div id={'buttons'} key={"buttons"} style={{ height: "100%" }}>
								{statesItems[0].buttons && (
									<div style={{ ...stylesGrafica.contenedor, }} className={editMode ? "shakeItems " : ""}>
										{editMode && (
											<div onMouseDown={this.stopPropagation} onTouchStart={this.stopPropagation} className={'shakeIcon'} onClick={(event) => this.props.itemStorage("buttons", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer" }}>
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
							</div>

							<div key={"sectionReuniones"} id={'sectionReuniones'} >
								{statesItems[0].sectionReuniones && (
									<div style={{ marginLeft: editMode ? "" : "-5px", paddingLeft: editMode ? "1em" : "", marginTop: editMode ? "2em" : "", overflow: "hidden", width: "100%", height: '100%', border: editMode ? "1px solid #ddd" : "", background: editMode ? "white" : "", boxShadow: editMode ? "rgba(0, 0, 0, 0.2) 0px 2px 4px" : "", borderRadius: editMode ? "3px" : "", }} className={editMode ? "shakeItems " : ""} >
										{editMode && (
											<div onMouseDown={this.stopPropagation} onTouchStart={this.stopPropagation} className={'shakeIcon'} onClick={() => this.props.itemStorage("sectionReuniones", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer", zIndex: "10" }} >
												<i className={"fa fa-times"}></i>
											</div>
										)}
										<div style={{ width: "100%", }}  >
											<ResponsiveGridLayout
												breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
												cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 1 }}
												onDragStop={(layout, oldItem, newItem, placeholder, e, element) => this.handleStop(layout, oldItem, newItem, placeholder, e, element, 2)}
												onDragStart={(layout, oldItem, newItem, placeholder, e, element) => this.handleStart(layout, oldItem, newItem, placeholder, e, element, 2)}
												isDraggable={editMode}
												className={"layout2"}
												layout={layouts}
												// layout={statesItems[2]}
												compactType={"horizontal"}
												width={1}
												onLayoutChange={this.onLayoutChange}
												style={{ width: "100%", height: '520px', overflow: "hidden", display:"flex" }}
											>
												<div id={"reuniones"} key={"reuniones"} style={{  /*maxWidth: "220px",*/ }} >

													{statesItems[0].reuniones && (
														<div style={{ overflow: "hidden", width: "220px", height: '300px', ...stylesGrafica.contenedor }} className={editMode ? "shakeItemSmall" : ""}>
															{editMode && (
																<div onMouseDown={this.stopPropagation} onTouchStart={this.stopPropagation} className={'shakeIcon'} onClick={() => this.props.itemStorage("reuniones", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer" }} >
																	<i className={"fa fa-times"}></i>
																</div>
															)}
															<div style={{ marginBottom: "0.5em", marginTop: "0.5em" }}><b> Reuniones </b></div> {/*TRADUCCION*/}
															<div > Año: {anoActual} </div> {/*TRADUCCION*/}
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
												<div id={'lastActions'} key={"lastActions"} style={{ /*maxWidth: "420px"*/ }}>

													{statesItems[0].lastActions && (
														<div style={{ overflow: "hidden", width: "420px", height: '475px', ...stylesGrafica.contenedor }} className={editMode ? "shakeItemSmall" : ""}>
															{editMode && (
																<div onMouseDown={this.stopPropagation} onTouchStart={this.stopPropagation} className={'shakeIcon'} onClick={() => this.props.itemStorage("lastActions", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer" }} >
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
												<div id={'noSession'} key={"noSession"} style={{/* maxWidth: "220px"*/ }}>

													{statesItems[0].noSession && (
														<div style={{ overflow: "hidden", width: "220px", height: '300px', ...stylesGrafica.contenedor }} className={editMode ? "shakeItemSmall" : ""}>
															{editMode && (
																<div onMouseDown={this.stopPropagation} onTouchStart={this.stopPropagation} className={'shakeIcon'} onClick={() => this.props.itemStorage("noSession", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer" }} >
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
											</ResponsiveGridLayout>
										</div>
									</div>
								)}
							</div>

							<div key={"calendar"} id={'calendar'}>
								{statesItems[0].calendar && (
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
															<div onMouseDown={this.stopPropagation} onTouchStart={this.stopPropagation} className={'shakeIcon'} onClick={() => this.props.itemStorage("calendar", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer" }}>
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
							</div>
						</ReactGridLayout>
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