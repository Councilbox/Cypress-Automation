import React from "react";
import { Steps } from 'antd';
import { Paper, Typography, Divider, IconButton } from "material-ui";
import Scrollbar from '../../../displayComponents/Scrollbar';
import { AgendaNumber, LoadingSection, LiveToast, AlertConfirm } from '../../../displayComponents';
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
        selected: 0,
        delegationsModal: false
    }

    updated = 0;

    selectAgenda = (index) => {
        this.setState({ selected: index });
    }

    agendaStateToastId = null;
    agendaVotingsToastId = null;

    componentDidMount(){
        if(this.props.participant.delegatedVotes.length > 0){
            if(!sessionStorage.getItem('delegationsNotify')){
                this.setState({
                    delegationsModal: true
                });
                sessionStorage.setItem('delegationsNotify', true);
            }
        }

    }

    showDelegationsModal = () => {
        this.setState({
            delegationsModal: true
        });
    }

    closeDelegationsModal = () => {
        this.setState({
            delegationsModal: false
        });
    }

    componentWillUnmount(){
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

    _renderDelegationsModalBody = () => {
        return (
            <div>
                Tiene los siguientes votos delegados en usted:
                {this.props.participant.delegatedVotes.map(vote => (
                    <div key={`delegatedVote_${vote.id}`}>
                        {`${vote.name} ${vote.surname} - Votos: ${vote.numParticipations}`/*TRADUCCION*/}
                    </div>
                ))}
                Total de votos: {this.calculateParticipantVotes()}
            </div>
        )
    }

    calculateParticipantVotes = () => {
        return this.props.participant.delegatedVotes.reduce((a, b) => a + b.numParticipations, this.props.participant.numParticipations);
    }

	render() {
		const { translate, council, } = this.props;
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


        return (
            <React.Fragment>
                <AlertConfirm
                    requestClose={this.closeDelegationsModal}
                    open={this.state.delegationsModal}
                    fullWidth={false}
                    buttonCancel={translate.close}
                    bodyText={this._renderDelegationsModalBody()}
                    title={translate.warning}
                />
                <AgendaNoSession {...this.props} />
            </React.Fragment>
        )
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
