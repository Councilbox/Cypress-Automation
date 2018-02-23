import React, { Fragment } from 'react';
import { Dialog } from 'material-ui';
import BasicButton from './BasicButton';
import { primary } from '../../styles/colors';


const AlertConfirm = ({ title, buttonAccept, buttonCancel, modal, open, requestClose, acceptAction, bodyText, hideAccept }) => {

    const buttons = 
        <Fragment>
            <BasicButton
                text={buttonCancel}
                textStyle={{textTransform: 'none', fontWeight: '700'}}
                primary={true}
                onClick={requestClose}
            />
            {!hideAccept &&
                <BasicButton
                    text={buttonAccept}
                    textStyle={{color: 'white', textTransform: 'none', fontWeight: '700'}}
                    buttonStyle={{marginLeft: '1em'}}
                    color={primary}
                    onClick={acceptAction}
                />
            }

        </Fragment>;

    return(
        <Dialog
            title={title}
            actions={buttons}
            modal={modal}
            open={open}
            onRequestClose={requestClose}
        >
            {bodyText}
        </Dialog>
    );
}

export default AlertConfirm;