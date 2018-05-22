import React from 'react';
import { DropDownMenu, Icon } from "../../../../displayComponents";
import * as CBX from '../../../../utils/CBX';
import FontAwesome from 'react-fontawesome';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import { MenuItem } from 'material-ui';
import SendCredentialsModal from './SendCredentialsModal';
import SendCredentialsTestModal from './SendCredentialsTestModal';
import NoCelebrateModal from './NoCelebrateModal';
import OriginalConveneModal from './OriginalConveneModal';
import CouncilInfoModal from './CouncilInfoModal';


class CouncilMenu extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            sendCredentials: false,
            sendCredentialsTest: false,
            noCelebrate: false,
            originalConvene: false,
            councilInfo: false
        }
    }

    render(){
        const { translate } = this.props;
        const primary = getPrimary();
        const secondary = getSecondary();

        return(
            <React.Fragment>
                <DropDownMenu
                    color="transparent"
                    buttonStyle={{
                        boxSizing: 'border-box',
                        padding: '0',
                        border: `1px solid ${primary}`,
                        marginLeft: '0.3em'
                    }}
                    text={
                        <FontAwesome
                            name={'bars'}
                            style={{
                                cursor: 'pointer',
                                fontSize: '0.8em',
                                height: '0.8em',
                                color: primary
                            }}
                        />
                    }
                    textStyle={{ color: primary }}
                    type="flat"
                    icon={
                        <Icon className="material-icons" style={{ color: primary }}>
                            keyboard_arrow_down
                        </Icon>
                    }
                    items={
                        <React.Fragment>
                            <MenuItem onClick={() => this.setState({sendCredentials: true})}>
                                <FontAwesome
                                    name="paper-plane"
                                    style={{marginRight: '0.8em', color: secondary}}
                                />
                                {translate.send_video_emails}
                            </MenuItem>
                            <MenuItem onClick={() => this.setState({sendCredentialsTest: true})}>
                                <FontAwesome
                                    name="flask"
                                    style={{marginRight: '0.8em', color: secondary}}
                                />
                                {translate.send_video_test}
                            </MenuItem>
                            <MenuItem onClick={() => this.setState({noCelebrate: true})}>
                                <FontAwesome
                                    name="exclamation-triangle"
                                    style={{marginRight: '0.8em', color: 'red'}}
                                />
                                {translate.no_celebrate_council}
                            </MenuItem>
                            <MenuItem onClick={() => this.setState({originalConvene: true})}>
                                <FontAwesome
                                    name="eye"
                                    style={{marginRight: '0.8em', color: secondary}}
                                />
                                {translate.view_original_convene}
                            </MenuItem>
                            <MenuItem onClick={() => this.setState({councilInfo: true})}>
                                <FontAwesome
                                    name="info"
                                    style={{marginRight: '0.8em', color: secondary}}
                                />
                                {translate.council_info}
                            </MenuItem>
                        </React.Fragment>
                    }
                />
                <SendCredentialsModal
                    show={this.state.sendCredentials}
                    council={this.props.council}
                    requestClose={() => this.setState({ sendCredentials: false })}
                    translate={translate}
                />
                <SendCredentialsTestModal
                    show={this.state.sendCredentialsTest}
                    council={this.props.council}
                    requestClose={() => this.setState({ sendCredentialsTest: false })}
                    translate={translate}
                />
                <NoCelebrateModal
                    show={this.state.noCelebrate}
                    council={this.props.council}
                    requestClose={() => this.setState({ noCelebrate: false })}
                    translate={translate}
                />
                <OriginalConveneModal
                    show={this.state.originalConvene}
                    council={this.props.council}
                    requestClose={() => this.setState({ originalConvene: false })}
                    translate={translate}
                />
                <CouncilInfoModal
                    show={this.state.councilInfo}
                    council={this.props.council}
                    requestClose={() => this.setState({ councilInfo: false })}
                    translate={translate}
                />
            </React.Fragment>
        )
    }
}

export default CouncilMenu;