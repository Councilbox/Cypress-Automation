import React from "react";
import { Checkbox } from "material-ui";
import { FormControlLabel } from "material-ui/Form";
import HelpPopover from './HelpPopover';

const CheckBox = ({ value, label, onChange, style, helpPopover, helpTitle, helpDescription }) => (
	<div
		style={{
			display: 'flex',
			flexDirection: 'row',
		}}
	>
		<FormControlLabel
			control={<Checkbox checked={value} onChange={onChange} />}
			label={
				<React.Fragment>
					<span>{label}</span>
				</React.Fragment>
			}
			style={{ marginBottom: "0", marginRight: '0' }}
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
