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
import { Doughnut, Line } from "react-chartjs-2";



const primary = getPrimary();
const secondary = getSecondary();

class Grafica extends React.Component {

	render(){
		const { data } = this.props
		return(
			<Doughnut
												data={data}
												options={{
													legend: {
														display: false
													},
													maintainAspectRatio: false,
													responsive: true,
													cutoutPercentage: 60
												}}
											/>
	)
}

}


export default Grafica;