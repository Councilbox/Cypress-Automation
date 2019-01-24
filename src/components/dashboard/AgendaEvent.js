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

		return (
			<div>
				<Tooltip title={event.title}><div onClick={this.selectEvent} style={{ cursor: "pointer" }}>{event.title}</div></Tooltip>
				<AlertConfirm
					requestClose={this.closeModal}
					open={this.state.modal}
					bodyText={
						<CouncilDetails council={event} translate={translate} inIndex={true}/>
					}
					title={translate.meeting_header}
					widthModal={{width:"75%"}}
				/>
			</div>
		);
	}
}



export default withTranslations()(AgendaEvent);