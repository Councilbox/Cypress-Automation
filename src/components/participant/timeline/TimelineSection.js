import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Scrollbar, LoadingSection } from '../../../displayComponents';
import { Paper } from 'material-ui';
import { Stepper, Step, StepLabel, StepContent }  from 'material-ui';
import { moment } from '../../../containers/App';

const TimelineSection = React.memo(({ data }) => {
    return (
        <Paper
            style={{
                width: "100%",
                height: "100%",
                overflow: 'hidden'
            }}
            elevation={4}
        >
            <Scrollbar>
                {data.loading?
                    <LoadingSection />
                :
                    <Stepper orientation="vertical">
                        {data.councilTimeline.map(event => (
                            <Step active>
                                <StepLabel>
                                    <b>{getTimelineTranslation(event.type, event.content)}</b><br/>
                                    <span style={{fontSize: '0.9em'}}>{moment(event.date).format('LLL')}</span>
                                </StepLabel>
                            </Step>
                        ))}

                    </Stepper>
                }
            </Scrollbar>
        </Paper>
    )
})

const councilTimeline = gql`
    query CouncilTimeline($councilId: Int!){
        councilTimeline(councilId: $councilId){
            type
            date
            content
        }
    }
`;

//TRADUCCION
const getTimelineTranslation = (type, content) => {
    const parsedContent = JSON.parse(content);
    const types = {
        'START_COUNCIL': () => 'Comienzo de reunión',
        'OPEN_VOTING': () => `${parsedContent.data.agendaPoint.name} - Apertura de votaciones`,
        'END_COUNCIL': () => 'Fin de reunión',
        'CLOSE_POINT_DISCUSSION': () => `${parsedContent.data.agendaPoint.name} - Cierre de discusión de punto`,
        'CLOSE_VOTING': () => `${parsedContent.data.agendaPoint.name} - Cierre de votaciones`,
        'REOPEN_VOTING': () => `${parsedContent.data.agendaPoint.name} - Reapertura de votaciones`,
        default: () => 'Tipo no reconocido'
    }

    return types[type]? types[type]() : types.default();
}

export default graphql(councilTimeline, {
    options: props => ({
        variables: {
            councilId: props.council.id
        }
    })
})(TimelineSection);