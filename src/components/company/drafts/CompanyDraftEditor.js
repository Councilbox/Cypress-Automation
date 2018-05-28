import React, { Component } from "react";
import {
	BasicButton,
	ButtonIcon,
	CardPageLayout
} from "../../../displayComponents";
import CompanyDraftForm from "./CompanyDraftForm";
import withTranslations from "../../../HOCs/withTranslations";
import { graphql } from "react-apollo";
import {
	getCompanyDraftData,
	updateCompanyDraft
} from "../../../queries/companyDrafts";
import { compose } from "react-apollo/index";
import { checkRequiredFields } from "../../../utils/CBX";
import { withRouter } from "react-router-dom";
import { getPrimary } from "../../../styles/colors";

class CompanyDraftEditor extends Component {
	updateState = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
			},
			success: false
		});
	};
	updateErrors = errors => {
		this.setState({
			errors
		});
	};
	updateCompanyDraft = async () => {
		const { translate } = this.props;
		const { data } = this.state;

		if (!checkRequiredFields(translate, data, this.updateErrors)) {
			this.setState({ loading: true });
			const response = await this.props.updateCompanyDraft({
				variables: {
					draft: {
						id: data.id,
						title: data.title,
						statuteId: data.statuteId,
						type: data.type,
						description: data.description,
						text: data.text,
						votationType: data.votationType,
						majorityType: data.majorityType,
						majority: data.majority,
						majorityDivider: data.majorityDivider,
						companyId: this.props.match.params.company
					}
				}
			});

			if (!response.errors) {
				this.setState({
					success: true,
					loading: false
				});
			}
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			data: {},
			errors: {}
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		return {
			data: nextProps.data.companyDraft
		};
	}

	render() {
		const { translate } = this.props;
		const { data, errors } = this.state;

		return (
			<CardPageLayout title={translate.edit_draft}>
				{!this.props.data.loading && (
					<div>
						<div style={{ marginTop: "1.8em" }}>
							<CompanyDraftForm
								translate={translate}
								errors={errors}
								updateState={this.updateState}
								draft={data}
								companyStatutes={
									this.props.data.companyStatutes
								}
								draftTypes={this.props.data.draftTypes}
								votingTypes={this.props.data.votingTypes}
								majorityTypes={this.props.data.majorityTypes}
							/>
						</div>
						<br />
						<BasicButton
							text={translate.save}
							color={getPrimary()}
							loading={this.state.loading}
							success={this.state.success}
							textStyle={{
								color: "white",
								fontWeight: "700"
							}}
							floatRight
							onClick={() => this.updateCompanyDraft()}
							icon={<ButtonIcon type="save" color="white" />}
						/>
					</div>
				)}
			</CardPageLayout>
		);
	}
}

export default compose(
	graphql(getCompanyDraftData, {
		name: "data",
		options: props => ({
			variables: {
				id: props.match.params.id,
				companyId: props.match.params.company
			},
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(updateCompanyDraft, { name: "updateCompanyDraft" })
)(withRouter(withTranslations()(CompanyDraftEditor)));
