import React from 'react';
import { Radio, HelpPopover } from '../../../displayComponents';

const AssistanceOption = ({ title, value, disabled, translate, selected, select, delegationItem }) => {
	return (
		<div style={{ display: 'flex' }}>
			<div onClick={!disabled ? select : () => { }}>
				<Radio
					value={value}
					disabled={disabled}
					checked={selected === value}
					onChange={!disabled ? select : () => { }}
					name="security"
					label={
						<HelpPopover
							title={translate.warning}
							content={translate.delegated_representant_cant_delegate}
							TriggerComponent={props => <div onClick={disabled ? props.onClick : () => { }}>
								{title}
							</div>
							}
						>
						</HelpPopover>
					}
				/>
			</div>

			{delegationItem}
		</div>
	);
};

export default AssistanceOption;
