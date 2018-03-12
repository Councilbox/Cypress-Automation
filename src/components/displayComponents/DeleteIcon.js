import React from 'react';
import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import { IconButton } from 'material-ui';

const DeleteIcon = ({ style, onClick }) => (
    <IconButton 
        iconStyle={style}
        onClick={onClick}
    >
        <DeleteForever />
    </IconButton>
)

export default DeleteIcon;