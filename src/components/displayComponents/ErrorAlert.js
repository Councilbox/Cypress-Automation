import React, { Fragment } from 'react';
import { Dialog } from 'material-ui';
import BasicButton from './BasicButton';


const ErrorAlert = ({ title, buttonAccept, open, requestClose, bodyText }) => {

    const buttons = 
        <Fragment>
            <BasicButton
                text={buttonAccept}
                textStyle={{color: 'white', textTransform: 'none', fontWeight: '700'}}
                buttonStyle={{marginLeft: '1em'}}
                color={'purple'}
                onClick={requestClose}
            />
        </Fragment>;

    return(
        <Dialog
            title={title}
            actions={buttons}
            modal={false}
            open={open}
            onRequestClose={requestClose}
        >
            {bodyText}
        </Dialog>
    );
}

export default ErrorAlert;