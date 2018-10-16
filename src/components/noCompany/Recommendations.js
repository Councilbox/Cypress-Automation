import React from "react";
import { NotLoggedLayout, ButtonIcon } from "../../displayComponents";
import { Paper, Card } from "material-ui";
import { getPrimary, getLightGrey } from "../../styles/colors";
import * as mainActions from "../../actions/mainActions";
import { bindActionCreators } from "redux";
import withTranslations from "../../HOCs/withTranslations";
import { connect } from "react-redux";
import { bHistory } from "../../containers/App";
import FontAwesome from "react-fontawesome";


class Recommendations extends React.Component {
    state = {
        platformActive: this.getBrowserPlatform()
    };

    componentDidMount() {
        if (this.props.match.params.language !== this.props.translate.selectedLanguage) {
            this.props.actions.setLanguage(this.props.match.params.language);
        }
    }

    getBrowserPlatform() {
        if (isMobile.Android()) {
            return "ANDROID";
        } else if (isMobile.iOS()) {
            return "IOS";
        } else {
            return "DESKTOP";
        }
    }

    setActivePlatform = platformActive => {
        this.setState({ platformActive });
    };

    _renderPlatformButtons = () => {
        let primary = getPrimary();
        let lightgrey = getLightGrey();
        return (
            <div style={{ float: 'right', display: 'inline-flex', marginTop: '-0.5em' }}>
                <Card
                    elevation={this.state.platformActive === 'DESKTOP' ? 0 : 1}
                    onClick={() => this.setActivePlatform('DESKTOP')}
                    style={{
                        cursor: 'pointer',
                        padding: '0.4em 0.8em 0.2em  0.3em',
                        backgroundColor: this.state.platformActive === 'DESKTOP' ? lightgrey : 'white'
                    }}
                >
                    <ButtonIcon
                        style={{ fontSize: '2em' }}
                        type="desktop_windows"
                        color={primary} />
                </Card>
                <Card
                    elevation={this.state.platformActive === 'ANDROID' ? 0 : 1}
                    onClick={() => this.setActivePlatform('ANDROID')}
                    style={{
                        cursor: 'pointer',
                        padding: '0.4em 0.8em 0.2em  0.3em',
                        backgroundColor: this.state.platformActive === 'ANDROID' ? lightgrey : 'white'
                    }}
                >
                    <ButtonIcon
                        style={{ fontSize: '2em' }}
                        type="android"
                        color={primary} />
                </Card>
                <Card
                    elevation={this.state.platformActive === 'IOS' ? 0 : 1}
                    onClick={() => this.setActivePlatform('IOS')}
                    style={{
                        cursor: 'pointer',
                        padding: '0.4em 0.8em 0.2em  1em',
                        backgroundColor: this.state.platformActive === 'IOS' ? lightgrey : 'white'
                    }}
                >
                    <FontAwesome
                        name={"apple"}
                        style={{
                            fontSize: "2em",
                            color: primary
                        }}
                    />
                </Card>
            </div>
        )
    }

    render() {
        let { translate } = this.props;
        let { platformActive } = this.state;
        let primary = getPrimary();

        return (
            <NotLoggedLayout
                translate={translate}
                languageSelector={true}
                helpIcon={true}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <Paper
                        style={{
                            marginTop: "2em",
                            width: "90vw",
                            padding: "2vw"
                        }}
                    >
                        {platformActive === "ANDROID" && (
                            <div>
                                <div style={titleStyle}>
                                    <span style={{ fontSize: '2em' }}>Android</span>
                                    {this._renderPlatformButtons()}
                                </div>
                                <ol style={instructionListStyle}>
                                    <li style={instructionListItemStyle}>
                                        <span style={counter}>1</span>
                                        {
                                            translate.video_instructions_android_step_one
                                        }
                                    </li>
                                    <li style={instructionListItemStyle}>
                                        <span style={counter}>2</span>
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    translate.video_instructions_android_step_two
                                            }}
                                        />
                                        <a href="https://play.google.com/store/apps/details?id=com.android.chrome&utm_source=global_co&utm_medium=prtnr&utm_content=Mar2515&utm_campaign=PartBadge&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
                                            <img
                                                style={{ maxWidth: "150px" }}
                                                alt="Disponible en Google Play"
                                                src="https://play.google.com/intl/en_us/badges/images/generic/es_badge_web_generic.png"
                                            />
                                        </a>
                                    </li>
                                    <li style={instructionListItemStyle}>
                                        <span style={counter}>3</span>

                                        {
                                            translate.video_instructions_android_step_three
                                        }
                                    </li>
                                    <li style={instructionListItemStyle}>
                                        <span style={counter}>4</span>
                                        {
                                            translate.video_instructions_android_step_four
                                        }
                                        <ButtonIcon
                                            type="videocam"
                                            color={primary}
                                            style={{ marginLeft: "15px", fontSize: '3em', cursor: 'pointer', marginBottom: '-0.25em' }}
                                            onClick={() => {console.info('click'); bHistory.push(`/test/${translate.selectedLanguage}`)}}
                                        />
                                    </li>
                                    <li style={instructionListItemStyle}>
                                        <span style={counter}>5</span>
                                        {
                                            translate.video_instructions_android_step_five
                                        }
                                    </li>
                                </ol>
                            </div>
                        )}

                        {platformActive === "IOS" && (
                            <div>
                                <div style={titleStyle}>
                                    {this._renderPlatformButtons()}
                                    <span style={{ fontSize: '2em' }}>iOS</span>
                                </div>

                                {/* <h3 style="text-align: center;margin-top: 40px;">
                                    <i class="fa fa-exclamation-triangle cbx-color-light" aria-hidden="true"
                                    style="font-size: 30px;"></i>
                                        {translate.ios_devices_not_compatible_with_our_platform}
                                </h3>*/}

                                <ol style={instructionListStyle}>
                                    <li style={instructionListItemStyle}>
                                        <span style={counter}>1</span>

                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    translate.video_instructions_ios_step_one
                                            }}
                                        />
                                        <a
                                            href="https://itunes.apple.com/es/app/councilbox/id1338823032?mt=8"
                                            alt="appstore-link"
                                            style={{
                                                display: "inline-block",
                                                overflow: "hidden",
                                                background:
                                                    "url(https://linkmaker.itunes.apple.com/assets/shared/badges/es-es/appstore-lrg.svg) no-repeat",
                                                width: "135px",
                                                height: "35px",
                                                backgroundSize: "contain",
                                                margin: "5px 0 -10px 1em"
                                            }}
                                        />
                                    </li>
                                    <li style={instructionListItemStyle}>
                                        <span style={counter}>2</span>

                                        {
                                            translate.video_instructions_ios_step_two
                                        }
                                    </li>
                                    <li style={instructionListItemStyle}>
                                        <span style={counter}>3</span>

                                        {
                                            translate.video_instructions_ios_step_three
                                        }
                                    </li>
                                    <li style={instructionListItemStyle}>
                                        <span style={counter}>4</span>

                                        {
                                            translate.video_instructions_ios_step_four
                                        }
                                    </li>
                                </ol>
                            </div>
                        )}

                        {platformActive === "DESKTOP" && (
                            <div>
                                <div style={titleStyle}>
                                    <span style={{ fontSize: '2em' }}>PC</span>
                                    {this._renderPlatformButtons()}
                                </div>
                                <ol style={instructionListStyle}>
                                    <li style={instructionListItemStyle}>
                                        <span style={counter}>1</span>
                                        {
                                            translate.video_instructions_pc_step_one
                                        }
                                    </li>
                                    <li style={instructionListItemStyle}>
                                        <span style={counter}>2</span>
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    translate.video_instructions_pc_step_two
                                            }}
                                        />
                                        <a
                                            href="https://www.google.com/chrome/browser/desktop/index.html"
                                            style={{
                                                display: "inline-block",
                                                border: "2px solid #A859A8",
                                                borderRadius: "5px",
                                                margin: "-5px 0 -10px 12px"
                                            }}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            <img
                                                src="https://app.councilbox.com/img/fa-chrome.png"
                                                alt="chrome-icon"
                                                width="25"
                                                style={{
                                                    padding: "5px",
                                                    display: "block"
                                                }}
                                            />
                                        </a>
                                    </li>
                                    <li style={instructionListItemStyle}>
                                        <span style={counter}>3</span>
                                        {
                                            translate.video_instructions_pc_step_three
                                        }
                                    </li>
                                    <li style={instructionListItemStyle}>
                                        <span style={counter}>4</span>
                                        {
                                            translate.video_instructions_pc_step_four
                                        }
                                        <ButtonIcon
                                            type="videocam"
                                            color={primary}
                                            style={{ marginLeft: "15px", fontSize: '3em', cursor: 'pointer', marginBottom: '-0.25em' }}
                                            onClick={() => {console.info('click'); bHistory.push(`/test/${translate.selectedLanguage}`)}}
                                        />
                                    </li>
                                    <li style={instructionListItemStyle}>
                                        <span style={counter}>5</span>
                                        {
                                            translate.video_instructions_pc_step_five
                                        }
                                    </li>
                                </ol>
                            </div>
                        )}
                    </Paper>
                </div>
            </NotLoggedLayout>
        );
    }
}

const titleStyle = {
    width: "100%",
    fontWeight: "bold",
    padding: "1em",
    borderBottom: `solid 1px lightgrey`,
    marginBottom: "2em"
};

const instructionListStyle = {
    margin: "0",
    padding: "0",
    listStyleType: "none"
};

const instructionListItemStyle = {
    padding: "1.2em",
    borderBottom: `solid 1px lightgrey`
};

const counter = {
    marginRight: "1em",
    backgroundColor: getPrimary(),
    color: "white",
    fontWeight: "bold",
    padding: "3px 8px",
    borderRadius: "3px"
};

const isMobile = {
    Windows: () => {
        return /IEMobile/i.test(navigator.userAgent);
    },
    Android: () => {
        return /Android/i.test(navigator.userAgent);
    },
    BlackBerry: () => {
        return /BlackBerry/i.test(navigator.userAgent);
    },
    iOS: () => {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    },
    Desktop: () => {
        return !isMobile.Android() && !isMobile.iOS();
    }
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(mainActions, dispatch)
});

export default connect(
    null,
    mapDispatchToProps
)(withTranslations()(Recommendations));
