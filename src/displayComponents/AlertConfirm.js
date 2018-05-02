import React, { Fragment } from 'react';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import BasicButton from './BasicButton';
import { getPrimary, getSecondary } from '../styles/colors';
import FontAwesome from 'react-fontawesome';


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

    return (
        <Dialog
            disableBackdropClick={modal}
            fullWidth={fullWidth}
            fullScreen={fullScreen}
            maxWidth={false}
            open={open}
            onClose={requestClose}
        >
            <FontAwesome
                name={'close'}
                style={{cursor: 'pointer', fontSize: '1.5em', color: getSecondary(), position: 'absolute', right: '12px', top: '9px'}}
                onClick={() => requestClose()}
            /> 
            {!!title &&
                <DialogTitle style={{paddingRight: '4em'}}>
                {title}
                </DialogTitle>
            }
            <DialogContent>
                {bodyText}
            </DialogContent>
            <DialogActions>
                {buttons}
            </DialogActions>
        </Dialog>);
};

export default AlertConfirm;