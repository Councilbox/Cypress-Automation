import React from "react";
import {
	Block, Grid, GridItem, LoadingSection, AlertConfirm, Link, BasicButton
} from "../../displayComponents";
import { graphql, compose } from "react-apollo";
import { councils } from "../../queries.js";
import CantCreateCouncilsModal from "./CantCreateCouncilsModal";
import { moment } from "../../containers/App";
import BigCalendar from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import CouncilDetails from '../../components/council/display/CouncilDetails'
import gql from 'graphql-tag';
import AgendaEvent from './AgendaEvent';
import { isMobile } from "react-device-detect";
import Grafica from "./Grafica";
import UltimasAcciones from "./UltimasAcciones";
import ButtonsDirectAccess from "./ButtonsDirectAccess";
import _ from "lodash";
import RGL, { WidthProvider, Responsive } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import withWindowSize from "../../HOCs/withWindowSize";



const ResponsiveReactGridLayout = WidthProvider(Responsive);
const ReactGridLayout = WidthProvider(RGL);


const stylesGrafica = {
	contenedor: {
		border: "1px solid #ddd",
		background: "white",
		boxShadow: "rgba(0, 0, 0, 0.2) 0px 2px 4px",
		borderRadius: "3px",
		padding: "1.2em",
		marginBottom: '1em',
		marginTop: "2em",
		// marginRight: '2em',
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
		desactiveItem: false,
		layout: this.props.statesItems[1],
		onLayoutChange: function () { },
		layoutHorizontal: this.props.statesItems[2],
		onLayoutChangeHorizontal: function () { },
		breakpoint: "lg",
		breakpointHorizontal: "lg"

	}

	updateDimensions = () => {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	componentWillMount = () => {
		this.updateDimensions();
	}

	componentDidMount = () => {
		window.addEventListener("resize", this.updateDimensions);
	}

	componentWillUnmount = () => {
		window.removeEventListener("resize", this.updateDimensions);
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

	handleStop = (layout, oldItem, newItem, placeholder, e, element, grid, nameLayout) => {
		e.preventDefault()
		e.stopPropagation()
		let breakpoint = this.state.breakpoint
		if (!grid) {
			grid = 2
			breakpoint = this.state.breakpointHorizontal
			element.click
		}
		this.props.itemStorage("", "", layout, grid, nameLayout, breakpoint);
	}

	stopPropagation = (event) => {
		event.stopPropagation();
	};


	onBreakpointChange = (breakpoint) => {
		this.setState({ breakpoint: breakpoint })
	}

	onBreakpointChangeHorizontal = (breakpoint) => {
		this.setState({ breakpointHorizontal: breakpoint })
	}


	render() {
		const { translate, company, editMode, statesItems, layoutsResize, layoutsResizeHorizontal } = this.props;
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

		return (
			<Grid
				style={{
					width: "90%",
					// marginTop: "4vh"
					height: "100%"
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

					<GridItem xs={12} md={12} lg={12} style={{ height: '100%', minHeight: "800px" }}>

						<ResponsiveReactGridLayout
							breakpoints={{ lg: 1200, md: 1100, sm: 768, xs: 480, xxs: 0 }}
							cols={{ lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 }}
							isResizable={false}
							layouts={layoutsResize}
							onBreakpointChange={(breakpoint, cols) => this.onBreakpointChange(breakpoint, cols)}
							onDragStop={(layout, oldItem, newItem, placeholder, e, element) => this.handleStop(layout, oldItem, newItem, placeholder, e, element, 1, 'layoutsResize')}
							onDragStart={(layout, oldItem, newItem, placeholder, e, element) => this.handleStart(layout, oldItem, newItem, placeholder, e, element, 1)}
							isDraggable={editMode}
							compactType={"vertical"}
							style={{ width: "100%", overflow: "hidden", display: "flex", }}
						>
							<div key={"buttons"} data-grid={statesItems[1][0]} >
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


							<div key={"sectionReuniones"} data-grid={statesItems[1][1]} >
								{statesItems[0].sectionReuniones && (
									<div  style={{ marginLeft: editMode ? "" : "-5px", paddingLeft: editMode ? "1em" : "", marginTop: editMode ? "2em" : "", overflow: "hidden", width: "100%", height: '100%', border: editMode ? "1px solid #ddd" : "", background: editMode ? "white" : "", boxShadow: editMode ? "rgba(0, 0, 0, 0.2) 0px 2px 4px" : "", borderRadius: editMode ? "3px" : "", }} className={editMode ? "shakeItems " : ""} >
										{editMode && (
											<div onMouseDown={this.stopPropagation} onTouchStart={this.stopPropagation} className={'shakeIcon'} onClick={() => this.props.itemStorage("sectionReuniones", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer", zIndex: "10" }} >
												<i className={"fa fa-times"}></i>
											</div>
										)}
										<div style={{ width: "100%", height: "100%" }}  >
											<ResponsiveReactGridLayout
												{...this.props}
												breakpoints={{ lg: 1400, md: 1200, sm: 768, xs: 480, xxs: 0 }}
												cols={{ lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 }}
												isResizable={false}
												autoSize={false}
												onBreakpointChange={(breakpoint, cols) => this.onBreakpointChangeHorizontal(breakpoint, cols)}
												onDragStop={(layout, oldItem, newItem, placeholder, e, element) => this.handleStop(layout, oldItem, newItem, placeholder, e, element, 2, 'layoutsResizeHorizontal')}
												onDragStart={(layout, oldItem, newItem, placeholder, e, element) => this.handleStart(layout, oldItem, newItem, placeholder, e, element, 2)}
												isDraggable={editMode}
												compactType={"horizontal"}
												style={{ width: "100%", display: "flex", height: "100%" }}
											>
												<div key={"reuniones"} data-grid={statesItems[2][0]} >

													{statesItems[0].reuniones && (
														<div style={{ overflow: "hidden", width: "220px", height: '300px', ...stylesGrafica.contenedor }} className={editMode ? "shakeItemSmall" : ""}>
															{editMode && (
																<div onMouseDown={this.stopPropagation} onTouchStart={this.stopPropagation} className={'shakeIcon'} onClick={(i) => this.props.itemStorage("reuniones", false)} style={{ position: "absolute", top: "0", right: "5px", cursor: "pointer" }} >
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

												<div key={"lastActions"} data-grid={statesItems[2][1]}>

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
												<div key={"noSession"} data-grid={statesItems[2][2]}>

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
											</ResponsiveReactGridLayout>
										</div>
									</div>
								)}
							</div>

							<div key={"calendar"} key="calendar" data-grid={statesItems[1][2]}>
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
						</ResponsiveReactGridLayout>

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




