import React from 'react';
import * as mainActions from '../actions/mainActions';
import * as companyActions from '../actions/companyActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {lightGrey} from '../styles/colors';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import '../styles/react-tabs.css';
import {NavLink} from 'react-router-dom';

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
                    onSelect={tabIndex => this.setState({tabIndex})}>
                    <TabList>
                        {tabsInfo.map((tab, index) => {
                            return (
                                <Tab key={tab.text + index}>
                                    <NavLink
                                        to={tab.link}
                                        style={{
                                        color: 'black',
                                        textDecoration: 'none'
                                    }}
                                        activeStyle={{
                                        color: 'purple'
                                    }}>
                                        {tab.text}
                                    </NavLink>
                                </Tab>
                            );

                        })}
                    </TabList>

                    {tabsInfo.map((tab, index) => {
                        return (
                            <TabPanel key={tab.text + index}>
                                {tab.component}
                            </TabPanel>
                        )
                    })
}
                </Tabs>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(mainActions, dispatch),
        companyActions: bindActionCreators(companyActions, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(TabsScreen);