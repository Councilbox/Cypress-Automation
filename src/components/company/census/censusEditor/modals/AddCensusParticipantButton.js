import React from "react";
import {
	AlertConfirm,
	BasicButton,
	ButtonIcon
} from "../../../../../displayComponents/index";
import { compose, graphql, withApollo } from "react-apollo";
import { getPrimary } from "../../../../../styles/colors";
import { addCensusParticipant, checkUniqueCensusEmails } from "../../../../../queries/census";
import { languages } from "../../../../../queries/masters";
import { censusHasParticipations } from "../../../../../utils/CBX";
import RepresentativeForm from "../RepresentativeForm";
import ParticipantForm from "../../../../council/participants/ParticipantForm";
import {
	checkRequiredFieldsParticipant,
	checkRequiredFieldsRepresentative
} from "../../../../../utils/validation";
import { isMobile } from 'react-device-detect';


class AddCensusParticipantButton extends React.Component {
	state = {
		modal: false,
		data: { ...initialParticipant },
		representative: { ...initialRepresentative },
		errors: {},
		representativeErrors: {}
	};

	addCensusParticipant = async () => {
		const { hasRepresentative, ...data } = this.state.representative;
		const representative = this.state.representative.hasRepresentative
			? {
					...data,
					companyId: this.props.census.companyId,
					censusId: this.props.census.id
			  }
			: null;

		if (!await this.checkRequiredFields()) {
			const response = await this.props.addCensusParticipant({
				variables: {
					participant: {
						...this.state.data,
						companyId: this.props.census.companyId,
						censusId: this.props.census.id
					},
					representative: representative
				}
			});
			if (!response.errors) {
				this.props.refetch();
				this.setState({
					modal: false,
					data: { ...initialParticipant },
					representative: { ...initialRepresentative },
					errors: {},
					representativeErrors: {}
				});
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

	async checkRequiredFields() {
		const participant = this.state.data;
		const representative = this.state.representative;
		const { translate, company } = this.props;
		let hasSocialCapital = censusHasParticipations(this.props.census);
		let errorsParticipant = checkRequiredFieldsParticipant(
			participant,
			translate,
			hasSocialCapital,
			company
		);

		const emailsToCheck = [];

		if(this.props.company.type !== 10){
			emailsToCheck.push(participant.email);
		}

		let errorsRepresentative = {
			errors: {},
			hasError: false
		};
		if (representative.hasRepresentative) {
			errorsRepresentative = checkRequiredFieldsRepresentative(
				representative,
				translate
			);

			emailsToCheck.push(representative.email);
		}

		if(emailsToCheck.length > 0){
			const response = await this.props.client.query({
				query: checkUniqueCensusEmails,
				variables: {
					censusId: this.props.census.id,
					emailList: emailsToCheck
				}
			});

			if(!response.data.checkUniqueCensusEmails.success){
				const data = JSON.parse(response.data.checkUniqueCensusEmails.message);
				data.duplicatedEmails.forEach(email => {
					if(participant.email === email){
						errorsParticipant.errors.email = translate.register_exists_email;
						errorsParticipant.hasError = true;
					}
					if(representative.email === email){
						errorsRepresentative.errors.email = translate.register_exists_email;
						errorsRepresentative.hasError = true;
					}
				})
			}

			if(participant.email === representative.email){
				errorsRepresentative.errors.email = translate.repeated_email;
				errorsParticipant.errors.email = translate.repeated_email;
				errorsParticipant.hasError = true;
			}
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
		const errors = this.state.errors;
		const { translate } = this.props;
		const { languages } = this.props.data;
		return (
			<div style={{maxWidth: '950px'}}>
				<ParticipantForm
					type={participant.personOrEntity}
					participant={participant}
					participations={censusHasParticipations(this.props.census)}
					translate={translate}
					languages={languages}
					errors={errors}
					updateState={this.updateState}
				/>
				<RepresentativeForm
					translate={this.props.translate}
					state={this.state.representative}
					updateState={this.updateRepresentative}
					errors={this.state.representativeErrors}
					languages={this.props.data.languages}
				/>
			</div>
		);
	}

	render() {
		const { translate } = this.props;
		const primary = getPrimary();

		return (
			<React.Fragment>
				<BasicButton
					text={translate.add_participant}
					color={"white"}
					textStyle={{
						color: primary,
						fontWeight: "700",
						fontSize: "0.9em",
						textTransform: "none"
					}}
					textPosition="after"
					icon={!isMobile? <ButtonIcon type="add" color={primary} /> : null}
					onClick={() => this.setState({ modal: true })}
					buttonStyle={{
						marginRight: "1em",
						border: `2px solid ${primary}`
					}}
				/>
				<AlertConfirm
					requestClose={() => this.setState({ modal: false })}
					open={this.state.modal}
					fullWidth={false}
					acceptAction={this.addCensusParticipant}
					buttonAccept={translate.save}
					buttonCancel={translate.cancel}
					bodyText={this._renderBody()}
					title={translate.add_participant}
				/>
			</React.Fragment>
		);
	}
}

export default compose(
	graphql(addCensusParticipant, {
		name: "addCensusParticipant",
		options: {
			errorPolicy: "all"
		}
	}),
	graphql(languages)
)(withApollo(AddCensusParticipantButton));

const initialParticipant = {
	name: "",
	surname: "",
	position: "",
	email: "",
	phone: "",
	dni: "",
	type: 0,
	delegateId: null,
	numParticipations: 1,
	socialCapital: 1,
	uuid: null,
	delegateUuid: null,
	language: "es",
	city: "",
	personOrEntity: 0
};

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
