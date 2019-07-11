import React from "react";
import {
	BasicButton,
	ButtonIcon,
	CardPageLayout
} from "../../../displayComponents";
import CompanyDraftForm from "./CompanyDraftForm";
import { graphql, withApollo } from "react-apollo";
import {
	getCompanyDraftData,
	updateCompanyDraft
} from "../../../queries/companyDrafts";
import { compose } from "react-apollo/index";
import { checkRequiredFields } from "../../../utils/CBX";
import { withRouter } from "react-router-dom";
import { getPrimary } from "../../../styles/colors";
import { sendGAevent } from "../../../utils/analytics";
import withSharedProps from "../../../HOCs/withSharedProps";


const CompanyDraftEditor = ({ translate, client, ...props }) => {
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
	const [vars, setVars] = React.useState({});
	const [errors, setErrors] = React.useState({});
	const [fetching, setFetching] = React.useState(true);
	const [loading, setLoading] = React.useState(false);
	const [success, setSuccess] = React.useState(false);

	const getData = React.useCallback(async() => {
		const response = await client.query({
			query: getCompanyDraftData,
			variables: {
				id: props.match.params.id,
				companyId: props.match.params.company
			}
		});

		setVars(response.data);
		setData(response.data.companyDraft);
		setFetching(false);
	}, [props.match.params.id]);

	React.useEffect(() => {
		getData();
	}, [getData]);

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

			sendGAevent({
				category: 'Borradores',
				action: `Modificación de borrador`,
				label: props.company.businessName
			});

			if (!response.errors) {
				setSuccess(true);
				setLoading(false);
			}
		}
	}

	return (
		<CardPageLayout title={translate.edit_draft}>
			{!fetching && (
				<div>
					<div style={{ marginTop: "1.8em" }}>
						<CompanyDraftForm
							translate={translate}
							errors={errors}
							updateState={updateState}
							draft={data}
							companyStatutes={vars.companyStatutes}
							draftTypes={vars.draftTypes}
							votingTypes={vars.votingTypes}
							majorityTypes={vars.majorityTypes}
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
	withApollo,
	graphql(updateCompanyDraft, { name: "updateCompanyDraft" })
)(withRouter(withSharedProps()(CompanyDraftEditor)));
