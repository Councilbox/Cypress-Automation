import React from 'react';
import withTranslations from '../HOCs/withTranslations';
import { getSecondary } from '../styles/colors';
import { AlertConfirm } from '.';
import BasicButton from './BasicButton';

const UnsavedChangesModal = ({
	translate, open, requestClose, acceptAction, cancelAction, successAction, loadingAction
}) => (
	<AlertConfirm
		title={translate.attention}
		id="unsaved-changes-modal"
		bodyText={translate.changes_without_saving}
		open={open}
		extraActions={
			cancelAction ?
				<BasicButton
					text={translate.discard_changes}
					id="unsaved-changes-discard"
					onClick={cancelAction}
					color={getSecondary()}
					textStyle={{
						color: 'white',
						fontWeight: '700'
					}}
				/>
				: null
		}
		buttonCancel={translate.close}
		cancelAction={requestClose}
		successAction={successAction}
		loadingAction={loadingAction}
		acceptAction={acceptAction || null}
		buttonAccept={acceptAction ? translate.save : ''}
		modal={true}
		requestClose={requestClose}
	/>
);

export default withTranslations()(UnsavedChangesModal);
