import React, { Fragment } from 'react';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import BasicButton from './BasicButton';
import { getPrimary } from '../../styles/colors';


const AlertConfirm = ({ title, fullWidth, fullScreen, buttonAccept, buttonCancel, scrollable = false, modal, open, requestClose, acceptAction, bodyText, hideAccept }) => {
    const primary = getPrimary();
    const buttons = <Fragment>
        {!!buttonCancel &&
            <BasicButton
                text={buttonCancel}
                textStyle={{
                    textTransform: 'none',
                    fontWeight: '700'
                }}
                primary={true}
                onClick={requestClose}
            />
        }

        {!hideAccept && !!buttonAccept &&
            <BasicButton
                text={buttonAccept}
                textStyle={{
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: '700'
                }}
                buttonStyle={{ marginLeft: '1em' }}
                color={primary}
                onClick={acceptAction}
            />
        }

    </Fragment>;

    return (<Dialog
            disableBackdropClick={modal}
            fullWidth={fullWidth}
            fullScreen={fullScreen}
            maxWidth={false}
            open={open}
            onClose={requestClose}
        >
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                {bodyText}
            </DialogContent>
            <DialogActions>
                {buttons}
            </DialogActions>
        </Dialog>);
};

export default AlertConfirm;