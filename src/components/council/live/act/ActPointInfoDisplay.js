import React from 'react';
import { AGENDA_STATES } from '../../../../constants';
import ActEditor from '../../writing/actEditor/ActEditor';
import ActLiveSection from '../../writing/actEditor/ActLiveSection';
import Comments from '../Comments';
import Votings from '../Votings';
import * as CBX from '../../../../utils/CBX';


class ActPointInfoDisplay extends React.Component {

    render(){
        const { agenda, council, translate } = this.props;

        return(
            <div>
            {agenda.pointState === AGENDA_STATES.DISCUSSION &&
                <React.Fragment>
                    {agenda.votingState === AGENDA_STATES.INITIAL &&
                        <div style={{paddingRight: '3.5em'}}>
                            <ActEditor
                                liveMode={true}
                                councilID={this.props.council.id}
                                companyID={this.props.council.companyId}
                                translate={this.props.translate}
                                refetch={this.props.refetch}
                            />
                        </div>
                    }
                    {(agenda.votingState === AGENDA_STATES.DISCUSSION || agenda.votingState === AGENDA_STATES.CLOSED)  &&
                        <React.Fragment>
                            <ActLiveSection
                                agenda={agenda}
                                translate={translate}
                                council={this.props.council}
                                refetch={this.props.refetch}
                                companyId={this.props.council.companyId}
                                data={this.props.data}
                            />
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
                    }
                </React.Fragment>
            }
            </div>
        )
    }
}

export default ActPointInfoDisplay;