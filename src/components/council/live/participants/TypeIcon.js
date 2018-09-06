import React from "react";
import FontAwesome from "react-fontawesome";
import { PARTICIPANT_TYPE } from "../../../../constants";
import { Tooltip } from "material-ui";

class TypeIcon extends React.PureComponent {
	render() {
		const { color = 'grey', type, number, translate, ratio = 1 } = this.props;
		return _renderIcon(color, type, number, translate, ratio)
	}
}

const styleMainIcon = (color, ratio) => {
	return {
		margin: `${0.5 * ratio}em`,
		fontSize: `${1.5 * ratio}em`,
		color
	}
}
const styleSubIcon = (color, ratio) => {
	return {
		marginLeft: `${-1 * ratio}em`,
		marginRight: `${0.5 * ratio}em`,
		fontSize: `${1 * ratio}em`,
		color
	}
}

const _renderIcon = (color, type, number, translate, ratio) => {
	switch (type) {
		case 'ALL':
			return (
				<Tooltip title={translate.all_plural}>
					<div>
						<FontAwesome
							name={"users"}
							style={styleMainIcon(color, ratio)}
						/>
						{number}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_TYPE.PARTICIPANT:
			return (
				<Tooltip title={translate.participant}>
					<div>
						<FontAwesome
							name={"user"}
							style={styleMainIcon(color, ratio)}
						/>
						{number}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_TYPE.REPRESENTATIVE:
			return (
				<Tooltip title={translate.representative}>
					<div>
						<FontAwesome
							name={"user-o"}
							style={styleMainIcon(color, ratio)}
						/>
						{number}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_TYPE.GUEST:
			return (
				<Tooltip title={translate.guest}>
					<div style={{ display: "flex", alignItems: "center", marginTop: '3px' }}>
						<FontAwesome
							name={"user-o"}
							style={styleMainIcon(color, ratio)}
						/>
						<FontAwesome
							name={"eye"}
							style={styleSubIcon(color, ratio)}
						/>
						{number}
					</div>
				</Tooltip>
			);
		default:
			return 'NO_ICON_FOR_THIS_TYPE';
	}
}

export default TypeIcon;
