import React from 'react';
import { Grid, TextInput } from './index';
import * as CBX from '../utils/CBX';
import GridItem from './GridItem';

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
			<div style={{ width: '100%', ...style, marginTop: '17px' }}>
				<TextInput
					type={'number'}
					value={value}
					id="agenda-majority-number"
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
				width: '100%', display: 'flex', alignItems: 'center', ...style, marginTop: '17px'
			}}>
				<Grid>
					<GridItem xs={4} lg={4} md={4}>
						<TextInput
							type={'number'}
							id="agenda-majority-number"
							value={value}
							adornment={'/'}
							min="1"
							errorText={majorityError}
							onChange={event => onChange(divider ? event.target.value > divider ? divider : event.nativeEvent.target.value : event.target.value)
							}
						/>
					</GridItem>
					<GridItem xs={4} lg={4} md={4}>
						<TextInput
							type={'number'}
							value={divider}
							id="agenda-majority-divider"
							min="1"
							errorText={dividerError}
							onChange={event => onChangeDivider(event.target.value < 1 ? 1 : event.nativeEvent.target.value)
							}
						/>
					</GridItem>
				</Grid>
				<br />
			</div>
		);
	}

	if (CBX.isMajorityNumber(type)) {
		return (
			<div style={{ width: '6em', ...style, marginTop: '17px' }}>
				<TextInput
					type={'number'}
					min="1"
					id="agenda-majority-number"
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
