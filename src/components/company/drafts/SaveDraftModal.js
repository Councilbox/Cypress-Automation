import React from "react";
import { AlertConfirm } from "../../../displayComponents";
import CompanyDraftForm from "./CompanyDraftForm";
import withTranslations from "../../../HOCs/withTranslations";
import { graphql } from "react-apollo";
import { createCompanyDraft } from "../../../queries/companyDrafts";
import { checkRequiredFields } from "../../../utils/CBX";

const SaveDraftModal = ({ translate, ...props }) => {
	const [data, setData] = React.useState(props.data);
	const [errors, setErrors] = React.useState({})

	const updateState = object => {
		setData({
			...data,
			...object
		});
	}

	const updateErrors = object => {
		setErrors(object);
	}

	const createCompanyDraft = async () => {
		if (!checkRequiredFields(translate, data, updateErrors)) {
			const response = await props.createCompanyDraft({
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
						companyId: props.company.id
					}
				}
			});

			if (!response.errors) {
				props.requestClose();
			}
		}
	};

	const _renderNewPointBody = () => {
		console.log(data);

		return (
			<div style={{ width: "800px" }}>
				<CompanyDraftForm
					translate={translate}
					errors={errors}
					updateState={updateState}
					draft={data}
					companyStatutes={props.companyStatutes}
					draftTypes={props.draftTypes}
					votingTypes={props.votingTypes}
					majorityTypes={props.majorityTypes}
				/>
			</div>
		);
	}

	return (
		<AlertConfirm
			requestClose={props.requestClose}
			open={props.open}
			acceptAction={createCompanyDraft}
			cancelAction={props.requestClose}
			buttonAccept={translate.accept}
			buttonCancel={translate.cancel}
			bodyText={_renderNewPointBody()}
			title={translate.new_draft}
		/>
	)

}


export default graphql(createCompanyDraft, { name: "createCompanyDraft" })(
	withTranslations()(SaveDraftModal)
);
