import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingSection } from '../../../../displayComponents';

const rand = Math.random();

class RecordingsSection extends React.Component {

    render(){
        if(!this.props.data.recordingsIframe){
            return <LoadingSection />;
        }

        return(
            <div style={{width: '100%', height: '100%'}}>
                <iframe
                    title="meetingScreen"
                    allow="geolocation; microphone; camera"
                    scrolling="no"
                    className="temp_video"
                    src={`https://${this.props.data.recordingsIframe}?rand=${rand}`}
                    allowFullScreen="true"
                    style={{
                        border: "none !important"
                    }}
                >
                    Something wrong...
                </iframe>
            </div>
        )
    }
}

const recordingsIframe = gql`
    query RecordingsIframe($councilId: Int!){
        recordingsIframe(councilId: $councilId)
    }
`;

export default graphql(recordingsIframe, {
    options: props => ({
        variables: {
            councilId: props.council.id
        }
    })
})(RecordingsSection);