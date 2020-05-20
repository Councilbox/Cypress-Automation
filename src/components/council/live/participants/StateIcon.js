import React from "react";
import FontAwesome from "react-fontawesome";
import { PARTICIPANT_STATES } from "../../../../constants";
import { Icon } from "../../../../displayComponents";
import { Tooltip } from "material-ui";

const StateIcon = ({
	color = "grey",
	state,
	number,
	translate,
	ratio = 1,
	hideTooltip = false
}) => {
	return _renderIcon(color, state, number, translate, ratio, hideTooltip);

}

const styleMainIcon = (color, ratio) => {
	return {
		fontSize: `${1.5 * ratio}em`,
		color
	};
};
const styleSubIcon = (color, ratio) => {
	return {
		marginLeft: `${-0.3 * ratio}em`,
		marginTop:  `${0.4 * ratio}em`,
		fontSize: `${1 * ratio}em`,
		color
	};
};

const _renderIcon = (color, state, number, translate, ratio, hideTooltip) => {
	switch (state) {
		case "ALL":
			return (
				<Tooltip disableHoverListener={hideTooltip} title={translate.all_plural}>
					<div style={{ padding: "0.5em" }}>
						<FontAwesome
							name={"users"}
							style={styleMainIcon(color, ratio)}
						/>
						{(!!number || number === 0) && <span style={{padding:"1em"}}>{number}</span>}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_STATES.NO_PARTICIPATE:
			return (
				<Tooltip disableHoverListener={hideTooltip} title={translate.no_participate}>
					<div style={{ padding: "0.5em", display: 'flex' }}>	
							<FontAwesome
								name={"user-o"}
								style={styleMainIcon(color, ratio)}
							/>

							<FontAwesome
								name={"times"}
								style={styleSubIcon(color, ratio)}
							/>
						
						{(!!number || number === 0) && <span style={{paddingLeft:"1em"}}>{number}</span>}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_STATES.REMOTE:
			return (
				<Tooltip disableHoverListener={hideTooltip} title={translate.customer_initial}>
					<div style={{ padding: "0.5em" }}>
						<FontAwesome
							name={"globe"}
							style={styleMainIcon(color, ratio)}
						/>
						{(!!number || number === 0) && <span style={{padding:"1em"}}>{number}</span>}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_STATES.PHYSICALLY_PRESENT:
			return (
				<Tooltip disableHoverListener={hideTooltip} title={translate.customer_present}>
					<div
						style={{
							// display: "flex",
							alignItems: "center",
							padding: "0.51em"
						}}
					>
						<Icon
							className="material-icons"
							style={{...styleMainIcon(color, ratio), paddingTop: '0.1em'}}
						>
							face
						</Icon>
						{(!!number || number === 0) && <span style={{padding:"1em"}}>{number}</span>}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE:
			return (
				<Tooltip disableHoverListener={hideTooltip} title={translate.physically_present_with_remote_vote}>
					<div
						style={{
							// display: "flex",
							alignItems: "center",
							padding: "0.51em"
						}}
					>
						<Icon
							className="material-icons"
							style={{...styleMainIcon(color, ratio), paddingTop: '0.1em'}}
						>
							face
						</Icon>
						<FontAwesome
							name={"mobile"}
							style={styleSubIcon(color, ratio)}
						/>
						{(!!number || number === 0) && <span style={{padding:"1em"}}>{number}</span>}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_STATES.DELEGATED:
			return (
				<Tooltip disableHoverListener={hideTooltip} title={translate.customer_delegated}>
					<div style={{ padding: "0.5em" }}>
						<FontAwesome
							name={"user"}
							style={styleMainIcon(color, ratio)}
						/>
						<FontAwesome
							name={"user"}
							style={styleSubIcon(color, ratio)}
						/>
						{(!!number || number === 0) && <span style={{padding:"1em"}}>{number}</span>}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_STATES.REPRESENTATED:
			return (
				<Tooltip disableHoverListener={hideTooltip} title={translate.customer_representated}>
					<div style={{ padding: "0.5em" }}>
						<FontAwesome
							name={"user-o"}
							style={styleMainIcon(color, ratio)}
						/>
						<FontAwesome
							name={"user"}
							style={styleSubIcon(color, ratio)}
						/>
						{(!!number || number === 0) && <span style={{padding:"1em"}}>{number}</span>}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_STATES.LEFT:
			return (
				<Tooltip disableHoverListener={hideTooltip} title={translate.left_the_council}>
					<div style={{ padding: "0.5em" }}>
						<i className="fa fa-sign-out" aria-hidden="true" style={styleMainIcon(color, ratio)}></i>
						{(!!number || number === 0) && <span style={{padding:"1em"}}>{number}</span>}
					</div>
				</Tooltip>
			);
		default:
			return (
				<Tooltip disableHoverListener={hideTooltip} title={translate.not_confirmed_assistance}>
					<div style={{ padding: "0.5em" }}>
						<FontAwesome
							name={"question"}
							style={styleMainIcon(color, ratio)}
						/>
						{(!!number || number === 0) && <span style={{padding:"1em"}}>{number}</span>}
					</div>
				</Tooltip>
			);
	}
};

export default StateIcon;
