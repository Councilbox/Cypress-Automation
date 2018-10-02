import React from "react";
import { CollapsibleSection, Icon } from "../../../displayComponents";
import { darkGrey } from "../../../styles/colors";
import { LIVE_COLLAPSIBLE_HEIGHT } from "../../../styles/constants";
import VotingsTable from "./voting/VotingsTable";
import { canEditPresentVotings, agendaVotingsOpened } from '../../../utils/CBX';
import ManualVotingsMenu from './voting/ManualVotingsMenu';
import { getSecondary } from '../../../styles/colors';

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
						translate={this.props.translate}
						agenda={this.props.agenda}
					/>
				}
				<VotingsTable
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
				onKeyUp={this.handleKeyPress}
			>
				{/* <CollapsibleSection
					trigger={this._button}
					collapse={this._section}
					open={false}
				/> */}
				{this._section()}
			</div>
		);
	}
}

/*
{agendaVotingsOpened(this.props.agenda)?
					this._section()
	:
		<div style={{width: '100%', paddingTop: '5em', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
			<i class="fa fa-lock" aria-hidden="true" style={{fontSize: '2em', marginRight: '0.6em', color: getSecondary()}}></i>
			{this.props.translate.agenda_votations_closed}
		</div>
	}
*/

export default Votings;
