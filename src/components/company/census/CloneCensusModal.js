import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import { MenuItem } from 'material-ui';
import {
	AlertConfirm,
	SelectInput,
	TextInput
} from '../../../displayComponents';
import RichTextInput from '../../../displayComponents/RichTextInput';
import { cloneCensus } from '../../../queries/census';
import { removeHTMLTags } from '../../../utils/CBX';

class CloneCensusModal extends Component {
	state = {
		data: {
			censusName: '',
			quorumPrototype: 0,
			censusDescription: ''
		},

		errors: {
			censusName: '',
			quorumPrototype: '',
			censusDescription: ''
		}
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.census) {
			if (nextProps.census.id !== prevState.data.id) {
				return {
					data: {
						...nextProps.census,
						censusDescription: nextProps.census.censusDescription || ''
					}
				};
			}
		}
		return null;
	}

	cloneCensus = async () => {
		if (this.checkRequiredFields()) {
			const { __typename, creator, creatorId, creationDate, lastEdit, defaultCensus, ...census } = this.state.data;
			const response = await this.props.cloneCensus({
				variables: {
					census: {
						...census,
						censusDescription: removeHTMLTags(census.censusDescription),
						creatorId: this.props.user.id
					}
				}
			});

			if (!response.errors) {
				if (response.data.cloneCensus.success) {
					this.props.refetch();
					this.props.requestClose();
				}
			}
		}
	};

	renderNewPointBody = () => {
		const { translate } = this.props;
		const { errors } = this.state;
		const census = this.state.data;

		return (
			<Fragment>
				<div className="row">
					<div className="col-lg-6 col-md-6 col-xs-12">
						<TextInput
							floatingText={translate.name}
							required
							type="text"
							errorText={errors.censusName}
							value={census.censusName}
							onChange={event => {
								this.updateState({
									censusName: event.target.value
								});
							}}
						/>
					</div>
					<div className="col-lg-6 col-md-6 col-xs-12">
						<SelectInput
							floatingText={translate.census_type}
							value={census.quorumPrototype}
							onChange={event => {
								this.updateState({
									quorumPrototype: event.target.value
								});
							}}
						>
							<MenuItem value={0}>
								{translate.census_type_assistants}
							</MenuItem>
							<MenuItem value={1}>
								{translate.social_capital}
							</MenuItem>
						</SelectInput>
					</div>
				</div>

				<RichTextInput
					floatingText={translate.description}
					type="text"
					translate={translate}
					errorText={errors.censusDescription}
					value={census.censusDescription}
					onChange={value => {
						this.updateState({
							censusDescription: value
						});
					}}
				/>
			</Fragment>
		);
	};

	updateState(object) {
		this.setState({
			data: {
				...this.state.data,
				...object
			}
		});
	}

	static heckRequiredFields() {
		return true;
	}

	render() {
		const { translate } = this.props;

		return (
			<Fragment>
				<AlertConfirm
					requestClose={this.props.requestClose}
					open={this.props.open}
					acceptAction={this.cloneCensus}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					bodyText={this.renderNewPointBody()}
					title={translate.clone_census}
				/>
			</Fragment>
		);
	}
}

export default graphql(cloneCensus, {
	name: 'cloneCensus'
})(CloneCensusModal);
