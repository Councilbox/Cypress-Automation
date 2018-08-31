import React from 'react';
import withTranslations from '../HOCs/withTranslations';
import { AlertConfirm } from './';

const UnsavedChangesModal = ({ translate, open, requestClose }) => (
    <AlertConfirm
        title={translate.attention}
        bodyText={translate.changes_without_saving}
        open={open}
        buttonCancel={translate.accept}
        modal={true}
        requestClose={requestClose}
    />
)

export default withTranslations()(UnsavedChangesModal);