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
import { Paper } from 'material-ui';
import gql from 'graphql-tag';


const primary = getPrimary();
const secondary = getSecondary();

class TopSectionBlocks extends React.Component {

	state = {
		open: false,
		modal: false,
		datosModal: false,
		reunion: null
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
		console.log(" ==== selectEvent ===");
		this.setState({
			modal: true,
			datosModal: event //mirar para que sea la info este en modal - null y dato
		})
	}

	showReunionDetails = reunion => {
		console.log(reunion);
        this.setState({
            reunion
        });
    }

    closeReunionDetails = () => {
        this.setState({
            reunion: null
        });
	}


	closeModal = () => {
        this.setState({
            modal: false
        });
    }

	_renderBodyModal = () => {
		let datosEvento = this.state.datosModal;
		let { translate } = this.props;
		return (
			<div style={{ height: "350px" }}>
				<div>{translate.name + ": " + datosEvento.title}</div>
				<div>{translate.date_real_start + ": " + convertDate(datosEvento.start)}</div>
				<div>{"Hora" + ": " + new Date(datosEvento.start).getHours() + ":" + addZero(new Date(datosEvento.start).getMinutes())}</div> {/*TRADUCCION*/}
			</div>
		);
	};
	_renderBody = () => {
		let datosEvento = this.state.datosModal;
		console.log(datosEvento);
		/*Esto no se k hace*/ 
        // if(!this.props.data.loading && this.props.data.councils.length === 0){
        //     return <span>{this.props.translate.no_celebrated_councils}</span>
        // }

        // if(!this.props.data.councils){
        //     return <LoadingSection />;
        // }

        if(this.state.council){
            return <CouncilDetails council={this.state.council} translate={this.props.translate} />;
        }

        return (
            <div>
                {/* {this.props.data.councils.map(council => ( */}
                    <Paper
                        key={`loadFromCouncil_${datosEvento.id}`}
                        style={{
                            width: '100%',
                            marginBottom: '0.6em',
                            padding: '0.6em',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div className="truncate" style={{width: '70%'}}>
                            {datosEvento.title}
                        </div>
                        <BasicButton
                            text={this.props.translate.read_details}
                            type="flat"
                            textStyle={{color: getSecondary(), fontWeight: '700'}}
                            onClick={event => {
                                event.stopPropagation();
                                this.showReunionDetails(datosEvento)
                            }}
                        />
                    </Paper>
                {/* ))} */}
            </div>
        )
    }

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
									eventPropGetter={
										(event, start, end, isSelected) => {
											return {
												className: 'rbc-cell-' + event.state,
											};
										}
									}
								>
								</BigCalendar>
							)}
						{/* crear modal para mostrar bien todo */}
						{/* <AlertConfirm
							requestClose={() => this.setState({ modal: false })}
							open={this.state.modal}
							title={"Reunion"}
							// title={this.state.datosModal.title}
							// acceptAction={this.createCensus}
							// buttonAccept={translate.accept}
							// buttonCancel={translate.cancel}
							bodyText={this._renderBodyModal()}
						/> */}
						<AlertConfirm
							requestClose={!!this.state.council ? this.closeCouncilDetails : this.closeModal}
							open={this.state.modal}
							hideAccept={!!this.state.council}
							acceptAction={this.changeCensus}
							buttonAccept={translate.accept}
							buttonCancel={!!this.state.council ? translate.back : translate.cancel}
							bodyText={this._renderBody()}
							title={'Cargar una reunión pasada'}
						/>
					</div>
				</GridItem>
			</Grid >

		);
	}
}

function convertDate(inputFormat) {
	function pad(s) { return (s < 10) ? '0' + s : s; }
	var d = new Date(inputFormat);
	return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
}
function addZero(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
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
				state: [5, 10, 20],
				companyId: props.company.id,
				isMeeting: false,
				active: 1
			},
			errorPolicy: 'all'
		})
	})
)(TopSectionBlocks);