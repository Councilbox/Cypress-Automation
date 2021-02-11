import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import withTranslations from '../../HOCs/withTranslations';

const GraficaEstadisiticas = ({ color, translate }) => {
	const data = {
		labels: [translate.companies_calendar, translate.companies_live, translate.companies_writing, translate.act_book],
		datasets: [{
			data: [65, 59, 80, 81],
			backgroundColor: [
				color,
				'#491f77',
				'#e77152',
				'rgb(125, 33, 128)',
			],
			hoverBackgroundColor: [
				color,
				'#491f77',
				'#e77152',
				'rgb(125, 33, 128)',
			],
			borderColor: '#cfe7f4',
			borderWidth: 4,
			hoverBorderColor: ['#cfe7f4', '#cfe7f4']
		}]
	};

	const options = {
		maintainAspectRatio: false,
		responsive: false,
		legend: {
			position: 'left',
			labels: {
				boxWidth: 10
			}
		}
	};

	return (
		<Doughnut data={data} options={options} />
	);
};


export default withTranslations()(GraficaEstadisiticas);
