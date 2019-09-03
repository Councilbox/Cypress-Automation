import React from 'react';
import { LoadingSection, BasicButton, TextInput, Scrollbar } from '../../../../displayComponents';
import { InputAdornment, Card, IconButton, CardHeader, Typography, Collapse, CardContent } from 'material-ui';
import FontAwesome from "react-fontawesome";
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import NotificationsTable from '../../../notifications/NotificationsTable';
import {  updateParticipantSends } from "../../../../queries";
import ParticipantContactEditor from './ParticipantContactEditor';
import StateIcon from '../../../council/live/participants/StateIcon';
import { useOldState } from '../../../../hooks';

const CredentialsManager = ({ translate, ...props }) => {
    const [state, setState] = useOldState({
        page: 1,
        limit: 10,
        filterText: '',
        visible: false
    });
    const [filter, setFilter] = React.useState(null);

    const toggleFilter = () => {
        setFilter(!filter? 'failed' : null);
    }

    const updatePage = page => {
        setState({
            page
        });
    }

    if(props.data.loading){
        return <LoadingSection />
    }

    const filteredParticipants = filterParticipants(props.data.liveParticipants.list, state.filterText);
    const slicedParticipants = filteredParticipants.slice((state.page - 1 ) * state.limit, ((state.page  - 1 ) * state.limit) + state.limit);

    return (
         <div style={{ height: "100%", overflow: "hidden", width: "100%" }}>
                <TextInput
                    value={state.filterText}
                    onChange={event => setState({ filterText: event.target.value })}
                    startAdornment={
                        <InputAdornment position="start" style={{ marginRight: "1em" }}>
                            <i className="fa fa-search" aria-hidden="true"></i>
                        </InputAdornment>
                    }
                />
                <BasicButton
                    text="Ver solo fallidos"
                    textStyle={{ fontWeight: '700' }}
                    loading={state.sendsLoading}
                    onClick={toggleFilter}
                />
                <div style={{ overflow: "hidden", height: "calc( 100% - 56px )", }}>
                    <Scrollbar>
                        {slicedParticipants.map(participant => (
                            <div key={`participant_${participant.id}`}>
                                <Content
                                    participant={participant}
                                    translate={translate}
                                    refetch={props.data.refetch}
                                    council={props.council}
                                />
                            </div>
                        ))}
                        <div style={{ display: 'flex', fontWeight: '700', alignItems: 'center', paddingTop: '0.5em' }}>
                            {state.page > 1 &&
                                <div onClick={() => updatePage(state.page - 1)} style={{ userSelect: 'none', fontSize: '1em', border: '1px solid white', padding: '0 0.2em', cursor: 'pointer' }}>{'<'}</div>
                            }
                            <div style={{ margin: '0 0.3em' }}>{state.page}</div>
                            {(state.page < (props.data.liveParticipants.total / state.limit)) &&
                                <div onClick={() => updatePage(state.page + 1)} style={{ userSelect: 'none', fontSize: '1em', border: '1px solid white', padding: '0 0.2em', cursor: 'pointer' }}>{'>'}</div>
                            }

                        </div>
                    </Scrollbar>
                </div>
            </div>
    )
}


const Content = ({ participant, translate, refetch, council }) => {
    const [expanded, setExpanded] = React.useState(false)

    const toggleExpanded = () => {
        setExpanded(!expanded);
    }

    return (
        <Card style={{ marginLeft: '1px', marginRight: '15px', marginTop: "15px" }}  >
            <CardHeader
                onClick={toggleExpanded}
                style={{ cursor: "pointer" }}
                avatar={
                    <StateIcon state={participant.state} translate={translate} ratio={1.4} />
                }
                action={
                    <IconButton
                        style={{ top: '20px', }}
                        onClick={toggleExpanded}
                        aria-expanded={expanded}
                        aria-label="Show more"
                        className={"expandButtonModal"}
                    >
                        <FontAwesome
                            name={"angle-down"}
                            style={{
                                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "all 0.3s"
                            }}
                        />
                    </IconButton>
                }
                title={`${participant.name} ${participant.surname}`}
                subheader={
                    <React.Fragment>
                        <Typography style={{ color: 'grey' }}>{participant.email}</Typography>
                        <Typography style={{ color: 'grey' }}>{participant.phone}</Typography>
                    </React.Fragment>
                }
            />
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <div style={{  }}>
                        <ParticipantContactEditor
                            participant={participant}
                            translate={translate}
                            refetch={refetch}
                            key={participant.id}
                            council={council}
                        />
                    </div>
                    <div style={{ padding: "1em 0px" }}>
                        <NotificationsTable
                            maxEmail={{maxWidth: '100px'}}
                            translate={translate}
                            notifications={participant.notifications}
                        />
                    </div>
                </CardContent>
            </Collapse>
        </Card>
    )
}


const filterParticipants = (participants, text) => {
    if (!text) {
        return participants;
    }
    const lText = text.toLowerCase();
    return participants.filter(participant => {
        return `${participant.name} ${participant.surname}`.toLowerCase().includes(lText) || participant.email.toLowerCase().includes(lText) || participant.phone.includes(lText)
    });
}

const participants = gql`
    query CredsParticipants($councilId: Int!, $options: OptionsInput){
        liveParticipants(councilId: $councilId, options: $options){
            list {
                name
                surname
                phone
                email
                state
                id
                notifications {
                    participantId
                    email
                    reqCode
                    refreshDate
                    sendDate
                    sendType
                }
            }
        total
    }
}
`;

export default compose(
    graphql(participants, {
        options: props => ({
            variables: {
                councilId: props.council.id,
                options: {
                    orderBy: 'fullName',
                    orderDirection: 'asc'
                }
            }
        })
    }),
    graphql(updateParticipantSends, {
        name: "updateParticipantSends"
    })
)(CredentialsManager);

