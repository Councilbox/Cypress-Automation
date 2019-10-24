import React from "react";
import {
	Block,
	Grid,
	GridItem,
	BasicButton,
	Scrollbar,
	TextInput,
	LoadingSection
} from "../../displayComponents";
import logo from '../../assets/img/logo-icono.png';
import { ConfigContext } from '../../containers/AppControl';
import CantCreateCouncilsModal from "./CantCreateCouncilsModal";
import { TRIAL_DAYS } from "../../config";
import { trialDaysLeft } from "../../utils/CBX";
import { moment } from "../../containers/App";
import { Avatar } from "antd";
import { primary, getPrimary } from "../../styles/colors";
import Calendar from 'react-calendar';
import { InputAdornment, Icon, withStyles, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "material-ui";
import { Doughnut, Chart } from "react-chartjs-2";
import { corporationUsers } from "../../queries/corporation";
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
var LineChart = require("react-chartjs-2").Line;



const styles = {
	'input': {
		'&::placeholder': {
			textOverflow: 'ellipsis !important',
			color: '#0000005c'
		}
	},
};

const DEFAULT_OPTIONS = {
	limit: 10,
	offset: 0,
	// orderBy: 'lastConnectionDate',
	orderDirection: 'DESC'
}

const corporationCompanies = gql`
    query corporationCompanies($filters: [FilterInput], $options: OptionsInput){
        corporationCompanies(filters: $filters, options: $options){
            list{
                id
                businessName
                logo
            }
            total
        }
    }
`;


const TopSectionBlocks = ({ translate, company, user, client, ...props }) => {
	const [open, setOpen] = React.useState(false);
	const [users, setUsers] = React.useState(false);
	const [companies, setCompanies] = React.useState(false);
	const [reuniones, setReuniones] = React.useState(false);
	const [state, setState] = React.useState({
		filterText: "",
		filterFecha: ""
	});
	const [usuariosEntidades, setUsuariosEntidades] = React.useState("usuarios");
	const config = React.useContext(ConfigContext);

	const closeCouncilsModal = () => {
		setOpen(false);
	}

	const showCouncilsModal = () => {
		setOpen(true);
	}

	const companyHasBook = () => {
		return company.category === 'society';
	}

	const getTileClassName = ({ date }) => {
		// console.log(moment().format("LLL"))
		if (reuniones.length > 0) {
			// let a = reuniones.find(
			// 	reunion => {
			// 		// console.log("----------------------------------")
			// 		// console.log(moment(reunion.dateStart).format("LLL"))
			// 		// console.log(moment(date).format("LLL"))
			// 		// console.log("----------------------------------")
			// 		return (
			// 			moment(reunion.dateStart).format("LLL") === moment(date).format("LLL")
			// 		)
			// 	}
			// )
			// console.log(a)
		}
		return 'Wed Oct 23 2019 00:00:00 GMT+0200 (hora de verano de Europa central)' === date.toString() ? 'selectedDate' : '';
	}

	const selectDay = (date) => {
		setState({ filterFecha: date })
	}

	const getUsers = async () => {
		const response = await client.query({
			query: corporationUsers,
			variables: {
				options: DEFAULT_OPTIONS, //falta limite
				filter: [{ field: 'fullName', text: state.filterText }],
			}
		});

		if (response.data.corporationUsers.list) {
			setUsers(response.data.corporationUsers.list)
		}
	}

	const getCompanies = async () => {
		const response = await client.query({
			query: corporationCompanies,
			variables: {
				options: DEFAULT_OPTIONS, //falta limite
				// filter: [{ field: 'fullName', text: state.filterText }],
			}
		});

		if (response.data.corporationCompanies.list) {
			setCompanies(response.data.corporationCompanies.list)
		}
	}

	React.useEffect(() => {
		if (usuariosEntidades === "usuarios") {
			getUsers();
		} else {
			getCompanies()
		}
	}, [company.id, state.filterTextUsuarios, usuariosEntidades]);


	const getReuniones = async () => {
		const response = await client.query({
			query: corporationCouncils,
			variables: {
				// options: DEFAULT_OPTIONS, //falta limite
				filters: [{ field: 'dateStart', text: state.filterFecha }],
			}
		});

		let data = ""
		console.log(response)
		if (response.data.corporationConvenedCouncils) {
			data = [...response.data.corporationConvenedCouncils, ...response.data.corporationLiveCouncils]
			setReuniones(data)
		}
	}

	React.useEffect(() => {
		getReuniones()
	}, [company.id, state.filterFecha ]);


	const hasBook = companyHasBook();

	const size = !hasBook ? 4 : 3;
	const blankSize = !hasBook ? 2 : 3;

	return (
		<div style={{ width: "100%" }}>
			<Grid style={{
				padding: "1em",
			}}>
				<Grid style={{
					background: "white",
					boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
					padding: "1em",
					borderRadius: "5px",
					textAlign: "left",
					overflow: "hidden"
				}}>
					<GridItem xs={8} md={8} lg={8} style={{ overflow: "hidden" }}>
						<div style={{ marginBottom: "1em", fontWeight: 'bold', color: "#a09b9e" }}>Reuniones en curso</div>
						<Grid style={{ overflow: "hidden", height: "90%" }}>
							<Scrollbar>
								{reuniones.length === undefined ?
									<LoadingSection />
									:
									reuniones.map((item, index) => {
										return (
											<GridItem key={item.id} style={{ background: index % 2 ? "#edf4fb" : "", padding: "0.7em 1em", }} xs={12} md={12} lg={12}>
												<Grid style={{ alignItems: "center" }}>
													<GridItem xs={1} md={1} lg={1}>
														<Avatar alt="Foto" />
													</GridItem>
													<GridItem xs={4} md={4} lg={4}>
														<b>{item.company.businessName}</b>
													</GridItem>
													<GridItem xs={4} md={4} lg={4}>
														{item.name} - {moment(item.dateStart).subtract(10, 'days').calendar()}
													</GridItem>
													<GridItem xs={3} md={3} lg={3} style={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
														<BasicButton
															text="Convocatoria enviada"
															//  onClick={create}
															textStyle={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: primary, }}
															backgroundColor={{ backgroundColor: "white", borderRadius: "4px" }}
														>
														</BasicButton>
													</GridItem>
												</Grid>
											</GridItem>
										)
									})
								}
							</Scrollbar>
						</Grid>
					</GridItem>
					<GridItem xs={4} md={4} lg={4}>
						<div style={{ padding: "1em", display: 'flex', justifyContent: "center" }}>
							<Calendar
								// onChange={this.onChange}
								value={new Date()}
								minDetail={'month'}
								tileClassName={date => getTileClassName(date)}
								onClickDay={ selectDay}
							/>
						</div>
					</GridItem>
				</Grid>
				<Grid
					style={{
						marginTop: '2em',
						display: "flex",
						justifyContent: 'space-between'
					}}>
					<GridItem xs={4} md={4} lg={4} style={{
						background: "white",
						boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
						padding: "1em",
						borderRadius: "5px"
					}}>
						<div style={{ marginBottom: "1em", fontWeight: 'bold', color: "#a09b9e", textAlign: "left" }}>Estadísticas</div>
						<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1em" }}>
							<div style={{ width: '33%' }}>
								<div style={{ color: "black", marginBottom: "1em" }}>Convocada</div>
								<div style={{ width: '100%', }}>
									<GraficaDoughnut
										porcentaje={'00'}
										color={'#e77153'}
									/>
								</div>
							</div>
							<div style={{ width: '33%' }}>
								<div style={{ color: "black", marginBottom: "1em" }}>Con sesión</div>
								<div style={{ width: '100%', }}>
									<GraficaDoughnut
										porcentaje={'50'}
										color={'#e77153'}
									/>
								</div>
							</div>
							<div style={{ width: '33%' }}>
								<div style={{ color: "black", marginBottom: "1em" }}>Redact. Acta</div>
								<div style={{ width: '100%', }}>
									<GraficaDoughnut
										porcentaje={'75'}
										color={'#85a9ca'}
									/>
								</div>
							</div>
						</div>
						<div>
							<Grafica
								porcentaje={'75'}
								color={'#85a9ca'}
							/>
						</div>
					</GridItem>
					<GridItem xs={7} md={7} lg={7} style={{
						background: "white",
						boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
						padding: "1em",
						borderRadius: "5px"
					}}>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<div style={{ height: "100%", fontWeight: "bold", padding: "0.5em", display: "flex", borderRadius: "5px", boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)", }}>
								<div
									style={{
										cursor: "pointer",
										paddingRight: "0.5em",
										color: usuariosEntidades === 'usuarios' ? getPrimary() : "#9f9a9d",
										borderRight: "1px solid gainsboro"
									}}
									onClick={() => setUsuariosEntidades("usuarios")}
								>
									Usuarios
								</div>
								<div
									style={{
										cursor: "pointer",
										paddingLeft: "0.5em",
										color: usuariosEntidades === 'entidades' ? getPrimary() : "#9f9a9d"
									}}
									onClick={() => setUsuariosEntidades("entidades")}
								>
									Entidades
								</div>
							</div>
							<div style={{ padding: "0.5em", display: "flex", alignItems: "center" }}>
								<BasicButton
									buttonStyle={{ boxShadow: "none", marginRight: "1em", borderRadius: "4px", border: `1px solid ${getPrimary()}`, padding: "0.2em 0.4em", marginTop: "5px", color: getPrimary(), }}
									backgroundColor={{ backgroundColor: "white" }}
									text="Añadir"
								// onClick={addException}
								/>
								<TextInput
									placeholder={"Buscar"}
									adornment={<Icon style={{ background: "#f0f3f6", paddingLeft: "5px", height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>search</Icon>}
									type="text"
									value={state.filterText}
									styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
									disableUnderline={true}
									stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
									onChange={event => {
										setState({
											filterText: event.target.value
										})
									}}
								/>

							</div>
						</div>
						{usuariosEntidades === 'usuarios' ?
							users.length === undefined ?
								<LoadingSection />
								:
								<TablaUsuarios
									users={users}
								/>
							:
							companies.length === undefined ?
								<LoadingSection />
								:
								<TablaCompanies
									companies={companies}
								/>
						}
					</GridItem>
				</Grid>

			</Grid>
		</div>
		// <Grid
		// 	style={{
		// 		width: "90%",
		// 		marginTop: "4vh"
		// 	}}
		// 	spacing={8}
		// >
		// 	<CantCreateCouncilsModal
		// 		open={open}
		// 		requestClose={closeCouncilsModal}
		// 		translate={translate}
		// 	/>
		// 	<GridItem xs={12} md={size} lg={size}>
		// 		<Block
		// 			link={`/company/${company.id}/statutes`}
		// 			icon="gavel"
		// 			id={'edit-statutes-block'}
		// 			text={translate.council_types}
		// 		/>
		// 	</GridItem>
		// 	{hasBook &&
		// 		<GridItem xs={12} md={3} lg={3}>
		// 			<Block
		// 				link={`/company/${company.id}/book`}
		// 				icon="contacts"
		// 				id={'edit-company-block'}
		// 				disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
		// 				disabledOnClick={showCouncilsModal}
		// 				text={translate.book}
		// 			/>
		// 		</GridItem>
		// 	}

		// 	<GridItem xs={12} md={size} lg={size}>
		// 		<Block
		// 			link={`/company/${company.id}/censuses`}
		// 			icon="person"
		// 			id={'edit-censuses-block'}
		// 			text={translate.censuses}
		// 		/>
		// 	</GridItem>

		// 	<GridItem xs={12} md={size} lg={size}>
		// 		<Block
		// 			link={`/company/${company.id}/drafts`}
		// 			icon="class"
		// 			id={'edit-drafts-block'}
		// 			text={translate.drafts}
		// 		/>
		// 	</GridItem>
		// 	<GridItem xs={12} md={blankSize} lg={blankSize}>
		// 	</GridItem>

		// 	<GridItem xs={12} md={size} lg={size}>
		// 		<Block
		// 			link={`/company/${company.id}/council/new`}
		// 			customIcon={<img src={logo} style={{height: '7em', width: 'auto'}} alt="councilbox-logo" />}
		// 			id={'create-council-block'}
		// 			disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
		// 			disabledOnClick={showCouncilsModal}
		// 			text={translate.dashboard_new}
		// 		/>
		// 	</GridItem>
		// 	<GridItem xs={12} md={size} lg={size}>
		// 		<Block
		// 			link={`/company/${company.id}/meeting/new`}
		// 			icon="video_call"
		// 			id={'init-meeting-block'}
		// 			text={translate.start_conference}
		// 		/>
		// 	</GridItem>
		// 	{user.roles === 'devAdmin' && false &&
		// 		<GridItem xs={12} md={size} lg={size}>
		// 			<Block
		// 				link={`/admin`}
		// 				customIcon={<i className="fa fa-user-secret" aria-hidden="true" style={{fontSize: '7em'}}></i>}
		// 				id={'admin-panel'}
		// 				text={'Panel devAdmin'}
		// 			/>
		// 		</GridItem>
		// 	}
		// </Grid>
	);
}


const TablaUsuarios = (users) => {
	return (
		<div style={{ fontSize: "13px" }}>
			<div style={{ display: "flex", justifyContent: "space-between", padding: "1em", }}>
				<div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
					Estado
				</div>
				<div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
					Id
				</div>
				<div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
					Nombre
				</div>
				<div style={{ color: getPrimary(), fontWeight: "bold", overflow: "hidden", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
					Email
				</div>
				<div style={{ color: getPrimary(), fontWeight: "bold", overflow: "hidden", width: 'calc( 100% / 5 )', textAlign: 'left' }}>
					Últ.Conexión
				</div>
			</div>
			<div style={{ height: "300px" }}>
				<Scrollbar>
					{users.users.map(item => {
						return (
							<div
								key={item.id}
								style={{
									display: "flex",
									justifyContent: "space-between",
									padding: "1em"
								}}>
								<Cell text={item.actived} />
								<Cell text={item.id} />
								<Cell text={item.name + " " + item.surname} />
								<Cell text={item.email} />
								<Cell text={moment(item.lastConnectionDate).format("LLL")} />
							</div>

						)
					})}
				</Scrollbar>
			</div>
		</div >
	)
}

const TablaCompanies = (companies) => {
	console.log(companies)
	return (
		<div style={{ fontSize: "13px" }}>
			<div style={{ display: "flex", justifyContent: "space-between", padding: "1em", }}>
				<div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 3 )', textAlign: 'left' }}>

				</div>
				<div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 3 )', textAlign: 'left' }}>
					Id
				</div>
				<div style={{ color: getPrimary(), fontWeight: "bold", width: 'calc( 100% / 3 )', textAlign: 'left' }}>
					Nombre
				</div>
			</div>
			<div style={{ height: "300px" }}>
				<Scrollbar>
					{companies.companies.map(item => {
						return (
							<div
								key={item.id}
								style={{
									display: "flex",
									justifyContent: "space-between",
									padding: "1em"
								}}>
								<CellAvatar width={3} avatar={item.logo} />
								<Cell width={3} text={item.id} />
								<Cell width={3} text={moment(item.businessName).format("LLL")} />
							</div>

						)
					})}
				</Scrollbar>
			</div>
		</div >
	)
}


const GraficaDoughnut = ({ porcentaje, color }) => {

	Chart.pluginService.register({
		afterUpdate: function (chart) {
			if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
				var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
				arc.round = {
					x: (chart.chartArea.left + chart.chartArea.right) / 2,
					y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
					radius: (chart.outerRadius + chart.innerRadius) / 2,
					thickness: (chart.outerRadius - chart.innerRadius) / 2 - 2,
					backgroundColor: arc._model.backgroundColor
				}
			}
		},

		afterDraw: function (chart) {
			if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
				var ctx = chart.chart.ctx;
				var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
				var startAngle = Math.PI / 2 - arc._view.startAngle;
				var endAngle = Math.PI / 2 - arc._view.endAngle;

				ctx.save();
				ctx.translate(arc.round.x, arc.round.y);
				ctx.fillStyle = arc.round.backgroundColor;
				ctx.beginPath();
				ctx.arc(arc.round.radius * Math.sin(startAngle), arc.round.radius * Math.cos(startAngle), arc.round.thickness, 0, 2 * Math.PI);
				ctx.arc(arc.round.radius * Math.sin(endAngle), arc.round.radius * Math.cos(endAngle), arc.round.thickness, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fill();
				ctx.restore();
			}
		},
	});

	Chart.pluginService.register({
		afterUpdate: function (chart) {
			if (chart.config.options.elements.center) {
				var helpers = Chart.helpers;
				var centerConfig = chart.config.options.elements.center;
				var globalConfig = Chart.defaults.global;
				var ctx = chart.chart.ctx;
				var fontStyle = helpers.getValueOrDefault(centerConfig.fontStyle, globalConfig.defaultFontStyle);
				var fontFamily = helpers.getValueOrDefault(centerConfig.fontFamily, globalConfig.defaultFontFamily);
				if (centerConfig.fontSize)
					var fontSize = centerConfig.fontSize;
				else {
					ctx.save();
					var fontSize = helpers.getValueOrDefault(centerConfig.minFontSize, 1);
					var maxFontSize = helpers.getValueOrDefault(centerConfig.maxFontSize, 256);
					var maxText = helpers.getValueOrDefault(centerConfig.maxText, centerConfig.text);
					do {
						ctx.font = helpers.fontString(fontSize, fontStyle, fontFamily);
						var textWidth = ctx.measureText(maxText).width;
						if (textWidth < chart.innerRadius * 2 && fontSize < maxFontSize)
							fontSize += 1;
						else {
							fontSize -= 1;
							break;
						}
					} while (true)
					ctx.restore();
				}
				chart.center = {
					font: helpers.fontString(fontSize, fontStyle, fontFamily),
					fillStyle: helpers.getValueOrDefault(centerConfig.fontColor, globalConfig.defaultFontColor)
				};
			}
		},
		afterDraw: function (chart) {
			if (chart.center) {
				var centerConfig = chart.config.options.elements.center;
				var ctx = chart.chart.ctx;
				ctx.save();
				ctx.font = chart.center.font;
				ctx.fillStyle = chart.center.fillStyle;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
				var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
				ctx.fillText(centerConfig.text, centerX, centerY);
				ctx.restore();
			}
		},
	})

	return (
		<Doughnut
			data={{
				labels: [
					"Red",
					"Gray"
				],
				datasets: [{
					data: [porcentaje, (parseInt(porcentaje) - 100)],
					backgroundColor: [
						color,
						"#491f77"
					],
					hoverBackgroundColor: [
						color,
						"#491f77"
					],
					borderColor: '#cfe7f4',
					borderWidth: 4,
					hoverBorderColor: ["#cfe7f4", '#cfe7f4']
				}]
			}}
			options={{
				legend: {
					display: false
				},
				tooltips: {
					enabled: false
				},
				cutoutPercentage: 60,
				elements: {
					arc: {
						roundedCornersFor: 0
					},
					center: {
						maxText: '100%',
						text: porcentaje + "%",
						fontColor: '#491f77',
						fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
						fontStyle: 'italic',
						minFontSize: 1,
						maxFontSize: 256,
					}
				}
			}}
		/>
	)
}

const Grafica = ({ porcentaje, color }) => {


	return (
		<LineChart
			type={'line'}
			data={{
				labels: ["10", "20", "30", "40", "50"],
				datasets: [
					{
						label: "My First a",
						data: [10, 30, 10, 30, 10],
						backgroundColor: '#a2d6e4a1',
						fillColor: "rgba(220,220,220,0.2)",
						strokeColor: "rgba(220,220,220,1)",
						pointColor: "rgba(220,220,220,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
					},
					{
						label: "My First dataset",
						data: [30, 10, 30, 10, 30],
						backgroundColor: '#e96c5757',
						fillColor: "rgba(220,220,220,0.2)",
						strokeColor: "rgba(220,220,220,1)",
						pointColor: "rgba(220,220,220,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
					},
				]
			}}
			options={{
				legend: {
					display: false
				},
				tooltips: {
					enabled: false
				},
				scales: {
					yAxes: [{
						display: false

					}],
				},
			}}
		/>
	)
}

const CellAvatar = ({ avatar }) => {
	return (
		<div style={{ overflow: "hidden", width: 'calc( 100% / 3 )', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: "10px" }}>
			{avatar ?
				<Avatar src={avatar} alt="Foto" />
				:
				<i style={{ color: 'lightgrey', fontSize: "1.7em", marginLeft: '6px' }} className={'fa fa-building-o'} />
			}
		</div >
	)
}
const Cell = ({ text, avatar, width }) => {

	return (
		<div style={{ overflow: "hidden", width: width ? `calc( 100% / ${width})` : 'calc( 100% / 5 )', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: "10px" }}>
			{text}
		</div>
	)
}

const corporationCouncils = gql`
    query corporationCouncils($filters: [FilterInput]){
        corporationConvenedCouncils(filters: $filters){
            id
            name
            state
            dateStart
            councilType
            prototype
            participants {
                id
            }
            company{
                id
				businessName
				logo
            }
        }

        corporationLiveCouncils(filters: $filters){
            id
            name
            state
            dateStart
            councilType
            prototype
            participants {
                id
            }
            company{
                id
				businessName
				logo
            }
        }
    }
`;

export default withApollo(withStyles(styles)(TopSectionBlocks));
