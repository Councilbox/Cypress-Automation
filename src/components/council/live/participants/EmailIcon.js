import React from "react";
import { Tooltip } from "material-ui";
import { getTranslationReqCode, getEmailIconByReqCode } from "../../../../utils/CBX";
import FontAwesome from "react-fontawesome";

class EmailIcon extends React.PureComponent {
	render() {
		const { color = 'grey', reqCode, number, translate, ratio = 1 } = this.props;
		return _renderIcon(color, reqCode, number, translate, ratio)
	}
}

const styleMainIcon = (color, ratio) => {
	return {
		fontSize: `${1.5 * ratio}em`,
		color
	};
};

const styleImageIcon = (ratio) => {
	return {
		height: `${1.6 * ratio}em`,
		width: "auto"
	}
}

const _renderIcon = (color, reqCode, number, translate, ratio) => {
	let translation = translate[getTranslationReqCode(reqCode)];
	let src = getEmailIconByReqCode(reqCode);
	if (reqCode === 'ALL') {
		return (
			<Tooltip title={translate.all_plural}>
				<div style={{ padding: "0.5em" }}>
					<FontAwesome
						name={"users"}
						style={styleMainIcon(color, ratio)}
					/>
					{(!!number || number === 0) && <span style={{ padding: "0.5em" }}>{number}</span>}
				</div>
			</Tooltip>
		);
	}
	return (
		<Tooltip
			title={translate.all_plural}
		>
			<div style={{ padding: "0.5em" }}>
				<img
					style={styleImageIcon(ratio)}
					src={src}
					alt={translation}
				/>
				{(!!number || number === 0) && <span style={{ padding: "0.5em" }}>{number}</span>}
			</div>
		</Tooltip>
	);
}

export default EmailIcon;
