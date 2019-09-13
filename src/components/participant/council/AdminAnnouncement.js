import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { Paper } from 'material-ui';
import { BasicButton } from '../../../displayComponents';
import icono from "../../../assets/img/logo-icono.png";
import { ConfigContext } from '../../../containers/AppControl';

const AdminAnnouncement = ({ data, council, closeButton, translate, closeRoomAnnouncement }) => {
    const context = React.useContext(ConfigContext);

    const closeAnnouncement = async () => {
        await closeRoomAnnouncement({
            variables: {
                councilId: council.id
            }
        })
        data.refetch();
    }

    if(data.loading || !context.roomAnnouncement){
        return <span />;
    }

    return (
        data.adminAnnouncement?
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
                        padding: '1em',
                        paddingTop: '0.5em',
                        maxWidth: '95%'
                    }}
                >
                    <h4>Mensaje del administrador</h4>
                    <div
                        style={{
                            display: 'flex',
                            paddingTop: '0.5em'
                        }}
                    >
                        <div>
                            <img src={icono} style={{width: '3em', height: 'auto'}} alt="councilbox-icon" />
                        </div>
                        <div style={{padding: '1em', paddingTop: '0'}}>
                            El administrador de la sala dice:<br/>
                            <div dangerouslySetInnerHTML={{__html: data.adminAnnouncement.text}} />
                            {closeButton &&
                                <BasicButton
                                    text={translate.close}
                                    textStyle={{fontWeight: '700', textTransform: 'none'}}
                                    onClick={closeAnnouncement}
                                    buttonStyle={{marginTop: '1em'}}
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

export default compose(
    graphql(adminAnnouncement, {
        options: props => ({
            variables: {
                councilId: props.council.id
            },
            pollInterval: 8000
        })
    }),
    graphql(closeRoomAnnouncement, { name: 'closeRoomAnnouncement'})
)(AdminAnnouncement);

