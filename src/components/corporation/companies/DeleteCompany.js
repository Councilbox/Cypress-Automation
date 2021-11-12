import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { AlertConfirm } from '../../../displayComponents';


const DeletCompany = ({
	company, render, refetch, translate, styles, client
}) => {
	const [modal, setModal] = React.useState(false);

	const openModal = () => {
		setModal(true);
	};

	const closeModal = () => {
		setModal(false);
	};

	const action = async () => {
		await client.mutate({
			mutation: gql`
				mutation deleteCompany($companyId: Int!){
					deleteCompany(companyId: $companyId){
						success
						message
					}
				}
			`,
			variables: {
				companyId: company.id
			}
		});
		refetch();
	};

	const renderModalBody = () => (
		<>
			{translate.delete_company_warning.replace(/{{businessName}}/, company.businessName)}
			<span onClick={action}> {translate.accept}</span>
		</>
	);

	return (
		<React.Fragment>
			<div onClick={openModal} style={{ cursor: 'pointer', ...styles }}>
				{render}
			</div>
			<AlertConfirm
				open={modal}
				requestClose={closeModal}
				title={translate.warning}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				acceptAction={action}
				bodyText={renderModalBody()}
			/>
		</React.Fragment>

	);
};

export default withApollo(DeletCompany);
