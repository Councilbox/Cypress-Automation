import React, { Component } from "react";
import {
	AlertConfirm
} from "../../../../displayComponents";
import { compose, graphql } from "react-apollo";
import { approveAct } from '../../../../queries';
import ActHTML from "../actViewer/ActHTML";


class FinishActModal extends Component {

	close = () => {
		this.props.requestClose();
	};

	approveAct = async () => {
		const response = await this.props.approveAct({
			variables: {
				councilId: this.props.council.id
			}
		});

		if(response){
            console.log(response);
			if(!response.data.errors){
				this.setState({
					success: true
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
