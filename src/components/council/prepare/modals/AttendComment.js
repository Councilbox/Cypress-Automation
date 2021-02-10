import React from 'react';
import { AlertConfirm } from '../../../../displayComponents';

const AttendComment = ({
 translate, requestClose, open, comment
}) => (
    <AlertConfirm
        requestClose={requestClose}
        open={open}
        acceptAction={requestClose}
        buttonAccept={translate.close}
        title={comment.author}
        bodyText={
            <div dangerouslySetInnerHTML={{ __html: comment.text }} />
        }
    />
);

export default AttendComment;
