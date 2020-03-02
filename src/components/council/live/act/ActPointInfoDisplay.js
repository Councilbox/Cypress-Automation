import React from 'react';
import { AGENDA_STATES } from '../../../../constants';
import ActEditor from '../../writing/actEditor/ActEditor';
import ActPointTabs from './ActPointTabs';


class ActPointInfoDisplay extends React.Component {

    render(){
        const { agenda, council, translate } = this.props;

        return(
            <div style={{height: '100%'}}>
            {agenda.pointState === AGENDA_STATES.DISCUSSION &&
                <React.Fragment>
                    {agenda.votingState === AGENDA_STATES.INITIAL &&
                        <div style={{paddingRight: '3.5em', height: '100%', paddingLeft: "1em"}} >
                            <ActEditor
                                withDrawer={true}
                                liveMode={true}
                                councilID={this.props.council.id}
                                companyID={this.props.council.companyId}
                                translate={this.props.translate}
                                refetch={this.props.refetch}
                            />
                        </div>
                    }
                    {(agenda.votingState === AGENDA_STATES.DISCUSSION || agenda.votingState === AGENDA_STATES.CLOSED)  &&
                        <ActPointTabs
                            {...this.props}
                            agenda={agenda}
                            council={council}
                            translate={translate}
                            refetch={this.props.refetch}
                            data={this.props.data}
                        />
                    }
                </React.Fragment>
            }
            </div>
        )
    }
}

export default ActPointInfoDisplay;