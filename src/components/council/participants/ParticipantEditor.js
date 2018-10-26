import React, { Component, Fragment } from "react";
import { graphql } from "react-apollo";
import {
	BasicButton,
	ButtonIcon,
	Checkbox,
	Grid,
	GridItem
} from "../../../displayComponents";
import { getPrimary } from "../../../styles/colors";
import { Paper, Typography } from "material-ui";
import RepresentativeForm from "./RepresentativeForm";
import ParticipantForm from "./ParticipantForm";
import { checkValidEmail, errorHandler } from "../../../utils";
import { updateCouncilParticipant } from "../../../queries/councilParticipant";

class ParticipantEditor extends Component {
	updateParticipantData = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
			}
		});
	};
	updateParticipant = async () => {
		if (!this.checkRequiredFields()) {
			const { __typename, ...participant } = this.state.data;
			const { translate } = this.props;

			let variables = {
				participant: {
					...participant
				}
			};

			if (this.state.addRepresentative) {
				let { __typename, ...representative } = this.state.data;
				variables.representative = representative;
			}

			const response = await this.props.updateParticipant({
				variables: variables
			});
			if (response) {
				if (response.errors) {
					const errorField = errorHandler(response.errors[0].code);
					this.setState({
						errors: {
							...this.state.errors,
							email: translate[errorField]
						}
					});
				} else {
					this.props.requestClose();
				}
			}
		}
	};
	updateRepresentative = object => {
		this.setState({
			data: {
				...this.state.data,
				representative: {
					...this.state.data.representative,
					...object
				}
			}
		});
	};
	activateRepresentative = value => {
		let newState = {
			...this.state,
			addRepresentative: value
		};

		if (!this.state.data.representative && value) {
			newState.data.representative = {
				...newRepresentativeInitialValues
			};
		}
		this.setState({ ...newState });
	};

	constructor(props) {
		super(props);
		this.state = {
			languages: [],
			addRepresentative: false,
			participantType: 0,
			data: {
				representative: {}
			},

			errors: {
				language: "",
				councilId: "",
				numParticipations: "",
				personOrEntity: "",
				name: "",
				dni: "",
				position: "",
				email: "",
				phone: ""
			}
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (!!nextProps.participant) {
			if (nextProps.participant.id !== prevState.data.id) {
				return {
					...prevState,
					addRepresentative: !!nextProps.participant.representative,
					data: {
						...nextProps.participant
					}
				};
			}
		}
		return {
			...prevState
		};
	}

	async componentDidMount() {
		this.setState({
			languages: [
				{
					columnName: 'es',
					desc: 'Español'
				},
				{
					columnName: 'en',
					desc: 'English'
				},
				{
					columnName: 'pt',
					desc: 'Portugués'
				},
				{
					columnName: 'cat',
					desc: 'Catalá'
				},
				{
					columnName: 'gal',
					desc: 'Galego'
				},
			]
		});
	}

	checkRequiredFields() {
		const participant = this.state.data;
		const { translate } = this.props;

		let errors = {
			name: "",
			surname: "",
			dni: "",
			position: "",
			email: "",
			phone: "",
			language: "",
			numParticipations: ""
		};

		let hasError = false;

		if (!participant.name) {
			hasError = true;
			errors.name = translate.field_required;
		}

		if (!participant.surname && this.state.participantType === 0) {
			hasError = true;
			errors.surname = translate.field_required;
		}

		if (!participant.dni) {
			hasError = true;
			errors.dni = translate.field_required;
		}

		if (!participant.position) {
			hasError = true;
			errors.position = translate.field_required;
		}

		if (!checkValidEmail(participant.email.toLocaleLowerCase())) {
			hasError = true;
			errors.email = "Se requiere un email válido";
		}

		if (!participant.phone) {
			hasError = true;
			errors.phone = translate.field_required;
		}

		if (!participant.language) {
			hasError = true;
			errors.language = translate.field_required;
		}

		if (!participant.numParticipations) {
			hasError = true;
			errors.numParticipations = translate.field_required;
		}

		this.setState({
			...this.state,
			errors: errors
		});

		return hasError;
	}

	_renderRepresentativeCheckbox() {
		return (
			<Grid>
				<GridItem xs={12} lg={12} md={12}>
					<Checkbox
						label={this.props.translate.add_representative}
						value={this.state.addRepresentative}
						onChange={(event, isInputChecked) =>
							this.activateRepresentative(isInputChecked)
						}
					/>
				</GridItem>
			</Grid>
		);
	}

	_renderAddParticipantButtons() {
		const { translate } = this.props;
		const primary = getPrimary();

		return (
			<Fragment>
				<BasicButton
					text={translate.cancel}
					color={"white"}
					textStyle={{
						color: primary,
						fontWeight: "700",
						fontSize: "0.9em",
						textTransform: "none"
					}}
					textPosition="after"
					onClick={this.props.requestClose}
					buttonStyle={{
						marginRight: "1em",
						border: `2px solid ${primary}`
					}}
				/>
				<BasicButton
					text={translate.save}
					color={primary}
					textStyle={{
						color: "white",
						fontWeight: "700",
						fontSize: "0.9em",
						textTransform: "none"
					}}
					icon={<ButtonIcon color="white" type="save" />}
					textPosition="after"
					onClick={this.updateParticipant}
				/>
			</Fragment>
		);
	}

	render() {
		const participant = this.state.data;
		const { translate, participations } = this.props;
		const { representative } = participant;
		const { errors } = this.state;

		return (
			<Fragment>
				<Grid>
					<GridItem xs={12} lg={12} md={12}>
						<Typography variant="title">
							{translate.edit_participant}
						</Typography>
					</GridItem>
					<Paper
						style={{
							padding: "2em",
							paddingTop: "1em",
							marginTop: "1em",
							marginBottom: "1em"
						}}
					>
						{
							<ParticipantForm
								type={this.state.participantType}
								participant={participant}
								participations={participations}
								translate={translate}
								languages={this.state.languages}
								errors={errors}
								updateState={this.updateParticipantData}
							/>
						}
					</Paper>
					{this._renderRepresentativeCheckbox()}
					{this.state.addRepresentative && (
						<Paper
							style={{
								marginBottom: "1.3em",
								padding: "2em"
							}}
						>
							{
								<RepresentativeForm
									representative={representative}
									translate={translate}
									languages={this.state.languages}
									errors={errors}
									updateState={this.updateRepresentative}
								/>
							}
						</Paper>
					)}
					{this._renderAddParticipantButtons()}
				</Grid>
			</Fragment>
		);
	}
}

export default graphql(updateCouncilParticipant, {
	name: "updateCouncilParticipant"
})(ParticipantEditor);

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
