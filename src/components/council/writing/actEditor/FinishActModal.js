import React from "react";
import {
	AlertConfirm
} from "../../../../displayComponents";
import { compose, graphql } from "react-apollo";
import { approveAct } from '../../../../queries';
import ActHTML from "../actViewer/ActHTML";


class FinishActModal extends React.Component {

	state = {
		loading: false
	}

	close = () => {
		this.props.requestClose();
	};

	approveAct = async () => {
		this.setState({
			loading: true
		});
		const response = await this.props.approveAct({
			variables: {
				councilId: this.props.council.id
			}
		});

		if(response){
			if(!response.data.errors){
				this.setState({
					success: true,
					loading: false
				});
				this.props.refetch();
			}
		}
	}


	_modalBody() {
        return (
			<div style={{width: '650px'}}>
				{this.props.show &&
					<ActHTML
						ref={(ref => this.actViewer = ref)}
						council={this.props.council}
					/>
				}
			</div>
		);
	}

	render() {
		const { translate } = this.props;

		return (
			<AlertConfirm
				requestClose={this.close}
				open={this.props.show}
				acceptAction={this.approveAct}
				loadingAction={this.state.loading}
				buttonAccept={translate.finish_and_aprove_act}
				buttonCancel={translate.close}
				bodyText={this._modalBody()}
				title={translate.finish_and_aprove_act}
			/>
		);
	}
}

export default compose(
	graphql(approveAct, {
		name: 'approveAct'
    }),

)(FinishActModal);
