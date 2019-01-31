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
import { Doughnut, Chart } from "react-chartjs-2";



const primary = getPrimary();
const secondary = getSecondary();

class Grafica extends React.Component {

	render() {
		const { translate, info, totalReuniones, textCentral, stylesGrafica } = this.props;
		const mesesArray = translate.datepicker_months.split(",");

		let originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
		Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
			draw: function () {
				originalDoughnutDraw.apply(this, arguments);

				let chart = this.chart;
				let width = chart.chart.width,
					height = chart.chart.height,
					ctx = chart.chart.ctx;
				ctx.fillStyle = "rgba(0, 0, 0, 0.65)";

				let fontSize = "14px";
				ctx.font = "sans-serif";
				ctx.textBaseline = "middle";

				let sum = textCentral;

				let text = sum,
					textX = Math.round((width - ctx.measureText(text).width) / 2),
					textY = height / 2;

				ctx.fillText(text, textX, textY);
			}
		});


		let data = {
			labels: mesesArray,
			datasets: [{
				data: info,
				backgroundColor: [
					'#FF6384',
					'#36A2EB',
					'#FFCE56',
					'#e3dada',
					'#ff0000',
					'#ff6600',
					'#e0e010',
					'#34ba34',
					'#3366ff',
					'#800080',
					'#999999',
					'#ff99cc',
				],
				hoverBackgroundColor: [
					'#FF6384',
					'#36A2EB',
					'#FFCE56',
					'#e3dada',
					'#ff0000',
					'#ff6600',
					'#e0e010',
					'#34ba34',
					'#3366ff',
					'#800080',
					'#999999',
					'#ff99cc',
				],
			}],
			text: '23%'
		};
		if (totalReuniones) {
			return (
				<div style={{ width: "90%", height: '220px', ...stylesGrafica }}>{/*width: "170px"*/}
					<Doughnut
						data={data}
						width={170}
						height={180}
						options={{
							legend: {
								display: false
							},
							maintainAspectRatio: false,
							responsive: true,
							cutoutPercentage: 60
						}}
					/>
				</div >
			)
		} else {
			return (
				<div style={{ display: 'inline-flex', alignItems: 'center', justifontent: 'center', height: '220px' }}>
					<div>Aun no hay reuniones</div>
				</div>
			)
		}
	}

}


export default Grafica;