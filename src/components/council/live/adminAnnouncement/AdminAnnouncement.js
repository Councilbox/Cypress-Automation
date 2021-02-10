import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { Paper } from 'material-ui';
import { BasicButton } from '../../../../displayComponents';
import { ConfigContext } from '../../../../containers/AppControl';
import { getPrimary } from '../../../../styles/colors';
import AdminAnnouncementBody from './AdminAnnouncementBody';


const AdminAnnouncement = ({
 data, council, closeButton, translate, closeRoomAnnouncement, updateAdminAnnouncement, openHelp, isAdmin, ...props
}) => {
    const context = React.useContext(ConfigContext);
    const [announcement, setAnnouncement] = React.useState(null);
    const [blockUser, setBlockUser] = React.useState(false);
    const [showInParticipant, setShowInParticipant] = React.useState(true);

    const container = document.getElementById('announcement-container');

    const containerWidth = container ? container.offsetWidth : 0;

    const maxWidth = containerWidth > 640 ? '600px' : `${containerWidth - 50}px`;


    React.useEffect(() => {
        props.subscribeToAdminAnnoucement({ councilId: council.id });
    }, [council.id]);

    const closeAnnouncement = async () => {
        await closeRoomAnnouncement({
            variables: {
                councilId: council.id
            }
        });
    };


    React.useEffect(() => {
        if (!data.loading) {
            if (data.adminAnnouncement) {
                if (!announcement || data.adminAnnouncement.id !== announcement) {
                    setAnnouncement(data.adminAnnouncement);
                    setBlockUser(data.adminAnnouncement.blockUser);
                }
            }
        }
    }, [data]);

    const updateAnnouncement = async message => {
        setBlockUser(blockUser);

        await updateAdminAnnouncement({
            variables: {
                message: {
                    councilId: council.id,
                    id: data.adminAnnouncement.id,
                    participantId: -1,
                    text: data.adminAnnouncement.text,
                    ...message
                },
            }
        });
        data.refetch();
    };

    if (data.loading || !context.roomAnnouncement) {
        return <span />;
    }

    return (
        (data.adminAnnouncement && (showInParticipant || data.adminAnnouncement.blockUser)) ?
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
                        padding: '20px',
                        maxHeight: '100%',
                        borderRadius: '8px',
                        position: 'relative'
                    }}
                >
                    <div style={{ paddingBottom: '2.5em', width: maxWidth }}>
                        <AdminAnnouncementBody
                            announcement={data.adminAnnouncement}
                            admin={isAdmin}
                            translate={translate}
                            updateAnnouncement={updateAnnouncement}
                            blockUser={blockUser}
                        />
                    </div>

                    <div style={{
                        width: '100%',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        display: 'flex',
                        height: '4em',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            width: '80%'
                        }}>
                            {isAdmin
                                && <BasicButton
                                    text={translate.hide_announcement}
                                    textStyle={{ textTransform: 'none', color: 'white', }}
                                    onClick={closeAnnouncement}
                                    buttonStyle={{ marginTop: '.8em', width: '100%' }}
                                    backgroundColor={{ backgroundColor: getPrimary(), boxShadow: 'none', borderRadius: '0' }}
                                />
                            }
                            {!isAdmin && !data.adminAnnouncement.blockUser
                                && <BasicButton
                                    text={translate.hide_announcement}
                                    textStyle={{ textTransform: 'none', color: 'white', }}
                                    onClick={() => setShowInParticipant(false)}
                                    buttonStyle={{ marginTop: '.8em', width: '100%' }}
                                    backgroundColor={{ backgroundColor: getPrimary(), boxShadow: 'none', borderRadius: '0' }}
                                />
                            }
                        </div>
                    </div>
                </Paper>
            </div>
            : <span />
    );
};

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


const updateAdminAnnouncement = gql`
    mutation updateAdminAnnouncement($message: RoomMessageInput!){
        updateAdminAnnouncement(message: $message){
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
        props: props => ({
                ...props,
                subscribeToAdminAnnoucement: params => props.data.subscribeToMore({
                        document: gql`
                        subscription adminAnnouncementUpdate($councilId: Int!){
                            adminAnnouncementUpdate(councilId: $councilId){
                                text
                                id
                                active
                                blockUser
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
                    })
            })
    }),
    graphql(closeRoomAnnouncement, { name: 'closeRoomAnnouncement' }),
    graphql(updateAdminAnnouncement, { name: 'updateAdminAnnouncement' })
)(AdminAnnouncement);

