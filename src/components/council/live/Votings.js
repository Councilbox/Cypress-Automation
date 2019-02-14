import React from "react";
import { Icon } from "../../../displayComponents";
import { darkGrey } from "../../../styles/colors";
import { LIVE_COLLAPSIBLE_HEIGHT } from "../../../styles/constants";
import VotingsTableFiltersContainer from "./voting/VotingsTableFiltersContainer";
import { canEditPresentVotings, agendaVotingsOpened } from '../../../utils/CBX';
import ManualVotingsMenu from './voting/ManualVotingsMenu';

class Votings extends React.Component {
	state = {
		open: false
	};

	_button = () => {
		return (
			<div
				style={{
					height: LIVE_COLLAPSIBLE_HEIGHT,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center"
				}}
			>
				<div
					style={{
						width: "25%",
						height: LIVE_COLLAPSIBLE_HEIGHT,
						display: "flex",
						alignItems: "center",
						paddingLeft: "1.5em"
					}}
				>
					<Icon className="material-icons" style={{ color: "grey" }}>
						thumbs_up_down
					</Icon>
					<span
						style={{
							marginLeft: "0.7em",
							color: darkGrey,
							fontWeight: "700"
						}}
					>
						{this.props.translate.voting}
					</span>
					{/*<span style={{marginLeft: '0.6em', color: darkGrey, fontSize: '0.7em'}}>
                        (Alt + V)
                    </span>*/}
				</div>
				<div
					style={{
						width: "25%",
						display: "flex",
						justifyContent: "flex-end",
						paddingRight: "2em"
					}}
				>
					<Icon className="material-icons" style={{ color: "grey" }}>
						keyboard_arrow_down
					</Icon>
				</div>
			</div>
		);
	};

	toggle = () => {
		this.setState({ open: !this.state.open });
	};

	_section = () => {

		return(
			<div style={{backgroundColor: 'white', paddingTop: '1em'}}>
				{canEditPresentVotings(this.props.agenda) && agendaVotingsOpened(this.props.agenda) &&
					<ManualVotingsMenu
						refetch={this.props.refetch}
						changeEditedVotings={this.props.changeEditedVotings}
						editedVotings={this.props.editedVotings}
						translate={this.props.translate}
						agenda={this.props.agenda}
					/>
				}
				<VotingsTableFiltersContainer
					recount={this.props.recount}
					translate={this.props.translate}
					agenda={this.props.agenda}
				/>
			</div>
		)
	};

	render() {
		return (
			<div
				style={{
					width: "100%",
					position: "relative"
				}}
				//onKeyUp={this.handleKeyPress}
			>
				{this._section()}
			</div>
		);
	}
}

export default Votings;
