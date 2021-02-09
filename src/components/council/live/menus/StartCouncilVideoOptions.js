import React from 'react';
import { Checkbox } from '../../../../displayComponents';


const StartCouncilVideoOptions = ({ council, translate, data, updateData }) => (
        <div>
            <Checkbox
                label={`${translate.to_start_recording} ${council.fullVideoRecord === 1 ? `(${translate.full_record})` : ''}`}
                disabled={council.fullVideoRecord === 1}
                value={data.startRecording}
                onChange={(event, isInputChecked) => updateData({
                        startRecording: isInputChecked,
                    })
                }
            />
            {(council.room.videoConfig && council.room.videoConfig.rtmp)
                && <Checkbox
                    label={translate.start_broadcasting}
                    disabled={!(council.room.videoConfig && council.room.videoConfig.rtmp)}
                    value={data.startStreaming}
                    onChange={(event, isInputChecked) => updateData({
                            startStreaming: isInputChecked,
                        })
                    }
                />
            }

        </div>
    );


export default StartCouncilVideoOptions;
