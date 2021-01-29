import React from "react";
import { compose, graphql } from "react-apollo";
import { toast } from 'react-toastify';
import { withRouter } from "react-router";
import { isMobile } from "react-device-detect";
import {
	BasicButton,
	ButtonIcon,
	LoadingSection,
	CardPageLayout,
	UnsavedChangesModal
} from "../../../displayComponents";
import { createCompanyDraft, draftData } from "../../../queries/companyDrafts";
import { getPrimary } from "../../../styles/colors";
import { checkRequiredFields } from "../../../utils/CBX";
import CompanyDraftForm from "./CompanyDraftForm";
import { bHistory } from "../../../containers/App";
import withTranslations from "../../../HOCs/withTranslations";
import { INPUT_REGEX } from "../../../constants";

let timeout;

const CompanyDraftNew = ({ translate, ...props }) => {
	const [dataInit, setDataInit] = React.useState({ draft: {
		title: "",
		statuteId: -1,
		type: -1,
		description: "",
		text: "",
		votationType: -1,
		majorityType: -1,
		majority: null,
		majorityDivider: null,
		companyId: +props.match.params.company
	}, })
	const [unsavedAlert, setUnsavedAlert] = React.useState(false)
	const [state, setState] = React.useState({
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
			companyId: +props.match.params.company
		},
	})
	const [errors, setErrors] = React.useState({});


	const updateState = object => {
		setState({
			draft: {
				...state.draft,
				...state.draft,
				...object
			}
		});
	};

	const updateErrors = errors => {
		setErrors({
			...errors,
			errors
		});
	};

	const createCompanyDraft = async () => {
		const { draft } = state;
		const errors = {
			title: "",
		}
		let hasError = false;
		const regex = INPUT_REGEX;
		if (!checkRequiredFields(translate, draft, updateErrors, null, toast)) {
			if (state.draft.title) {
				if (!(regex.test(state.draft.title)) || !state.draft.title.trim()) {
					hasError = true;
					errors.title = translate.invalid_field;
					updateErrors(errors);
				}
			}

			if (!hasError) {
				setState({ ...state, loading: true });
				const response = await props.createCompanyDraft({
					variables: {
						draft: state.draft
					}
				});

				if (!response.errors) {
					setState({ ...state, success: true });
					timeout = setTimeout(() => resetAndClose(), 2000);
				}
			}
		}
	};

	const resetAndClose = () => {
		clearTimeout(timeout);
		setErrors({});
		setState({
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
				companyId: +props.match.params.company
			},
			loading: false,
			success: false
		});
		bHistory.goBack();
	};

	const comprobateChanges = () => JSON.stringify(state) !== JSON.stringify(dataInit);

	const goBack = () => {
		if(!comprobateChanges()){
			bHistory.goBack();
		} else {
			setUnsavedAlert(true);
		}
	};

	const { loading } = props.data;

	if (loading) {
		return <LoadingSection />;
	}

	return (
		<CardPageLayout title={translate.new_draft} disableScroll={true}>
			<div style={{ height: 'calc( 100% - 5em )' }}>
				<div style={{ marginTop: "1.8em", height: "100%", overflow: "hidden", padding: "0px 25px" }}>
					<CompanyDraftForm
						draft={state.draft}
						errors={errors}
						translate={translate}
						updateState={updateState}
						{...props.data}
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
						text={translate.back}
						color={getPrimary()}
						loading={state.loading}
						success={state.success}
						textStyle={{
							color: "white",
							fontWeight: "700",
							marginRight: "1em"
						}}
						onClick={() => goBack()}
					/>
					<BasicButton
						id={"saveDraft"}
						floatRight
						text={translate.save}
						color={getPrimary()}
						loading={state.loading}
						success={state.success}
						textStyle={{
							color: "white",
							fontWeight: "700",
							marginRight: "1em"
						}}
						onClick={() => createCompanyDraft()}
						icon={<ButtonIcon type="save" color="white" />}
					/>
				</div>
			</div>
			<UnsavedChangesModal
				acceptAction={createCompanyDraft}
				cancelAction={() => bHistory.goBack()}
				requestClose={() => setUnsavedAlert(false)}
				successAction={state.success}
				loadingAction={state.loading}
				open={unsavedAlert}
			/>
		</CardPageLayout>
	);
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
