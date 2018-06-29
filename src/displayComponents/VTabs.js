import React from "react";
import Scrollbar from "react-perfect-scrollbar";
import withWindowSize from "../HOCs/withWindowSize";
import { getPrimary, getSecondary, lightTurquoise } from "../styles/colors";
import { CloseIcon, Grid, GridItem, MenuItem, SelectInput } from "./index";
import Tabs from 'antd/lib/tabs';
import "../styles/react-tabs.css";

const primary = getPrimary();
const secondary = getSecondary();

const Vtabs = ({
	children,
	tabs,
	changeTab,
	additionalTab,
	windowSize,
	deleteAction
}) => (
	<React.Fragment>
		{windowSize !== "xs" && (
			<Tabs
				tabPosition={'left'}
				onChange={changeTab}
			>
				{tabs.map((tab, index) => {
					return (
						<Tabs.TabPane
							key={''+index}
							tab={
								<div>
									{tab.title}
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
							<div style={{ height: "calc(80vh - 0.8em)", position: 'relative', overflow: 'hidden' }}>
								<Scrollbar>{children}</Scrollbar>
							</div>
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
					<GridItem xs={6}>
						{additionalTab && (
							<button
								style={{
									width: "20%",
									backgroundColor: secondary,
									color: "white",
									fontWeight: "700",
									cursor: "pointer",
									float: "right"
								}}
								onClick={additionalTab.action}
							>
								<i className="fa fa-plus" />
								{/*{additionalTab.title}*/}
							</button>
						)}
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
						height: "calc(100% - 4em)",
						marginTop: "0.5em"
					}}
				>
					<Scrollbar>{children}</Scrollbar>
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