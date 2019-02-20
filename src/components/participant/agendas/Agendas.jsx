import React from "react";
import { Steps } from 'antd';
import { Paper, Typography, Divider, IconButton } from "material-ui";
import Scrollbar from '../../../displayComponents/Scrollbar';
import { AgendaNumber, LoadingSection, LiveToast } from '../../../displayComponents';
import withTranslations from "../../../HOCs/withTranslations";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import AgendaMenu from './AgendaMenu';
import AgendaDescription from './AgendaDescription';
import { agendaPointOpened, agendaVotingsOpened, getAgendaTypeLabel, councilStarted, councilHasSession } from '../../../utils/CBX';
import CouncilInfoMenu from '../menus/CouncilInfoMenu';
import { toast } from 'react-toastify';
import AgendaNoSession from "./AgendaNoSession";

const styles = {
    container: {
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

class Agendas extends React.Component {
    state = {
        selected: 0
    }

    updated = 0;

    selectAgenda = (index) => {
        this.setState({ selected: index });
    }

    agendaStateToastId = null;
    agendaVotingsToastId = null;

    componentWillUnmount() {
        toast.dismiss(this.agendaStateToastId);
        toast.dismiss(this.agendaVotingsToastId);
    }

    componentDidUpdate(prevProps) {
        const { translate } = this.props;

        if (prevProps.data.agendas) {
            const { agendas: actualAgendas } = this.props.data;
            prevProps.data.agendas.forEach((agenda, index) => {
                let agendaToCheck = agenda.id === actualAgendas[index].id ?
                    actualAgendas[index]
                    :
                    actualAgendas.find(item => item.id === agenda.id)
                    ;

                if (!agendaPointOpened(agenda) && agendaPointOpened(agendaToCheck)) {
                    if (this.agendaStateToastId) {
                        toast.dismiss(this.agendaStateToastId);
                    }
                    this.agendaStateToastId = this.toastChanges(
                        `${translate.point_of_day_opened_number} ${agendaToCheck.orderIndex}`,
                        () => this.agendaStateToastId = null
                    );
                }

                if (agendaPointOpened(agenda) && !agendaPointOpened(agendaToCheck)) {
                    if (this.agendaStateToastId) {
                        toast.dismiss(this.agendaStateToastId);
                    }
                    this.agendaStateToastId = this.toastChanges(
                        `${translate.point_closed_num} ${agendaToCheck.orderIndex}`,
                        () => this.agendaStateToastId = null
                    );
                }

                if (!agendaVotingsOpened(agenda) && agendaVotingsOpened(agendaToCheck)) {
                    if (this.agendaVotingsToastId) {
                        toast.dismiss(this.agendaVotingsToastId);
                    }
                    this.agendaVotingsToastId = this.toastChanges(
                        `${translate.point_num_votings_open} ${agendaToCheck.orderIndex}`,
                        () => this.agendaVotingsToastId = null
                    );
                }

                if (agendaVotingsOpened(agenda) && !agendaVotingsOpened(agendaToCheck)) {
                    if (this.agendaVotingsToastId) {
                        toast.dismiss(this.agendaVotingsToastId);
                    }
                    this.agendaVotingsToastId = this.toastChanges(
                        `${translate.point_num_votings_closed} ${agendaToCheck.orderIndex}`,
                        () => this.agendaVotingsToastId = null
                    )
                }
            });
        }
    }

    toastChanges = (message, onClose) => (
        toast(
            <LiveToast
                message={message}
                action={() => this.selectAgenda}
            />, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: false,
                onClose: onClose,
                className: "liveToast"
            }
        )
    )

    render() {
        const { translate, council, agendasAnchor, toggleAgendasAnchor, anchorToggle } = this.props;
        const { selected } = this.state;
        const secondary = getSecondary();
        const primary = getPrimary();

        let agendas = [];

        if (this.props.data.agendas) {
            agendas = this.props.data.agendas.map(agenda => {
                return {
                    ...agenda,
                    votings: this.props.data.participantVotings.filter(voting => voting.agendaId === agenda.id)
                }
            });
        }
        if (councilHasSession(council)) {
            return (
                <Paper style={styles.container} elevation={4}>
                    <Scrollbar>
                        <div>
                            <div style={styles.agendasHeader}>
                                <div style={{ width: '3em' }}>
                                    {agendasAnchor === 'right' ?
                                        anchorToggle &&
                                        <IconButton
                                            size={'small'}
                                            onClick={toggleAgendasAnchor}
                                            style={{ outline: 0 }}
                                        >
                                            <i className="fa fa-caret-left"></i>
                                        </IconButton>
                                        :
                                        <CouncilInfoMenu
                                            translate={translate}
                                            council={council}
                                        />
                                    }
                                </div>
                                <Typography variant="title" style={{ fontWeight: '700' }}>{translate.agenda}</Typography>
                                <div style={{ width: '3em' }}>
                                    {agendasAnchor === 'left' ?
                                        anchorToggle &&
                                        <IconButton
                                            size={'small'}
                                            onClick={toggleAgendasAnchor}
                                            style={{ outline: 0 }}
                                        >
                                            <i className="fa fa-caret-right"></i>
                                        </IconButton>
                                        :
                                        <CouncilInfoMenu
                                            translate={translate}
                                            council={council}
                                        />
                                    }
                                </div>
                            </div>
                            <Divider />
                            {!councilStarted(council) &&
                                <div style={{ backgroundColor: primary, width: '100%', padding: '1em', color: 'white', fontWeight: '700' }}>
                                    {this.props.translate.council_not_started_yet}
                                </div>
                            }
                            <div style={{ padding: '0.8em', paddingLeft: '1.2em', marginTop: '10px' }}>
                                <Steps direction="vertical" size="small" current={selected}>
                                    {this.props.data.agendas ?
                                        agendas.map((agenda, index) => {
                                            return (
                                                <Steps.Step
                                                    icon={
                                                        <AgendaNumber
                                                            index={index + 1}
                                                            open={agenda.pointState === 1}
                                                            active={selected === index}
                                                            activeColor={getPrimary()}
                                                            voting={agenda.votingState === 1 && agenda.subjectType !== 0}
                                                            translate={translate}
                                                            secondaryColor={getSecondary()}
                                                            onClick={() => this.selectAgenda(index)}
                                                            small={true}
                                                            style={{
                                                                position: 'static'
                                                            }}
                                                        />
                                                    }
                                                    title={
                                                        <div onClick={() => this.selectAgenda(index)} style={{ cursor: 'pointer' }}>
                                                            {agenda.agendaSubject}
                                                        </div>
                                                    }
                                                    description={selected === index ?
                                                        <React.Fragment>
                                                            <Typography variant="body1" style={{ color: secondary, fontWeight: '700' }}>
                                                                {translate[getAgendaTypeLabel(agenda)]}
                                                            </Typography>
                                                            <div style={{ marginBottom: '0.6em' }}>
                                                                <AgendaDescription agenda={agenda} translate={translate} />
                                                            </div>
                                                            <AgendaMenu
                                                                agenda={agenda}
                                                                council={council}
                                                                participant={this.props.participant}
                                                                translate={translate}
                                                                refetch={this.props.data.refetch}
                                                            />
                                                        </React.Fragment>
                                                        :
                                                        ''
                                                    }
                                                    key={agenda.id}
                                                />
                                            )
                                        })
                                        :
                                        <LoadingSection />
                                    }
                                </Steps>
                            </div>
                        </div>
                    </Scrollbar>
                </Paper>
            );
        } else {
            return (
                <AgendaNoSession
                     {...this.props}
                ></AgendaNoSession>
            );
        }
    }
}


const agendas = gql`
    query Agendas($councilId: Int!, $participantId: Int!){
        agendas(councilId: $councilId){
            agendaSubject
            attachments {
                id
                agendaId
                filename
                filesize
                filetype
                councilId
                state
            }
            councilId
            dateEndVotation
            dateStart
            dateStartVotation
            description
            id
            orderIndex
            pointState
            subjectType
            votingState
        }
        participantVotings(participantId: $participantId){
            id
            comment
            participantId
            delegateId
            agendaId
            numParticipations
            author {
                id
                state
                name
                type
                surname
                representative {
                    id
                    name
                    surname
                }
            }
            vote
        }
    }
`;

export default graphql(agendas, {
    options: props => ({
        variables: {
            councilId: props.council.id,
            participantId: props.participant.id
        },
        pollInterval: 7000
    })
})(withTranslations()(Agendas));
