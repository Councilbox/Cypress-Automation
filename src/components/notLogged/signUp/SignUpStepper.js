import React from "react";
//import Stepper, { Step, StepContent, StepLabel } from "material-ui/Stepper";
import Steps from 'antd/lib/steps';
import { Tooltip } from 'material-ui';
import { getSecondary, getPrimary } from '../../../styles/colors';
import Icon from 'antd/lib/icon';

const Step = Steps.Step;

const SignUpStepper = ({ active, translate, windowSize, goToPage }) => {
	const secondary = getSecondary();
	const primary = getPrimary();

	if(windowSize !== 'xs'){
		return (
			<div
				style={{
					paddingLeft: '1.5em',
					paddingTop: "2em"
				}}
			>
				<Steps current={active} direction={windowSize === 'xs'? "horizontal" : "vertical"} size="small">
					<Step
						style={{
							cursor: active + 1 > 1 ? "pointer" : "inherited",
							marginBottom: '2em'
						}}
						title={
							<React.Fragment>
								<span style={{cursor: active + 1 > 2 ? "pointer" : "inherited"}}>
								{translate.user_data}
								</span>
								<br />
								<br />
							</React.Fragment>
						}
						onClick={() => goToPage(1)}
						icon={<Icon type="user" style={{color: active === 0? primary : secondary}} />}
					/>
					{/* <Step
						onClick={() => goToPage(2)}
						title={
							<React.Fragment>
								<span style={{cursor: active + 1 > 2 ? "pointer" : "inherited"}}>
									{`${translate.company_new_data} (${translate.optional})`}
								</span>
								<br />
								<br />
							</React.Fragment>
						}
						icon={<Icon type="profile" style={{color: active === 1? primary : secondary}} />}
					/>
					<Step
						title={
							<span style={{cursor: active + 1 > 2 ? "pointer" : "inherited" , marginBottom: '2em'}}>
								{`${translate.billing_information} (${translate.optional})`}
							</span>
						}
						icon={<Icon type="credit-card" style={{color: active === 2? primary : secondary}} />}
					/> */}
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
				<Icon type="user" style={{color: active === 0? primary : secondary}} />
			</Tooltip>
{/* 			<Tooltip title={`Datos de entidad (opcional)`}>
				<Icon type="profile" style={{color: active === 1? primary : secondary}} />
			</Tooltip>
			<Tooltip title={`${translate.billing_information} (opcional)`}>
				<Icon type="credit-card" style={{color: active === 2? primary : secondary}} />
			</Tooltip> */}
		</div>
	);
};

export default SignUpStepper;
