import React from "react";
import { getPrimary, lightGrey } from "../styles/colors";
//import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "../styles/react-tabs.css";
import { Link } from "react-router-dom";
import Add from "material-ui-icons/Add";
import 'antd/lib/tabs/style/index.css';
import Tabs from 'antd/lib/tabs';

class TabsScreen extends React.Component {
	state = {
		selectedTab: 0
	};

	static getDerivedStateFromProps(nextProps) {
		if(nextProps.controlled){
			return{
				selectedTab: nextProps.tabsIndex[nextProps.selected]
			}
		}
		return null
	}

	handleChange = tabIndex => {
		this.setState({
			selectedTab: tabIndex
		})
	}


	render() {
		const tabsInfo = this.props.tabsInfo;
		const primary = getPrimary();

		return (
			<div
				style={{
					overflowY: "hidden",
					width: "100%",
					padding: '1.2em',
					height: "100%",
					display: "flex",
					alignItems: "center",
					flexDirection: "column"
				}}

				className="card-container"
			>
				<Tabs
					activeKey={''+this.state.selectedTab}
					type="card"
					style={{ width: '100%' }}
					onChange={this.handleChange}
				>
					{tabsInfo.map((tab, index) => {
						return (
							<Tabs.TabPane
								tab={
									this.props.linked?
									 <Link to={tab.link}>{tab.text}</Link>
									:
										tab.text
								}
								key={''+index}
								style={{
									height: "80vh",
									overflow: "hidden",
									border: '1px solid #e8e8e8',
									borderTop: 'none',
									boxShadow:
										"0 1px 4px 0 rgba(0, 0, 0, 0.14)",
									borderRadius: "0px 5px 5px 5px"
								}}
							>
								<div style={{width: '90%'}}>
									{!!tab.component && tab.component()}
								</div>
							</Tabs.TabPane>
						);
					})}
				</Tabs>
			</div>
		);
	}
}

export default TabsScreen;

/* 					<TabList>
						{tabsInfo.map((tab, index) => {
							return (
								<Link
									key={tab.text + index}
									to={tab.link}
									style={{ color: "black" }}
								>
									<Tab
										style={
											tab.add && {
												backgroundColor: primary,
												color: "white"
											}
										}
									>
										{tab.text}
										{tab.add && (
											<Add style={{ fontSize: "1em" }} />
										)}
									</Tab>
								</Link>
							);
						})}
					</TabList>
					<TabList>
						{tabsInfo.map((tab, index) => {
							return (
								<Link
									key={tab.text + index}
									to={tab.link}
									style={{ color: "black" }}
								>
									<Tab
										style={
											tab.add && {
												backgroundColor: primary,
												color: "white"
											}
										}
									>
										{tab.text}
										{tab.add && (
											<Add style={{ fontSize: "1em" }} />
										)}
									</Tab>
								</Link>
							);
						})}
					</TabList>
*/
