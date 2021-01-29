import React from "react";
import { compose, graphql } from "react-apollo";
import { AlertConfirm } from "../../../displayComponents";
import { addRepresentative } from "../../../queries";
import RepresentativeForm from "../participants/RepresentativeForm";
import { languages } from "../../../queries/masters";
import { useOldState } from "../../../hooks";

const AddRepresentativeModal = ({ translate, participant, ...props }) => {
	const [state, setState] = useOldState({
		success: "",
		errors: {},
		representative: {
			...newRepresentativeInitialValues
		}
	});

	const close = () => {
		props.requestClose();
		resetForm();
	}

	const addRepresentative = async () => {
		const response = await props.addRepresentative({
			variables: {
				representative: state.representative,
				participantId: participant.id
			}
		});
		if (response.data.addRepresentative) {
			if (response.data.addRepresentative.success) {
				props.refetch();
				close();
			}
		}
		if(response.errors){
			if(response.errors[0].message = 'Email already used'){
				setState({
					errors: {
						email: translate.repeated_email
					}
				})
			}
		}
	}

	const resetForm = () => {
		setState({
			representative: {
				...newRepresentativeInitialValues
			}
		});
	};

	const updateRepresentative = object => {
		setState({
			representative: {
				...state.representative,
				...object
			}
		});
	}

	function _renderReminderBody() {
		if (state.sending) {
			return <div>{translate.sending_convene_reminder}</div>;
		}

		return (
			<RepresentativeForm
				translate={translate}
				representative={state.representative}
				updateState={updateRepresentative}
				errors={state.errors}
				languages={props.data.languages}
			/>
		);
	}

	return (
		<AlertConfirm
			requestClose={close}
			open={props.show}
			acceptAction={addRepresentative}
			buttonAccept={translate.send}
			buttonCancel={translate.close}
			bodyText={_renderReminderBody()}
			title={participant.representative ? translate.change_representative : translate.add_representative}
		/>
	);
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
	initialState: 0,
	dni: "",
	email: "",
	phone: ""
};
