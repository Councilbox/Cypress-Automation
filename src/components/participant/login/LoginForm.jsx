import React from "react";
import { Tooltip, Card } from "material-ui";
import * as mainActions from "../../../actions/mainActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { bHistory } from "../../../containers/App";
import withTranslations from "../../../HOCs/withTranslations";
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import withWindowSize from "../../../HOCs/withWindowSize";
import withWindowOrientation from "../../../HOCs/withWindowOrientation";
import { checkValidEmail } from "../../../utils/validation";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { ButtonIcon, TextInput, BasicButton, AlertConfirm, HelpPopover } from "../../../displayComponents";
import { councilStarted, participantNeverConnected } from '../../../utils/CBX';
import { moment } from '../../../containers/App';



const styles = {
    loginContainer: {
        width: "100%",
        height: "100%",
        padding: '1em',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
    },
    loginContainerMax: {
        width: "100%",
        height: "100%",
        padding: '1em',
        // display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
    },
    loginContainer: {
        width: "100%",
        height: "100%",
        padding: '1em',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
    },
    splittedLoginContainer: {
        width: "100%",
        height: "100%",
        padding: '1em',
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
    },
    councilInfoContainer: {
        display: "flex",
        width: '100%',
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "15px",
        textAlign: "center"
    },
    loginFormContainer: {
        display: "flex",
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        padding: "15px"
    },
    enterButtonContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "35px"
    }
};

class LoginForm extends React.Component {
    state = {
        email: this.props.participant.email,
        password: "",
        sendPassModal: false,
        showPassword: false,
        errors: {
            email: "",
            password: ""
        },
        hover: false,
        helpPopover: true
    };

    checkFieldsValidationState = () => {
        const { translate, council } = this.props;

        let errors = {
            email: "",
            password: ""
        };

        //CHECK REQUIRED
        errors.email =
            !(this.state.email.length > 0) ? translate.field_required : "";

        if (council.securityType === 0) {
            errors.password = "";
        } else {
            errors.password =
                !(this.state.password.length > 0) ? translate.field_required : "";
        }

        // CHECK VALID EMAIL
        const validEmail = checkValidEmail(this.state.email);
        errors.email = !validEmail
            ? translate.tooltip_invalid_email_address
            : "";

        this.setState({
            ...this.state,
            errors: errors
        });

        return errors.email === "" && errors.password === "";
    };

    showSendPassModal = () => {
        this.setState({
            sendPassModal: true
        });
    }

    closeSendPassModal = () => {
        this.setState({
            sendPassModal: false,
            phoneError: ''
        })
    }

    handleChange = (field, event) => {
        const newState = {};
        newState[field] = event.target.value;
        this.setState(newState, this.checkFieldsValidationState);
    };

    login = async () => {
        const { participant, council } = this.props;
        const isValidForm = this.checkFieldsValidationState();
        if (council.securityType !== 0) {
            try {
                const response = await this.props.checkParticipantKey({
                    variables: {
                        participantId: participant.id,
                        key: this.state.password
                    }
                });

                    //TRADUCCION
                if (!response.data.checkParticipantKey.success) {
                    this.setState({
                        errors: {
                            password: 'Clave de acceso incorrecta'
                        }
                    });
                    return;
                }
            } catch (error) {
                this.setState({
                    errors: {
                        password: 'Clave de acceso incorrecta'
                    }
                });
                return;
            }
        }
        if (isValidForm) {
            this.props.actions.participantLoginSuccess();
            bHistory.push(`/participant/${participant.id}/council/${council.id}/${participant.roomType === 'MEETING' ? 'meet' : 'council'}`);
        }

    };

    handleKeyUp = event => {
        if (event.nativeEvent.keyCode === 13) {
            this.login();
        }
    };

    _sendPassModalBody = () => {
        return (
            <div>
                {this.props.council.securityType === 1 &&
                    this.props.translate.receive_access_key_email
                }
                {this.props.council.securityType === 2 &&
                    this.props.translate.receive_access_key_phone
                }
                {!!this.state.phoneError &&
                    <div style={{ color: 'red' }}>{this.state.phoneError}</div>
                }
            </div>
        )
    }

    _tooltipContent = () => {
        //TRADUCCION
        const securityTypes = {
            1: 'Clave de acceso que deberá recibir en su correo electrónico',
            2: 'Clave de acceso que deberá recibir a través de un SMS en su teléfono'
        }

        return securityTypes[this.props.council.securityType];

    }

    sendParticipantRoomKey = async () => {
        this.setState({
            loading: true
        });
        const response = await this.props.sendParticipantRoomKey({
            variables: {
                councilId: this.props.council.id,
                participantIds: [this.props.participant.id],
                timezone: moment().utcOffset()
            }
        });

        if (response.errors) {
            if (response.errors[0].message = 'Invalid phone number') {
                this.setState({
                    phoneError: this.props.translate.invalid_phone_number,
                    loading: false
                });
            }
        } else {
            this.setState({
                loading: false,
                phoneError: ''
            });
            this.closeSendPassModal();
        }
    }

    onMouseEnter = () => {
        this.setState({
            hover: true
        })
    }
    onMouseLeave = () => {
        this.setState({
            hover: false
        })
    }

    render() {
        const {
            participant,
            council,
            company,
            windowSize,
            windowOrientation,
            translate
        } = this.props;
        const { email, password, errors, showPassword } = this.state;
        const primaryColor = getPrimary();
        const secondaryColor = getSecondary();

        return (
            <div style={styles.loginContainerMax}>

                <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: 'center', alignItems: 'center' }}>

                    <div style={{
                        width: "100%",
                        paddingLeft: "4px"
                    }}>
                        <div style={{ textAlign: "center", padding: "1em" }} >
                            <Tooltip
                                title={council.businessName}
                                placement={"top"}
                                enterDelay={300}
                                leaveDelay={300}
                            >
                                {!!company.logo ?
                                    <img
                                        src={company.logo}
                                        alt="company_logo"
                                        style={{
                                            maxWidth: '130px',
                                            maxHeight: '80px',
                                            marginBottom: "1em"
                                        }}
                                    />
                                    :
                                    <i className="fa fa-building-o" style={{ fontSize: '75px', color: 'grey', marginBottom: '10px' }} />
                                }
                            </Tooltip>
                            <h3 style={{ color: secondaryColor, fontSize: '1.8em' }}>{council.name}</h3>
                            <span>
                                {moment(new Date(council.dateStart)).format("LLL")}
                            </span>

                            {(councilStarted(council) && (council.statute.existsLimitedAccessRoom === 1) && participantNeverConnected(participant)) &&
                                <p>
                                    {translate.room_access_close_at}
                                    <span style={{ fontWeight: 'bold', marginLeft: '2px' }}>
                                        {
                                            moment(new Date(council.dateRealStart))
                                                .add(council.statute.limitedAccessRoomMinutes, 'm')
                                                .format("HH:mm")
                                        }
                                    </span>
                                </p>
                            }
                        </div>

                        {/* <div style={styles.loginFormContainer}> */}
                        <Card elevation={1} style={{ padding: "1.5em", border: "1px solid gainsboro" }}>
                            <form style={{ width: '100%' }}>
                                <TextInput
                                    floatingText={translate.email}
                                    type="email"
                                    fullWidth
                                    errorText={errors.email}
                                    value={email}
                                    onChange={event =>
                                        this.handleChange("email", event)
                                    }
                                    disabled={true}
                                />

                                {council.securityType !== 0 && (
                                    <React.Fragment>
                                        <TextInput
                                            onKeyUp={this.handleKeyUp}
                                            helpPopoverInLabel={true}
                                            floatingText={council.securityType === 2 ?
                                                (
                                                    <div style={{ display: "flex" }}>
                                                        {translate.key_by_sms}
                                                        <div>
                                                            <HelpPopover
                                                                errorText={!!errors.password}
                                                                title={translate.key_by_sms}
                                                                content={this._tooltipContent()}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                (
                                                    <div style={{ display: "flex" }}>
                                                        {translate.key_by_email}
                                                        <div>
                                                            <HelpPopover
                                                                errorText={!!errors.password}
                                                                title={translate.key_by_email}
                                                                content={this._tooltipContent()}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            type={showPassword ? "text" : "password"}
                                            errorText={errors.password}
                                            value={password}
                                            onChange={event =>
                                                this.handleChange("password", event)
                                            }
                                            required={true}
                                            showPassword={showPassword}
                                            passwordToggler={() =>
                                                this.setState({
                                                    showPassword: !showPassword
                                                })
                                            }
                                        />
                                        <span style={{ cursor: 'pointer', color: this.state.hover ? secondaryColor : "", borderBottom: this.state.hover ? `1px solid ${secondaryColor}` : "" }} onClick={this.showSendPassModal} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                                            {translate.didnt_receive_access_key}
                                        </span>
                                        <AlertConfirm
                                            requestClose={this.closeSendPassModal}
                                            open={this.state.sendPassModal}
                                            loadingAction={this.state.loading}
                                            acceptAction={this.sendParticipantRoomKey}
                                            buttonAccept={translate.accept}
                                            buttonCancel={translate.cancel}
                                            bodyText={this._sendPassModalBody()}
                                            title={translate.resend_access_key}
                                        />
                                    </React.Fragment>
                                )}

                                <div style={styles.enterButtonContainer}>
                                    <BasicButton
                                        text={translate.enter_room}
                                        color={primaryColor}
                                        textStyle={{
                                            color: "white",
                                            fontWeight: "700"
                                        }}
                                        textPosition="before"
                                        fullWidth={true}
                                        icon={
                                            <ButtonIcon
                                                color="white"
                                                type="directions_walk"
                                            />
                                        }
                                        onClick={this.login}
                                    />
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
            // <div
            //     style={
            //         windowSize === "xs" && windowOrientation === "landscape"
            //             ? styles.splittedLoginContainer
            //             : styles.loginContainer
            //     }
            // >
            //     <div style={styles.councilInfoContainer}>
            //         <Tooltip
            //             title={council.businessName}
            //             placement={"top"}
            //             enterDelay={300}
            //             leaveDelay={300}
            //         >
            //             {!!company.logo ?
            //                 <img
            //                     src={company.logo}
            //                     alt="company_logo"
            //                     style={{
            //                         maxWidth: '80px',
            //                         maxHeight: '80px'
            //                     }}
            //                 />
            //                 :
            //                 <i className="fa fa-building-o" style={{ fontSize: '75px', color: 'grey', marginBottom: '10px' }} />
            //             }
            //         </Tooltip>
            //         <h3 style={{ color: secondaryColor, fontSize: '1.8em' }}>{council.name}</h3>
            //         <span>
            //             {moment(new Date(council.dateStart)).format("LLL")}
            //         </span>

            //         {(councilStarted(council) && (council.statute.existsLimitedAccessRoom === 1) && participantNeverConnected(participant)) &&
            //             <p>
            //                 {translate.room_access_close_at}
            //                 <span style={{ fontWeight: 'bold', marginLeft: '2px' }}>
            //                     {
            //                         moment(new Date(council.dateRealStart))
            //                             .add(council.statute.limitedAccessRoomMinutes, 'm')
            //                             .format("HH:mm")
            //                     }
            //                 </span>
            //             </p>
            //         }
            //     </div>

            //     <div style={styles.loginFormContainer}>
            //         <form style={{ width: '100%' }}>
            //             <TextInput
            //                 floatingText={translate.email}
            //                 type="email"
            //                 fullWidth
            //                 errorText={errors.email}
            //                 value={email}
            //                 onChange={event =>
            //                     this.handleChange("email", event)
            //                 }
            //                 disabled={true}
            //             />

            //             {council.securityType !== 0 && (
            //                 <React.Fragment>
            //                     <TextInput
            //                         onKeyUp={this.handleKeyUp}
            //                         floatingText={council.securityType === 2 ? translate.key_by_sms : translate.key_by_email}
            //                         type={showPassword ? "text" : "password"}
            //                         errorText={errors.password}
            //                         value={password}
            //                         onChange={event =>
            //                             this.handleChange("password", event)
            //                         }
            //                         required={true}
            //                         showPassword={showPassword}
            //                         passwordToggler={() =>
            //                             this.setState({
            //                                 showPassword: !showPassword
            //                             })
            //                         }
            //                     />
            //                     <span style={{ cursor: 'pointer', color: this.state.hover ? secondaryColor :"", borderBottom: this.state.hover ? `1px solid ${secondaryColor}` :"" }} onClick={this.showSendPassModal} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
            //                         {translate.didnt_receive_access_key}
            //                     </span>
            //                     <AlertConfirm
            //                         requestClose={this.closeSendPassModal}
            //                         open={this.state.sendPassModal}
            //                         loadingAction={this.state.loading}
            //                         acceptAction={this.sendParticipantRoomKey}
            //                         buttonAccept={translate.accept}
            //                         buttonCancel={translate.cancel}
            //                         bodyText={this._sendPassModalBody()}
            //                         title={translate.resend_access_key}
            //                     />
            //                 </React.Fragment>
            //             )}

            //             <div style={styles.enterButtonContainer}>
            //                 <BasicButton
            //                     text={translate.enter_room}
            //                     color={primaryColor}
            //                     textStyle={{
            //                         color: "white",
            //                         fontWeight: "700"
            //                     }}
            //                     textPosition="before"
            //                     fullWidth={true}
            //                     icon={
            //                         <ButtonIcon
            //                             color="white"
            //                             type="directions_walk"
            //                         />
            //                     }
            //                     onClick={this.login}
            //                 />
            //             </div>
            //         </form>
            //     </div>
            // </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(mainActions, dispatch)
    };
}

const checkParticipantKey = gql`
    mutation CheckParticipantKey($participantId: Int!, $key: Int!){
        checkParticipantKey(participantId: $participantId, key: $key){
            success
            message
        }
    }
`;

const sendParticipantRoomKey = gql`
    mutation SendParticipantRoomKey($participantIds: [Int]!, $councilId: Int!, $timezone: String!){
        sendParticipantRoomKey(participantsIds: $participantIds, councilId: $councilId, timezone: $timezone){
            success
        }
    }
`;

export default compose(
    graphql(checkParticipantKey, {
        name: 'checkParticipantKey'
    }),
    graphql(sendParticipantRoomKey, {
        name: 'sendParticipantRoomKey'
    })
)(connect(
    null,
    mapDispatchToProps
)(withTranslations()(withWindowOrientation(withWindowSize(LoginForm)))));
