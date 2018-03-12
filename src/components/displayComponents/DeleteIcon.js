import React from 'react';
//import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import { DeleteForever } from 'material-ui-icons';
import { Button } from 'material-ui';

const DeleteIcon = ({ style, onClick }) => (
    <Button 
        variant="fab"
        style={style}
        onClick={onClick}
    >
        <DeleteForever />
    </Button>
)

export default DeleteIcon;