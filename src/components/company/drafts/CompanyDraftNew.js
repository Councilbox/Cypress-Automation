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
import { bHistory } from "../../../containers/App";


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
		let errors = {
			title: "",
		}
		let hasError = false;
		var regex = new RegExp("[ A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ.-]+");
		console.log(this.state.draft.title)
		if (!checkRequiredFields(translate, draft, this.updateErrors, null, toast)) {
			if (this.state.draft.title) {
				if (!(regex.test(this.state.draft.title)) || !this.state.draft.title.trim()) {
					hasError = true;
					errors.title = translate.invalid_field;
					this.updateErrors(errors);
				}
			}

			if (!hasError) {
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

	goBack = () => {
		bHistory.goBack();
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
				<div style={{ marginTop: "1.8em", height: 'calc( 100% - 3em )' }}>
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
					<BasicButton
						// id={"saveDraft"}
						floatRight
						text={translate.back}
						color={getPrimary()}
						loading={this.state.loading}
						success={this.state.success}
						textStyle={{
							color: "white",
							fontWeight: "700",
							marginRight: "1em"
						}}
						onClick={() => this.props.back()}
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
