import React from 'react';
import { graphql } from 'react-apollo';
import {
	AlertConfirm,
	BasicButton,
	ButtonIcon,
	UnsavedChangesModal,
} from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import { createCensus } from '../../../queries/census';
import CensusInfoForm from './CensusInfoForm';
import { isMobile } from '../../../utils/screen';
import { INPUT_REGEX } from '../../../constants';

class AddCensusButton extends React.Component {
	state = {
		modal: false,
		unsavedModal: false,
		data: {
			censusName: '',
			censusDescription: '',
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
					unsavedModal: false,
					data: {
						censusName: '',
						censusDescription: '',
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

	renderBody = () => (
		<div style={{ minWidth: !isMobile && '800px' }}>
			<CensusInfoForm
				translate={this.props.translate}
				errors={this.state.errors}
				updateState={this.updateState}
				census={this.state.data}
			/>
		</div>
	);

	checkRequiredFields() {
		let hasError = false;
		const { translate } = this.props;

		if (this.state.data.censusName) {
			if (!(INPUT_REGEX.test(this.state.data.censusName)) || !this.state.data.censusName.trim()) {
				hasError = true;
				this.setState({
					errors: {
						...this.state.errors,
						censusName: translate.invalid_field
					}
				});
			}
		}
		if (this.state.data.censusDescription) {
			if (!(INPUT_REGEX.test(this.state.data.censusDescription)) || !this.state.data.censusDescription.trim()) {
				hasError = true;
				this.setState({
					errors: {
						...this.state.errors,
						censusDescription: translate.invalid_field
					}
				});
			}
		}

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
		}
		return false;
	}

	render() {
		const { translate } = this.props;
		const primary = getPrimary();
		return (
			<React.Fragment>
				<BasicButton
					text={translate.add_census}
					color={'white'}
					id="add-census-button"
					textStyle={{
						color: primary,
						fontWeight: '700',
						fontSize: '0.9em',
						textTransform: 'none'
					}}
					textPosition="after"
					icon={<ButtonIcon type="add" color={primary} />}
					onClick={() => this.setState({
						modal: true,
						data: {
							censusName: '',
							censusDescription: '',
							quorumPrototype: 0
						},
						errors: {}
					})}
					buttonStyle={{
						marginRight: '1em',
						border: `2px solid ${primary}`
					}}
				/>
				<AlertConfirm
					requestClose={() => {
						if (this.state.data.censusDescription.length >= 1 || this.state.data.censusName.length >= 1) {
							this.setState({ ...this.state, unsavedModal: true });
						} else {
							this.setState({ ...this.state, modal: false, unsavedModal: false });
						}
					}}
					open={this.state.modal}
					acceptAction={this.createCensus}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					bodyText={this.renderBody()}
					title={translate.add_census}
				/>
				<UnsavedChangesModal
					translate={translate}
					open={this.state.unsavedModal}
					requestClose={() => {
						this.setState({ ...this.state, unsavedModal: false });
					}}
					acceptAction={this.createCensus}
					cancelAction={() => this.setState({
						modal: false,
						unsavedModal: false,
						data: {
							censusName: '',
							censusDescription: '',
							quorumPrototype: 0
						},
						errors: {}
					})}
				/>
			</React.Fragment>
		);
	}
}

export default graphql(createCensus, {
	name: 'createCensus'
})(AddCensusButton);
