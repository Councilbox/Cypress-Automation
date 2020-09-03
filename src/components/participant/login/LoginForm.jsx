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
import { getPrimary, getSecondary } from "../../../styles/colors";
import { ButtonIcon, TextInput, BasicButton, AlertConfirm, HelpPopover, LoadingSection } from "../../../displayComponents";
import { councilStarted, participantNeverConnected, hasAccessKey } from '../../../utils/CBX';
import { moment } from '../../../containers/App';
import { useOldState, useCountdown, useSendRoomKey, useInterval } from "../../../hooks";
import { withApollo } from 'react-apollo';
import LoginWithCert from "./LoginWithCert";
import CouncilKeyButton from "./CouncilKeyButton";
import SMSStepper from "./SMSAccess/SMSStepper";
import { isMobile } from "react-device-detect";

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

const LoginForm = ({ participant, translate, company, council, client, ...props }) => {
    const [loading, setLoading] = React.useState(true);
    const [state, setState] = useOldState({
        password: "",
        sendPassModal: council.securityType !== 0 ? true : false,
        showPassword: false,
        errors: {
            email: "",
            password: ""
        },
        hover: false,
        helpPopover: true,
        modal: false
    });
    const [sends, setSends] = React.useState(null);
    const [responseSMS, setResponseSMS] = React.useState('');
    const { secondsLeft, setCountdown } = useCountdown(0);
    const [loadingKey, sendKey] = useSendRoomKey(client, participant);
    const primary = getPrimary();
    const secondary = getSecondary();

    const getData = React.useCallback(async value => {
        const response = await client.query({
            query: participantSend,
            variables: {
                councilId: council.id,
                participantId: participant.id,
                options: {
                    offset: 0,
                    limit: 20
                }
            }
        });

        if (response.data.participantSend.list) {
            setSends(response.data.participantSend.list);
        }
        setLoading(false);
    }, [council.id]);

    React.useEffect(() => {
        if (council.securityType === 2) {
            getData();
        }
    }, [getData, council.id]);

    useInterval(getData, responseSMS === 20? 5000 : null);

    React.useEffect(() => {
        if(sends && sends.length > 0){
            const lastSend = sends[sends.length - 1];
            const end = moment(new Date());
            const start = moment(lastSend.sendDate);
            const duration = moment.duration(start.diff(end));
            const seconds = duration.asSeconds();
            if(seconds > -60){
                setCountdown(Math.round(60 + seconds));
            }
            setResponseSMS(lastSend.reqCode);
        }
    }, [sends]);

    const checkFieldsValidationState = () => {
        let errors = {
            password: ""
        };

        if (council.securityType === 0 || council.securityType == 3) {
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
        if (hasAccessKey(council)) {
            try {
                const response = await props.checkParticipantKey({
                    variables: {
                        participantId: participant.id,
                        key: +state.password
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
            handleSuccess();
        }

    };

    const handleSuccess = () => {
        props.actions.participantLoginSuccess();
        bHistory.push(`/participant/${participant.id}/council/${council.id}/${participant.roomType === 'MEETING' ? 'meet' : 'council'}`);
    }

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

    const sendParticipantRoomKey = async () => {
        setState({
            loading: true
        });
        const response = await sendKey();

        if (!response.data.sendMyRoomKey.success) {
            setResponseSMS(-2);
            setCountdown(60);
        } else {
            setResponseSMS(20);
            setState({
                modal: true
            });
            setCountdown(60);
        }
    }

    const showHiddenPhone = num => {
        if(!num){
            return '';
        }

        return num.toString().substr(num.length - 4);
    }

    const success = !!responseSMS && (responseSMS === 20 || responseSMS === 22);
    const error = !!responseSMS && !success;

    const renderAccessButton = () => {
        if(council.securityType === 3){
            return (
                <LoginWithCert
                    translate={translate}
                    participant={participant}
                    handleSuccess={handleSuccess}
                    status={props.status}
                    message={props.message}
                    dispatch={props.updateState}
                />
            )
        }

        if(council.securityType === 0){
            return (
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
            )
        }

        const disabled = secondsLeft > 0 && error;

        return (
            <>
                <div style={{ margin: "0 auto", marginTop: "1em", display: isMobile ? "" : "flex", justifyContent: "space-between", width: "90%", }}>
                    <CouncilKeyButton
                        participant={participant}
                        council={council}
                        translate={translate}
                        open={state.sendPassModal}
                        fullWidth={isMobile}
                        requestclose={closeSendPassModal}
                        council={council}
                    />
                    <BasicButton
                        // TRADUCCION
                        text={disabled ? `SMS Enviado. Reenviar en (${secondsLeft}sec)` : 
                            success? translate.enter_room : 'Solicita la clave de acceso'}
                        color={primary}
                        textStyle={{
                            color: "white",
                            fontWeight: "700",
                            marginTop: isMobile ? "1em" : ""
                        }}
                        disabled={disabled}
                        buttonStyle={{
                            minWidth: '200px'
                        }}
                        textPosition="before"
                        fullWidth={isMobile}
                        onClick={
                            success? 
                                login
                            : 
                            sendParticipantRoomKey
                        }
                    />
                </div>
                {/* no recibi el sms, un state para abrir y modal */}
                <AlertConfirm
                    open={responseSMS != "" && state.modal && success}
                    requestClose={() => setState({ modal: false })}
                    bodyText={
                        <div style={{ margin: isMobile ? "4em 0em 2em" : "4em 4em 2em" }}>
                            {loading ?
                                <LoadingSection />
                                :
                                <React.Fragment>
                                    <div style={{ textAlign: "center", color: "black", fontWeight: "bold" }}>
                                        El SMS se ha enviado con éxito al número terminado en ...{showHiddenPhone(participant.phone)}
                                    </div>
                                    <div style={{ marginTop: "3em", display: isMobile ? "" : "flex", justifyContent: "center" }}>
                                        <BasicButton
                                            text={
                                                <div>
                                                    <span>Volver a enviar SMS</span>
                                                    {secondsLeft > 0 &&
                                                        <span style={{ fontWeight: "300", marginLeft: "5px" }}>{`(${secondsLeft}seg)`}</span>
                                                    }
                                                </div>
                                            }
                                            disabled={secondsLeft > 0}
                                            color={secondsLeft <= 0 ? primary : 'grey'}
                                            backgroundColor={{ borderRadius: '4px', minWidth: "200px" }}
                                            textStyle={{
                                                width: "auto",
                                                color: "white",
                                                fontWeight: "700",
                                                marginRight: "1em",
                                                marginBottom: isMobile? "1em" : "",
                                            }}
                                            textPosition="before"
                                            fullWidth={true}
                                            onClick={!secondsLeft && sendParticipantRoomKey}
                                        />
                                        <CouncilKeyButton
                                            participant={participant}
                                            council={council}
                                            translate={translate}
                                            open={state.sendPassModal}
                                            requestclose={closeSendPassModal}
                                            council={council}
                                            styles={{
                                                border: ``, 
                                                color: "white",
                                                fontWeight: "700",
                                                borderRadius: '4px',
                                                minWidth: "200px",
                                                backgroundColor: getPrimary(),
                                            }}
                                        // setResponseSMS={setResponseSMS}
                                        />
                                    </div>
                                </React.Fragment>
                            }
                        </div>
                    }
                />
            </>
        )
    }

    const { password, errors, showPassword } = state;


    return (
        <div style={{
            ...styles.loginContainerMax,
            ...(council.securityType !== 0 ? {
                height: ""
            } : {}),
        }}>
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
                        {/* //comprobar bien que esta sea la validacion */}
                        {council.securityType === 2 &&
                            <div style={{ color: '#61abb7', fontWeight: 'bold', margin: "1em" }}>
                                Esta reunión es privada y el administrador ha protegido el acceso con doble verificación. Recibirás la clave en tu móvil
                            </div>
                        }
                    </div>

                    {/* <div style={styles.loginFormContainer}> */}
                    <Card elevation={1} style={{ padding: "1.5em", border: "1px solid gainsboro" }}>
                        <form style={{ width: '100%' }}>
                            <TextInput
                                styleFloatText={{ fontSize: "20px" }}
                                floatingText={translate.email}
                                type="email"
                                fullWidth
                                errorText={errors.email}
                                value={participant.email}
                                disabled={true}
                            />

                            {hasAccessKey(council) && (
                                <React.Fragment>
                                    <TextInput
                                        onKeyUp={handleKeyUp}
                                        helpPopoverInLabel={true}
                                        floatingText={council.securityType === 2 ?
                                            (
                                                <div style={{ display: "flex", fontSize: "20px" }}>
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

                                    
                                </React.Fragment>
                            )} 
                            {renderAccessButton()}
                        </form>
                    </Card>
                    {error &&
                        <div style={{ fontWeight: "bold", color: "#f11a1a", marginTop: "2em", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: "90%", }}>
                                {'Hay un error con la entrega de SMS a tu teléfono. Contacta con el admin para confirmar que tus datos son correctos antes de volver a enviarlo.'}
                            </div>
                        </div>
                    }
                    {council.securityType === 2 &&
                        <div style={{ marginTop: "1em", marginBottom: "1em", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: "100%" }}>
                                <SMSStepper
                                    council={council}
                                    translate={translate}
                                    responseSMS={responseSMS}
                                    resendKey={sendParticipantRoomKey}
                                    error={error}
                                />
                            </div>
                        </div>
                    }
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
    mutation SendMyRoomKey{
        sendMyRoomKey{
            success
        }
    }
`;


const participantSend = gql`
    query participantSend($councilId: Int!, $filter: String,  $options: OptionsInput, $participantId: Int!,){
        participantSend(councilId: $councilId, filter: $filter, options: $options, participantId: $participantId){
            list{
                liveParticipantId
                sendType
                id
                reqCode
                sendDate
                councilId
                recipient{
                    name
                    id
                    surname
                    phone
                    email
                }
            }
        total
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