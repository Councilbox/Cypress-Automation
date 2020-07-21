import React from "react";
import {
	AlertConfirm,
	BasicButton,
	ButtonIcon,
} from "../../../displayComponents";
import { graphql } from "react-apollo";
import { getPrimary } from "../../../styles/colors";
import { createCensus } from "../../../queries/census";
import CensusInfoForm from './CensusInfoForm';

class AddCensusButton extends React.Component {
	state = {
		modal: false,
		data: {
			censusName: "",
			censusDescription: "",
			quorumPrototype: 0
		},
		errors: {}
	}

	createCensus = async () => {
		if (!this.checkRequiredFields()) {
			const response = await this.props.createCensus({
				variables: {
					census: {
						...this.state.data,
						creatorId: this.props.user.id,
						companyId: this.props.company.id,
						defaultCensus: 0
					}
				}
			});
			if (response) {
				this.props.refetch();
				this.setState({
					modal: false,
					data: {
						censusName: "",
						censusDescription: "",
						quorumPrototype: 0
					},
					errors: {}
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

	_renderBody = () => {
		return (
			<div style={{ minWidth: "800px" }}>
				<CensusInfoForm
					translate={this.props.translate}
					errors={this.state.errors}
					updateState={this.updateState}
					census={this.state.data}
				/>
			</div>
		);
	};

	checkRequiredFields() {
		let hasError = false;
		const { translate } = this.props;
		var regex = new RegExp("[ A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ.-]+");

		if (this.state.data.censusName) {
			if (!(regex.test(this.state.data.censusName)) || !this.state.data.censusName.trim()) {
				hasError = true;
				this.setState({
					errors: {
						...this.state.errors,
						censusName: translate.invalid_field
					}
				})
			}
		}
		if (this.state.data.censusDescription) {
			if (!(regex.test(this.state.data.censusDescription)) || !this.state.data.censusDescription.trim()) {
				hasError = true;
				this.setState({
					errors: {
						...this.state.errors,
						censusDescription: translate.invalid_field
					}
				})
			}
		}
		console.log(this.state)
		if (!this.state.data.censusName) {
			hasError = true;
			this.setState({
				errors: {
					...this.state.errors,
					censusName: this.props.translate.required_field
				}
			});
		}
		if (hasError) {
			return true;
		} else {
			return false;
		}
	}

	render() {
		const { translate } = this.props;
		const primary = getPrimary();

		return (
			<React.Fragment>
				<BasicButton
					text={translate.add_census}
					color={"white"}
					textStyle={{
						color: primary,
						fontWeight: "700",
						fontSize: "0.9em",
						textTransform: "none"
					}}
					textPosition="after"
					icon={<ButtonIcon type="add" color={primary} />}
					onClick={() => this.setState({
						modal: true,
						data: {
							censusName: "",
							censusDescription: "",
							quorumPrototype: 0
						},
						errors: {}
					})}
					buttonStyle={{
						marginRight: "1em",
						border: `2px solid ${primary}`
					}}
				/>
				<AlertConfirm
					requestClose={() => this.setState({ modal: false })}
					open={this.state.modal}
					acceptAction={this.createCensus}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					bodyText={this._renderBody()}
					title={translate.census}
				/>
			</React.Fragment>
		);
	}
}

export default graphql(createCensus, {
	name: "createCensus"
})(AddCensusButton);
