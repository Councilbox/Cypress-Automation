import React from "react";
import FontAwesome from "react-fontawesome";
import { PARTICIPANT_STATES } from "../../../../constants";
import { Icon } from "../../../../displayComponents";
import { Tooltip } from "material-ui";

class StateIcon extends React.PureComponent {
	render() {
		const {
			color = "grey",
			state,
			number,
			translate,
			ratio = 1
		} = this.props;
		return _renderIcon(color, state, number, translate, ratio);
	}
}

const styleMainIcon = (color, ratio) => {
	return {
		fontSize: `${1.5 * ratio}em`,
		color
	};
};
const styleSubIcon = (color, ratio) => {
	return {
		marginLeft: `${-0.5 * ratio}em`,
		fontSize: `${1 * ratio}em`,
		color
	};
};

const _renderIcon = (color, state, number, translate, ratio) => {
	switch (state) {
		case "ALL":
			return (
				<Tooltip title={translate.all_plural}>
					<div style={{ padding: "0.5em" }}>
						<FontAwesome
							name={"users"}
							style={styleMainIcon(color, ratio)}
						/>
						{number && <span style={{padding:"1em"}}>{number}</span>}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_STATES.NO_PARTICIPATE:
			return (
				<Tooltip title={translate.no_participate}>
					<div style={{ padding: "0.5em" }}>
						<FontAwesome
							name={"user-o"}
							style={styleMainIcon(color, ratio)}
						/>
						<FontAwesome
							name={"times"}
							style={styleSubIcon(color, ratio)}
						/>
						{number && <span style={{padding:"1em"}}>{number}</span>}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_STATES.REMOTE:
			return (
				<Tooltip title={translate.customer_initial}>
					<div style={{ padding: "0.5em" }}>
						<FontAwesome
							name={"globe"}
							style={styleMainIcon(color, ratio)}
						/>
						{number && <span style={{padding:"1em"}}>{number}</span>}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_STATES.PHYSICALLY_PRESENT:
			return (
				<Tooltip title={translate.customer_present}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							padding: "0.51em"
						}}
					>
						<Icon
							className="material-icons"
							style={styleMainIcon(color, ratio)}
						>
							face
						</Icon>
						{number && <span style={{padding:"1em"}}>{number}</span>}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE:
			return (
				<Tooltip title={translate.physically_present_with_remote_vote}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							padding: "0.51em"
						}}
					>
						<Icon
							className="material-icons"
							style={styleMainIcon(color, ratio)}
						>
							face
						</Icon>
						<FontAwesome
							name={"mobile"}
							style={styleSubIcon(color, ratio)}
						/>
						{number && <span style={{padding:"1em"}}>{number}</span>}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_STATES.DELEGATED:
			return (
				<Tooltip title={translate.customer_delegated}>
					<div style={{ padding: "0.5em" }}>
						<FontAwesome
							name={"user"}
							style={styleMainIcon(color, ratio)}
						/>
						<FontAwesome
							name={"user"}
							style={styleSubIcon(color, ratio)}
						/>
						{number && <span style={{padding:"1em"}}>{number}</span>}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_STATES.REPRESENTATED:
			return (
				<Tooltip title={translate.customer_representated}>
					<div style={{ padding: "0.5em" }}>
						<FontAwesome
							name={"user-o"}
							style={styleMainIcon(color, ratio)}
						/>
						<FontAwesome
							name={"user"}
							style={styleSubIcon(color, ratio)}
						/>
						{number && <span style={{padding:"1em"}}>{number}</span>}
					</div>
				</Tooltip>
			);

		default:
			return (
				<Tooltip title={translate.not_confirmed_assistance}>
					<div style={{ padding: "0.5em" }}>
						<FontAwesome
							name={"question"}
							style={styleMainIcon(color, ratio)}
						/>
						{number && <span style={{padding:"1em"}}>{number}</span>}
					</div>
				</Tooltip>
			);
	}
};

export default StateIcon;
