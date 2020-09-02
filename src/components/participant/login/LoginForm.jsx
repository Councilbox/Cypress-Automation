import React from "react";
import { Tooltip, Card, Stepper, Step, StepButton } from "material-ui";
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
import { councilStarted, participantNeverConnected, getSMSStatusByCode, hasAccessKey } from '../../../utils/CBX';
import { moment } from '../../../containers/App';
import { useOldState, useCountdown, useSendRoomKey } from "../../../hooks";
import { withApollo } from 'react-apollo';
import CertModal from "./CertModal";
import LoginWithCert from "./LoginWithCert";
import CouncilKeyModal from "./CouncilKeyModal";
import CouncilKeyButton from "./CouncilKeyButton";
import SteperAcceso from "./SteperAcceso";
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

/////////Quitar
const limitPerPage = 10;

const LoginForm = ({ participant, translate, company, council, client, ...props }) => {
    const [loading, setLoading] = React.useState(true);
    const [contador, setContador] = React.useState(60);
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
        modal: true
    });
    const [sends, setSends] = React.useState(null);
    const [error, setError] = React.useState('');
    const [responseSMS, setResponseSMS] = React.useState('');
    const { secondsLeft, setCountdown } = useCountdown(0);
    const [loadingKey, sendKey] = useSendRoomKey(client, participant);
    const [errorAcces, setErrorAcces] = React.useState(false);

    const [data, setData] = React.useState(null);
    //const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = React.useState(null);
    const [modal, setModal] = React.useState(false);
    // const [filter, setFilter] = React.useState(showAll ? null : 'failed');

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
        if (council.securityType !== 0) {
            getData();
        }
    }, [getData, council.id]);


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
        if(council.securityType === 3){
            return setModal(true);
        }


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

    const _sendPassModalBody = () => {
        return (
            <div>
                {council.securityType === 1 &&
                    translate.receive_access_key_email
                }
                {council.securityType === 2 &&
                    data ?
                    <div>
                        {renderStatusSMS(data.reqCode)}
                    </div>
                    :
                    <LoadingSection></LoadingSection>
                }
                {!!state.phoneError &&
                    <div style={{ color: 'red' }}>{state.phoneError}</div>
                }
            </div>
        )
    }

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
        setResponseSMS(response);
        
        if (!response.data.sendMyRoomKey.success) {
            // TRADUCCION
            setError('Hay un error con la entrega de SMS a tu teléfono. Contacta con el admin para confirmar que tus datos son correctos antes de volver a enviarlo.');
            setErrorAcces(true);
            setCountdown(60);
        } else {
            setError('')
            setCountdown(60);
        }
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

    const cuentaAtras = () => {
        setCountdown(60);
    }

    const acortarNumeroTelf = num => {
        if(!num){
            return '';
        }

        return num.toString().substr(num.length - 4);
    }

    const renderStatusSMS = (reqCode) => {
        switch (reqCode) {
            case 22:
                return (<div>El SMS ha sido enviado</div>)
                break;

            case 20:
                return (<div>El SMS ha sido enviado</div>)
                break;

            case -2:
                return (<div>El SMS no se ha podido enviar porque el número no es válido. Por favor contacte con el administrador</div>)
                break;

            default:
                return (<div>El SMS ha fallado.</div>)
        }

    }

    const { password, errors, showPassword } = state;


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
                        {/* //comprobar bien que esta sea la validacion */}
                        {council.securityType !== 0 &&
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

                            {hasAccessKey(council) ? (
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
                                    {/* Esto es el modal de que si no te llego el email */}
                                    {/* <span
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
                                    </span> */}
                                    {/* boton de Recibir clave de acceso / tiene que rotar nombre y lo k hace */}
                                    <div style={{ margin: "0 auto", marginTop: "1em", display: isMobile ? "" : "flex", justifyContent: "space-between", width: "90%", }}>
                                        <CouncilKeyButton
                                            participant={participant}
                                            council={council}
                                            translate={translate}
                                            setError={setError}
                                            open={state.sendPassModal}
                                            requestclose={closeSendPassModal}
                                            council={council}
                                        // setResponseSMS={setResponseSMS}
                                        />
                                        <BasicButton
                                            // TRADUCCION
                                            text={secondsLeft ? error ? `SMS Enviado. Reenviar en (${secondsLeft}sec)` : "Entrar en la sala" : 'Solicita la clave de acceso'}
                                            color={primary}
                                            backgroundColor={
                                                secondsLeft ? error ? { border: `solid 1px ${getPrimary()}`, color: "#7d2180", borderRadius: '4px', minWidth: "200px", backgroundColor: "rgba(124, 39, 130, 0.34)" } :
                                                    { borderRadius: '4px', minWidth: "200px", } :
                                                    { borderRadius: '4px', minWidth: "200px", }}
                                            textStyle={{
                                                width: "auto",
                                                color: "white",
                                                fontWeight: "700",
                                                marginTop: isMobile ? "1em" : ""
                                            }}
                                            textPosition="before"
                                            fullWidth={true}
                                            onClick={secondsLeft ? error ? "" : login : sendParticipantRoomKey}
                                        />
                                    </div>
                                    {/* no recibi el sms, un state para abrir y modal */}
                                    <AlertConfirm
                                        open={responseSMS != "" && state.modal && responseSMS.data.sendMyRoomKey.success}
                                        requestClose={() => setState({ modal: false })}
                                        bodyText={
                                            <div style={{ margin: isMobile ? "4em 0em 2em" : "4em 4em 2em" }}>
                                                {loading ?
                                                    <LoadingSection />
                                                    :
                                                    <React.Fragment>
                                                        <div style={{ textAlign: "center", color: "black", fontWeight: "bold" }}>
                                                            El SMS se ha enviado con éxito al número terminado en ...{acortarNumeroTelf(participant.phone)}
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
                                                                setError={setError}
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
                                    // title={translate.edit}
                                    />


                                    {/* {error &&
                                        <span style={{ color: 'red' }}>{error}</span>

                                    } */}
                                </React.Fragment>
                            )
                        :
                            council.securityType === 3?
                                <LoginWithCert
                                    translate={translate}
                                    participant={participant}
                                    handleSuccess={handleSuccess}
                                    status={props.status}
                                    message={props.message}
                                    dispatch={props.updateState}
                                />
                            :

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
                        } 
                        </form>
                    </Card>
                    {error &&
                        <div style={{ fontWeight: "bold", color: "#f11a1a", marginTop: "2em", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: "90%", }}>
                                {error}
                            </div>
                        </div>
                    }
                    {council.securityType === 2 &&
                        <div style={{ marginTop: "1em", marginBottom: "3em", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: "100%" }}>
                                {/* width: "90%" */}
                                <SteperAcceso
                                    council={council}
                                    responseSMS={responseSMS}
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