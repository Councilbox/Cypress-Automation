import React from "react";
import { Paper, Typography, Divider, Card, Avatar, CardHeader, CardContent, Collapse, CardActions, Tooltip, Button } from "material-ui";
import { LoadingSection, Scrollbar, AlertConfirm } from '../../../displayComponents';
import { getPrimary } from "../../../styles/colors";
import AgendaMenu from './AgendaMenu';
import AgendaDescription from './AgendaDescription';
import { getAgendaTypeLabel, councilStarted } from '../../../utils/CBX';
import CouncilInfoMenu from '../menus/CouncilInfoMenu';
import TimelineSection from "../timeline/TimelineSection";
import * as CBX from '../../../utils/CBX';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import CommentModal from "./CommentModal";
import { moment, store } from "../../../containers/App";
import { logoutParticipant } from "../../../actions/mainActions";
import { updateCustomPointVoting } from "./CustomPointVotingMenu";
import FinishModal from "./FinishModal";
import Results from "../Results";
import ResultsTimeline from "../ResultsTimeline";
import { isMobile } from "../../../utils/screen";
import { agendaVotings } from "../../../queries/agenda";
import { usePolling } from "../../../hooks";
import { getSubjectAbrv } from "../../../displayComponents/AgendaNumber";


export const VotingContext = React.createContext({});

const styles = {
    container: {
        width: "100%",
        height: "calc( 100% - 2em )",
        overflow: 'hidden'
    },
    container100: {
        width: "100%",
        height: "100%",
        overflow: 'hidden'
    },
    agendasHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        justifyContent: 'space-between'
    }
};

const updateAgendaVoting = gql`
    mutation UpdateAgendaVoting($agendaVoting: AgendaVotingInput!){
        updateAgendaVoting(agendaVoting: $agendaVoting){
            success
            message
        }
    }
`;


const AgendaNoSession = ({ translate, council, participant, data, noSession, client, updateComment, ...props }) => {
    const primary = getPrimary();
    const scrollbar = React.useRef();
    let agendas = [];
    const [timelineSeeId, settimelineSeeId] = React.useState(0);
    const [responses, setResponses] = React.useState(new Map());
    const [finishModal, setFinishModal] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [idActive, setIdActive] = React.useState(false);

    let itemRefs = [];

    const renderAgendaCard = agenda => {
        return (
            <AgendaCard
                agenda={agenda}
                council={council}
                translate={translate}
                participant={participant}
                refetch={data.refetch}
                responses={responses}
                setResponse={setResponses}
                client={client}
            />
        )
    }

    const showFinishModal = () => {
        setFinishModal(true);
    }

    const sendVoteAndExit = async () => {
        const response = await Promise.all(Array.from(responses).filter(response => response[1] !== -1).map(response => {
            if (Array.isArray(response[1])) {
                return client.mutate({
                    mutation: updateCustomPointVoting,
                    variables: {
                        selections: response[1],
                        votingId: response[0]
                    }
                })
            }

            return client.mutate({
                mutation: updateAgendaVoting,
                variables: {
                    agendaVoting: {
                        id: response[0],
                        vote: response[1],
                    }
                }
            })
        }));

        if (response) {
            await client.mutate({
                mutation: gql`
                    mutation participantFinishedVoting{
                        participantFinishedVoting{
                            success
                        }
                    }
                `
            });
            await data.refetch();
            logout();
        }
    }

    React.useEffect(() => {
        if (data.participantVotings && responses.size === 0) {
            data.participantVotings.filter(voting => (
                voting.participantId === participant.id
                || voting.delegateId === participant.id ||
                voting.author.representative.id === participant.id)).forEach(voting => {
                    responses.set(voting.id, -1);
                });
            setResponses(new Map(responses));
        }
    }, [data]);

    React.useEffect(() => {

        // const showUnfinishedVoting = ev => {
        //     ev.preventDefault();
        //     return ev.returnValue = 'No ha enviado su voto, está seguro de querer salir, ¿confirmar?';
        // }

        // window.addEventListener("beforeunload", showUnfinishedVoting);

        // return () => window.removeEventListener("beforeunload", showUnfinishedVoting);
    }, [council.id]);



    const _renderModalBody = () => {
        return (
            <div style={{ width: "100%", height: "100%" }}>
                <div style={{ height: "100%", marginTop: "1em", overflow: "hidden", padding: "1em" }}>
                    <div style={{ marginBottom: "1em" }}>{translate.my_participation} - <span style={{ color: getPrimary() }}>{participant.name} {participant.surname || ''}</span></div>
                    <div style={{ height: "calc( 100% - 2.5em )", }}>
                        <Scrollbar>
                            <Results
                                stylesHead={{ marginTop: "1em", }}
                                council={council}
                                participant={participant}
                                translate={translate}
                                endPage={true}
                            />
                        </Scrollbar>
                    </div>
                </div>
            </div>
        )
    }

    const scrollToBottom = () => {
        scrollbar.current.scrollToBottom();
    }

    React.useEffect(() => {
        const readTimelines = async () => {
            const response = await client.query({
                query: readTimeline,
                variables: {
                    councilId: council.id,
                }
            });

            if (response.data && response.data.readTimeline && response.data.readTimeline > 0) {
                settimelineSeeId(JSON.parse(response.data.readTimeline[response.data.readTimeline.length - 1].content).data.participant.timeline)
            }
        }

        readTimelines();
    }, [council.id]);

    const logout = () => {
        store.dispatch(logoutParticipant(participant, council));
    };

    React.useLayoutEffect(() => {
        let id = "";
        data.agendas.map(agenda => {
            if (CBX.agendaPointOpened(agenda)) {
                id = agenda.id
            }
        });
        
        if (id !== idActive) {
            scrollTo(id);
            setIdActive(id);
        }

        if(props.timeline && idActive){
            setIdActive(false);
        }
    }, [data.agendas, props.timeline]);

    const scrollTo = (id) => {
        if (itemRefs[id] != null) {
            itemRefs[id].scrollIntoView();
        }
    }


    const renderExitModal = () => (
        <AlertConfirm
            requestClose={() => setShowModal(false)}
            open={showModal}
            acceptAction={logout}
            buttonCancel={translate.cancel}
            buttonAccept={translate.finish}
            bodyText={_renderModalBody()}
            bodyStyle={{ height: "60vh", overflow: "hidden" }}
            title={translate.summary}
        ></AlertConfirm>
    )

    const renderFinishModal = () => (
        <FinishModal
            open={finishModal}
            translate={translate}
            requestClose={() => setFinishModal(false)}
            action={sendVoteAndExit}
        />
    )

    const renderExitButton = () => (
        CBX.voteAllAtOnce({ council }) ?
            <Button
                onClick={showFinishModal}
                style={{
                    borderRadius: "25px",
                    background: "white",
                    color: primary,
                    height: "25px",
                    fontSize: "13px",
                    userSelect: 'none',
                    textTransform: "none",
                    minHeight: "0px",
                    lineHeight: '0.5',
                    borderColor: primary,
                    border: '2px solid',
                    marginRight: "0.5em"
                }}
            >
                <b>{translate.to_vote}</b>
            </Button>
            :
            <Button
                onClick={() => setShowModal(true)}
                style={{
                    borderRadius: "25px",
                    background: "white",
                    color: primary,
                    height: "25px",
                    fontSize: "13px",
                    textTransform: "none",
                    minHeight: "0px",
                    lineHeight: '0.5',
                    borderColor: primary,
                    border: '2px solid',
                    marginRight: "0.5em"
                }}
            >
                <b>{translate.finish}</b>
            </Button>
    )


    if (data.agendas) {
        agendas = data.agendas.map(agenda => {
            return {
                ...agenda,
                votings: data.participantVotings.filter(voting => voting.agendaId === agenda.id)
            }
        });
    }

    if (props.inPc) {
        return (
            <VotingContext.Provider value={{
                responses,
                setResponses
            }}>
                {renderFinishModal()}
                <Paper style={!noSession ? styles.container : styles.container100} elevation={4}>
                    <div style={{ height: "calc(100% - 2.5em)" }}>
                        {!props.sinCabecera &&
                            <React.Fragment>
                                <div style={{
                                    // display: 'flex',
                                    // alignItems: 'center',
                                    padding: '8px',
                                    // justifyContent: 'space-between'
                                    position: "relative",
                                    textAlign: "center"
                                }}>
                                    {/* <div style={styles.agendasHeader}> */}
                                    <div style={{}}>
                                        {/* <div style={{ width: '8em' }}> */}
                                    </div>
                                    {props.timeline ?
                                        (
                                            <React.Fragment>
                                                <Typography variant="title" style={{ fontWeight: '700' }}>{translate.summary}</Typography>
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <Typography variant="title" style={{ fontWeight: '700' }}>{translate.agenda}</Typography>
                                            </React.Fragment>
                                        )
                                    }
                                    <div style={{ position: "absolute", top: "3px", right: "5px" }}>
                                        {/* <div style={{ width: '9em' }}> */}
                                        <CouncilInfoMenu
                                            {...props}
                                            translate={translate}
                                            participant={participant}
                                            council={council}
                                            agendaNoSession={true}
                                            noSession={noSession}
                                        />

                                    </div>
                                </div>
                                <Divider />
                            </React.Fragment>
                        }
                        {props.sinCabecera &&
                            <div style={{ position: "fixed", top: '50px', right: "15px", background: "gainsboro", width: "47px", height: "32px", borderRadius: "25px" }}>
                                <CouncilInfoMenu
                                    {...props}
                                    noSession={noSession}
                                    translate={translate}
                                    participant={participant}
                                    council={council}
                                />
                            </div>
                        }
                        {props.timeline ? (
                            <div style={{ height: '100%', paddingBottom: '3em' }}>
                                <ResultsTimeline
                                    council={council}
                                    participant={participant}
                                    translate={translate}
                                    endPage={true}
                                />
                            </div>
                        ) : (
                                <Scrollbar ref={scrollbar}>
                                    {!councilStarted(council) &&
                                        <div style={{ backgroundColor: primary, width: '100%', padding: '1em', color: 'white', fontWeight: '700' }}>
                                            {translate.council_not_started_yet}
                                        </div>
                                    }
                                    {council.company.logo &&
                                        <div
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                height: '2.5em'
                                            }}
                                        >
                                            <img src={council.company.logo} style={{ height: '100%', width: 'auto', marginTop: '0.6em' }}></img>
                                        </div>
                                    }
                                    <div style={{ marginTop: '20px', marginBottom: '5rem', height: '100%' }}>
                                        {data.agendas ?
                                            <React.Fragment>
                                                {agendas.map((agenda, index) => {
                                                    // agenda.options =  {
                                                    //     maxSelections: 2,
                                                    //     id: 140
                                                    // }
                                                    return (
                                                        <React.Fragment key={`agenda_card_${index}`} >
                                                            <div ref={el => { itemRefs[agenda.id] = el }}>
                                                                {renderAgendaCard(agenda)}
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                })}
                                            </React.Fragment>
                                            :
                                            <LoadingSection />
                                        }
                                    </div>
                                </Scrollbar>
                            )}
                    </div>
                </Paper>
                {!noSession &&
                    <div style={{ marginTop: "0.5em", display: "flex", justifyContent: "flex-end" }}>
                        {renderExitButton()}
                    </div>
                }
                {renderExitModal()}
            </VotingContext.Provider>
        );
    }

    return (
        <VotingContext.Provider value={{
            setResponses,
            responses
        }}>
            {renderFinishModal()}
            <div style={{ height: !noSession ? "calc( 100% - 3em )" : "100%" }}>
                {!props.sinCabecera &&
                    <React.Fragment>
                        <div style={styles.agendasHeader}>
                            <Typography variant="title" style={{ fontWeight: '700' }}>{translate.agenda}</Typography>
                            <div style={{ width: '3em' }}>
                                <CouncilInfoMenu
                                    {...props}
                                    translate={translate}
                                    participant={participant}
                                    council={council}
                                    noSession={noSession}
                                />
                            </div>
                        </div>
                        <Divider />
                    </React.Fragment>
                }
                {props.sinCabecera &&
                    <div style={{ position: "relative", top: '5px', width: "100%", height: "32px", }}>
                        <CouncilInfoMenu
                            noSession={noSession}
                            {...props}
                            translate={translate}
                            participant={participant}
                            council={council}
                        />
                    </div>
                }
                {!councilStarted(council) &&
                    <div style={{ backgroundColor: primary, width: '100%', padding: '1em', color: 'white', fontWeight: '700' }}>
                        {translate.council_not_started_yet}
                    </div>
                }
                <div style={{ padding: '0.6em' }}> {/*marginTop: '10px',*/}
                    {data.agendas ?
                        <React.Fragment>
                            {agendas.map((agenda, index) => {
                                return (
                                    <React.Fragment key={`agenda_card_${index}`} >
                                        <div ref={el => { itemRefs[agenda.id] = el }}>
                                            {renderAgendaCard(agenda)}
                                        </div>
                                    </React.Fragment>
                                )

                            })}
                            {!noSession &&
                                <div style={{ marginTop: "0.5em", display: "flex", justifyContent: "flex-end" }}>
                                    {renderExitButton()}
                                </div>
                            }
                        </React.Fragment>

                        :
                        <LoadingSection />
                    }
                </div>

                {renderExitModal()}
            </div>
        </VotingContext.Provider>
    );
}

const AgendaCard = ({ agenda, translate, participant, refetch, council, client, ...props }) => {
    const ownVote = CBX.findOwnVote(agenda.votings, participant);
    const primary = getPrimary();
    const [state, setState] = React.useState({
        open: false,
        voteFilter: "all",
        stateFilter: "all",
        filterText: "",
        page: 1,
    });
    const [data, setData] = React.useState({});


    // const getData = async () => {
    //     ////ESTO ES AÑADIDO PROBAR BIEN
    //     const responseAgendaVotings = await client.query({
    //         query: agendaVotings,
    //         variables: {
    //             agendaId: agenda.id,
    //             ...buildVariables()
    //         }
    //     });

    //     setData(responseAgendaVotings.data);
    // }

    // usePolling(getData, 2000, []);
    // // usePolling(getData, 2000, [state.voteFilter, state.stateFilter, state.filterText, state.page]);

    // const buildVariables = () => {
    //     let variables = {
    //         filters: [],
    //         authorFilters: null
    //     };

    //     variables.options = {
    //         limit: 10,
    //         offset: (state.page - 1) * 10
    //     }

    //     if (state.voteFilter !== "all") {
    //         variables.filters = [
    //             {
    //                 field: "vote",
    //                 text: state.voteFilter
    //             }
    //         ];
    //     }

    //     if (state.filterText) {
    //         variables = {
    //             ...variables,
    //             authorFilters: {
    //                 username: state.filterText
    //             }
    //         };
    //     }

    //     if (state.stateFilter !== "all") {
    //         variables = {
    //             ...variables,
    //             filters: [
    //                 ...variables.filters,
    //                 {
    //                     field: "presentVote",
    //                     text: state.stateFilter
    //                 }
    //             ]
    //         };
    //     }

    //     return variables;
    // }

    const agendaStateIcon = agenda => {
        let title = '';
        if (council.councilType >= 2) {
            return <span />;
        }

        let icon = 'fa fa-lock';
        let color = ""
        if (CBX.agendaPointNotOpened(agenda) || CBX.agendaClosed(agenda)) {
            icon = "fa fa-lock colorGrey";
            title = translate.closed;
        }
        if (CBX.agendaPointOpened(agenda)) {
            icon = "fa fa-unlock-alt colorGren";
            color = "#278289";
            title = translate.in_discussion;
        }
        return (
            <Tooltip title={title}>
                <i
                    className={icon}
                    aria-label={icon === "fa fa-lock colorGrey" ? "punto cerrado" : "punto abierto"}
                    style={{ marginRight: '0.6em', cursor: 'auto', fontSize: "18px", color: color }}
                ></i>
            </Tooltip>
        );
    }


    const agendaVotingIcon = agenda => {
        let mostrar = agenda.subjectType !== 0;
        if (mostrar) {
            let title = translate.closed_votings;
            let color = 'default';
            if (CBX.agendaVotingsOpened(agenda)) {
                title = translate.opened_votings;
                color = "#278289";
            }
            return (
                <Tooltip title={title}>
                    <i
                        className={"material-icons"}
                        aria-label={title}
                        style={{ marginRight: '0.6em', fontSize: "20px", color, cursor: 'context-menu', }}
                    >
                        how_to_vote
                    </i>
                </Tooltip>
            );
        }
        return <span />;
    }


    return (
        <div style={{ margin: "0 auto", marginBottom: "15px", width: isMobile ? "100%" : '93%', }} key={agenda.id}>
            <Card
                aria-label={"punto" + (agenda.orderIndex + 1) + " " + translate[getAgendaTypeLabel(agenda)] + " título " + agenda.agendaSubject}
                style={{ border: CBX.agendaPointOpened(agenda) ? "1px solid purple" : 'none' }}
            >
                <CardHeader
                    action={
                        <div style={{ display: "flex" }}>
                            <div>
                                {agendaStateIcon(agenda)}
                            </div>
                            <div>
                                {agendaVotingIcon(agenda)}
                            </div>
                        </div>
                    }
                    title={<div style={{ fontSize: '17px', fontWeight: '700' }}>{agenda.agendaSubject}</div>}
                    subheader={translate[getAgendaTypeLabel(agenda)]}
                />
                <Collapse in={true} timeout="auto" unmountOnExit>
                    <CardContent>
                        <AgendaDescription agenda={agenda} translate={translate} />
                        <AgendaMenu
                            horizontal={true}
                            agenda={agenda}
                            council={council}
                            participant={participant}
                            translate={translate}
                            refetch={refetch}
                        // votings={data}
                        />
                    </CardContent>
                </Collapse>

                <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <CommentModal
                        translate={translate}
                        agenda={agenda}
                        participant={participant}
                        council={council}
                        refetch={refetch}
                    />
                    {(ownVote && ownVote.vote !== -1) &&
                        <Button
                            disableRipple
                            disabled
                            disableFocusRipple
                            style={{
                                textTransform: 'none',
                                fontStyle: 'italic',
                                fontSize: '12px',
                                color: primary,
                                fontWeight: '700'
                            }}
                        >
                            {`${translate.vote_registered} (${moment(ownVote.date).format('LLL')})`}
                        </Button>
                    }
                </CardActions>
            </Card>
        </div>
    )
}

const readTimeline = gql`
    query ReadTimeline($councilId: Int!){
        readTimeline(councilId: $councilId){
            id
            type
            date
            content
        }
    }
`;

export default withApollo(AgendaNoSession);