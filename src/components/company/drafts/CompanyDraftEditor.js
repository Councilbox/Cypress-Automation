import React from "react";
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


const CompanyDraftEditor = ({ translate, ...props }) => {
	const [data, setData] = React.useState({
		companyId: '',
		companyType: '',
		corporationId: '',
		creationDate: "",
		description: "",
		draftId: '',
		id: '',
		language: '',
		lastModificationDate: '',
		majority: '',
		majorityDivider: '',
		majorityType: '',
		statuteId: '',
		text: "",
		title: "",
		type: '',
		userId: '',
		votationType: '',
	});
	const [errors, setErrors] = React.useState({});
	const [loading, setLoading] = React.useState(false);
	const [success, setSuccess] = React.useState(false);

	React.useEffect(() => {
		if(!props.data.loading){
			if(props.data.companyDraft.id !== data.id){
				setData(props.data.companyDraft);
			}
		}
	}, [props.data.loading]);

	const updateState = object => {
		setData({
			...data,
			...object
		});
		setSuccess(false);
	}

	const updateErrors = errors => {
		setErrors(errors);
	}

	const updateCompanyDraft = async () => {
		if (!checkRequiredFields(translate, data, updateErrors)) {
			setLoading(true);
			const { __typename, ...cleanData } = data;
			const response = await props.updateCompanyDraft({
				variables: {
					draft: {
						...cleanData,
						companyId: props.match.params.company
					}
				}
			});

			if (!response.errors) {
				setSuccess(true);
				setLoading(false);
			}
		}
	}
	
	return (
		<CardPageLayout title={translate.edit_draft}>
			{(!props.data.loading && data.id) && (
				<div>
					<div style={{ marginTop: "1.8em" }}>
						<CompanyDraftForm
							translate={translate}
							errors={errors}
							updateState={updateState}
							draft={data}
							companyStatutes={data.companyStatutes}
							draftTypes={props.data.draftTypes}
							votingTypes={props.data.votingTypes}
							majorityTypes={props.data.majorityTypes}
						/>
					</div>
					<br />
					<BasicButton
						text={translate.save}
						color={getPrimary()}
						loading={loading}
						success={success}
						textStyle={{
							color: "white",
							fontWeight: "700"
						}}
						floatRight
						onClick={updateCompanyDraft}
						icon={<ButtonIcon type="save" color="white" />}
					/>
				</div>
			)}
		</CardPageLayout>
	);
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
