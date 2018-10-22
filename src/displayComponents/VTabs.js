import React from "react";
import withWindowSize from "../HOCs/withWindowSize";
import { getPrimary, getSecondary } from "../styles/colors";
import { CloseIcon, Grid, GridItem, SelectInput, Icon } from "./index";
import { Tooltip, Paper, MenuItem } from 'material-ui';
import Tabs from 'antd/lib/tabs';
import { IconButton } from 'material-ui';
import FontAwesome from 'react-fontawesome';
import "../styles/react-tabs.css";

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
		{windowSize !== "xs" && (
			<Tabs
				tabPosition={'left'}
				onChange={changeTab}
				activeKey={''+index}
			>
				<Tabs.TabPane
					key="new"
					tab={
						additionalTab
					}
				/>
				{tabs.map((tab, mapIndex) => {
					return (
						<Tabs.TabPane
							key={''+mapIndex}
							tab={
								<HoverableTab
									tab={tab}
									index={index}
									mapIndex={mapIndex}
									editAction={editAction}
									deleteAction={deleteAction}
									translate={translate}
								/>
							}
						>
							{children}
						</Tabs.TabPane>
					);
				})}
			</Tabs>
		)}
		{windowSize === "xs" && (
			<div className="container-fluid" style={{ height: "100%" }}>
				<Grid>
					<GridItem xs={6}>
						<SelectInput
							noLabel
							value={index}
							style={{ margin: "-16px" }}
							onChange={event => changeTab(event.target.value)}
						>
							{tabs.map((tab, itemIndex) => {
								return (
									<MenuItem
										value={itemIndex}
										key={`statute_${itemIndex}`}
									>
										{tab.title}
									</MenuItem>
								);
							})}
						</SelectInput>
					</GridItem>
					<GridItem xs={6} style={{display: 'flex'}}>
						{additionalTab && (
							<Paper style={{margin: 0, padding: 0, backgroundColor: secondary, width: '2em', height: '2em', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<MenuItem onClick={additionalTabAction} style={{margin: 0, padding: 0, width: '2em', height: '2em', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<i className="fa fa-plus" style={{color: 'white'}} />
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
							{!!saveAction &&
								<React.Fragment>
									<Tooltip title={translate.save}>
										<Icon
											type="save"
											style={{
												fontSize:'1.75em',
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
												fontSize:'1.75em',
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
											fontSize:'1.75em',
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
									onClick={(event) => {
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
						marginTop: "0.5em"
					}}
				>
					{children}
				</div>
			</div>
		)}
	</React.Fragment>
);

export default withWindowSize(Vtabs);


class HoverableTab extends React.PureComponent {

	state = {
		showAction: false
	}

	mouseEnterHandler = () => {
		this.setState({
			showAction: true
		})
	}

	mouseLeaveHandler = () => {
		this.setState({
			showAction: false
		})
	}


	render(){
		const { tab, mapIndex, index, deleteAction, editAction } = this.props;

		return (
			<div style={{display: 'flex', width: '22em', alignItems: 'center', justifyContent: 'space-between'}}
				onMouseOver={this.mouseEnterHandler}
				onMouseLeave={this.mouseLeaveHandler}
			>
				<Tooltip title={tab.title}>
					<span
						style={{
							marginRight: '0.2em',
							maxWidth: '15em',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							color: +index === +mapIndex? primary : 'black',
						...(+index === +mapIndex? { fontWeight: '700'} : {})
						}}
					>
						{tab.title}
					</span>
				</Tooltip>
				<span style={{width: '2em', height: '32px'}} />
				{this.state.showAction &&
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
						{!!editAction && (
							<Tooltip title={this.props.translate.rename_council_type}>
								<IconButton
									style={{
										width: '32px',
										height: '32px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center'
									}}
								>
									<FontAwesome
										name="edit"
										style={{
											fontSize:'19px',
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
						<CloseIcon
							style={{ float: "right" }}
							onClick={event => {
								deleteAction(tab.data.id);
								event.stopPropagation();
							}}
						/>
					</Paper>
				}
			</div>
		)
	}
}