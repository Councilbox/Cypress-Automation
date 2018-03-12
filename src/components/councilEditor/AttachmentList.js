import React from 'react';
import { getPrimary } from '../../styles/colors';
import { DeleteIcon } from '../displayComponents';

const AttachmentList = ({ attachments, deleteAction, translate }) => (
    attachments.map((attachment) => {
        return(
            <div key={attachment.id}>
                {attachment.filename}
                {attachment.state !== 2?
                    <DeleteIcon 
                        style={{color: getPrimary()}}
                        onClick={() => deleteAction(attachment.id)}
                    />
                :
                    ` ${translate.deleted}`

                }
                
            </div>
        );
    })
)

export default AttachmentList;