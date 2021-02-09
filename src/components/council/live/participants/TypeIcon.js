import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Tooltip } from 'material-ui';
import { PARTICIPANT_TYPE } from '../../../../constants';

const styleMainIcon = (color, ratio) => ({
		fontSize: `${1.5 * ratio}em`,
		color
	});

const styleSubIcon = (color, ratio) => ({
		marginLeft: `${-0.3 * ratio}em`,
		fontSize: `${1 * ratio}em`,
		color
	});

const _renderIcon = (color, type, number, translate, ratio) => {
	switch (type) {
		case 'ALL':
			return (
				<Tooltip title={translate.all_plural}>
					<div style={{ padding: '0.5em' }}>
						<FontAwesome
							name={'users'}
							style={styleMainIcon(color, ratio)}
						/>
						{(!!number || number === 0) && <span style={{ padding: '0.5em' }}>{number}</span>}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_TYPE.PARTICIPANT:
		case PARTICIPANT_TYPE.REPRESENTATED:
			return (
				<Tooltip title={translate.participant}>
					<div style={{ padding: '0.5em' }}>
						<FontAwesome
							name={'user'}
							style={styleMainIcon(color, ratio)}
						/>
						{(!!number || number === 0) && <span style={{ padding: '0.5em' }}>{number}</span>}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_TYPE.REPRESENTATIVE:
			return (
				<Tooltip title={translate.representative}>
					<div style={{ padding: '0.5em' }}>
						<FontAwesome
							name={'user-o'}
							style={styleMainIcon(color, ratio)}
						/>
						{(!!number || number === 0) && <span style={{ padding: '0.5em' }}>{number}</span>}
					</div>
				</Tooltip>
			);
		case PARTICIPANT_TYPE.GUEST:
			return (
				<Tooltip title={translate.guest}>
					<div style={{ display: 'flex', alignItems: 'center', marginTop: '3px', padding: '0.5em' }}>
						<FontAwesome
							name={'user-o'}
							style={styleMainIcon(color, ratio)}
						/>
						<FontAwesome
							name={'eye'}
							style={styleSubIcon(color, ratio)}
						/>
						{(!!number || number === 0) && <span style={{ padding: '0.5em' }}>{number}</span>}
					</div>
				</Tooltip>
			);
		default:
			return 'NO_ICON_FOR_THIS_TYPE';
	}
};

class TypeIcon extends React.PureComponent {
	render() {
		const { color = 'grey', type, number, translate, ratio = 1 } = this.props;
		return _renderIcon(color, type, number, translate, ratio);
	}
}


export default TypeIcon;
