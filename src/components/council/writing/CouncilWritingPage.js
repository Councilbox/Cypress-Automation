import React, { Component, Fragment } from 'react';

import {
    CardPageLayout, LoadingSection, ErrorWrapper
} from "../../../displayComponents";
import { getPrimary, getSecondary } from '../../../styles/colors';
import { graphql, withApollo } from 'react-apollo';
import ParticipantsSection from '../prepare/ParticipantsSection';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Scrollbar from 'react-perfect-scrollbar';
import Convene from '../convene/Convene';
import ActEditor from './actEditor/ActEditor';
import gql from "graphql-tag";

export const councilDetails = gql `
  query CouncilDetails($councilID: Int!) {
    council(id: $councilID) {
      dateEnd
      dateRealStart
      dateStart
      dateStart2NdCall
      state
      statute {
        id
        prototype
        councilId
        statuteId
        title
        existPublicUrl
        addParticipantsListToAct
        existsAdvanceNoticeDays
        advanceNoticeDays
        existsSecondCall
        minimumSeparationBetweenCall
        canEditConvene
        firstCallQuorumType
        firstCallQuorum
        firstCallQuorumDivider
        secondCallQuorumType
        secondCallQuorum
        secondCallQuorumDivider
        existsDelegatedVote
        delegatedVoteWay
        existMaxNumDelegatedVotes
        maxNumDelegatedVotes
        existsLimitedAccessRoom
        limitedAccessRoomMinutes
        existsQualityVote
        qualityVoteOption
        canUnblock
        canAddPoints
        canReorderPoints
        existsAct
        includedInActBook
        includeParticipantsList
        existsComments
        conveneHeader
        intro
        constitution
        conclusion
        actTemplate
        censusId
      }
     
    }

    councilTotalVotes(councilId: $councilID)
    councilSocialCapital(councilId: $councilID)
  }
`;

const panelStyle = {
    height: '77vh',
    overflow: 'hidden',
    boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)",
    borderRadius: '0px 5px 5px 5px',
    padding: '1vw'
};


class CouncilWritingPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            participants: false,
            sendReminder: false,
            sendConvene: false,
            cancel: false,
            rescheduleCouncil: false
        }
    }

    componentDidMount() {
        this.props.data.refetch();
    }

    render() {
        const { council, error, loading } = this.props.data;
        const { translate } = this.props;
        const primary = getPrimary();
        const secondary = getSecondary();

        if (loading) {
            return (<LoadingSection/>);
        }

        if (error) {
            return (<ErrorWrapper error={error} translate={translate}/>)
        }

        return (<CardPageLayout title={translate.companies_writing}>
            <Tabs
                selectedIndex={this.state.selectedTab}
                style={{
                    padding: '0',
                    width: '100%',
                    margin: '0'
                }}>

                <TabList>
                    <Tab onClick={() => this.setState({
                        page: !this.state.page
                    })}>
                        {translate.act}
                    </Tab>
                    <Tab onClick={() => this.setState({
                        page: !this.state.page
                    })}>
                        {translate.convene}
                    </Tab>
                    <Tab onClick={() => this.setState({
                        page: !this.state.page
                    })}>
                        {translate.new_list_called}
                    </Tab>
                </TabList>
                <TabPanel style={panelStyle}>
                    <ActEditor councilID={this.props.councilID}
                               companyID={this.props.companyID}
                             translate={translate}/>
                </TabPanel>
                <TabPanel style={panelStyle}>
                    <Convene councilID={this.props.councilID}
                             translate={translate}/>
                </TabPanel>

                <TabPanel style={panelStyle}>
                    <Scrollbar>
                        <ParticipantsSection
                            translate={translate}
                            council={council}
                            totalVotes={this.props.data.councilTotalVotes}
                            socialCapital={this.props.data.councilSocialCapital}
                            refetch={this.props.data.refetch}
                        />
                    </Scrollbar>
                </TabPanel>
            </Tabs>
        </CardPageLayout>);
    }
}

export default graphql(councilDetails, {
    name: "data",
    options: (props) => ({
        variables: {
            councilID: props.councilID,
        }
    })
})(withApollo(CouncilWritingPage));