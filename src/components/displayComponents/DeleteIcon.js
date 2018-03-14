import React, { Fragment } from 'react';
//import DeleteForever from 'material-ui/svg-icons/action/delete-forever';
import { DeleteForever } from 'material-ui-icons';
import { Button } from 'material-ui';
import { CircularProgress } from 'material-ui/Progress';

const DeleteIcon = ({ style, onClick, loading }) => (
    <Fragment>
        {!loading?
            <Button 
                variant="fab"
                style={style}
                onClick={onClick}
            >
                <DeleteForever />
            </Button>
        :
            <CircularProgress size={20} color="primary" />
        }
    </Fragment>
)

export default DeleteIcon;