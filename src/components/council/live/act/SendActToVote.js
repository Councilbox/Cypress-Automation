import React from "react";
import {
	AlertConfirm,
	Scrollbar,
} from "../../../../displayComponents";
import { compose, graphql } from "react-apollo";
import { sendActToVote, openAgendaVoting } from '../../../../queries';
import ActHTML from "../../writing/actViewer/ActHTML";


class SendActToVote extends React.Component {

	close = () => {
		this.props.requestClose();
	};

    sendActToVote = async () => {
		const { agenda } = this.props;
		const response = await this.props.openAgendaVoting({
			variables: {
				agendaId: agenda.id
			}
		});
		if (response) {
			this.props.refetch();
		}
	}

	_modalBody() {
        return (
			<div style={{width: '650px', maxHeight: '75vh', height: '40em'}}>
				<Scrollbar>
					{this.props.show &&
						<ActHTML
							ref={(ref => this.actViewer = ref)}
							council={this.props.council}
						/>
					}
				</Scrollbar>
			</div>
		);
	}

	render() {
		const { translate } = this.props;

		return (
			<AlertConfirm
				requestClose={this.close}
				open={this.props.show}
				acceptAction={this.sendActToVote}
				buttonAccept={translate.finish_and_aprove_act}
				buttonCancel={translate.close}
				bodyText={this._modalBody()}
				title={translate.finish_and_aprove_act}
			/>
		);
	}
}

export default compose(
	graphql(sendActToVote, {
		name: 'sendActToVote'
	}),

	graphql(openAgendaVoting, {
		name: 'openAgendaVoting'
	})
)(SendActToVote);
