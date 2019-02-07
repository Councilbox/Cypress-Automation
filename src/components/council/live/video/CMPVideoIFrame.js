import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import RecordingButton from './RecordingButton';
import { darkGrey } from '../../../../styles/colors';
import { ConfigContext } from '../../../../containers/AppControl';
import AdminAnnouncement from '../../../participant/council/AdminAnnouncement';
import { useInterval } from '../../../../hooks';

const rand = Date.now();

if(!sessionStorage.getItem('adminId')){
    sessionStorage.setItem('adminId', rand);
}

const CMPVideoIFrame = ({ data, ...props }) => {
    const config = React.useContext(ConfigContext);
    React.useEffect(() => {
        if(!data.loading){
            if(!props.videoURL){
                props.setVideoURL(data.error? 'Error' : data.roomVideoURL);
            }
        }
    }, [data.loading]);

    useInterval(() => {
        if(props.videoURL !== 'Error'){
            props.adminPing({
                variables: {
                    councilId: props.council.id,
                    adminId: sessionStorage.getItem('adminId')
                }
            })
        }
    }, 10000);

    return (
        <div style={{width: '100%', height: '100%', position: 'relative'}}>
            <AdminAnnouncement
                translate={props.translate}
                council={props.council}
                context={config}
                closeButton
            />
            {!!data.roomVideoURL && config.video?
                <React.Fragment>
                    {data.roomVideoURL.includes('councilbox') &&
                        <RecordingButton
                            config={config}
                            council={props.council}
                            translate={props.translate}
                        />
                    }
                    <iframe
                        title="meetingScreen"
                        allow="geolocation; microphone; camera"
                        scrolling="no"
                        className="temp_video"
                        src={`https://${data.roomVideoURL}?rand=${rand}`}
                        allowFullScreen={true}
                        style={{
                            border: "none !important"
                        }}
                    >
                        Something wrong...
                    </iframe>
                </React.Fragment>
            :
                <div
                    style={{
                        width: '100%',
                        backgroundColor: darkGrey,
                        height: '100%',
                        color: 'white'
                    }}
                >
                    Lo sentimos, algo ha ocurrido con el servidor de video, disculpe las molestias
                </div>
            }
        </div>
    )
}

const videoURL = gql`
    query RoomVideoURL($councilId: Int!, $participantId: String!, $adminId: String){
        roomVideoURL(councilId: $councilId, participantId: $participantId, adminId: $adminId)
    }
`;


const adminPing = gql`
    mutation AdminPing($councilId: Int!, $adminId: String!){
        adminPing(councilId: $councilId, adminId: $adminId){
            success
        }
    }
`;

export default compose(
    graphql(videoURL, {
        options: props => ({
            variables: {
                councilId: props.council.id,
                participantId: 'Mod',
                adminId: sessionStorage.getItem('adminId')
            }
        })
    }),
    graphql(adminPing, {
        name: 'adminPing'
    })
)(CMPVideoIFrame);