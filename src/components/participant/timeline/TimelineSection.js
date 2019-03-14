import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Scrollbar, LoadingSection } from '../../../displayComponents';
import { Paper } from 'material-ui';
import { Stepper, Step, StepLabel, StepContent } from 'material-ui';
import { moment } from '../../../containers/App';
import { isMobile } from 'react-device-detect';



const TimelineSection = React.memo(({ data }) => {
    if (isMobile) {
        return (
            data.loading ?
                <LoadingSection />
                :
                <Stepper orientation="vertical">
                    {data.councilTimeline.map(event => {
                        const content = JSON.parse(event.content);
                        return (
                            <Step active key={`event_${event.id}`}>
                                <StepLabel>
                                    <b>{getTimelineTranslation(event.type, content)}</b><br />
                                    <span style={{ fontSize: '0.9em' }}>{moment(event.date).format('LLL')}</span>
                                </StepLabel>
                                <StepContent style={{ fontSize: '0.9em' }}>
                                    {event.type === 'CLOSE_VOTING' &&
                                        <React.Fragment>
                                            <span>
                                                {`Resultados:`}
                                                <br />A favor: {content.data.agendaPoint.results.positive}
                                                <br />En contra: {content.data.agendaPoint.results.negative}
                                                <br />Abstención: {content.data.agendaPoint.results.abstention}
                                                <br />No vota: {content.data.agendaPoint.results.noVote}
                                            </span>
                                            <br />
                                        </React.Fragment>
                                    }
                                </StepContent>
                            </Step>
                        )
                    })}
                </Stepper>
        );
    } else {
        return (
            <Paper
                style={{
                    width: "100%",
                    height: "100vh",
                    overflow: 'hidden'
                }}
                elevation={0}
            >
                <Scrollbar>
                    {data.loading ?
                        <LoadingSection />
                        :
                        <Stepper orientation="vertical">
                            {data.councilTimeline.map(event => {
                                const content = JSON.parse(event.content);
                                return (
                                    <Step active key={`event_${event.id}`}>
                                        <StepLabel>
                                            <b>{getTimelineTranslation(event.type, content)}</b><br />
                                            <span style={{ fontSize: '0.9em' }}>{moment(event.date).format('LLL')}</span>
                                        </StepLabel>
                                        <StepContent style={{ fontSize: '0.9em' }}>
                                            {event.type === 'CLOSE_VOTING' &&
                                                <React.Fragment>
                                                    <span>
                                                        {`Resultados:`}
                                                        <br />A favor: {content.data.agendaPoint.results.positive}
                                                        <br />En contra: {content.data.agendaPoint.results.negative}
                                                        <br />Abstención: {content.data.agendaPoint.results.abstention}
                                                        <br />No vota: {content.data.agendaPoint.results.noVote}
                                                    </span>
                                                    <br />
                                                </React.Fragment>
                                            }
                                        </StepContent>
                                    </Step>
                                )
                            })}

                        </Stepper>
                    }
                </Scrollbar>
            </Paper>
        )
    }
})

const councilTimeline = gql`
    query CouncilTimeline($councilId: Int!){
        councilTimeline(councilId: $councilId){
            id
            type
            date
            content
        }
    }
`;

//TRADUCCION
const getTimelineTranslation = (type, content) => {
    const types = {
        'START_COUNCIL': () => 'Comienzo de reunión',
        'OPEN_VOTING': () => `${content.data.agendaPoint.name} - Apertura de votaciones`,
        'END_COUNCIL': () => 'Fin de reunión',
        'CLOSE_POINT_DISCUSSION': () => `${content.data.agendaPoint.name} - Cierre de discusión de punto`,
        'CLOSE_VOTING': () => `${content.data.agendaPoint.name} - Cierre de votaciones`,
        'REOPEN_VOTING': () => `${content.data.agendaPoint.name} - Reapertura de votaciones`,
        default: () => 'Tipo no reconocido'
    }

    return types[type] ? types[type]() : types.default();
}

export default graphql(councilTimeline, {
    options: props => ({
        variables: {
            councilId: props.council.id
        }
    })
})(TimelineSection);