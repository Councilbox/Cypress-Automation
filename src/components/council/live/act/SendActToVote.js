import React from "react";
import {
	AlertConfirm,
	Scrollbar,
} from "../../../../displayComponents";
import { compose, graphql } from "react-apollo";
import { sendActToVote, openAgendaVoting } from '../../../../queries';
import ActHTML from "../../writing/actViewer/ActHTML";


const SendActToVote = ({ requestClose, translate, agenda, council, refetch, ...props }) => {
	const [loading, setLoading] = React.useState(false);

	const close = () => {
		requestClose();
	}

	const sendActToVote = async () => {
		setLoading(true);
		const response = await props.openAgendaVoting({
			variables: {
				agendaId: agenda.id
			}
		});
		if (response) {
			setLoading(false);
			refetch();
		}
	}

	const _modalBody = () => {
        return (
			<div style={{width: '650px', maxHeight: '75vh', height: '40em'}}>
				<Scrollbar>
					{props.show &&
						<ActHTML
							council={council}
						/>
					}
				</Scrollbar>
			</div>
		);
	}

	return (
		<AlertConfirm
			requestClose={close}
			open={props.show}
			acceptAction={sendActToVote}
			loadingAction={loading}
			buttonAccept={translate.save_preview_act}
			buttonCancel={translate.close}
			bodyText={_modalBody()}
			title={translate.save_preview_act}
		/>
	);

}


export default compose(
	graphql(sendActToVote, {
		name: 'sendActToVote'
	}),

	graphql(openAgendaVoting, {
		name: 'openAgendaVoting'
	})
)(SendActToVote);
