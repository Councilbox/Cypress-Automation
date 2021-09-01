import React from 'react';
import Steps from 'antd/lib/steps';
import 'antd/lib/steps/style/index.css';
import Icon from 'antd/lib/icon';
import { Tooltip } from 'material-ui';
import { getSecondary, getPrimary } from '../../../styles/colors';
import withWindowSize from '../../../HOCs/withWindowSize';
import { isMobile } from '../../../utils/screen';

const EditorStepper = ({
	translate, active, goToPage, windowSize, previousPage
}) => {
	const secondary = getSecondary();
	const primary = getPrimary();
	const previous = active - 1;
	const next = active + 1;

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

	const XsIcon = ({ icon, page }) => (
		<Icon
			type={icon}
			style={{
				fontSize: '18px',
				color: active === page - 1 ? primary : secondary,
				cursor: active > page - 1 ? 'pointer' : 'inherit',
				userSelect: 'none',
				...(active === page - 1 ? {
					fontSize: '22px',
					fontWeight: '700'
				} : {})
			}}

			{...(active > page - 1 ? {
				onClick: () => goToPage(page),
			} : {})}

		/>
	);

	if (windowSize === 'xs') {
		return (
			<div
				style={{
					width: '100%',
					height: isMobile ? '1em' : '2em',
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
		);
	}

	return (
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
								cursor: previous === step.index || next === step.index ? 'pointer' : 'inherit',
								...(active === step.index ? {
									fontSize: !isMobile ? '18px' : '1rem',
									textDecoration: 'underline'
								} : {})
							}}
							onClick={() => (next === step.index ? goToPage() : step.index === previous && previousPage())}
						>
							{step.text}
						</span>
					}
					icon={
						< Icon
							type={step.icon}
							style={{
								color: active === step.index ? primary : secondary,
								cursor: previous === step.index || next === step.index ? 'pointer' : 'inherit',
							}}
							onClick={() => (next === step.index ? goToPage() : step.index === previous && previousPage())}
						/>
					}
				/>
			))}
		</Steps >
	);
};

export default withWindowSize(EditorStepper);
