import React from 'react';
import { TextInput } from './index';
import * as CBX from '../utils/CBX';

const MajorityInput = ({
	type,
	value,
	divider,
	onChange,
	onChangeDivider,
	style,
	majorityError,
	dividerError
}) => {
	if (CBX.isMajorityPercentage(type)) {
		return (
			<div style={{ width: '100%', ...style }}>
				<TextInput
					type={'number'}
					value={value}
					errorText={majorityError}
					min={1}
					max={100}
					adornment={'%'}
					onChange={event => onChange(event.target.value <= 1 ? 1 : event.target.value > 100 ? 100 : event.nativeEvent.target.value)}
				/>
			</div>
		);
	}

	if (CBX.isMajorityFraction(type)) {
		return (
			<div style={{
 width: '100%', display: 'flex', alignItems: 'center', ...style
}}>
				<div style={{ width: '5em', display: 'flex', alignItems: 'center' }}>
					<TextInput
						type={'number'}
						value={value}
						min="1"
						errorText={majorityError}
						onChange={event => onChange(divider ? event.target.value > divider ? divider : event.nativeEvent.target.value : event.target.value)
						}
					/>
				</div>
				/
				<div style={{
 width: '5em', marginLeft: '0.8em', isplay: 'flex', alignItems: 'center'
}}>
					<TextInput
						type={'number'}
						value={divider}
						min="1"
						errorText={dividerError}
						onChange={event => onChangeDivider(event.target.value < 1 ? 1 : event.nativeEvent.target.value)
						}
					/>
				</div>
				<br />
			</div>
		);
	}

	if (CBX.isMajorityNumber(type)) {
		return (
			<div style={{ width: '6em', ...style }}>
				<TextInput
					type={'number'}
					min="1"
					value={value}
					errorText={majorityError}
					onChange={event => onChange(event.nativeEvent.target.value)}
				/>
			</div>
		);
	}

	return <div />;
};

export default MajorityInput;
