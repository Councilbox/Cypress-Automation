import React from 'react';
import Steps from 'antd/lib/steps';
import 'antd/lib/steps/style/index.css';
import Icon from 'antd/lib/icon';
import { getSecondary, getPrimary } from '../../../styles/colors';
import withWindowSize from '../../../HOCs/withWindowSize';
import { Tooltip } from 'material-ui';


const EditorStepper = ( { translate, active, goToPage, windowSize }) => {
    const secondary = getSecondary();
    const primary = getPrimary();

    const XsIcon = ({ icon, page }) => (
        <Icon
            type={icon}
            style={{
                color: active === page - 1? primary : secondary,
                cursor: active > page - 1? 'pointer' : 'inherit',
                userSelect: 'none'
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
                    height: '2.5em',
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
            <Steps.Step
                title={
                    <span
                        style={{userSelect: 'none', cursor: active > 0? 'pointer' : 'inherit'}}
                        {...(active > 0
                        ? {
                                onClick: () => goToPage(1),
                        }
                        : {})}
                    >
                        {translate.wizard_convene}
                    </span>
                }
                icon={<Icon type="schedule" style={{color: active === 0? primary : secondary}} />}
            />
            <Steps.Step
                title={
                    <span
                        style={{userSelect: 'none', cursor: active > 1? 'pointer' : 'inherit'}}
                        {...(active > 1
                        ? {
                                onClick: () => goToPage(2),
                        }
                        : {})}
                    >
                        {translate.census}
                    </span>
                }
                icon={<Icon type="team" style={{color: active === 1? primary : secondary}} />}
            />
            <Steps.Step
                title={
                    <span
                        style={{userSelect: 'none', cursor: active > 2? 'pointer' : 'inherit'}}
                        {...(active > 2
                        ? {
                                onClick: () => goToPage(3),
                        }
                        : {})}
                    >
                        {translate.wizard_agenda}
                    </span>
                }
                icon={<Icon type="profile" style={{color: active === 2? primary : secondary}} />}
            />
            <Steps.Step
                title={
                    <span
                        style={{userSelect: 'none', cursor: active > 3? 'pointer' : 'inherit'}}
                        {...(active > 3
                        ? {
                                onClick: () => goToPage(4),
                        }
                        : {})}
                    >
                        {translate.wizard_attached_documentation}
                    </span>
                }
                icon={<Icon type="link" style={{color: active === 3? primary : secondary}} />}
            />
            <Steps.Step
                title={
                    <span
                        style={{userSelect: 'none', cursor: active > 4? 'pointer' : 'inherit'}}
                        {...(active > 4
                        ? {
                                onClick: () => goToPage(5),
                        }
                        : {})}
                    >
                        {translate.wizard_options}
                    </span>
                }
                icon={<Icon type="bars" style={{color: active === 4? primary : secondary}} />}
            />
            <Steps.Step
                title={
                    <span
                        style={{userSelect: 'none'}}
                    >
                        {translate.wizard_preview}
                    </span>
                }
                icon={<Icon type="copy" style={{color: active === 5? primary : secondary}} />}
            />
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





