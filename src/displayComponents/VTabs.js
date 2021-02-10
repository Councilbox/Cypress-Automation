import React from 'react';
import {
	Tooltip, Paper, MenuItem, IconButton
} from 'material-ui';
import FontAwesome from 'react-fontawesome';
import {
	CloseIcon, Grid, GridItem, SelectInput, Icon
} from './index';
import { getPrimary, getSecondary } from '../styles/colors';
import withWindowSize from '../HOCs/withWindowSize';
import '../styles/react-tabs.css';
import Scrollbar from './Scrollbar';
import { isMobile } from '../utils/screen';

const primary = getPrimary();
const secondary = getSecondary();

const Vtabs = ({
	children,
	tabs,
	changeTab,
	additionalTab,
	additionalTabAction,
	windowSize,
	saveAction,
	editAction,
	undoAction,
	translate,
	index,
	deleteAction
}) => (
	<React.Fragment>
		<div style={{ height: '100%' }}>
			{windowSize !== 'xs' && !isMobile && (
				<div style={{ borderRight: '1px solid gainsboro', width: '24em', height: '100%' }}>
					<div style={{ height: 'calc(100% - 3em)' }}>
						<div style={{
							width: '90%',
							margin: '0 auto',
							marginBottom: '0.5em'
						}}>
							{additionalTab}
						</div>
						<Scrollbar>
							{tabs.map((tab, mapIndex) => (
								<div key={`${mapIndex}`} onClick={() => changeTab(`${mapIndex}`)}
									style={{
										borderRight: +index === +mapIndex ? `6px solid ${primary}` : '',
										marginTop: '0.5em',
										marginBottom: '0.5em',
										padding: '0.5em',
										paddingLeft: '1.2em',
										background: +index === +mapIndex ? '#dcdcdc' : 'white',
										cursor: 'pointer'
									}}>
									<HoverableTab
										tab={tab}
										index={index}
										disabled={tab.disabled}
										mapIndex={mapIndex}
										editAction={editAction}
										deleteAction={deleteAction}
										translate={translate}
									/>
								</div>
							))}
						</Scrollbar>
					</div>
				</div>
			)}

			{(windowSize === 'xs' || isMobile) && (
				<div className="container-fluid" style={{ height: '100%' }}>
					<Grid>
						<GridItem xs={6}>
							<SelectInput
								noLabel
								value={index}
								style={{ margin: '-16px' }}
								onChange={event => changeTab(event.target.value)}
							>
								{tabs.map((tab, itemIndex) => (
									<MenuItem
										value={itemIndex}
										key={`statute_${itemIndex}`}
									>
										{tab.title}
									</MenuItem>
								))}
							</SelectInput>
						</GridItem>
						<GridItem xs={6} style={{ display: 'flex' }}>
							{additionalTab && (
								<Paper style={{
									margin: 0, padding: 0, backgroundColor: secondary, width: '2em', height: '2em', display: 'flex', alignItems: 'center', justifyContent: 'center'
								}}>
									<MenuItem onClick={additionalTabAction} style={{
										margin: 0, padding: 0, width: '2em', height: '2em', display: 'flex', alignItems: 'center', justifyContent: 'center'
									}}>
										<i className="fa fa-plus" style={{ color: 'white' }} />
									</MenuItem>
								</Paper>
							)}
							<Paper
								style={{
									height: '35px',
									paddingLeft: '1em',
									paddingRight: '1em',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									borderRadius: '18px',
									outline: '0'
								}}
								elevation={0}
							>
								{!!saveAction
&& <React.Fragment>
	<Tooltip title={translate.save}>
		<Icon
			type="save"
			style={{
				fontSize: '1.75em',
				width: '1.5em',
				color: secondary
			}}
			onClick={event => {
				saveAction();
				event.stopPropagation();
			}}
		/>
	</Tooltip>
	<Tooltip title={translate.discard_changes} >
		<Icon
			type="rollback"
			style={{
				fontSize: '1.75em',
				width: '1.5em',
				color: secondary
			}}
			onClick={event => {
				undoAction();
				event.stopPropagation();
			}}
		/>
	</Tooltip>
</React.Fragment>
								}
								{!!editAction && (
									<Tooltip title={translate.rename_council_type}>
										<FontAwesome
											name="edit"
											style={{
												fontSize: '1.75em',
												width: '1.5em',
												color: secondary
											}}
											onClick={event => {
												editAction(index);
												event.stopPropagation();
											}}
										/>
									</Tooltip>
								)}
								{deleteAction && (
									<CloseIcon
										onClick={event => {
											deleteAction(tabs[index].data.id);
											event.stopPropagation();
										}}
									/>
								)}
							</Paper>
						</GridItem>
					</Grid>
					<div
						style={{
							height: '100%',
							marginTop: '0.5em'
						}}
					>
						{children}
					</div>
				</div>
			)}
		</div>
	</React.Fragment >
);

export default withWindowSize(Vtabs);


const HoverableTab = ({
	tab, mapIndex, index, deleteAction, editAction, disabled, ...props
}) => {
	const [state, setState] = React.useState({
		showAction: false
	});

	const mouseEnterHandler = () => {
		setState({
			showAction: true
		});
	};

	const mouseLeaveHandler = () => {
		setState({
			showAction: false
		});
	};


	return (
		<div style={{
			display: 'flex', width: '22em', alignItems: 'center', justifyContent: 'space-between'
		}}
		onMouseOver={mouseEnterHandler}
		onMouseLeave={mouseLeaveHandler}
		>
			<Tooltip title={tab.title}>
				<span
					style={{
						marginRight: '0.2em',
						maxWidth: '15em',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						color: +index === +mapIndex ? primary : 'black',
						...(+index === +mapIndex ? { fontWeight: '700' } : {})
					}}
				>
					{tab.title}
				</span>
			</Tooltip>
			<span style={{ width: '2em', height: '32px' }} />
			{(state.showAction && !disabled)
&& <Paper
	style={{
		height: '35px',
		paddingLeft: '1em',
		paddingRight: '1em',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderRadius: '18px',
		outline: '0'
	}}
	elevation={0}
>
	{!!editAction && (
		<Tooltip title={props.translate.rename_council_type}>
			<IconButton
				style={{
					width: '32px',
					height: '32px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<i
					className="fa fa-edit"
					style={{
						fontSize: '19px',
						color: secondary
					}}
					onClick={event => {
						editAction(mapIndex);
						event.stopPropagation();
					}}
				/>
			</IconButton>
		</Tooltip>
	)}
	{deleteAction
&& <CloseIcon
	style={{ float: 'right' }}
	onClick={event => {
		deleteAction(tab.data.id);
		event.stopPropagation();
	}}
/>
	}
</Paper>
			}
		</div>
	);
};
