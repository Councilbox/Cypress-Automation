import React from "react";
import "../styles/react-tabs.css";
import Link from './LinkWithoutStyling';
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

		return (
			<div
				style={{
					overflowY: "hidden",
					width: "100%",
					height: "100%",
					display: "flex",
					...(this.props.windowSize === 'xs'? { paddingBottom: '3.5em' } : {}),
					alignItems: "center",
					flexDirection: "column"
				}}

				className="card-container"
			>
				<Tabs
					activeKey={''+this.state.selectedTab}
					type="card"
					style={{ width: '100%', height: '100%' }}
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
									height: "calc(100% - 40px) !important",
									overflow: "hidden",
									border: '1px solid #e8e8e8',
									borderTop: 'none',
									boxShadow:
										"0 1px 4px 0 rgba(0, 0, 0, 0.14)",
									borderRadius: "0px 5px 5px 5px"
								}}
							>
								<div style={{width: '100%', height: '100%'}}>
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
