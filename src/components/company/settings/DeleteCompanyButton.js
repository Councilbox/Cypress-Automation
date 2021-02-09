import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { BasicButton, AlertConfirm } from '../../../displayComponents';
import { bHistory } from '../../../containers/App';


const deleteCompanyMutation = gql`
    mutation DeleteCompany($companyId: Int!) {
        deleteCompany(companyId: $companyId){
        success
        }
    }
`;

const DeleteCompanyButton = ({ company, deleteCompany }) => {
    const [modal, setModal] = React.useState(false);

    const confirmDeleteCompany = async () => {
        const response = await deleteCompany({
            variables: {
                companyId: company.id
            }
        });

        if(response.data){
            if(response.data.deleteCompany.success){
                bHistory.replace('/companies');
            }
        }
    };

    return (
        <div>
            <BasicButton
                text="Eliminar compañía"
                color="red"
                textStyle={{ color: 'white' }}
                onClick={() => setModal(true)}
            />
            <AlertConfirm
                open={modal}
                requestClose={() => setModal(false)}
                acceptAction={confirmDeleteCompany}
                buttonAccept='Aceptar'
                buttonCancel={'Cancelar'}
                bodyText={<div>Esta acción no se puede deshacer, se borrará la compañía, censos y reuniones, confirmar?</div>}
                title={'Advertencia'}
            />
        </div>
    );
};

export default graphql(deleteCompanyMutation, {
    name: 'deleteCompany'
})(DeleteCompanyButton);
