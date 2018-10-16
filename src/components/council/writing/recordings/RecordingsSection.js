import React from 'react';
import { getSecondary } from '../../../../styles/colors';

const rand = Math.random();

class RecordingsSection extends React.Component {

    render(){
        if(!this.props.data.recordingsIframe){
            return (
                <div style={{width: '100%', paddingTop: '8em', fontSize: '20px', display: 'flex', fontWeight: '700', flexDirection: 'column', alignItems: 'center'}}>
                    <i className="material-icons" style={{color: getSecondary(), fontSize: '8em'}}>
                        videocam_off
                    </i>
                    No se ha realizado ninguna grabación
                </div>
            ) //TRADUCCION
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

export default RecordingsSection;