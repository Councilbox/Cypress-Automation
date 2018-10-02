import React, { Component } from "react";
import {
	CollapsibleSection,
	Icon
} from "../../../displayComponents";
import { darkGrey } from "../../../styles/colors";
import { LIVE_COLLAPSIBLE_HEIGHT } from "../../../styles/constants";
import CommentsTable from "./comments/CommentsTable";


class CommentsSection extends Component {
	state = {
		open: false
	};

	_button = () => {
		const { translate, council } = this.props;

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
						assignment
					</Icon>
					<span
						style={{
							marginLeft: "0.7em",
							color: darkGrey,
							fontWeight: "700"
						}}
					>
						{council.statute.existsAct
							? translate.act_comments
							: translate.council_comments}
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
		return(
			<CommentsTable
				translate={this.props.translate}
				agenda={this.props.agenda}
			/>
		)
	};

	render() {
		return (
			<div
				style={{
					width: "100%",
					//backgroundColor: "lightgrey",
					position: "relative"
				}}
			>
				{/* <CollapsibleSection
					trigger={this._button}
					collapse={this._section}
				/> */}
				<div>
					{this._section()}
				</div>
			</div>
		);
	}
}

export default CommentsSection;
