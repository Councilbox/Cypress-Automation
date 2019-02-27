import React from 'react';
import Steps from 'antd/lib/steps';
import 'antd/lib/steps/style/index.css';
import Icon from 'antd/lib/icon';
import { getSecondary, getPrimary } from '../../../styles/colors';
import withWindowSize from '../../../HOCs/withWindowSize';
import { Tooltip } from 'material-ui';
import { isMobile } from 'react-device-detect';



const EditorStepper = ( { translate, active, goToPage, windowSize }) => {
    const secondary = getSecondary();
    const primary = getPrimary();

    const steps = [
        {
            index: 0,
            icon: 'schedule',
            text: translate.wizard_convene
        },
        {
            index: 1,
            icon: 'team',
            text: translate.census
        },
        {
            index: 2,
            icon: 'profile',
            text: translate.wizard_agenda
        },
        {
            index: 3,
            icon: 'link',
            text: translate.wizard_attached_documentation
        },
        {
            index: 4,
            icon: 'bars',
            text: translate.wizard_options
        },
        {
            index: 5,
            icon: 'copy',
            text: translate.wizard_preview
        },
    ];

    const XsIcon = ({ icon, page, selected }) => (
        <Icon
            type={icon}
            style={{
                fontSize: '18px',
                color: active === page - 1? primary : secondary,
                cursor: active > page - 1? 'pointer' : 'inherit',
                userSelect: 'none',
                ...(active === page - 1? {
                    fontSize: '22px',
                    fontWeight: '700'
                } : {})
            }}

            {...(active > page - 1? {
                onClick: () => goToPage(page),
            }: {})}

        />
    );

    if(windowSize === 'xs'){
        return(
            <div
                style={{
                    width: '100%',
                    height: isMobile?'1em':'2em',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: '15%',
                    paddingRight: '15%',
                    justifyContent: 'space-between'
                }}
            >
                <Tooltip title={translate.wizard_convene}>
                    <XsIcon icon='schedule' page={1} />
                </Tooltip>
                <Tooltip title={translate.census}>
                    <XsIcon icon='team' page={2} />
                </Tooltip>
                <Tooltip title={translate.wizard_agenda}>
                    <XsIcon icon='profile' page={3} />
                </Tooltip>
                <Tooltip title={translate.wizard_attached_documentation}>
                    <XsIcon icon='link' page={4} />
                </Tooltip>
                <Tooltip title={translate.wizard_options}>
                    <XsIcon icon='bars' page={5} />
                </Tooltip>
                <Tooltip title={translate.wizard_preview}>
                    <XsIcon icon='copy' page={6} />
                </Tooltip>
            </div>
        )
    }

    return(
        <Steps
            current={active}
            size="small"
            direction="horizontal"
        >
            {steps.map(step => (
                <Steps.Step
                    key={`step:${step.index}`}
                    title={
                        <span
                            style={{
                                userSelect: 'none',
                                cursor: active > step.index? 'pointer' : 'inherit',
                                ...(active === step.index? {
                                    fontSize: '18px',
                                    textDecoration: 'underline'
                                } : {})
                            }}
                            {...(active > step.index
                            ? {
                                    onClick: () => goToPage(step.index + 1),
                            }
                            : {})}
                        >
                            {step.text}
                        </span>
                    }
                    icon={
                        <Icon
                            type={step.icon}
                            style={{
                                color: active === step.index? primary : secondary,
                                cursor: active > step.index ? 'pointer' : 'inherit'
                            }}
                            {...(active > step.index
                            ? {
                                    onClick: () => goToPage(step.index + 1),
                            }
                            : {})}
                        />
                    }
                />
            ))}
        </Steps>
    )
}

export default withWindowSize(EditorStepper);


/* { windowSize === "xs" ? (
	<MobileStepper active={this.state.step - 1} total={6} />
) : (
	<Stepper
		alternativeLabel
		activeStep={this.state.step - 1}
		orientation="horizontal"
	>
		<Step
			{...(this.state.step > 1
				? {
						onClick: () => this.goToPage(1),
						style: pointerStep
				  }
				: {})}
		>
			<StepLabel style={{marginTop: 0}}>
				{translate.wizard_convene}
			</StepLabel>
		</Step>
		<Step
			{...(this.state.step > 2
				? {
						onClick: () => this.goToPage(2),
						style: pointerStep
				  }
				: {})}
		>
			<StepLabel>{translate.census}</StepLabel>
		</Step>
		<Step
			{...(this.state.step > 3
				? {
						onClick: () => this.goToPage(3),
						style: pointerStep
				  }
				: {})}
		>
			<StepLabel>{translate.wizard_agenda}</StepLabel>
		</Step>
		<Step
			{...(this.state.step > 4
				? {
						onClick: () => this.goToPage(4),
						style: pointerStep
				  }
				: {})}
		>
			<StepLabel>
				{translate.wizard_attached_documentation}
			</StepLabel>
		</Step>
		<Step
			{...(this.state.step > 5
				? {
						onClick: () => this.goToPage(5),
						style: pointerStep
				  }
				: {})}
		>
			<StepLabel>
				{translate.wizard_options}
			</StepLabel>
		</Step>
		<Step>
			<StepLabel>
				{translate.wizard_preview}
			</StepLabel>
		</Step>
	</Stepper>
)} */





