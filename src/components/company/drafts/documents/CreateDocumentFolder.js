import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { TextInput, AlertConfirm } from '../../../../displayComponents';


const CreateDocumentFolder = ({
	translate, refetch, open, requestClose, client, company, parentFolder
}) => {
	const [name, setName] = React.useState('');
	const [error, setError] = React.useState(false);


	const createDocumentFolder = async () => {
		await client.mutate({
			mutation: gql`
				mutation CreateDocumentFolder($companyDocument: CompanyDocumentInput){
					createDocumentFolder(companyDocument: $companyDocument){
						id
					}
				}
			`,
			variables: {
				companyDocument: {
					name,
					companyId: company.id,
					parentFolder: parentFolder || 0
				}
			}
		});

		refetch();
		setName('');
		requestClose();
	};

	const checkRequiredFields = () => {
		if (!name) {
			setError(true);
		} else {
			setError(false);
		}
	};

	const acceptAction = () => {
		checkRequiredFields();
		if (name && !error) {
			createDocumentFolder();
		}
	};

	const renderBody = () => (
		<TextInput
			required
			floatingText={translate.translate.title}
			type="text"
			id="create-folder-name"
			errorText={error && name.length === 0 ? translate.field_required : null}
			value={name}
			onChange={event => {
				checkRequiredFields();
				setName(event.nativeEvent.target.value);
			}}
		/>
	);

	return (
		<>
			<AlertConfirm
				title={translate.new_folder}
				open={open}
				acceptAction={acceptAction}
				requestClose={requestClose}
				buttonCancel={translate.cancel}
				buttonAccept={translate.accept}
				bodyText={renderBody()}
			/>
		</>
	);
};

export default withApollo(CreateDocumentFolder);
