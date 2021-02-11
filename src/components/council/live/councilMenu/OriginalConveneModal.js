import React from 'react';
import { AlertConfirm } from '../../../../displayComponents';

const OriginalConveneModal = ({
	council, requestClose, show, translate
}) => (
	<AlertConfirm
		requestClose={requestClose}
		open={show}
		bodyText={
			<div
				dangerouslySetInnerHTML={{ __html: council.emailText }}
				style={{
					maxWidth: '750px',
					minWidth: '450px',
					width: '65%'
				}}
			/>
		}
		title={translate.original_convene}
	/>
);

export default OriginalConveneModal;
