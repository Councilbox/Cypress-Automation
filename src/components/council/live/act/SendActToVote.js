import React from 'react';
import { compose, graphql } from 'react-apollo';
import { sendActToVote as sendActToVoteMutation, openAgendaVoting } from '../../../../queries';
import { AlertConfirm } from '../../../../displayComponents';
import DocumentPreview from '../../../documentEditor/DocumentPreview';


const SendActToVote = ({
 requestClose, translate, updateAct, agenda, council, refetch, ...props
}) => {
	const [loading, setLoading] = React.useState(false);

	const close = () => {
		requestClose();
	};

	const sendActToVote = async () => {
		setLoading(true);
		await updateAct();
		const response = await props.openAgendaVoting({
			variables: {
				agendaId: agenda.id
			}
		});

		if (response) {
			await refetch();
		}
		setLoading(false);
	};

	const modalBody = () => (
			<div style={{ marginTop: '12px', height: '100%', border: '1px solid gainsboro' }}>
				<DocumentPreview
					translate={translate}
					options={props.options}
					doc={props.doc}
					generatePreview={props.generatePreview}
					company={props.company}
				/>
			</div>
		);

	return (
		<AlertConfirm
			requestClose={close}
			open={props.show}
			acceptAction={sendActToVote}
			loadingAction={loading}
			buttonAccept={translate.save_preview_act}
			buttonCancel={translate.close}
			bodyText={modalBody()}
			title={translate.save_preview_act}
		/>
	);
};


export default compose(
	graphql(sendActToVoteMutation, {
		name: 'sendActToVote'
	}),

	graphql(openAgendaVoting, {
		name: 'openAgendaVoting'
	})
)(SendActToVote);
