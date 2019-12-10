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
import { ButtonIcon, TextInput, BasicButton, AlertConfirm, HelpPopover, LoadingSection } from "../../../displayComponents";
import { councilStarted, participantNeverConnected, getSMSStatusByCode } from '../../../utils/CBX';
import { moment } from '../../../containers/App';
import { useOldState } from "../../../hooks";
import { withApollo } from 'react-apollo';
import CouncilKeyModal from "./CouncilKeyModal";



const styles = {
    loginContainerMax: {
        width: "100%",
        height: "100%",
        padding: '1em',
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

/////////Quitar
const limitPerPage = 10;

const LoginForm = ({ participant, translate, company, council, client, ...props }) => {
    const [state, setState] = useOldState({
        password: "",
        sendPassModal: council.securityType !== 0 ? true : false,
        showPassword: false,
        errors: {
            email: "",
            password: ""
        },
        hover: false,
        helpPopover: true
    });

    const primary = getPrimary();
    const secondary = getSecondary();


    const checkFieldsValidationState = () => {
        let errors = {
            password: ""
        };

        if (council.securityType === 0) {
            errors.password = "";
        } else {
            errors.password =
                !(state.password.length > 0) ? translate.field_required : "";
        }

        setState({
            ...state,
            errors
        });

        return errors.password === "";
    };

    const handleChange = (field, event) => {
        const newState = {};
        newState[field] = event.target.value;
        setState(newState, checkFieldsValidationState);
    }

    const showSendPassModal = () => {
        setState({
            sendPassModal: true
        });
    }

    const closeSendPassModal = () => {
        setState({
            sendPassModal: false,
            phoneError: ''
        })
    }

    const login = async () => {
        const isValidForm = checkFieldsValidationState();
        if (council.securityType !== 0) {
            try {
                const response = await props.checkParticipantKey({
                    variables: {
                        participantId: participant.id,
                        key: state.password
                    }
                });

                if (!response.data.checkParticipantKey.success) {
                    setState({
                        errors: {
                            password: translate.incorrect_access__key
                        }
                    });
                    return;
                }
            } catch (error) {
                setState({
                    errors: {
                        password: translate.incorrect_access__key
                    }
                });
                return;
            }
        }
        if (isValidForm) {
            props.actions.participantLoginSuccess();
            bHistory.push(`/participant/${participant.id}/council/${council.id}/${participant.roomType === 'MEETING' ? 'meet' : 'council'}`);
        }

    };

    const handleKeyUp = event => {
        if (event.nativeEvent.keyCode === 13) {
            login();
        }
    };


    const _tooltipContent = () => {
        const securityTypes = {
            1: translate.key_should_receive_email,
            2: translate.key_must_receive_sms
        }

        return securityTypes[council.securityType];

    }


    const onMouseEnter = () => {
        setState({
            hover: true
        })
    }

    const onMouseLeave = () => {
        setState({
            hover: false
        })
    }

    const { email, password, errors, showPassword } = state;

    return (
        <div style={{
            ...styles.loginContainerMax,
            ...(council.securityType !== 0 ? {
                height: ""
            } : {}),
        }}>
            {/* <div style={styles.loginContainerMax, ...()  height: "100%" }> */}
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
                        <h3 style={{ color: secondary, fontSize: '1.8em' }}>{council.name}</h3>
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
                                    handleChange("email", event)
                                }
                                disabled={true}
                            />
                            {council.securityType !== 0 &&
                                <React.Fragment>
                                    <TextInput
                                        onKeyUp={handleKeyUp}
                                        helpPopoverInLabel={true}
                                        floatingText={council.securityType === 2 ?
                                            (
                                                <div style={{ display: "flex" }}>
                                                    {translate.key_by_sms}
                                                    <div>
                                                        <HelpPopover
                                                            errorText={!!errors.password}
                                                            title={translate.key_by_sms}
                                                            content={_tooltipContent()}
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
                                                            content={_tooltipContent()}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        }
                                        type={showPassword ? "text" : "password"}
                                        errorText={errors.password}
                                        value={password}
                                        onChange={event =>
                                            handleChange("password", event)
                                        }
                                        required={true}
                                        showPassword={showPassword}
                                        passwordToggler={() =>
                                            setState({
                                                showPassword: !showPassword
                                            })
                                        }
                                    />
                                    <span
                                        style={{
                                            cursor: 'pointer',
                                            color: state.hover ? secondary : "",
                                            borderBottom: state.hover ? `1px solid ${secondary}` : ""
                                        }}
                                        onClick={showSendPassModal}
                                        onMouseEnter={onMouseEnter}
                                        onMouseLeave={onMouseLeave}
                                    >
                                        {translate.didnt_receive_access_key}
                                    </span>
                                    <CouncilKeyModal
                                        participant={participant}
                                        council={council}
                                        translate={translate}
                                        open={state.sendPassModal}
                                        requestclose={closeSendPassModal}
                                    />
                                </React.Fragment>

                            }
                            <div style={styles.enterButtonContainer}>
                                <BasicButton
                                    text={translate.enter_room}
                                    color={primary}
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
                                    onClick={login}
                                />
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
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
)(withTranslations()(withWindowOrientation(withWindowSize(withApollo(LoginForm))))));



/*
{council.securityType !== 0 && (
                                <React.Fragment>
                                    <AlertConfirm
                                        requestClose={() => setModalSecurity(false)}
                                        open={modalSecurity}
                                        bodyText={
                                            <div>
                                                {council.securityType === 1 &&
                                                    <React.Fragment>
                                                        {loading ?
                                                            <LoadingSection></LoadingSection>
                                                            :
                                                            data === undefined ?
                                                                <div>
                                                                    <div style={{ display: "flex" }}>
                                                                        <div>Para entrar en esta reunión es necesario una clave que se envía por email </div>
                                                                    </div>
                                                                    <br></br>
                                                                    <div style={{ marginTop: "1em" }}>
                                                                        <BasicButton
                                                                            text={'Enviar Email'}
                                                                            color={secondary}
                                                                            textStyle={{
                                                                                maxWidth: '200px',
                                                                                color: "white",
                                                                                fontWeight: "700"
                                                                            }}
                                                                            textPosition="before"
                                                                            fullWidth={true}
                                                                            onClick={sendParticipantRoomKey}
                                                                            loading={state.loading}
                                                                        ></BasicButton>
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div>
                                                                    <div style={{ display: "flex" }}>
                                                                        <div>Email enviado corretamente </div>
                                                                    </div>
                                                                    <br></br>
                                                                    <div style={{ marginTop: "1em" }}>
                                                                        <BasicButton
                                                                            text={'Enviar Email'}
                                                                            color={secondary}
                                                                            textStyle={{
                                                                                maxWidth: '200px',
                                                                                color: "white",
                                                                                fontWeight: "700"
                                                                            }}
                                                                            textPosition="before"
                                                                            fullWidth={true}
                                                                            onClick={sendParticipantRoomKey}
                                                                            loading={state.loading}
                                                                        ></BasicButton>
                                                                    </div>
                                                                </div>
                                                        }
                                                    </React.Fragment>
                                                }
                                                {council.securityType === 2 &&
                                                    <React.Fragment>
                                                        {loading ?
                                                            <LoadingSection></LoadingSection>
                                                            :
                                                            data === undefined ?
                                                                <div>
                                                                    <div style={{ display: "flex" }}>
                                                                        {renderStatusSMS(288)}
                                                                        <div style={{ fontWeight: "bold", marginLeft: "1em" }}> {formatPhone(participant.phone)}</div>
                                                                    </div>
                                                                    <br></br>
                                                                    <div style={{ marginTop: "1em" }}>
                                                                        <BasicButton
                                                                            text={'Enviar SMS'}
                                                                            color={secondary}
                                                                            textStyle={{
                                                                                maxWidth: '200px',
                                                                                color: "white",
                                                                                fontWeight: "700"
                                                                            }}
                                                                            textPosition="before"
                                                                            fullWidth={true}
                                                                            onClick={sendParticipantRoomKey}
                                                                            loading={state.loading}
                                                                        ></BasicButton>
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div>
                                                                    <div style={{ display: "flex" }}>
                                                                        {renderStatusSMS(data.reqCode)}
                                                                        <div style={{ fontWeight: "bold", marginLeft: "1em" }}> {formatPhone(data.recipient.phone)}</div>
                                                                    </div>
                                                                    <br></br>
                                                                    {data.reqCode !== -2 &&
                                                                        <div style={{ marginTop: "1em" }}>
                                                                            <BasicButton
                                                                                text={'Enviar SMS'}
                                                                                color={secondary}
                                                                                textStyle={{
                                                                                    maxWidth: '200px',
                                                                                    color: "white",
                                                                                    fontWeight: "700"
                                                                                }}
                                                                                textPosition="before"
                                                                                fullWidth={true}
                                                                                onClick={sendParticipantRoomKey}
                                                                                loading={state.loading}
                                                                            ></BasicButton>
                                                                        </div>
                                                                    }
                                                                </div>
                                                        }
                                                    </React.Fragment>
                                                }
                                                {!!state.phoneError &&
                                                    <div style={{ color: 'red' }}>{state.phoneError}</div>
                                                }
                                            </div>
                                        }
                                        title={council.securityType === 2 ? translate.key_by_sms : translate.key_by_email}
                                    />
                                    
                                </React.Fragment>
                            )}


*/