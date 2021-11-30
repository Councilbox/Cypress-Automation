import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, AlertConfirm, ButtonIcon } from '../../../../displayComponents';
import { getPrimary } from '../../../../styles/colors';
import CompanyTagForm from './CompanyTagForm';
import { sendGAevent } from '../../../../utils/analytics';

const addTag = gql`
	mutation CreateCompanyTag($tag: CompanyTagInput!){
		createCompanyTag(tag: $tag){
			id
			key
			value
		}
	}
`;

export const checkUsedKey = gql`
	query CompanyTagKeyUsed($companyId: Int!, $key: String!){
		companyTagKeyUsed(companyId: $companyId, key: $key){
			id
		}
	}
`;


const AddCompanyTag = ({
	company, translate, refetch, client, styles
}) => {
	const [modal, setModal] = React.useState(false);
	const [errors, setErrors] = React.useState({
		key: '',
		value: '',
		description: ''
	});
	const primary = getPrimary();
	const [tag, setTag] = React.useState({
		key: '',
		value: '',
		description: ''
	});


	const checkRequiredFields = async () => {
		const checkErrors = {};

		if (!tag.key || !tag.key.trim()) {
			checkErrors.key = translate.required_field;
		} else {
			const response = await client.query({
				query: checkUsedKey,
				variables: {
					companyId: company.id,
					key: tag.key
				}
			});

			if (response.data.companyTagKeyUsed) {
				checkErrors.key = translate.key_already_used;
			}
		}

		if (!tag.value || !tag.value.trim()) {
			checkErrors.value = translate.required_field;
		}

		setErrors(checkErrors);

		return Object.keys(checkErrors).length > 0;
	};

	const updateTag = object => {
		setTag({
			...tag,
			...object
		});
	};

	const createCompanyTag = async () => {
		if (!await checkRequiredFields()) {
			const response = await client.mutate({
				mutation: addTag,
				variables: {
					tag: {
						value: tag.value,
						key: tag.key,
						description: tag.description,
						companyId: company.id
					}
				}
			});

			if (response.data.createCompanyTag) {
				sendGAevent({
					category: 'Etiquetas',
					action: 'Crear etiqueta',
					label: company.businessName
				});
				refetch();
				setModal(false);
				setTag({
					key: '',
					value: '',
					description: '',
				});
			}
		}
	};


	const openModal = React.useCallback(() => {
		setModal(true);
	});

	const closeModal = React.useCallback(() => {
		setModal(false);
	});

	const renderModalBody = () => (
		<CompanyTagForm
			translate={translate}
			tag={tag}
			errors={errors}
			setTag={updateTag}
		/>
	);

	return (
		<React.Fragment>
			<BasicButton
				onClick={openModal}
				id="company-tag-add-button"
				color={primary}
				icon={<ButtonIcon type="add" color="white" />}
				text={translate.add}
				textStyle={{
					color: 'white',
					fontWeight: '700',
					...styles
				}}
			/>
			<AlertConfirm
				open={modal}
				title={translate.add_tag}
				requestClose={closeModal}
				acceptAction={createCompanyTag}
				bodyText={renderModalBody()}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
			/>
		</React.Fragment>
	);
};

export default withApollo(AddCompanyTag);
