import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { AlertConfirm } from '../../../displayComponents';


const RestoreAccount = ({ render, translate, client, user, refetch }) => {
    const [modal, setModal] = React.useState(false);

    const showModal = () => {
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
    };

    const deactivateUser = async () => {
        await client.mutate({
            mutation: gql`
                mutation DeactivateUser($userId: Int!){
                    restoreUser(userId: $userId){
                        success
                        message
                    }
                }
            `,
            variables: {
                userId: user.id
            }
        });
        closeModal();
        refetch();
    };

    const renderBody = () => (
            <div>
                ¿Está seguro que desea desactivar la cuenta de {user.name} {user.surname || ''}?
            </div>
        );


    return (
        <div onClick={showModal}>
            <AlertConfirm
                open={modal}
                buttonCancel={translate.close}
                title={translate.warning}
                buttonAccept={translate.accept}
                acceptAction={deactivateUser}
                requestClose={closeModal}
                bodyText={renderBody()}
            />
            {render}
        </div>
    );
};

export default withApollo(RestoreAccount);
