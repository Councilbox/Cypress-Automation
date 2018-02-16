import React from 'react';
import { lightGrey } from '../../styles/colors';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../../styles/react-tabs.css';
import { Link } from 'react-router-dom';

class TabsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0
        }
    }

    componentDidMount() {
        this.setState({
            selectedTab: this.props.tabsIndex[this.props.selected]
        })
    }

    changeTab = (index) => {
        this.setState({selectedTab: this.props.tabsIndex[index]})
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selectedTab: this.props.tabsIndex[nextProps.selected]
        })
    }

    render() {
        const tabsInfo = this.props.tabsInfo;

        return (
            <div
                style={{
                overflowY: 'auto',
                width: '100%',
                backgroundColor: lightGrey,
                padding: 0,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column'
            }}
                className="container-fluid">
                <Tabs
                    selectedIndex={this.state.selectedTab}
                    style={{ paddingBottom: '2em'}}
                    onSelect={tabIndex => this.setState({tabIndex})}>
                    <TabList>
                        {tabsInfo.map((tab, index) => {
                            return (
                                <Link key={tab.text + index} to={tab.link} style={{color: 'black'}}>
                                    <Tab>
                                        {tab.text}
                                    </Tab>
                                </Link>
                            );

                        })}
                    </TabList>

                    {tabsInfo.map((tab, index) => {
                        return (
                            <TabPanel key={tab.text + index} style={{minHeight: '80vh', overflow: 'auto', paddingBottom: '2em'}}>
                                {tab.component()}
                            </TabPanel>
                        )
                    })
}
                </Tabs>
            </div>
        );
    }
}

export default TabsScreen;