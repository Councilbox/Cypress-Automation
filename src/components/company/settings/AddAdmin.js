import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { corporationUsers } from '../../../queries/corporation';
import { LoadingSection, PaginationFooter, AlertConfirm } from '../../../displayComponents';


const AddAdmin = ({
 translate, company, refetch, admins, client
}) => {
    const [users, setUsers] = React.useState({
        list: null,
        page: 1,
        total: null
    });
    const [modal, setModal] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const addAdmin = async () => {
        await client.mutate({
            mutation: gql`
                mutation AddAdmin($companyId: Int!, $userId: Int!){
                    addCompanyAdmin(companyId: $companyId, userId: $userId){
                        success
                        message
                    }
                }
            `
        });
        setModal(false);
        refetch();
    };

    const getUsers = React.useCallback(async () => {
        const response = await client.query({
			query: corporationUsers,
			variables: {
				options: {
					limit: 10,
					offset: (users.page - 1) * 10,
					orderDirection: 'DESC'
				},
				corporationId: company.corporationId
			}
        });

        setUsers({
            ...users,
            list: response.data.corporationUsers.list.filter(user => admins.find(admin => admin.id === user.id) !== -1),
            ...response.data.corporationUsers
        });
        setLoading(false);
    }, [company.id, users.page]);

    React.useEffect(() => {
        getUsers();
    }, [getUsers]);

    if (loading) {
        return <LoadingSection />;
    }


    return (
        <div style={{ width: '600px' }}>
            <AlertConfirm
                open={modal}
                buttonAccept={'Confirmar'}
                title={translate.warning}
                acceptAction={addAdmin}
                bodyText={
                    <React.Fragment>
                        {`¿Desea añadir a ${modal.name} ${modal.surname || ''} como administrador de ${company.businessName}?`}
                        <button onClick={addAdmin}>Aceptar</button>
                    </React.Fragment>}
                requestClose={() => setModal(false)}
            />
            {users.list.map(user => (
                <div key={user.id} style={{ display: 'flex' }}>
                    {`${user.name} ${user.surname || ''} - ${user.email}`}
                    <div style={{ cursor: 'pointer' }} onClick={() => {
                        setModal(user);
                        // alert()
                    }}>Añadir</div>
                </div>
            ))}
            <div style={{ width: '100%', marginTop: '1.2em' }}>
                <PaginationFooter
                    page={users.page}
                    translate={translate}
                    length={users.list.length}
                    total={users.total}
                    limit={10}
                    // changePage={changePageUsuarios}
                    md={12}
                    xs={12}
                />
            </div>
        </div>
    );
};

export default withApollo(AddAdmin);
