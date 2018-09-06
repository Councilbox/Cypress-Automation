import React from "react";
import { Tooltip } from "material-ui";
import { getTranslationReqCode, getEmailIconByReqCode } from "../../../../utils/CBX";


class EmailIcon extends React.PureComponent {
	render() {
		const { color = 'grey', reqCode, number, translate, ratio = 1 } = this.props;
		return _renderIcon(color, reqCode, number, translate, ratio)
	}
}

const styleImageIcon = (ratio) => {
	return {
		height: `${2.1*ratio}em`,
		width: "auto"
	}
}

const _renderIcon = (color, reqCode, number, translate, ratio) => {
	let translation = translate[getTranslationReqCode(reqCode)];
	let src = getEmailIconByReqCode(reqCode);
	return (
		<Tooltip
			title={translation}
		>
			<img
				style={styleImageIcon(ratio)}
				src={src}
				alt={translation}
			/>
			{number}
		</Tooltip>
	);
}

export default EmailIcon;
