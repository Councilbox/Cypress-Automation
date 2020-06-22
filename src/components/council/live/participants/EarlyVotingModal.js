import React from 'react';
import { withApollo } from 'react-apollo';
import { BasicButton, AlertConfirm, LoadingSection } from '../../../../displayComponents';
import { getSecondary, getPrimary } from '../../../../styles/colors';
import { ConfigContext } from '../../../../containers/AppControl';
import gql from 'graphql-tag';
import { AGENDA_TYPES, VOTE_VALUES } from '../../../../constants';
import { MenuItem, CircularProgress } from 'material-ui';
import VotingValueIcon from '../voting/VotingValueIcon';
import { VotingButton } from '../../../participant/agendas/VotingMenu';
import { agendaVotingsOpened } from '../../../../utils/CBX';


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
                text={props.translate.anticipate_vote}
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
    const [loadingVote, setLoadingVote] = React.useState(false);

    console.log(data);

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

    const deleteProxyVote = async agendaId => {
        await client.mutate({
            mutation: gql`
                mutation DeleteProxyVote($participantId: Int!, $agendaId: Int!){
                    deleteProxyVote(participantId: $participantId, agendaId: $agendaId){
                        success
                    }
                }
            `,
            variables: {
                participantId: participant.id,
                agendaId,
            }
        });

        getData();
    }

    const setVotingRightDenied = async agendaId => {
        setLoadingVote(agendaId);
        const response = await client.mutate({
            mutation: gql`
                mutation SetVotingRightDenied($participantId: Int!, $agendaId: Int!){
                    setVotingRightDenied(participantId: $participantId, agendaId: $agendaId){
                        id
                    }
                }
            `,
            variables: {
                participantId: participant.id,
                agendaId
            }
        });
        setLoadingVote(null);
        getData();
    }

    const setEarlyVote = async (agendaId, value) => {
        setLoadingVote(agendaId);
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

        setLoadingVote(null);
        getData();
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
                        <div key={`point_${point.id}`} style={{marginTop: '1em'}}>
                            <b>Punto: {point.agendaSubject}</b>
                            <BasicButton
                                color="white"
                                text="Eliminar"
                                buttonStyle={{
                                    marginLeft: '1em'
                                }}
                                textStyle={{
                                    color: getSecondary()
                                }}
                                onClick={() => deleteProxyVote(point.id)}
                            />
                            <div>
                                {[{
                                    value: VOTE_VALUES.POSITIVE,
                                    label: translate.in_favor_btn,
                                    icon: "fa fa-check"
                                }, {
                                    value: VOTE_VALUES.NEGATIVE,
                                    label: translate.against_btn,
                                    icon: "fa fa-times"
                                }, {
                                    value: VOTE_VALUES.ABSTENTION,
                                    label: translate.abstention_btn,
                                    icon: 'fa fa-circle-o'
                                }].map(vote => {
                                    const active = isActive(point.id, vote.value);
                                    return (
                                        <VotingButton
                                            loading={loadingVote === point.id}
                                            text={vote.label}
                                            disabled={agendaVotingsOpened(point)}
                                            key={`vote_${vote.value}`}
                                            onClick={() => {
                                                setEarlyVote(point.id, vote.value)
                                            }}
                                            selected={active}
                                            icon={<i className={vote.icon} aria-hidden="true" style={{ marginLeft: '0.2em', color: active ? getPrimary() : 'silver' }}></i>}
                                        />
                                    )
                                })}
                                <VotingButton
                                    text={'No puede votar este punto'}
                                    selected={isActive(point.id, null)}
                                    disabled={agendaVotingsOpened(point)}
                                    onClick={() => setVotingRightDenied(point.id)}
                                    //icon={<i className={vote.icon} aria-hidden="true" style={{ marginLeft: '0.2em', color: active ? getPrimary() : 'silver' }}></i>}
                                />
                            </div>
                            
                        </div>
                    )
                })
            }
        </>
    )
})

export default EarlyVotingModal;