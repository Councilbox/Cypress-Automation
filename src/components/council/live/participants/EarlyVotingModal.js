import React from 'react';
import { withApollo } from 'react-apollo';
import { BasicButton, AlertConfirm, LoadingSection } from '../../../../displayComponents';
import { getSecondary, getPrimary } from '../../../../styles/colors';
import { ConfigContext } from '../../../../containers/AppControl';
import gql from 'graphql-tag';
import { AGENDA_STATES, AGENDA_TYPES, VOTE_VALUES } from '../../../../constants';
import { VotingButton } from '../../../participant/agendas/VotingMenu';
import { agendaVotingsOpened, isConfirmationRequest, isCustomPoint } from '../../../../utils/CBX';


const EarlyVotingModal = props => {
    const [modal, setModal] = React.useState(false);
    const config = React.useContext(ConfigContext);

    if (!config.earlyVoting) {
        return null;
    }

    return (
        <>
            <BasicButton
                color="white"
                text={props.translate.anticipate_vote}
                type="flat"
                buttonStyle={{
                    border: `1px solid ${getSecondary()}`,
                    marginTop: '0.3em'
                }}
                onClick={() => setModal(!modal)}
                textStyle={{
                    color: getSecondary()
                }}
            />
            <AlertConfirm
                open={modal}
                requestClose={() => setModal(false)}
                title={'Fijar sentido del voto'}
                bodyText={<EarlyVotingBody {...props} />}
            />
        </>
    )

}

const EarlyVotingBody = withApollo(({ council, participant, translate, client, ...props }) => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [loadingVote, setLoadingVote] = React.useState(false);

    const getData = async () => {
        const response = await client.query({
            query: gql`
                query agendas($councilId: Int!, $participantId: Int!){
                    agendas(councilId: $councilId){
                        id
                        agendaSubject
                        subjectType
                        votingState
                        items {
                            id
                            value
                        }
                        options {
                            id
                            maxSelections
                            minSelections
                        }
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

    const getProxyVote = (agendaId, value, custom) => {
        const vote = data.proxyVotes.find(proxy => {
            if (!custom) {
                return proxy.agendaId === agendaId;
            } else {
                return proxy.agendaId === agendaId && value === proxy.value;
            }
        });

        if (!vote) {
            return false;
        }

        return vote;
    }

    const deleteProxyVote = async (agendaId, participantId) => {
        const response = await client.mutate({
            mutation: gql`
                mutation DeleteProxyVote( $agendaId: Int!, $participantId: Int!){
                    deleteProxyVote(agendaId: $agendaId, participantId: $participantId){
                        success
                    }
                }
            `,
            variables: {
                agendaId: agendaId,
                participantId: participantId
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
            {loading ?
                <LoadingSection />
                :
                data.agendas.filter(point => point.subjectType !== AGENDA_TYPES.INFORMATIVE).map(point => {
                    const disabled = point.votingState !== AGENDA_STATES.INITIAL;

                    if (isConfirmationRequest(point.subjectType)) {
                        return (
                            <div key={`point_${point.id}`}>
                                <div style={{ fontWeight: '700', marginTop: '1em' }}>{point.agendaSubject}</div>
                                <div>
                                    {[{
                                        value: VOTE_VALUES.POSITIVE,
                                        label: translate.accept,
                                        icon: "fa fa-check"
                                    }, {
                                        value: VOTE_VALUES.NEGATIVE,
                                        label: translate.refuse,
                                        icon: "fa fa-times"
                                    }].map(vote => {
                                        const proxyVote = getProxyVote(point.id, vote.value);
                                        const active = vote.value === proxyVote.value;
                                        return (
                                            <div
                                                key={`vote_${vote.value}`}
                                                style={{
                                                    marginRight: "0.2em",
                                                    borderRadius: "3px",
                                                    display: "flex",
                                                    cursor: "pointer",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                                onClick={() => {
                                                    setEarlyVote(point.id, vote.value);
                                                }}
                                            >
                                                <VotingButton
                                                    text={vote.label}
                                                    selected={active}
                                                    disabledColor={disabled ? 'grey' : null}
                                                    disabled={disabled}
                                                    icon={<i className={vote.icon} aria-hidden="true" style={{ marginLeft: '0.2em', color: active ? getPrimary() : 'silver' }}></i>}
                                                />
                                            </div>
                                        )
                                    })}
                                    <VotingButton
                                        text={translate.cant_vote_this_point}
                                        selected={getProxyVote(point.id, null) ? getProxyVote(point.id, null).value === null : false}
                                        disabledColor={disabled ? 'grey' : null}
                                        disabled={disabled}
                                        onClick={() => setVotingRightDenied(point.id)}
                                    />
                                </div>
                                <div style={{ marginTop: "10px" }}>
                                    <BasicButton
                                        color="white"
                                        text="Eliminar"
                                        backgroundColor={{
                                            border: '1px solid ' + getSecondary(),
                                            borderRadius: '4px',
                                            marginTotop: '0.3em',
                                            color: getSecondary(),
                                            backgroundColor: 'white',
                                            outline: '0px',
                                        }}
                                        onClick={() => deleteProxyVote(point.id, participant.id)}
                                    />
                                </div>
                            </div>
                        )
                    }

                    if (!isCustomPoint(point.subjectType)) {
                        return (
                            <div key={`point_${point.id}`}>
                                <div style={{ fontWeight: '700', marginTop: '1em' }}>{point.agendaSubject}</div>
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
                                        const proxyVote = getProxyVote(point.id, vote.value);
                                        const active = vote.value === proxyVote.value;
                                        return (
                                            <div
                                                key={`vote_${vote.value}`}
                                                style={{
                                                    marginRight: "0.2em",
                                                    borderRadius: "3px",
                                                    display: "flex",
                                                    cursor: "pointer",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                                onClick={() => {
                                                    setEarlyVote(point.id, vote.value);
                                                }}
                                            >
                                                <VotingButton
                                                    text={vote.label}
                                                    selected={active}
                                                    disabledColor={disabled ? 'grey' : null}
                                                    disabled={disabled}
                                                    icon={<i className={vote.icon} aria-hidden="true" style={{ marginLeft: '0.2em', color: active ? getPrimary() : 'silver' }}></i>}
                                                />
                                            </div>
                                        )
                                    })}
                                    <VotingButton
                                        text={translate.cant_vote_this_point}
                                        selected={getProxyVote(point.id, null) ? getProxyVote(point.id, null).value === null : false}
                                        disabledColor={disabled ? 'grey' : null}
                                        disabled={disabled}
                                        onClick={() => setVotingRightDenied(point.id)}
                                    />
                                </div>
                                <div style={{ marginTop: "10px" }}>
                                    <BasicButton
                                        color="white"
                                        text="Eliminar"
                                        backgroundColor={{
                                            border: '1px solid ' + getSecondary(),
                                            borderRadius: '4px',
                                            marginTotop: '0.3em',
                                            color: getSecondary(),
                                            backgroundColor: 'white',
                                            outline: '0px',
                                        }}
                                        onClick={() => deleteProxyVote(point.id, participant.id)}
                                    />
                                </div>
                            </div>
                        )
                    }

                    const selections = point.items.reduce((acc, curr) => {
                        if (getProxyVote(point.id, curr.id, true)) {
                            acc++;
                            return acc;
                        }
                        return acc;
                    }, 0)

                    const getRemainingOptions = () => {
                        console.log(selections)
                        if (((point.options.minSelections - selections) < 0)) {
                            return point.options.minSelections;
                        } else {
                            return point.options.minSelections - selections
                        }
                    }

                    const disableCustom = (selections >= point.options.maxSelections) || disabled;

                    return (
                        <div key={`point_${point.id}`} style={{ marginTop: '1.3em' }}>
                            Punto: {point.agendaSubject}
                            {(point.options.maxSelections > 1) &&
                                < div > {
                                    translate.can_select_between_min_max
                                        .replace('{{min}}', point.options.minSelections)
                                        .replace('{{max}}', point.options.maxSelections)
                                }
                                </div>
                            }
                            <div>
                                {(point.options.minSelections - selections) > 0 &&
                                    <React.Fragment>{translate.need_select_more.replace('{{options}}', getRemainingOptions())}</React.Fragment>
                                }
                                {/* {(selections.length < point.options.minSelections && point.options.minSelections > 1) &&
                                    <React.Fragment>{translate.need_select_more.replace('{{options}}', getRemainingOptions())}</React.Fragment>
                                } */}
                            </div>
                            <div>
                                {point.items.map(item => {
                                    const proxyVote = getProxyVote(point.id, item.id, true);
                                    const active = proxyVote.value === item.id;
                                    return (
                                        <VotingButton
                                            disabled={disableCustom && !active}
                                            disabledColor={disableCustom && !active}
                                            styleButton={{ padding: '0', width: '100%' }}
                                            selectCheckBox={active}
                                            onClick={() => {
                                                setEarlyVote(point.id, item.id);
                                            }}
                                            text={item.value}
                                        />
                                    )
                                })}
                                <VotingButton
                                    text={translate.cant_vote_this_point}
                                    selected={getProxyVote(point.id, null) ? getProxyVote(point.id, null).value === null : false}
                                    disabledColor={disabled ? 'grey' : null}
                                    disabled={disabled}
                                    onClick={() => setVotingRightDenied(point.id)}
                                />
                            </div>
                            <div style={{ marginTop: "10px" }}>
                                <BasicButton
                                    color="white"
                                    text="Eliminar"
                                    backgroundColor={{
                                        border: '1px solid' + getSecondary(),
                                        borderRadius: '4px',
                                        marginTotop: '0.3em',
                                        color: getSecondary(),
                                        backgroundColor: 'white',
                                        outline: '0px',
                                    }}
                                    onClick={() => deleteProxyVote(point.id, participant.id)}
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