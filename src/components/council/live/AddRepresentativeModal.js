import React from "react";
import { AlertConfirm } from "../../../displayComponents";
import { compose, graphql } from "react-apollo";
import { addRepresentative } from "../../../queries";
import RepresentativeForm from "../participants/RepresentativeForm";
import { languages } from "../../../queries/masters";

class AddRepresentativeModal extends React.Component {

	state = {
		success: "",
		errors: {},
		representative: {
			...newRepresentativeInitialValues
		}
	};

	close = () => {
		this.props.requestClose();
		this.resetForm();
	};

	addRepresentative = async () => {
		const response = await this.props.addRepresentative({
			variables: {
				representative: this.state.representative,
				participantId: this.props.participant.id
			}
		});
		if (response.data.addRepresentative) {
			if (response.data.addRepresentative.success) {
				this.props.refetch();
				this.close();
			}
		}
		if(response.errors){
			if(response.errors[0].message === 'Email already used'){
				this.setState({
					errors: {
						email: this.props.translate.repeated_email
					}
				})
			}
		}
	};

	resetForm = () => {
		this.setState({
			representative: {
				...newRepresentativeInitialValues
			}
		});
	};

	updateRepresentative = object => {
		this.setState({
			representative: {
				...this.state.representative,
				...object
			}
		});
	};

	_renderReminderBody() {
		const { translate } = this.props;

		if (this.state.sending) {
			return <div>{translate.sending_convene_reminder}</div>;
		}

		return (
			<RepresentativeForm
				translate={this.props.translate}
				representative={this.state.representative}
				updateState={this.updateRepresentative}
				errors={this.state.errors}
				languages={this.props.data.languages}
			/>
		);
	}

	render() {
		const { translate } = this.props;

		return (
			<AlertConfirm
				requestClose={this.close}
				open={this.props.show}
				acceptAction={this.addRepresentative}
				buttonAccept={translate.send}
				buttonCancel={translate.close}
				bodyText={this._renderReminderBody()}
				title={this.props.participant.representative? translate.change_representative : translate.add_representative}
			/>
		);
	}
}

export default compose(
	graphql(addRepresentative, {
		name: "addRepresentative",
		options: {
			errorPolicy: "all"
		}
	}),
	graphql(languages)
)(AddRepresentativeModal);

const newRepresentativeInitialValues = {
	language: "es",
	personOrEntity: 0,
	name: "",
	surname: "",
	position: "",
	dni: "",
	email: "",
	phone: ""
};
