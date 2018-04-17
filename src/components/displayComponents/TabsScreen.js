import React from 'react';
import { lightGrey } from '../../styles/colors';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../../styles/react-tabs.css';
import { Link } from 'react-router-dom';
import { getPrimary } from '../../styles/colors';
import { Add } from 'material-ui-icons';


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
        });
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
        const primary = getPrimary();

        return (
            <div
                style={{
                overflowY: 'hidden',
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
                                    <Tab style={tab.add && {backgroundColor: primary, color: 'white'}}>
                                        {tab.text}{tab.add && <Add style={{fontSize: '1em'}}/>}
                                    </Tab>
                                </Link>
                            );

                        })}
                    </TabList>

                    {tabsInfo.map((tab, index) => {
                        return (
                            <TabPanel key={tab.text + index} style={{height: '80vh', overflow: 'hidden', boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)", borderRadius: '0px 5px 5px 5px'}}>
                                {!!tab.component && tab.component()}                           
                            </TabPanel>
                        )
                    })}
                </Tabs>
            </div>
        );
    }
}

export default TabsScreen;