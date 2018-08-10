import React from 'react';
import { DropDownMenu, Icon, AlertConfirm } from '../../../displayComponents';
import FontAwesome from 'react-fontawesome';
import { MenuItem, Paper } from 'material-ui';
import { getPrimary, getSecondary } from '../../../styles/colors';
import Convene from '../convene/Convene';
import CouncilInfo from '../convene/CouncilInfo';


class CouncilInfoMenu extends React.Component {

    state = {
        showConvene: false,
        showCouncilInfo: false
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

    _renderCouncilInfo = () => {
        return(
            <CouncilInfo
                council={this.props.council}
                translate={this.props.translate}
            />
        )
    }

    _renderConveneBody = () => {
        return(
            <div>
                <Convene
                    council={this.props.council}
                    translate={this.props.translate}
                />
            </div>
        )
    }

    render(){
        const primary = getPrimary();
        const secondary = getSecondary();
        const { translate } = this.props;

        return (
            <React.Fragment>
                <DropDownMenu
                    color="transparent"
                    Component={() =>
                        <Paper
                            elevation={1}
                            style={{
                                boxSizing: "border-box",
                                padding: "0",
                                width: '5em',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: `1px solid ${primary}`,
                                marginLeft: "0.3em"
                            }}
                        >
                            <MenuItem
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    margin: 0,
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <FontAwesome
                                    name={"bars"}
                                    style={{
                                        cursor: "pointer",
                                        fontSize: "0.8em",
                                        height: "0.8em",
                                        color: primary
                                    }}
                                />
                                <Icon
                                    className="material-icons"
                                    style={{ color: primary }}
                                >
                                    keyboard_arrow_down
                                </Icon>
                            </MenuItem>
                        </Paper>
                    }
                    textStyle={{ color: primary }}
                    items={
                        <React.Fragment>
                            <MenuItem
                                onClick={() => this.setState({showConvene: true})}
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
                        </React.Fragment>
                    }
                />
                <AlertConfirm
					requestClose={this.closeConveneModal}
					open={this.state.showConvene}
					acceptAction={this.closeConveneModal}
					buttonAccept={translate.accept}
					bodyText={this._renderConveneBody()}
					title={translate.original_convene}
				/>
                <AlertConfirm
					requestClose={this.closeInfoModal}
					open={this.state.showCouncilInfo}
					acceptAction={this.closeInfoModal}
					buttonAccept={translate.accept}
					bodyText={this._renderCouncilInfo()}
					title={translate.council_info}
				/>
            </React.Fragment>
            
        );
    }
}

export default CouncilInfoMenu;