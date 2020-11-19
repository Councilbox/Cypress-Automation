import React from "react";
import {
	BasicButton,
	ButtonIcon,
	LoadingSection,
	CardPageLayout
} from "../../../displayComponents";
import { compose, graphql } from "react-apollo";
import { createCompanyDraft, draftData } from "../../../queries/companyDrafts";
import { getPrimary } from "../../../styles/colors";
import { checkRequiredFields } from "../../../utils/CBX";
import CompanyDraftForm from "./CompanyDraftForm";
import { toast } from 'react-toastify';
import { bHistory } from "../../../containers/App";
import { withRouter } from "react-router";
import withTranslations from "../../../HOCs/withTranslations";
import { isMobile } from "react-device-detect";
import { INPUT_REGEX } from "../../../constants";


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
				companyId: +this.props.match.params.company
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
		const regex = INPUT_REGEX;
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
				companyId: +this.props.match.params.company
			},
			loading: false,
			success: false
		});
		this.goBack()
		// this.props.closeForm();
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
			<CardPageLayout title={this.props.translate.new_draft} disableScroll={true}>
				<div style={{ height: 'calc( 100% - 5em )' }}>
					<div style={{ marginTop: "1.8em", height: "100%", overflow: "hidden", padding: "0px 25px" }}>
						<CompanyDraftForm
							draft={draft}
							errors={errors}
							translate={translate}
							updateState={this.updateState}
							{...this.props.data}
						/>
					</div>

					<div style={{
						paddingRight: '0.8em',
						width: '100%',
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'center',
						paddingTop: isMobile && "0.5em"
					}}>
						<BasicButton
							// id={"saveDraft"}
							floatRight
							text={this.props.translate.back}
							color={getPrimary()}
							loading={this.state.loading}
							success={this.state.success}
							textStyle={{
								color: "white",
								fontWeight: "700",
								marginRight: "1em"
							}}
							onClick={() => this.goBack()}
						/>
						<BasicButton
							id={"saveDraft"}
							floatRight
							text={this.props.translate.save}
							color={getPrimary()}
							loading={this.state.loading}
							success={this.state.success}
							textStyle={{
								color: "white",
								fontWeight: "700",
								marginRight: "1em"
							}}
							onClick={() => this.createCompanyDraft()}
							icon={<ButtonIcon type="save" color="white" />}
						/>
					</div>
				</div>
			</CardPageLayout>
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
				companyId: +props.match.params.company
			}
		})
	})
)(withRouter(withTranslations()(CompanyDraftNew)));
