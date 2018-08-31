import React from 'react';
import { DropDownMenu, Icon, AlertConfirm } from '../../../displayComponents';
import { MenuItem, IconButton } from 'material-ui';
import { getPrimary, getSecondary } from '../../../styles/colors';
import Convene from '../../council/convene/Convene';
import CouncilInfo from '../../council/convene/CouncilInfo';


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
                        <IconButton
                            size={'small'}
                            style={{outline: 0, color: secondary}}
                        >
                            <i className="fa fa-info"></i>
                        </IconButton>
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