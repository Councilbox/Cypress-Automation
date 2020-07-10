import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { Paper } from 'material-ui';
import { BasicButton, Checkbox } from '../../../displayComponents';
import icono from "../../../assets/img/logo-icono.png";
import { ConfigContext } from '../../../containers/AppControl';
import { getPrimary } from '../../../styles/colors';
import aviso from '../../../assets/img/aviso.svg';


const AdminAnnouncement = ({ data, council, closeButton, translate, closeRoomAnnouncement, blockFunctionsRoomAnnouncement, openHelp, isAdmin, ...props }) => {
    const context = React.useContext(ConfigContext);
    const [announcement, setAnnouncement] = React.useState(null);
    const [mostrarInfo, setMostrarInfo] = React.useState(openHelp ? openHelp : false);
    const [showCloseButton, setShowCloseButton] = React.useState(false);
    const [showInParticipant, setShowInParticipant] = React.useState(true);

    React.useEffect(() => {
        props.subscribeToAdminAnnoucement({ councilId: council.id });
    }, [council.id])

    const closeAnnouncement = async () => {
        await closeRoomAnnouncement({
            variables: {
                councilId: council.id
            }
        })
        // data.refetch();
    }


    React.useEffect(() => {
        if (!data.loading) {
            if(data.adminAnnouncement){
                if(!announcement || data.adminAnnouncement.id !== announcement){
                    setAnnouncement(data.adminAnnouncement);
                }
            }
        }
    }, [data])

    React.useEffect(() => {
        if (isAdmin && !data.loading && data.adminAnnouncement) {
            buttonCloseShow()
        }
    }, [showCloseButton])

    const buttonCloseShow = async () => {
        const response = await blockFunctionsRoomAnnouncement({
            variables: {
                message: {
                    councilId: council.id,
                    text: data.adminAnnouncement.text,
                    participantId: -1,
                    // blockUser: true,
                    blockUser: showCloseButton,
                    id: data.adminAnnouncement.id
                },
            }
        })
        data.refetch();
    }

    if (data.loading || !context.roomAnnouncement) {
        return <span />;
    }

    return (
        data.adminAnnouncement && showInParticipant ?
            <div
                id="announcement-container"
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 10
                }}
            >
                <Paper elevation={5}
                    style={{
                        padding: '1.5em',
                        maxWidth: '95%',
                        borderRadius: "8px"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", color: "black" }}>
                        {/* TRADUCCION */}
                        <div style={{ paddingRight: "0.5em" }}><img src={aviso}></img></div>
                        <div style={{ fontSize: "18px", color: "black" }}>Aviso del administrador</div>
                        <div style={{ paddingLeft: "0.5em", width: mostrarInfo && "230px", display: "flex" }} >
                            <i className="material-icons" style={{ color: getPrimary(), fontSize: '14px', paddingRight: "0.3em", cursor: "pointer" }} onClick={() => setMostrarInfo(!mostrarInfo)}>
                                help
                            </i>
                            {mostrarInfo &&
                                <div style={{ color: "rgba(0, 0, 0, 0.37)", fontSize: "10px" }}>
                                    Este aviso bloquea todas las funciones de los participantes hasta que haya sido cerrado
                                </div>}
                        </div>
                    </div>
                    <div
                        style={{
                            paddingTop: '0.5em'
                        }}
                    >
                        <div style={{
                            color: getPrimary()
                        }}>
                            {/* TRADUCCION */}
                            {isAdmin &&
                                <Checkbox
                                    label={"Bloquear funciones a los participantes hasta cerrar el aviso"}
                                    styleInLabel={{ color: getPrimary(), fontSize: "12px" }}
                                    colorCheckbox={"primary"}
                                    value={showCloseButton}
                                    onChange={() => setShowCloseButton(!showCloseButton)}
                                />
                            }
                        </div>
                        <div style={{ marginTop: "5px" }} >
                            <div style={{ width: "100%", border: "1px solid" + getPrimary(), minHeight: "80px", margin: "0 auto", padding: "5px", fontSize: "13px", color: "black" }}>
                                <div dangerouslySetInnerHTML={{ __html: data.adminAnnouncement.text }} />
                            </div>
                        </div>
                        <div style={{ width: "100%" }} >
                            {isAdmin &&
                                <BasicButton
                                    text={"Cerrar aviso"}
                                    // text={translate.close}
                                    textStyle={{ textTransform: 'none', color: "white", }}
                                    onClick={closeAnnouncement}
                                    buttonStyle={{ marginTop: '.8em', width: "100%" }}
                                    backgroundColor={{ backgroundColor: getPrimary(), boxShadow: "none", borderRadius: "0" }}
                                />
                            }
                        </div>
                        <div style={{ width: "100%" }} >
                            {!isAdmin && data.adminAnnouncement.blockUser &&
                                <BasicButton
                                    text={"Cerrar aviso"}
                                    // text={translate.close}
                                    textStyle={{ textTransform: 'none', color: "white", }}
                                    onClick={() => setShowInParticipant(false)}
                                    buttonStyle={{ marginTop: '.8em', width: "100%" }}
                                    backgroundColor={{ backgroundColor: getPrimary(), boxShadow: "none", borderRadius: "0" }}
                                />
                            }
                        </div>
                    </div>
                </Paper>
            </div>
            :
            <span />
    )
}

const adminAnnouncement = gql`
    query AdminAnnouncement($councilId: Int!){
        adminAnnouncement(councilId: $councilId){
            text
            id
            active
            blockUser
        }
    }
`;

const closeRoomAnnouncement = gql`
    mutation CloseRoomAnnouncement($councilId: Int!){
        closeRoomAnnouncement(councilId: $councilId){
            success
        }
    }
`;


const blockFunctionsRoomAnnouncement = gql`
    mutation blockFunctionsRoomAnnouncement($message: RoomMessageInput!){
        blockFunctionsRoomAnnouncement(message: $message){
            success
            message
        }
    }
`;

export default compose(
    graphql(adminAnnouncement, {
        options: props => ({
            variables: {
                councilId: props.council.id
            },
            pollInterval: 15000,
        }),
        props: props => {
            return {
                ...props,
                subscribeToAdminAnnoucement: params => {
                    return props.data.subscribeToMore({
                        document: gql`
                        subscription adminAnnouncementUpdate($councilId: Int!){
                            adminAnnouncementUpdate(councilId: $councilId){
                                text
                                id
                                active
                                councilId
                            }
                        }`,
                        variables: {
                            councilId: params.councilId
                        },
                        updateQuery: (prev, { subscriptionData }) => {
                            if (subscriptionData.data.adminAnnouncementUpdate) {
                                if (subscriptionData.data.adminAnnouncementUpdate.active === 1) {
                                    return ({
                                        adminAnnouncement: subscriptionData.data.adminAnnouncementUpdate
                                    });
                                }
                            }

                            return ({
                                adminAnnouncement: null
                            });

                        }
                    });
                }
            };
        }
    }),
    graphql(closeRoomAnnouncement, { name: 'closeRoomAnnouncement' }),
    graphql(blockFunctionsRoomAnnouncement, { name: 'blockFunctionsRoomAnnouncement' })
)(AdminAnnouncement);

