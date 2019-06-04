import React from "react";
import { Checkbox } from "material-ui";
import { FormControlLabel } from "material-ui/Form";
import HelpPopover from './HelpPopover';

const CheckBox = ({ value, label, onChange, style, disabled, helpPopover, helpTitle, helpDescription, styleLabel }) => (
	<div
		style={{
			display: 'flex',
			flexDirection: 'row',
		}}
	>
		<FormControlLabel
			control={<Checkbox checked={value} onChange={onChange} disabled={disabled} />}
			label={
				<React.Fragment>
					<span>{label}</span>
				</React.Fragment>
			}
			style={{ marginBottom: "0", marginRight: '0', ...styleLabel }}
		/>
		{helpPopover &&
			<HelpPopover
				title={helpTitle}
				content={helpDescription}
			/>
		}
	</div>
);

export default CheckBox;
