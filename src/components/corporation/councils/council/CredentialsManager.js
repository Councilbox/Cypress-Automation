import React from 'react';
import { LoadingSection, BasicButton, CollapsibleSection, AlertConfirm, TextInput, Scrollbar } from '../../../../displayComponents';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import NotificationsTable from '../../../notifications/NotificationsTable';
import { liveParticipant, updateParticipantSends } from "../../../../queries";
import ParticipantContactEditor from './ParticipantContactEditor';
import { PARTICIPANT_STATES } from '../../../../constants';
import StateIcon from '../../../council/live/participants/StateIcon';
import { InputAdornment, Card, Avatar, IconButton, CardHeader, Typography, Collapse, CardContent } from 'material-ui';
import FontAwesome from "react-fontawesome";
import { transition } from '../../../../styles/styles';


class CredentialsManager extends React.Component {

    state = {
        page: 1,
        limit: 10,
        filterText: '',
        visible: false,
        expanded: false
    }

    toggleVisible = () => {
        this.setState({
            visible: !this.state.visible
        });
    }

    toggleExpanded = () => {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    refreshSends = async id => {
        const response = await this.props.updateParticipantSends({
            variables: {
                participantId: id
            }
        });

        this.props.data.refetch();
    }

    updatePage = page => {
        this.setState({
            page: page
        });
    }


    render() {
        if (this.props.data.loading) {
            return <LoadingSection />
        }

        const filteredParticipants = filter(this.props.data.liveParticipants.list, this.state.filterText);
        const slicedParticipants = filteredParticipants.slice((this.state.page - 1) * this.state.limit, ((this.state.page - 1) * this.state.limit) + this.state.limit);

        return (
            <div style={{ height: "100%", overflow: "hidden", width: "100%" }}>
                <TextInput
                    value={this.state.filterText}
                    onChange={event => this.setState({ filterText: event.target.value })}
                    startAdornment={
                        <InputAdornment position="start" style={{ marginRight: "1em" }}>
                            <i className="fa fa-search" aria-hidden="true"></i>
                        </InputAdornment>
                    }
                />
                <div style={{ overflow: "hidden", height: "calc( 100% - 56px )", }}>
                    <Scrollbar>
                        {slicedParticipants.map(participant => (
                            <div key={`participant_${participant.id}`}>
                                <CardContenido
                                    participant={participant}
                                    translate={this.props.translate}
                                    refetch={this.props.data.refetch}
                                    council={this.props.council}
                                />
                            </div>
                            // <CollapsibleSection
                            //     style={{ paddingRight: "20px", width: "100%" }}
                            //     trigger={() => (
                            //         <div style={{ width: '100%', padding: '1em', border: '2px solid gainsboro', display: 'flex', alignItems: 'center' }} onClick={() => this.refreshSends(participant.id)}>
                            //             <StateIcon state={participant.state} translate={this.props.translate} />
                            //             <span style={{ marginLeft: '0.6em' }}>{`${participant.name} ${participant.surname} - tlf: ${participant.phone} - @: ${participant.email}`}</span>
                            //         </div>
                            //     )}
                            //     collapse={() => (
                            //         <div style={{ border: '2px solid gainsboro', borderTop: '0px', marginBottom: '1.4em', padding: '1em', marginRight: "20px" }}>

                            //             <ParticipantContactEditor
                            //                 participant={participant}
                            //                 translate={this.props.translate}
                            //                 refetch={this.props.data.refetch}
                            //                 key={participant.id}
                            //                 council={this.props.council}
                            //             />
                            //             <NotificationsTable
                            //                 visib={this.state.visible}
                            //                 translate={this.props.translate}
                            //                 notifications={participant.notifications}
                            //                 handleToggleVisib={this.toggleVisible}
                            //             />
                            //         </div>
                            //     )}
                            //     key={`participant_${participant.id}`}
                            // />
                        ))}
                        <div style={{ display: 'flex', fontWeight: '700', alignItems: 'center', paddingTop: '0.5em' }}>
                            {this.state.page > 1 &&
                                <div onClick={() => this.updatePage(this.state.page - 1)} style={{ userSelect: 'none', fontSize: '1em', border: '1px solid white', padding: '0 0.2em', cursor: 'pointer' }}>{'<'}</div>
                            }
                            <div style={{ margin: '0 0.3em' }}>{this.state.page}</div>
                            {(this.state.page < (this.props.data.liveParticipants.total / this.state.limit)) &&
                                <div onClick={() => this.updatePage(this.state.page + 1)} style={{ userSelect: 'none', fontSize: '1em', border: '1px solid white', padding: '0 0.2em', cursor: 'pointer' }}>{'>'}</div>
                            }

                        </div>
                    </Scrollbar>
                </div>
            </div>
        )
    }
}


const CardContenido = ({ participant, translate, refetch, council }) => {

    const [state, setState] = React.useState({
        expanded: false,
    })

    const toggleExpanded = () => {
        setState({
            ...state,
            expanded: !state.expanded
        });
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
                        aria-expanded={state.expanded}
                        aria-label="Show more"
                        className={"expandButtonModal"}
                    >
                        <FontAwesome
                            name={"angle-down"}
                            style={{
                                transform: state.expanded ? "rotate(180deg)" : "rotate(0deg)",
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
            <Collapse in={state.expanded} timeout="auto" unmountOnExit>
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


const filter = (participants, text) => {
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

