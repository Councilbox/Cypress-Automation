import React from 'react';
import { AlertConfirm } from '../../../displayComponents';
import { IconButton, Card } from 'material-ui';
import { getSecondary } from '../../../styles/colors';
import Convene from '../../council/convene/Convene';
import CouncilInfo from '../../council/convene/CouncilInfo';
import withTranslations from '../../../HOCs/withTranslations';
import { moment } from '../../../containers/App';
import * as CBX from '../../../utils/CBX';


const CouncilInfoMenu = ({ translate, council, participant, agendaNoSession, noSession, ...props }) => {
    const [state, setState] = React.useState({
        showConvene: false,
        showCouncilInfo: false,
        showParticipantInfo: false
    });

    const closeConveneModal = () => {
        setState({
            ...state,
            showConvene: false
        });
    }

    const closeInfoModal = () => {
        setState({
            ...state,
            showCouncilInfo: false
        })
    }

    const closeParticipantInfoModal = () => {
        setState({
            ...state,
            showParticipantInfo: false
        })
    }

    const _renderCouncilInfo = () => {
        return (
            <CouncilInfo
                council={council}
                translate={translate}
            />
        )
    }

    const _renderConveneBody = () => {
        return (
            <div>
                <Convene
                    council={council}
                    translate={translate}
                    agendaNoSession={agendaNoSession}
                />
            </div>
        )
    }

    const calculateParticipantVotes = () => {
        return participant.delegatedVotes.reduce((a, b) => a + b.numParticipations, participant.numParticipations);
    }

    const _renderParticipantInfo = () => {

        return (
            <div>
                <Card style={{ padding: "20px" }}>
                    <div>
                        <b>&#8226; {`${translate.name}`}</b>: {`${participant.name} ${participant.surname || ''}`}
                    </div>
                    <div style={{ marginBottom: '1em' }}>
                        <b>&#8226; {`${translate.email}`}</b>: {`${participant.email}`}
                    </div>
                    <div>
                        {`${translate.you_have_following_delegated_votes}:`}
                        {participant.delegatedVotes.map(vote => (
                            <div key={`delegatedVote_${vote.id}`}>
                                <b>{`${vote.name} ${vote.surname || ''} - ${translate.votes} `}</b> : {`${vote.numParticipations}`}
                            </div>
                        ))}
                        <br></br>
                    </div>
                    {`${translate.total_votes}: ${calculateParticipantVotes()}`}
                </Card>
            </div>
        )
    }

    const secondary = getSecondary();
    let fecha1 = moment(new Date(council.closeDate))
    let fecha2 = moment(new Date())

    let duration = fecha1.diff(fecha2)
    const diffDuration = moment.duration(duration);
    let dias = diffDuration.days() ? diffDuration.days() + "d " : ""
    let finalizado = false
    if (diffDuration.hours() < 0 && (diffDuration.minutes() == 0 && diffDuration.seconds() == 0)) {
        finalizado = '00:00'
    }
    let date = dias + (finalizado ? finalizado : (diffDuration.hours() < 10 ? "0" + diffDuration.hours() : diffDuration.hours()) + ":" + (diffDuration.minutes() < 10 ? "0" + diffDuration.minutes() : diffDuration.minutes()) + ":" + (diffDuration.seconds() < 10 ? "0" + diffDuration.seconds() : diffDuration.seconds()));
    return (
        <React.Fragment>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                {!noSession && !CBX.checkSecondDateAfterFirst(fecha1, fecha2) &&
                    <div style={{ display: "flex", color: secondary, alignItems: "center" }} >
                        {date}
                        <i className="fa fa-hourglass-half"
                            style={{
                                outline: 0,
                                color: secondary,
                                fontSize: '16px',
                                paddingLeft: " 0.2em"
                            }}
                        ></i>
                    </div>
                }

                <IconButton
                    size={'small'}
                    onClick={() =>
                        setState({
                            ...state,
                            showCouncilInfo: true
                        })
                    }
                    style={{
                        outline: 0,
                        color: secondary,
                        cursor: 'pointer',
                        width: "42px"
                    }}
                    title={"information"}
                >
                    <i className="fa fa-info"></i>
                </IconButton>
            </div>
            {state.showCouncilInfo &&
                <AlertConfirm
                    requestClose={closeInfoModal}
                    open={state.showCouncilInfo}
                    acceptAction={closeInfoModal}
                    buttonAccept={translate.accept}
                    bodyText={_renderCouncilInfo()}
                    title={translate.council_info}
                    bodyStyle={{ paddingTop: "5px", margin: "10px" }}
                />
            }
        </React.Fragment>
    );
}

export default (withTranslations()(CouncilInfoMenu));