import React from 'react';
import { Tabs, Tab, TabContainer, SwipeableViews } from 'material-ui';
import * as CBX from "../../../../utils/CBX";
import { Scrollbar } from '../../../../displayComponents';
import Votings from "../Votings";
import ActLiveSection from '../../writing/actEditor/ActLiveSection';
import Comments from '../Comments';

class ActPointTabs extends React.Component {

        state = {
        selectedTab: 0
    }

    handleChange = (event, index) => {
        this.setState({
            selectedTab: index
        })
    }


    render(){
        const { agenda, translate, council } = this.props;

        return(
            <div style={{height: '100%', backgroundColor: 'white'}}>
                <Tabs
                    value={this.state.selectedTab}
                    indicatorColor="secondary"
                    textColor="secondary"
                    onChange={this.handleChange}
                >
                    <Tab label={translate.proposed_act} />
                    <Tab label={translate.voting}/>
                    {CBX.councilHasComments(council.statute) &&
                        <Tab label={translate.act_comments}/>
                    }
                </Tabs>
                <div style={{width: '100%', height: 'calc(100% - 48px)', borderTop: '1px solid gainsboro'}}>
                    <Scrollbar>
                        {this.state.selectedTab === 0 &&
                            <div style={{padding: '1.5em', paddingRight: '4.5em'}}>
                                <ActLiveSection
                                    agenda={agenda}
                                    translate={translate}
                                    council={this.props.council}
                                    refetch={this.props.refetch}
                                    companyId={this.props.council.companyId}
                                    data={this.props.data}
                                />
                            </div>
                        }
                        {this.state.selectedTab === 1 &&
                            <div style={{padding: '1.5em', paddingRight: '4.5em'}}>
                                <Votings
                                    ref={votings => (this.votings = votings)}
                                    agenda={agenda}
                                    majorities={this.props.data.majorities}
                                    translate={translate}
                                />
                            </div>
                        }
                        {this.state.selectedTab === 2 &&
                            <Comments
                                agenda={agenda}
                                council={council}
                                translate={translate}
                            />

                        }
                    </Scrollbar>
                </div>
            </div>
        )
    }
}

export default ActPointTabs;

/*
    <React.Fragment>
                            {CBX.councilHasComments(council.statute) && (
                                <div
                                    style={{
                                        width: "100%",
                                        marginTop: "0.4em"
                                    }}
                                    className="withShadow"
                                >
                                    <Comments
                                        agenda={agenda}
                                        council={council}
                                        translate={translate}
                                    />
                                </div>
                            )}
                            {CBX.showAgendaVotingsTable(agenda) &&
                                <div
                                    style={{
                                        width: "100%",
                                        marginTop: "0.4em"
                                    }}
                                    className="withShadow"
                                >
                                    <Votings
                                        ref={votings => (this.votings = votings)}
                                        agenda={agenda}
                                        majorities={this.props.data.majorities}
                                        translate={translate}
                                    />
                                </div>
                            }
                        </React.Fragment>
*/