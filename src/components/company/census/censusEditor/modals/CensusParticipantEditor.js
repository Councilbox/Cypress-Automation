import React from "react";
import { compose, graphql } from "react-apollo";
import { Card } from "material-ui";
import { AlertConfirm } from "../../../../../displayComponents/index";
import { updateCensusParticipant } from "../../../../../queries/census";
import { languages } from "../../../../../queries/masters";
import { censusHasParticipations } from "../../../../../utils/CBX";
import RepresentativeForm from "../RepresentativeForm";
import ParticipantForm from "../../../../council/participants/ParticipantForm";
import {
	checkRequiredFieldsParticipant,
	checkRequiredFieldsRepresentative
} from "../../../../../utils/validation";
import SelectCensusParticipantRepresentative from "./SelectCensusParticipantRepresentative";

const initialRepresentative = {
	hasRepresentative: false,
	language: "es",
	type: 2,
	initialState: 0,
	name: "",
	surname: "",
	position: "",
	email: "",
	phone: "",
	dni: ""
};

function extractTypeName(object) {
	const { __typename, ...rest } = object;
	return rest;
}

class CensusParticipantEditor extends React.Component {
	state = {
		modal: false,
		data: {},
		representative: {},
		errors: {},
		representativeErrors: {}
	};

	componentDidMount() {
		let { representative, ...participant } = extractTypeName(
			this.props.participant
		);
		representative = representative
			? {
				hasRepresentative: true,
				...extractTypeName(representative)
			}
			: initialRepresentative;
		this.setState({
			data: participant,
			representative
		});
	}

	componentWillUnmount() {
		let { representative, ...participant } = extractTypeName(
			this.props.participant
		);
		representative = representative
			? {
				hasRepresentative: true,
				...extractTypeName(representative)
			}
			: initialRepresentative;
		this.setState({
			data: participant,
			representative
		});
	}

	updateCensusParticipant = async () => {
		const { hasRepresentative, ...data } = this.state.representative;
		const representative = this.state.representative.hasRepresentative
			? {
				...data,
				companyId: this.props.census.companyId,
				censusId: this.props.census.id
			}
			: null;

		if (!await this.checkRequiredFields()) {
			const response = await this.props.updateCensusParticipant({
				variables: {
					participant: {
						...this.state.data,
						companyId: this.props.census.companyId,
						censusId: this.props.census.id
					},
					representative
				}
			});
			if (!response.errors) {
				this.props.refetch();
				this.props.close();
			} else if (response.errors[0].message === 'Too many granted words') {
				this.setState({
					...(this.state.data.initialState === 2 ? {
						errors: {
							initialState: this.props.translate.initial_granted_word_error
						}
					} : {}),
					...(representative && representative.initialState === 2 ? {
						representativeErrors: {
							initialState: this.props.translate.initial_granted_word_error
						}
					} : {})

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
		const hasSocialCapital = censusHasParticipations(this.props.census);
		const errorsParticipant = checkRequiredFieldsParticipant(
			participant,
			translate,
			hasSocialCapital,
			company
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
		const errors = this.state.errors;
		const { translate } = this.props;
		const { languages } = this.props.data;
		return (
			<React.Fragment>
				<div>
					<SelectCensusParticipantRepresentative
						open={this.state.selectRepresentative}
						census={this.props.census}
						translate={translate}
						updateRepresentative={representative => {
							this.updateRepresentative({
								...representative,
								hasRepresentative: true
							});
						}}
						requestClose={() => this.setState({
							selectRepresentative: false
						})}
					/>
					<div style={{ marginRight: "1em" }}>
						<Card style={{
							padding: '1em',
							marginBottom: "1em",
							color: 'black',
						}}>
							<ParticipantForm
								type={participant.personOrEntity}
								participant={participant}
								participations={censusHasParticipations(this.props.census)}
								translate={translate}
								languages={languages}
								errors={errors}
								updateState={this.updateState}
							/>
						</Card>
						<Card style={{
							padding: '1em',
							marginBottom: "1em",
							color: 'black',
						}}>
							<RepresentativeForm
								translate={this.props.translate}
								state={this.state.representative}
								setSelectRepresentative={value => this.setState({
									selectRepresentative: value
								})}
								updateState={this.updateRepresentative}
								errors={this.state.representativeErrors}
								languages={this.props.data.languages}
							/>
						</Card>
					</div>
				</div>


			</React.Fragment>
		);
	}

	render() {
		const { translate } = this.props;

		return (
			<React.Fragment>
				<AlertConfirm
					requestClose={() => this.props.close()}
					open={this.props.opened}
					fullWidth={false}
					acceptAction={this.updateCensusParticipant}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					bodyText={this._renderBody()}
					title={translate.edit_participant}
				/>
			</React.Fragment>
		);
	}
}

export default compose(
	graphql(updateCensusParticipant, {
		name: "updateCensusParticipant",
		options: {
			errorPolicy: "all"
		}
	}),
	graphql(languages)
)(CensusParticipantEditor);

