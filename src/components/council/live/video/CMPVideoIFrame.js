import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import RecordingButton from './RecordingButton';
import { darkGrey } from '../../../../styles/colors';
import { ConfigContext } from '../../../../containers/AppControl';

const rand = Date.now();

class CMPVideoIFrame extends React.Component {


    render(){
        const { data } = this.props;

        if(!data.loading){
            return (
                <ConfigContext.Consumer>
                    {config => (
                        <div style={{width: '100%', height: '100%', position: 'relative'}}>
                            {!!data.roomVideoURL && config.video?
                                <React.Fragment>
                                    <RecordingButton
                                        config={config}
                                        council={this.props.council}
                                        translate={this.props.translate}
                                    />
                                    <iframe
                                        title="meetingScreen"
                                        allow="geolocation; microphone; camera"
                                        scrolling="no"
                                        className="temp_video"
                                        src={`https://${data.roomVideoURL}?rand=${rand}`}
                                        allowFullScreen="true"
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
                    )}
                </ConfigContext.Consumer>
            );
        }
        return(
            <div/>
        );
    }
}

const videoURL = gql`
    query RoomVideoURL($councilId: Int!, $participantId: String!){
        roomVideoURL(councilId: $councilId, participantId: $participantId)

    }
`;

export default compose(
    graphql(videoURL, {
        options: props => ({
            variables: {
                councilId: props.council.id,
                participantId: 'Mod'
            }
        })
    }),
)(CMPVideoIFrame);