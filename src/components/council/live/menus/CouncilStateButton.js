import React from 'react';
import OpenRoomButton from "./OpenRoomButton";
import StartCouncilButton from "./StartCouncilButton";
import EndCouncilButton from "./EndCouncilButton";
import { councilStarted, pointIsClosed } from "../../../../utils/CBX";
import { moment } from '../../../../containers/App';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { LoadingSection } from '../../../../displayComponents';

const CouncilStateButton = ({ translate, data, council, participants, refetch, recount, ...props }) => {
    const [unclosedAgendas, setUnclosedAgendas] = React.useState([]);

    React.useEffect(() => {
        if(!data.loading){
            const newUnclosed = data.agendas.filter(agenda => !pointIsClosed(agenda));

            if(newUnclosed.length !== unclosedAgendas.length){
                setUnclosedAgendas(newUnclosed);
            }
        }
    }, [data]);

    React.useEffect(() => {
        props.subscribeToPointStates({
            councilId: council.id
        })
    }, [council.id])

    if(data.loading){
        return <LoadingSection />
    }

    //TRADUCCION
    if(council.councilType > 1){
        if(councilStarted(council)){
            if(council.councilType === 3){
                return (
                    <div>
                        <EndCouncilButton
                            unclosedAgendas={unclosedAgendas}
                            council={council}
                            translate={translate}
                        />
                    </div>
                )
            }
            return (
                <div style={{fontSize: '0.9em', padding: '0.3em', display: 'flex'}}>
                    <div>
                        {`La reunión se cerrará automáticamente: ${moment(council.closeDate).format('LLL')}`}
                    </div>
                    <div style={{minWidth: '10em'}}>
                        <EndCouncilButton
                            unclosedAgendas={unclosedAgendas}
                            council={council}
                            translate={translate}
                        />
                    </div>
                </div>
            )
        }
        return (
            <div style={{fontSize: '0.9em', padding: '0.3em', display: 'flex'}}>
                <div>
                    {`La reunión comenzará automáticamente: ${moment(council.dateStart).format('LLL')}`}
                </div>
                <div style={{minWidth: '10em'}}>
                    <StartCouncilButton
                        recount={recount}
                        council={council}
                        translate={translate}
                        participants={participants}
                        refetch={refetch}
                    />
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>
            <OpenRoomButton
                translate={translate}
                council={council}
                refetch={refetch}
            />
            {(council.state === 20 || council.state === 30) && (
                !councilStarted(council) ? (
                    <div>
                        <StartCouncilButton
                            recount={recount}
                            council={council}
                            translate={translate}
                            participants={participants}
                            refetch={refetch}
                        />
                    </div>
                ) : (
                    <div>
                        <EndCouncilButton
                            unclosedAgendas={unclosedAgendas}
                            council={council}
                            translate={translate}
                        />
                    </div>
                )
            )}
        </React.Fragment>

    )
}


export default graphql(gql`
    query AgendaPointStates($councilId: Int!) {
		agendas(councilId: $councilId) {
            id
            pointState
            subjectType
            agendaSubject
            votingState
        }
    }

`, {
	options: props => ({
		variables: {
			councilId: props.council.id
        },
        fetchPolicy: 'network-only'
	}),
	props: props => {
		return {
            ...props,
            subscribeToPointStates: params => {
                return props.data.subscribeToMore({
                    document: gql`
                        subscription pointStateChanged($councilId: Int!) {
                            pointStateChanged(councilId: $councilId) {
                                id
                                pointState
                                agendaSubject
                                votingState
                            }
                        }
                    `,
                    variables: {
                        councilId: params.councilId
                    },
                    updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data.pointStateChanged) {
                            return prev;
                        }
                        const agendas = [...prev.agendas];
                        const index = prev.agendas.findIndex(agenda => agenda.id === subscriptionData.data.pointStateChanged.id);

                        agendas[index] = {
                            ...agendas[index],
                            ...subscriptionData.data.pointStateChanged
                        }

                        return ({
                            ...prev,
                            agendas
                        });
                    }
                    });
                }
		    };
	  }
})(CouncilStateButton);