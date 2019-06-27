import React from 'react';
import { DropDownMenu, Icon, AlertConfirm } from '../../../displayComponents';
import { MenuItem, IconButton, Card } from 'material-ui';
import { getPrimary, getSecondary } from '../../../styles/colors';
import Convene from '../../council/convene/Convene';
import CouncilInfo from '../../council/convene/CouncilInfo';
import withTranslations from '../../../HOCs/withTranslations';



class CouncilInfoMenu extends React.Component {

    state = {
        showConvene: false,
        showCouncilInfo: false,
        showParticipantInfo: false
    }

    closeConveneModal = () => {
        this.setState({
            showConvene: false
        });
    }

    closeInfoModal = () => {
        this.setState({
            showCouncilInfo: false
        })
    }

    closeParticipantInfoModal = () => {
        this.setState({
            showParticipantInfo: false
        })
    }

    _renderCouncilInfo = () => {
        return (
            <CouncilInfo
                council={this.props.council}
                translate={this.props.translate}
            />
        )
    }

    _renderConveneBody = () => {
        return (
            <div>
                <Convene
                    council={this.props.council}
                    translate={this.props.translate}
                    agendaNoSession={this.props.agendaNoSession}
                />
            </div>
        )
    }

    calculateParticipantVotes = () => {
        return this.props.participant.delegatedVotes.reduce((a, b) => a + b.numParticipations, this.props.participant.numParticipations);
    }

    _renderParticipantInfo = () => {
        const { translate, participant } = this.props;

        return (
            <div>
                <Card style={{ padding: "20px" }}>
                    <div>
                        <b>&#8226; {`${translate.name}`}</b>: {`${participant.name} ${participant.surname}`}
                    </div>
                    <div style={{ marginBottom: '1em' }}>
                        <b>&#8226; {`${translate.email}`}</b>: {`${participant.email}`}
                    </div>
                    <div>
                        {`${this.props.translate.you_have_following_delegated_votes}:`}
                        {participant.delegatedVotes.map(vote => (
                            <div key={`delegatedVote_${vote.id}`}>
                                <b>{`${vote.name} ${vote.surname} - Votos `}</b> : {`${vote.numParticipations}`/*TRADUCCION*/}
                            </div>
                        ))}
                        <br></br>
                    </div>
                    {`${this.props.translate.total_votes}: ${this.calculateParticipantVotes()}`}
                </Card>
            </div >
        )
    }

    render() {
        const primary = getPrimary();
        const secondary = getSecondary();
        const { translate } = this.props;
        let fecha1 = new Date(this.props.council.closeDate).getTime()
        let fecha2 = new Date().getTime()
        console.log(fecha1)
        console.log(fecha2)
        let resta = fecha1 - fecha2
        console.log(resta)
        console.log(resta/ (1000*60*60*24))
        return (
            <React.Fragment>
                <div style={{ display: "flex", alignItems:"center" }}>
                    <div style={{ display: "flex" }} >
                        <i className="fa fa-hourglass-half"
                            style={{
                                outline: 0,
                                color: secondary,
                                fontSize: '16px'
                            }}
                        ></i>
                    </div>

                    <IconButton
                        size={'small'}
                        onClick={() =>
                            this.setState({
                                showCouncilInfo: true
                            })
                        }
                        style={{
                            outline: 0,
                            color: secondary,
                            cursor: 'pointer',
                        }}
                        title={"information"}
                    >
                        <i className="fa fa-info"></i>
                    </IconButton>
                </div>
                {this.state.showCouncilInfo &&
                    <AlertConfirm
                        requestClose={this.closeInfoModal}
                        open={this.state.showCouncilInfo}
                        acceptAction={this.closeInfoModal}
                        buttonAccept={translate.accept}
                        bodyText={this._renderCouncilInfo()}
                        title={translate.council_info}
                        bodyStyle={{ paddingTop: "5px", margin: "10px" }}
                    />
                }
            </React.Fragment>
        );
    }
}

export default (withTranslations()(CouncilInfoMenu));