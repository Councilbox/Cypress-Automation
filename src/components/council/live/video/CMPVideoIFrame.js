import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import RecordingButton from './RecordingButton';
import { darkGrey } from '../../../../styles/colors';
import { ConfigContext } from '../../../../containers/AppControl';
import AdminAnnouncement from '../../../participant/council/AdminAnnouncement';
import { useInterval } from '../../../../hooks';
import { LoadingSection } from '../../../../displayComponents';

const rand = Date.now();

if(!sessionStorage.getItem('adminId')){
    sessionStorage.setItem('adminId', rand);
}


const CMPVideoIFrame = props => {
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState(null);
    const config = React.useContext(ConfigContext);

    React.useEffect(() => {
        if(!data){
            fetchVideoURL(setData, props.client, );
        }
    }, []);

    React.useEffect(() => {
        if(!loading){
            if(data.errors){
                props.setVideoURL(data.errors[0].message === 'Admin already in the room'? 'Admin already logued' : 'Error');
            } else {
                sendAdminPing();
                props.setVideoURL(data.roomVideoURL);
            }
        }
    }, [loading]);

    useInterval(async () => {
        if(data && data.roomVideoURL){
            sendAdminPing();
        } else {
            setLoading(true);
            await fetchVideoURL();
            setLoading(false);
        }
    }, 10000);

    const fetchVideoURL = async () => {
        setLoading(true);
        const response = await props.client.query({
            query: videoURL,
            variables: {
                councilId: props.council.id,
                participantId: 'Mod',
                adminId: sessionStorage.getItem('adminId'),
            },
        });
        setData({
            ...response.data,
            errors: response.errors
        });
        setLoading(false);
    }

    const sendAdminPing = () => {
        props.adminPing({
            variables: {
                councilId: props.council.id,
                adminId: sessionStorage.getItem('adminId')
            }
        });
    }

    if(loading){
        return <LoadingSection />
    }


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
                    {props.videoURL === 'Admin already logued'?
                        <AdminAlreadyLoguedScreen translate={props.translate} />
                    :
                        <CMPVideoError translate={props.translate} />
                    }
                </div>
            }
        </div>
    )
}

const AdminAlreadyLoguedScreen = ({ translate }) => (
    <div style={{width: '100%', height: '100%', padding: '2em', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{fontWeight: '700'}}>
            {translate.mod_already_streaming_retrying}
        </div>
        <div style={{marginTop: '0.6em'}}>
            <LoadingSection size={20} />
        </div>
    </div>
)

const CMPVideoError = ({ translate }) => (
    <div style={{width: '100%', height: '100%', padding: '2em', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{fontWeight: '700'}}>
            {translate.something_failed_cmp}
        </div>
        <div style={{marginTop: '0.6em'}}>
            <LoadingSection size={20} />
        </div>
    </div>
)

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
    graphql(adminPing, {
        name: 'adminPing'
    })
)(withApollo(CMPVideoIFrame));