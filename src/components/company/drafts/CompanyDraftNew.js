import React from "react";
import {
	BasicButton,
	ButtonIcon,
	LoadingSection
} from "../../../displayComponents";
import { compose, graphql } from "react-apollo";
import { createCompanyDraft, draftData } from "../../../queries/companyDrafts";
import { getPrimary } from "../../../styles/colors";
import { checkRequiredFields } from "../../../utils/CBX";
import CompanyDraftForm from "./CompanyDraftForm";
import { toast } from 'react-toastify';


class CompanyDraftNew extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			draft: {
				title: "",
				statuteId: -1,
				type: -1,
				description: "",
				text: "",
				votationType: -1,
				majorityType: -1,
				majority: null,
				majorityDivider: null,
				companyId: this.props.company.id
			},

			errors: {}
		};
	}

	updateState = object => {
		this.setState({
			draft: {
				...this.state.draft,
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
		const { draft } = this.state;

		if (!checkRequiredFields(translate, draft, this.updateErrors, null, toast)) {
			this.setState({ loading: true });
			const response = await this.props.createCompanyDraft({
				variables: {
					draft: this.state.draft
				}
			});

			if (!response.errors) {
				this.setState({ success: true });
				this.timeout = setTimeout(() => this.resetAndClose(), 2000);
			}
		}
	};

	resetAndClose = () => {
		clearTimeout(this.timeout);
		this.setState({
			errors: {},
			draft: {
				title: "",
				statuteId: -1,
				type: -1,
				description: "",
				text: "",
				votationType: -1,
				majorityType: -1,
				majority: null,
				majorityDivider: null,
				companyId: this.props.company.id
			},
			loading: false,
			success: false
		});
		this.props.closeForm();
	};

	render() {
		const { translate } = this.props;
		const { draft, errors } = this.state;
		const { loading } = this.props.data;

		if (loading) {
			return <LoadingSection />;
		}

		return (
			<React.Fragment>
				<div style={{ marginTop: "1.8em", height: 'calc( 100% - 8em )' }}>
					<CompanyDraftForm
						draft={draft}
						errors={errors}
						translate={translate}
						updateState={this.updateState}
						{...this.props.data}
					/>
					<br />
					<BasicButton
						id={"saveDraft"}
						floatRight
						text={translate.save}
						color={getPrimary()}
						loading={this.state.loading}
						success={this.state.success}
						textStyle={{
							color: "white",
							fontWeight: "700"
						}}
						onClick={() => this.createCompanyDraft()}
						icon={<ButtonIcon type="save" color="white" />}
					/>
					<br /><br />
				</div>
			</React.Fragment>
		);
	}
}

export default compose(
	graphql(createCompanyDraft, {
		name: "createCompanyDraft",
		options: {
			errorPolicy: "all"
		}
	}),
	graphql(draftData, {
		options: props => ({
			variables: {
				companyId: props.company.id
			}
		})
	})
)(CompanyDraftNew);
