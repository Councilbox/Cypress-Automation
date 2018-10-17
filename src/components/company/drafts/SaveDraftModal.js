import React from "react";
import { AlertConfirm } from "../../../displayComponents";
import CompanyDraftForm from "./CompanyDraftForm";
import withTranslations from "../../../HOCs/withTranslations";
import { graphql } from "react-apollo";
import { createCompanyDraft } from "../../../queries/companyDrafts";
import { checkRequiredFields } from "../../../utils/CBX";

class SaveDraftModal extends React.Component {
	state = {
		data: {}
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		return {
			data: nextProps.data
		};
	}


	updateState = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
			}
		});
	};

	updateErrors = errors => {
		this.setState({
			errors
		});
	};

	createCompanyDraft = async () => {
		const { translate } = this.props;
		const draft = this.state.data;
		if (!checkRequiredFields(translate, draft, this.updateErrors)) {
			const { data } = this.state;
			this.setState({ loading: true });
			const response = await this.props.createCompanyDraft({
				variables: {
					draft: {
						title: data.title,
						statuteId: data.statuteId,
						type: data.type,
						description: data.description,
						text: data.text,
						votationType: data.votationType,
						majorityType: data.majorityType,
						majority: data.majority,
						majorityDivider: data.majorityDivider,
						companyId: this.props.company.id
					}
				}
			});

			if (!response.errors) {
				this.setState({ success: true });
				this.props.requestClose();
			}
		}
	};

	_renderNewPointBody = () => {
		const { translate } = this.props;
		const { data = {} } = this.state;

		return (
			<div style={{ width: "800px" }}>
				<CompanyDraftForm
					translate={translate}
					errors={{}}
					updateState={this.updateState}
					draft={data}
					companyStatutes={this.props.companyStatutes}
					draftTypes={this.props.draftTypes}
					votingTypes={this.props.votingTypes}
					majorityTypes={this.props.majorityTypes}
				/>
			</div>
		);
	};

	render() {
		const { translate } = this.props;

		return (
			<AlertConfirm
				requestClose={this.props.requestClose}
				open={this.props.open}
				acceptAction={this.createCompanyDraft}
				cancelAction={this.props.requestClose}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				bodyText={this._renderNewPointBody()}
				title={translate.new_point}
			/>
		);
	}
}

export default graphql(createCompanyDraft, { name: "createCompanyDraft" })(
	withTranslations()(SaveDraftModal)
);
