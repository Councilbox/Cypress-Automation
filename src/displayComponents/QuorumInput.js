import React from 'react';
import { Grid, GridItem, TextInput } from './index';
import * as CBX from '../utils/CBX';
import { isMobile } from '../utils/screen';

const QuorumInput = ({
	type,
	value,
	divider,
	id = '',
	onChange,
	onChangeDivider,
	style,
	quorumError,
	dividerError
}) => {
	const onBlurChange = () => {
		if (value < 1) {
			onChange(1);
		}
	};

	if (CBX.isQuorumPercentage(type)) {
		return (
			<div className="row">
				<div style={{ width: '100%', ...style, marginTop: '17px' }}>
					<TextInput
						id={`${id}-percentage`}
						type={'number'}
						value={value <= 0 ? '' : value}
						min="0"
						max="100"
						errorText={quorumError || (value <= 0 ? 'El valor mínimo es 1' : '')}
						onBlur={onBlurChange}
						adornment={'%'}
						styles={{ width: isMobile && '90%' }}
						onChange={event => {
							onChange(event.nativeEvent.target.value);
						}}
					/>
				</div>
			</div>
		);
	}

	if (divider < 1) {
		onChangeDivider(1);
	}

	if (CBX.isQuorumFraction(type)) {
		return (
			<div style={{ width: '100%', ...style, marginTop: '17px' }}>
				<Grid>
					<GridItem xs={6} lg={6} md={6}>
						<TextInput
							type={'number'}
							value={value}
							id={`${id}-number`}
							adornment={'/'}
							onBlur={onBlurChange}
							min="1"
							errorText={quorumError}
							onChange={event => {
								const newValue = event.target.value;
								onChange(newValue > 0 ? newValue > divider ? divider : newValue : 1);
							}}
						/>
					</GridItem>
					<GridItem xs={6} lg={6} md={6}>
						<TextInput
							type={'number'}
							id={`${id}-divider`}
							value={divider}
							min="0"
							onBlur={() => { if (divider < value) onChangeDivider(value); }}
							errorText={dividerError}
							onChange={event => {
								const newValue = event.target.value;
								onChangeDivider(newValue > 0 ? newValue : 1);
							}}
						/>
					</GridItem>
				</Grid>
			</div>
		);
	}

	if (CBX.isQuorumNumber(type)) {
		return (
			<div className="row">
				<div style={{ width: '100%', ...style, marginTop: '17px' }}>
					<TextInput
						id={`${id}-number`}
						type={'number'}
						value={value <= 0 ? '' : value}
						onBlur={onBlurChange}
						errorText={quorumError || (value <= 0 ? 'El valor mínimo es 1' : '')}
						onChange={event => onChange(event.nativeEvent.target.value)
						}
					/>
				</div>
			</div>
		);
	}

	return <div />;
};

export default QuorumInput;
