import React from "react";
import { Grid, GridItem, TextInput } from "./index";
import * as CBX from "../utils/CBX";

const QuorumInput = ({
	type,
	value,
	divider,
	onChange,
	onChangeDivider,
	style,
	quorumError,
	dividerError
}) => {
	if (CBX.isQuorumPercentage(type)) {
		return (
			<div className="row">
				<div style={{ width: "100%", ...style }}>
					<TextInput
						type={"number"}
						value={value}
						min="1"
						max="100"
						errorText={quorumError}
						adornment={"%"}
						onChange={event => {
							onChange(event.nativeEvent.target.value)
						}}
					/>
				</div>
			</div>
		);
	}

	if(value < 1){
		onChange(1);
	}

	if(divider < 1){
		onChangeDivider(1);
	}

	if (CBX.isQuorumFraction(type)) {
		return (
			<div style={{ width: "100%", ...style }}>
				<Grid>
					<GridItem xs={6} lg={6} md={6}>
						<TextInput
							type={"number"}
							value={value}
							adornment={"/"}
							min="1"
							errorText={quorumError}
							onChange={event => {
								let newValue = event.target.value;
								onChange(newValue > 0? newValue > divider? divider : newValue : 1)
							}}
						/>
					</GridItem>
					<GridItem xs={6} lg={6} md={6}>
						<TextInput
							type={"number"}
							value={divider}
							min="1"
							adornment={"/"}
							onBlur={() => {if(divider < value) onChangeDivider(value)}}
							errorText={dividerError}
							onChange={event => {
								let newValue = event.target.value;
								onChangeDivider(newValue > 0? newValue : 1)
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
				<div style={{ width: "100%", ...style }}>
					<TextInput
						type={"number"}
						value={value}
						min="1"
						errorText={quorumError}
						onChange={event =>
							onChange(event.nativeEvent.target.value)
						}
					/>
				</div>
			</div>
		);
	}

	return <div />;
};

export default QuorumInput;
