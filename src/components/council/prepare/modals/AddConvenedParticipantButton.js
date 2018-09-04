import React from "react";
import {
	BasicButton,
	ButtonIcon,
	CustomDialog
} from "../../../../displayComponents";
import { compose, graphql, withApollo } from "react-apollo";
import { getPrimary, secondary } from "../../../../styles/colors";
import { upsertConvenedParticipant } from "../../../../queries/councilParticipant";
import { languages } from "../../../../queries/masters";
import ParticipantForm from "../../participants/ParticipantForm";
import {
	checkRequiredFieldsParticipant,
	checkRequiredFieldsRepresentative
} from "../../../../utils/validation";
import RepresentativeForm from "../../../company/census/censusEditor/RepresentativeForm";
import { checkUniqueCouncilEmails } from "../../../../queries/councilParticipant";


class AddConvenedParticipantButton extends React.Component {
	state = {
		modal: false,
		data: { ...initialParticipant },
		representative: { ...initialRepresentative },
		errors: {},
		representativeErrors: {}
	};

	addParticipant = async sendConvene => {
		const { hasRepresentative, ...data } = this.state.representative;
		const representative = this.state.representative.hasRepresentative
			? {
					...data,
					councilId: this.props.councilId
			  }
			: null;

		if (!await this.checkRequiredFields()) {
			const response = await this.props.addParticipant({
				variables: {
					participant: {
						...this.state.data,
						councilId: this.props.councilId
					},
					representative: representative,
					sendConvene: sendConvene
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

	async checkRequiredFields(onlyEmail) {
		const participant = this.state.data;
		const representative = this.state.representative;
		const { translate, participations } = this.props;

		let errorsParticipant = {
			errors: {},
			hasError: false
		};

		if(!onlyEmail){
			let hasSocialCapital = participations;
			errorsParticipant = checkRequiredFieldsParticipant(
				participant,
				translate,
				hasSocialCapital
			);
		}
		let errorsRepresentative = {
			errors: {},
			hasError: false
		};



		if (representative.hasRepresentative) {
			if(!onlyEmail){
				errorsRepresentative = checkRequiredFieldsRepresentative(
					representative,
					translate
				);
			}
		}


		if(participant.email){
			let emailsToCheck = [participant.email];

			if(representative.email){
				emailsToCheck.push(representative.email);
			}

			const response = await this.props.client.query({
				query: checkUniqueCouncilEmails,
				variables: {
					councilId: this.props.councilId,
					emailList: emailsToCheck
				}
			});
	
			if(!response.data.checkUniqueCouncilEmails.success){
				const data = JSON.parse(response.data.checkUniqueCouncilEmails.message);
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

	render() {
		const primary = getPrimary();
		const {
			data: participant,
			errors,
			representativeErrors,
			representative
		} = this.state;
		const { translate, participations } = this.props;
		const { languages } = this.props.data;

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
					icon={<ButtonIcon type="add" color={primary} />}
					onClick={() => this.setState({ modal: true })}
					buttonStyle={{
						marginRight: "1em",
						border: `2px solid ${primary}`
					}}
				/>
				<CustomDialog
					title={translate.add_participant}
					requestClose={() => this.setState({ modal: false })}
					open={this.state.modal}
					actions={
						<React.Fragment>
							<BasicButton
								text={translate.cancel}
								type="flat"
								color="white"
								textStyle={{
									textTransform: "none",
									fontWeight: "700"
								}}
								onClick={() => this.setState({
									modal: false
								})}
							/>
							<BasicButton
								text={translate.save_changes_and_send}
								textStyle={{
									color: "white",
									textTransform: "none",
									fontWeight: "700"
								}}
								buttonStyle={{ marginLeft: "1em" }}
								color={secondary}
								onClick={() => {
									this.addParticipant(true);
								}}
							/>
							<BasicButton
								text={translate.save_changes}
								textStyle={{
									color: "white",
									textTransform: "none",
									fontWeight: "700"
								}}
								buttonStyle={{ marginLeft: "1em" }}
								color={primary}
								onClick={() => {
									this.addParticipant(false);
								}}
							/>
						</React.Fragment>
					}
				>
					<div style={{maxWidth: '900px'}}>
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
					</div>
				</CustomDialog>
			</React.Fragment>
		);
	}
}

export default compose(
	graphql(upsertConvenedParticipant, {
		name: "addParticipant",
		options: {
			errorPolicy: "all"
		}
	}),
	graphql(languages)
)(withApollo(AddConvenedParticipantButton));

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
