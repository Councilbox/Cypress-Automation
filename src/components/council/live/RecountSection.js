import React from "react";
import { Icon, CollapsibleSection } from "../../../displayComponents";
import { darkGrey } from "../../../styles/colors";
//import VotesTable from "./VotesTable";
import AgendaRecount from '../agendas/AgendaRecount';
import { LIVE_COLLAPSIBLE_HEIGHT } from "../../../styles/constants";
import { canEditPresentVotings } from '../../../utils/CBX';

class RecountSection extends React.Component {
	state = {
		open: false
	};

	_button = () => {
		const { translate } = this.props;

		return (
			<div
				style={{
					height: LIVE_COLLAPSIBLE_HEIGHT,
					display: "flex",
					backgroundColor: 'lightgrey',
					justifyContent: "space-between",
					alignItems: "center"
				}}
			>
				<div
					style={{
						width: "25%",
						height: "3em",
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
						{translate.recount}
					</span>
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

	_section = () => {
/* 		if (this.props.data.loading) {
			return <LoadingSection />;
		} */

		const { translate, council, agenda } = this.props;

		return (
			<div style={{backgroundColor: 'white'}}>
				<AgendaRecount
					agenda={agenda}
					council={council}
					translate={translate}
					editable={canEditPresentVotings(agenda) && false}
					refetch={this.props.refetch}
					recount={this.props.recount}
					majorityTypes={this.props.majorityTypes}
				/>
			</div>
		);
	};

	render() {
		return (
			<div
				style={{
					width: "100%",
					backgroundColor: 'white',
					position: "relative"
				}}
			>
				{/* <CollapsibleSection trigger={this._button} collapse={this._section} /> */}
				{this._section()}
			</div>
		);
	}
}

export default RecountSection;