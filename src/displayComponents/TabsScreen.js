import React from 'react';
import 'antd/lib/tabs/style/index.css';
import Tabs from 'antd/lib/tabs';
import Link from './LinkWithoutStyling';
import { bHistory } from '../containers/App';

const TabsScreen = ({
	selected, controlled, tabsIndex, tabsInfo, linked, windowSize, styles
}) => {
	const [selectedTab, setSelected] = React.useState(0);

	React.useEffect(() => {
		if (controlled) {
			if (selected !== selectedTab) {
				setSelected(tabsIndex[selected]);
			}
		}
	}, [selected]);

	const handleChange = tabIndex => {
		if (linked) {
			bHistory.push(tabsInfo[tabIndex].link);
		} else {
			setSelected(tabIndex);
		}
	};

	return (
		<div
			style={{
				overflowY: 'hidden',
				width: '100%',
				height: '100%',
				display: 'flex',
				...(windowSize === 'xs' ? { paddingBottom: '3.5em' } : {}),
				alignItems: 'center',
				flexDirection: 'column',
				borderBottom: '1px solid gainsboro',
				borderRadius: '4px',
				...styles
			}}
			className="card-container"
		>
			<Tabs
				activeKey={`${selectedTab}`}
				type="card"
				style={{ width: '100%', height: '100%', paddingBottom: '1em' }}
				onChange={handleChange}
			>
				{tabsInfo.map((tab, index) => (
					<Tabs.TabPane
						tab={
							linked ?
								<Link to={tab.link}>{tab.text}</Link>
								: tab.text
						}
						key={`${index}`}
						style={{
							height: 'calc(100% - 40px) !important',
							overflow: 'hidden',
							border: '1px solid #e8e8e8',
							borderTop: 'none',
							boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.14)',
							borderRadius: '0px 5px 5px 5px'
						}}
					>
						<div style={{ width: '100%', height: '100%' }}>
							{!!tab.component && tab.component()}
						</div>
					</Tabs.TabPane>
				))}
			</Tabs>
		</div>
	);
};


export default TabsScreen;
