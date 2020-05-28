import React from 'react';
import { withApollo } from 'react-apollo';
import { BasicButton, AlertConfirm, LoadingSection } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';
import { ConfigContext } from '../../../../containers/AppControl';
import gql from 'graphql-tag';
import { AGENDA_TYPES, VOTE_VALUES } from '../../../../constants';
import { MenuItem, CircularProgress } from 'material-ui';
import VotingValueIcon from '../voting/VotingValueIcon';


const EarlyVotingModal = props => {
    const [modal, setModal] = React.useState(false);
    const config = React.useContext(ConfigContext);

    if(!config.earlyVoting){
        return null;
    }

    return (
        <>
            <BasicButton
                color="white"
                text="Adelantar voto"
                onClick={() => setModal(!modal)}
                textStyle={{
                    color: getSecondary()
                }}
            />
            <AlertConfirm
                open={modal}
                requestClose={() => setModal(false)}
                title={'Fijar sentido del voto'}
                bodyText={<EarlyVotingBody {...props } />}
            />
        </>
    )

}

const EarlyVotingBody = withApollo(({ council, participant, translate, client, ...props }) => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const getData = async () => {
        const response = await client.query({
            query: gql`
                query agendas($councilId: Int!, $participantId: Int!){
                    agendas(councilId: $councilId){
                        id
                        agendaSubject
                        subjectType
                    }
                    proxyVotes(participantId: $participantId){
                        value
                        agendaId
                        id
                    }
                }
            `,
            variables: {
                councilId: council.id,
                participantId: participant.id
            }
        });

        setData(response.data);
        setLoading(false);
    }

    const isActive = (agendaId, value) => {
        const vote = data.proxyVotes.find(proxy => proxy.agendaId === agendaId);
        
        if(!vote){
            return false;
        }

        return vote.value === value;
    }

    console.log(data);

    const setEarlyVote = async (agendaId, value) => {
        const response = await client.mutate({
            mutation: gql`
                mutation SetEarlyVote($participantId: Int!, $agendaId: Int!, $value: Int!){
                    setProxyVote(participantId: $participantId, agendaId: $agendaId, value: $value){
                        id
                    }
                }
            `,
            variables: {
                participantId: participant.id,
                agendaId,
                value
            }
        });

        getData();

        console.log(response);
    }

    React.useEffect(() => {
        getData();
    }, [council.id])


    return (
        <>
            {loading?
                <LoadingSection />
            :
                data.agendas.filter(point => point.subjectType !== AGENDA_TYPES.INFORMATIVE).map(point => {
                    return (
                        <div key={`point_${point.id}`}>
                            Punto: {point.agendaSubject}
                            <div style={{display: 'flex'}}>
                                {[VOTE_VALUES.POSITIVE, VOTE_VALUES.NEGATIVE, VOTE_VALUES.ABSTENTION, VOTE_VALUES.NO_VOTE].map(vote => {
                                    const active = isActive(point.id, vote);
                                    return (
                                        <div
                                            key={`vote_${vote}`}
                                            style={{
                                                height: "1.75em",
                                                width: "1.75em",
                                                marginRight: "0.2em",
                                                border: `2px solid ${"grey"}`,
                                                borderRadius: "3px",
                                                display: "flex",
                                                cursor: "pointer",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                            onClick={() => {
                                                setEarlyVote(point.id, vote)
                                            }}
                                        >
                                            <MenuItem
                                                selected={active}
                                                style={{
                                                    display: "flex",
                                                    fontSize: "0.9em",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    height: '100%',
                                                    width: '100%',
                                                    padding: 0,
                                                    margin: 0
                                                }}
                                            >
                                                {loading === vote?
                                                    <CircularProgress size={12} thickness={7} color={'primary'} style={{marginBottom: '0.35em'}} />
                                                :
                                                    <VotingValueIcon
                                                        vote={vote}
                                                        color={active ? undefined : "grey"}
                                                    />
                                                }
                                            </MenuItem>
                                        </div>
                                    )
                                })}
                            </div>
                            
                        </div>
                    )
                })
            }
        </>
    )
})

export default EarlyVotingModal;