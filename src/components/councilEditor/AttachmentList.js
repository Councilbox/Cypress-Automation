import React from 'react';
import { primary } from '../../styles/colors';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import { IconButton } from 'material-ui';

const AttachmentList = ({ attachments, deleteAction, translate }) => (
    attachments.map((attachment) => {
        return(
            <div key={attachment.id}>
                {attachment.filename}
                {attachment.state !== 2?
                    <IconButton 
                        iconStyle={{color: primary}}
                        onClick={() => deleteAction(attachment.id)}
                    >
                        <DeleteForever />
                    </IconButton>
                :
                    ` ${translate.deleted}`

                }
                
            </div>
        );
    })
)

export default AttachmentList;