import React from 'react';
import { DropDownMenu, Icon, AlertConfirm } from '../../../displayComponents';
import { MenuItem, IconButton, Card } from 'material-ui';
import { getPrimary, getSecondary } from '../../../styles/colors';
import Convene from '../../council/convene/Convene';
import CouncilInfo from '../../council/convene/CouncilInfo';



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
                        <b>Votos delegados:</b>
                {participant.delegatedVotes.map(vote => (
                            <div key={`delegatedVote_${vote.id}`}>
                                <b>{`${vote.name} ${vote.surname} - Votos `}</b> : {`${vote.numParticipations}`/*TRADUCCION*/}
                            </div>
                        ))}
                        <br></br>
                       <b>Total de votos</b>: {this.calculateParticipantVotes()}
                    </div>
                </Card>
            </div >
        )
    }

    render() {
        const primary = getPrimary();
        const secondary = getSecondary();
        const { translate } = this.props;
        
        return (
            <React.Fragment>
                <DropDownMenu
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    color="transparent"
                    Component={() =>
                        <IconButton
                            size={'small'}
                            style={{ outline: 0, color: secondary }}
                        >
                            <i className="fa fa-info"></i>
                        </IconButton>
                    }
                    textStyle={{ color: primary }}
                    items={
                        <React.Fragment>
                            <MenuItem
                                onClick={() => this.setState({ showConvene: true })}
                                style={{
                                    fontSize: '1em'
                                }}
                            >
                                <Icon
                                    className="material-icons"
                                    style={{
                                        color: secondary,
                                        marginRight: "0.4em"
                                    }}
                                >
                                    list_alt
                                </Icon>
                                {translate.view_original_convene}
                            </MenuItem>
                            <MenuItem
                                onClick={() =>
                                    this.setState({
                                        showCouncilInfo: true
                                    })
                                }
                                style={{
                                    fontSize: '1em'
                                }}
                            >
                                <Icon
                                    className="material-icons"
                                    style={{
                                        color: secondary,
                                        marginRight: "0.4em"
                                    }}
                                >
                                    info
                                </Icon>
                                {translate.council_info}
                            </MenuItem>
                            <MenuItem
                                onClick={() =>
                                    this.setState({
                                        showParticipantInfo: true
                                    })
                                }
                                style={{
                                    fontSize: '1em'
                                }}
                            >
                                <Icon
                                    className="material-icons"
                                    style={{
                                        color: secondary,
                                        marginRight: "0.4em"
                                    }}
                                >
                                    person
                                </Icon>
                                {translate.participant_data}
                            </MenuItem>
                        </React.Fragment>
                    }
                />
                {this.state.showConvene &&
                    <AlertConfirm
                        requestClose={this.closeConveneModal}
                        open={this.state.showConvene}
                        acceptAction={this.closeConveneModal}
                        buttonAccept={translate.accept}
                        bodyText={this._renderConveneBody()}
                        title={translate.original_convene}
                    />
                }
                {this.state.showCouncilInfo &&
                    <AlertConfirm
                        requestClose={this.closeInfoModal}
                        open={this.state.showCouncilInfo}
                        acceptAction={this.closeInfoModal}
                        buttonAccept={translate.accept}
                        bodyText={this._renderCouncilInfo()}
                        title={translate.council_info}
                        bodyStyle={{paddingTop: "5px", margin: "10px"}}
                    />
                }
                {this.state.showParticipantInfo &&
                    <AlertConfirm
                        requestClose={this.closeParticipantInfoModal}
                        open={this.state.showParticipantInfo}
                        acceptAction={this.closeParticipantInfoModal}
                        buttonAccept={translate.accept}
                        bodyText={this._renderParticipantInfo()}
                        title={translate.participant_data}
                        bodyStyle={{paddingTop: "5px", margin: "10px"}}
                    />
                }
            </React.Fragment>
        );
    }
}

export default CouncilInfoMenu;