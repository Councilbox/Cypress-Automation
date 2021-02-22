import React from 'react';
import { Doughnut, Chart } from 'react-chartjs-2';
import 'react-big-calendar/lib/css/react-big-calendar.css';

class Grafica extends React.Component {
	render() {
		const {
			translate, info, totalReuniones, textCentral, stylesGrafica
		} = this.props;
		const mesesArray = translate.datepicker_months.split(',');

		const originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
		Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
			draw() {
				// eslint-disable-next-line prefer-rest-params
				originalDoughnutDraw.apply(this, arguments);

				const { chart } = this;
				const { width, height, ctx } = chart.chart;
				ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
				ctx.font = 'sans-serif';
				ctx.textBaseline = 'middle';

				const sum = textCentral;

				const text = sum;
				const textX = Math.round((width - ctx.measureText(text).width) / 2);
				const textY = height / 2;

				ctx.fillText(text, textX, textY);
			}
		});


		const data = {
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
				<div style={{ width: '100%', height: '220px', ...stylesGrafica }}>{/* width: "170px" */}
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
			);
		}
		return (
			<div style={{
				display: 'inline-flex', alignItems: 'center', justifontent: 'center', height: '220px'
			}}>
				<div>Aun no hay reuniones</div>
			</div>
		);
	}
}


export default Grafica;
