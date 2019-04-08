import React from "react";
import {
	Block, Grid, GridItem, LoadingSection, AlertConfirm, Link, BasicButton
} from "../../displayComponents";
import logo from '../../assets/img/logo-icono.png';
import { ConfigContext } from '../../containers/AppControl';
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
import SinSesion from "./SinSesion"
import { Tooltip } from "material-ui";

const TopSectionBlocks = ({ translate, company, user }) => {
	const [open, setOpen] = React.useState(false);
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

	const hasBook = companyHasBook();

	const size = !hasBook? 4 : 3;
	const blankSize = !hasBook? 2 : 3;

	return(
		<Grid
			style={{
				width: "90%",
				marginTop: "4vh"
			}}
			spacing={8}
		>
			<CantCreateCouncilsModal
				open={open}
				requestClose={closeCouncilsModal}
				translate={translate}
			/>
			<GridItem xs={12} md={size} lg={size}>
				<Block
					link={`/company/${company.id}/statutes`}
					icon="gavel"
					id={'edit-statutes-block'}
					text={translate.council_types}
				/>
			</GridItem>
			{hasBook &&
				<GridItem xs={12} md={3} lg={3}>
					<Block
						link={`/company/${company.id}/book`}
						icon="contacts"
						id={'edit-company-block'}
						disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
						disabledOnClick={showCouncilsModal}
						text={translate.book}
					/>
				</GridItem>
			}

			<GridItem xs={12} md={size} lg={size}>
				<Block
					link={`/company/${company.id}/censuses`}
					icon="person"
					id={'edit-censuses-block'}
					text={translate.censuses}
				/>
			</GridItem>

			<GridItem xs={12} md={size} lg={size}>
				<Block
					link={`/company/${company.id}/drafts`}
					icon="class"
					id={'edit-drafts-block'}
					text={translate.drafts}
				/>
			</GridItem>
			<GridItem xs={12} md={blankSize} lg={blankSize}>
			</GridItem>

			<GridItem xs={12} md={size} lg={size}>
				<Block
					link={`/company/${company.id}/council/new`}
					customIcon={<img src={logo} style={{height: '7em', width: 'auto'}} alt="councilbox-logo" />}
					id={'create-council-block'}
					disabled={company.demo === 1 && trialDaysLeft(company, moment, TRIAL_DAYS) <= 0}
					disabledOnClick={showCouncilsModal}
					text={translate.dashboard_new}
				/>
			</GridItem>
			<GridItem xs={12} md={size} lg={size}>
				<Block
					link={`/company/${company.id}/meeting/new`}
					icon="video_call"
					id={'init-meeting-block'}
					text={translate.start_conference}
				/>
			</GridItem>
			{user.roles === 'devAdmin' && false &&
				<GridItem xs={12} md={size} lg={size}>
					<Block
						link={`/admin`}
						customIcon={<i className="fa fa-user-secret" aria-hidden="true" style={{fontSize: '7em'}}></i>}
						id={'admin-panel'}
						text={'Panel devAdmin'}
					/>
				</GridItem>
			}
		</Grid>
	);
}


export default TopSectionBlocks;

}


function layoutPositivo(layout) {
	let aux = [];
	layout.forEach(element => {
		let datoX = element.x;
		if (Math.sign(element.x) === -1) {
			datoX = 0
		}
		aux.push({ w: element.w, h: element.h, x: Math.round(datoX), y: element.y, i: element.i, moved: element.moved, static: element.static })
	});
	return aux;
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
				state: [5, 10, 20, 30, 40, 60, 70],
				companyId: props.company.id,
				isMeeting: false,
				active: 1
			},
			errorPolicy: 'all'
		})
	})
)(TopSectionBlocks);

	// CANCELED: -1,
	// DRAFT: 0,
	// PRECONVENE: 3,
	// SAVED: 5,
	// PREPARING: 10,
	// ROOM_OPENED: 20,
	// APPROVING_ACT_DRAFT: 30,
	// FINISHED: 40,
	// APPROVED: 60,
	// FINAL_ACT_SENT: 70,
	// NOT_CELEBRATED: 80,
	// FINISHED_WITHOUT_ACT: 90,
	// MEETING_FINISHED: 100
