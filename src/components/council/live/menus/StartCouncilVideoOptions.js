import React from 'react';
import { Checkbox } from '../../../../displayComponents';


const StartCouncilVideoOptions = ({ council, translate, data, updateData }) => {
    //TRADUCCION
    return (
        <div>
            <Checkbox
                label={`Iniciar grabación ${council.fullVideoRecord === 1? `(${translate.full_record})` : ''}`}
                disabled={council.fullVideoRecord === 1}
                value={data.startRecording}
                onChange={(event, isInputChecked) =>
                    updateData({
                        startRecording: isInputChecked,
                    })
                }
            />

            <Checkbox
                label={'Iniciar streaming'}
                disabled={!(council.room.videoConfig && council.room.videoConfig.rtmp)}
                value={data.startStreaming}
                onChange={(event, isInputChecked) =>
                    updateData({
                        startStreaming: isInputChecked,
                    })
                }
            />
        </div>
    )
}


export default StartCouncilVideoOptions;