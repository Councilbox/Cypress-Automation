import React, { Component, Fragment } from "react";
import { AlertConfirm } from "../../../../../displayComponents/index";
import { compose, graphql } from "react-apollo";
import { getPrimary } from "../../../../../styles/colors";
import { updateCouncilParticipant } from "../../../../../queries/councilParticipant";
import { languages } from "../../../../../queries/masters";
import ParticipantForm from "../../../participants/ParticipantForm";
import {
	checkRequiredFieldsParticipant,
	checkRequiredFieldsRepresentative
} from "../../../../../utils/validation";
import RepresentativeForm from "../../../../company/census/censusEditor/RepresentativeForm";

class CouncilParticipantEditor extends Component {
	updateCouncilParticipant = async () => {
		const { hasRepresentative, ...data } = this.state.representative;
		const representative = this.state.representative.hasRepresentative
			? {
					...data,
					councilId: this.props.councilId
			  }
			: null;

		if (!this.checkRequiredFields()) {
			const response = await this.props.updateCouncilParticipant({
				variables: {
					participant: {
						...this.state.data,
						councilId: this.props.councilId
					},
					representative: representative
				}
			});
			if (!response.errors) {
				this.props.refetch();
				this.props.close();
			}
		}
	};
	updateState = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
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

	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			data: {},
			representative: {},
			errors: {},
			representativeErrors: {}
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		let { representative, ...participant } = extractTypeName(
			nextProps.participant
		);
		representative = representative
			? {
					hasRepresentative: true,
					...extractTypeName(representative)
			  }
			: initialRepresentative;
		return {
			data: participant,
			representative: representative
		};
	}

	checkRequiredFields() {
		const participant = this.state.data;
		const representative = this.state.representative;
		const { translate, participations } = this.props;
		let hasSocialCapital = participations;
		let errorsParticipant = checkRequiredFieldsParticipant(
			participant,
			translate,
			hasSocialCapital
		);

		let errorsRepresentative = {
			errors: {},
			hasError: false
		};
		if (representative.hasRepresentative) {
			errorsRepresentative = checkRequiredFieldsRepresentative(
				representative,
				translate
			);
		}

		this.setState({
			...this.state,
			errors: errorsParticipant.errors,
			representativeErrors: errorsRepresentative.errors
		});

		return errorsParticipant.hasError || errorsRepresentative.hasError;
	}

	_renderBody() {
		const participant = this.state.data;
		const { representative, errors, representativeErrors } = this.state;
		const { translate, participations } = this.props;
		const { languages } = this.props.data;
		return (
			<Fragment>
				<ParticipantForm
					type={participant.personOrEntity}
					participant={participant}
					participations={participations}
					translate={translate}
					languages={languages}
					errors={errors}
					updateState={this.updateState}
				/>
				<RepresentativeForm
					translate={translate}
					state={representative}
					updateState={this.updateRepresentative}
					errors={representativeErrors}
					languages={languages}
				/>
			</Fragment>
		);
	}

	render() {
		const { translate } = this.props;
		const primary = getPrimary();

		return (
			<Fragment>
				<AlertConfirm
					requestClose={() => this.props.close()}
					open={this.props.opened}
					fullWidth={false}
					acceptAction={this.updateCouncilParticipant}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					bodyText={this._renderBody()}
					title={translate.edit_participant}
				/>
			</Fragment>
		);
	}
}

export default compose(
	graphql(updateCouncilParticipant, {
		name: "updateCouncilParticipant",
		options: {
			errorPolicy: "all"
		}
	}),
	graphql(languages)
)(CouncilParticipantEditor);

const initialRepresentative = {
	hasRepresentative: false,
	language: "es",
	type: 2,
	name: "",
	surname: "",
	position: "",
	email: "",
	phone: "",
	dni: ""
};

function extractTypeName(object) {
	let { __typename, ...rest } = object;
	return rest;
}
