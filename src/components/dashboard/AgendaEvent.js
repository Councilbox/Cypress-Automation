import React from "react";
import { AlertConfirm } from "../../displayComponents";
import withTranslations from "../../HOCs/withTranslations";
import CouncilDetails from '../../components/council/display/CouncilDetails'
import { Tooltip } from "material-ui";



class AgendaEvent extends React.Component {

	state = {
		open: false,
		modal: false,
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
		const { event, translate } = this.props;
		const objectNames = { 5: "Convocadas", 10: "Convocadas", 20: "En celebración", 30: "En celebración" } //TRADUCCION
		const objectClass = { 5: "fa fa-calendar-o", 10: "fa fa-calendar-o", 20: "fa fa-users", 30: "fa fa-users" }
		return (
			<div>
				<div style={{ display: "flex", cursor: "pointer", }} onClick={this.selectEvent}>
					<Tooltip title={objectNames[event.state]}>
						<div style={{ marginRight: "7px" }}><i className={objectClass[event.state]}></i></div>
					</Tooltip>
					<Tooltip title={event.title}>
						<div style={{ width: "100%", margin: "0 auto", }}>
							{event.title}
						</div>
					</Tooltip>
				</div>
				<AlertConfirm
					requestClose={this.closeModal}
					open={this.state.modal}
					bodyText={
						<CouncilDetails council={event} translate={translate} inIndex={true} />
					}
					title={translate.meeting_header}
					widthModal={{ width: "50%" }}
				/>
			</div>
		);
	}
}



export default withTranslations()(AgendaEvent);