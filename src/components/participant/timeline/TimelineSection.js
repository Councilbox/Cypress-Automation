import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Scrollbar, LoadingSection } from '../../../displayComponents';
import { Paper } from 'material-ui';
import { Stepper, Step, StepLabel, StepContent } from 'material-ui';
import { moment } from '../../../containers/App';
import { isMobile } from 'react-device-detect';
import CouncilInfoMenu from '../menus/CouncilInfoMenu';



const TimelineSection = React.memo(({ data, translate, participant, council }) => {

    return (
        data.loading ?
            <LoadingSection />
            :
            <React.Fragment>
                <div style={{ position: "fixed", top: '50px', right: "15px", background: "gainsboro", width: "47px", height: "32px", borderRadius: "25px" }}>
                    <CouncilInfoMenu
                        translate={translate}
                        participant={participant}
                        council={council}
                        agendaNoSession={true}
                    />
                </div>
                <Stepper orientation="vertical" style={{ margin: '0', padding: isMobile ? '20px' : '10px' }}>
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
            </React.Fragment>
    );
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