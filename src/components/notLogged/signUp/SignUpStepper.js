import React from 'react';
// import Stepper, { Step, StepContent, StepLabel } from "material-ui/Stepper";
import Steps from 'antd/lib/steps';
import { Tooltip } from 'material-ui';
import Icon from 'antd/lib/icon';
import { getSecondary, getPrimary } from '../../../styles/colors';

const { Step } = Steps;

const SignUpStepper = ({
	active, translate, windowSize, goToPage
}) => {
	const secondary = getSecondary();
	const primary = getPrimary();

	if (windowSize !== 'xs') {
		return (
			<div
				style={{
					paddingLeft: '1.5em',
					paddingTop: '2em'
				}}
			>
				<Steps current={active} direction={windowSize === 'xs' ? 'horizontal' : 'vertical'} size="small">
					<Step
						style={{
							cursor: active + 1 > 1 ? 'pointer' : 'inherited',
							marginBottom: '2em'
						}}
						title={
							<React.Fragment>
								<span style={{ cursor: active + 1 > 2 ? 'pointer' : 'inherited' }}>
									{translate.user_data}
								</span>
								<br />
								<br />
							</React.Fragment>
						}
						onClick={() => goToPage(1)}
						icon={<Icon type="user" style={{ color: active === 0 ? primary : secondary }} />}
					/>
				</Steps>
			</div>
		);
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				width: '100%',
				paddingRight: '25%',
				paddingLeft: '25%',
				fontSize: '22px',
				height: '100%',
				alignItems: 'center',
				justifyContent: 'space-between'
			}}
		>
			<Tooltip title={translate.user_data}>
				<Icon type="user" style={{ color: active === 0 ? primary : secondary }} />
			</Tooltip>
		</div>
	);
};

export default SignUpStepper;
