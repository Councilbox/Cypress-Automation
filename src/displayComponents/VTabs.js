import React from "react";
import withWindowSize from "../HOCs/withWindowSize";
import { getPrimary, getSecondary } from "../styles/colors";
import { CloseIcon, Grid, GridItem, SelectInput } from "./index";
import { Tooltip, Paper, MenuItem } from 'material-ui';
import Tabs from 'antd/lib/tabs';
import "../styles/react-tabs.css";
import Icon from 'antd/lib/icon';

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
								<div style={{display: 'flex', width: '22em', alignItems: 'center', justifyContent: 'space-between'}}>
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
									{!!(saveAction && +index === +mapIndex)?
										<React.Fragment>
											<Tooltip title={translate.save}>
												<Paper style={{margin: 0, padding: 0, width: '2.5em', height: '2em', overflow: 'hidden'}}>
													<Icon
														type="save"
														style={{
															fontSize:'1.75em',
															width: '100%',
															height: '100%',
															backgroundColor: primary,
															color: 'white'
														}}
														onClick={event => {
															saveAction();
															event.stopPropagation();
														}}
													/>
												</Paper>
											</Tooltip>
											<Tooltip title="Deshacer" /*TRADUCCION*/>
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
									:
										<span style={{width: '2em'}}>

										</span>
									}
									<CloseIcon
										style={{ float: "right" }}
										onClick={event => {
											deleteAction(tab.data.id);
											event.stopPropagation();
										}}
									/>
								</div>
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
							style={{ margin: "-16px" }}
							onChange={event => changeTab(event.target.value)}
						>
							{tabs.map((tab, index) => {
								return (
									<MenuItem
										value={index}
										key={`statute_${index}`}
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
								<Tooltip title="Deshacer" /*TRADUCCION*/>
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
						{deleteAction && (
							<CloseIcon
								onClick={() => {
									for (let i = 0; i < tabs.length; i++) {
										const tab = tabs[i];
										if (tab.active) {
											return deleteAction(tab.data.id);
										}
									}
								}}
							/>
						)}
					</GridItem>
				</Grid>
				<div
					style={{
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


/*
<Grid style={{ height: "100%" }}>
				<GridItem xs={12} md={3} lg={3} className="nav-tabs-left">
					{tabs.map((tab, index) => {
						return (
							<div
								key={`vtab${index}`}
								style={{
									width: "100%",
									backgroundColor: tab.active
										? "white"
										: lightTurquoise,
									padding: "0.8vh",
									color: tab.active ? primary : secondary,
									fontWeight: "700",
									borderLeft:
										"solid 3px " +
										(tab.active ? primary : secondary),
									marginBottom: "0.6vh",
									cursor: tab.active ? "" : "pointer",
									boxShadow: tab.active
										? "-2px 2px 6px -2px rgba(0, 0, 0, 0.2)"
										: ""
								}}
								onClick={() => changeTab(index)}
							>
								<Grid>
									<GridItem xs={10}>{tab.title}</GridItem>
									<GridItem xs={2}>
										<CloseIcon
											style={{ float: "right" }}
											onClick={event => {
												deleteAction(tab.data.id);
												event.stopPropagation();
											}}
										/>
									</GridItem>
								</Grid>
							</div>
						);
					})}
					{additionalTab && (
						<div
							style={{
								width: "100%",
								backgroundColor: secondary,
								padding: "0.8vh",
								color: "white",
								fontWeight: "700",
								cursor: "pointer"
							}}
							onClick={additionalTab.action}
						>
							<i className="fa fa-plus" />
							{additionalTab.title}
						</div>
					)}
				</GridItem>
				<GridItem xs={12} md={9} lg={9} style={{ height: "100%" }}>
					<Scrollbar>{children}</Scrollbar>
				</GridItem>
			</Grid>
		)}

 */