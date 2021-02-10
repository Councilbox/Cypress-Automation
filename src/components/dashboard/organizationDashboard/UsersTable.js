import React from 'react';
import { withApollo } from 'react-apollo';
import { corporationUsers } from '../../../queries/corporation';
import { getPrimary } from '../../../styles/colors';
import {
 PaginationFooter, Scrollbar, Grid, LoadingSection
} from '../../../displayComponents';
import { getActivationText } from '../../company/settings/CompanySettingsPage';
import { moment } from '../../../containers/App';
import Cell from './Cell';

const OrganizationUsersTable = ({
 company, translate, textFilter, client
}) => {
    const [filters, setFilters] = React.useState({
        page: 1
    });
    const [users, setUsers] = React.useState(false);
	const [usersTotal, setUsersTotal] = React.useState(false);
    const primary = getPrimary();

    console.log(textFilter);

    const getUsers = React.useCallback(async () => {
		const response = await client.query({
			query: corporationUsers,
			variables: {
                ...(textFilter ? {
                    filters: [{ field: 'fullName', text: textFilter }],
                } : {}),
				options: {
					limit: 10,
					offset: (filters.page - 1) * 10,
					orderDirection: 'DESC'
				},
				corporationId: company.id
			}
		});

		if (response.data) {
			setUsers(response.data.corporationUsers.list);
			setUsersTotal(response.data.corporationUsers.total);
		}
    }, [textFilter, filters.page, company.id]);

    React.useEffect(() => {
        console.log('debería pedir de nuevo');
        getUsers();
    }, [getUsers]);


    if (!users) {
        return <LoadingSection />;
    }


	return (
		<div style={{}}>
			<div style={{ fontSize: '13px' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', padding: '1em', }}>
					<div style={{
 color: primary, fontWeight: 'bold', width: 'calc( 100% / 5 )', textAlign: 'left'
}}>
						{translate.state}
					</div>
					<div style={{
 color: primary, fontWeight: 'bold', width: 'calc( 100% / 5 )', textAlign: 'left'
}}>
						Id
					</div>
					<div style={{
 color: primary, fontWeight: 'bold', width: 'calc( 100% / 5 )', textAlign: 'left'
}}>
						{translate.name}
					</div>
					<div style={{
 color: primary, fontWeight: 'bold', overflow: 'hidden', width: 'calc( 100% / 5 )', textAlign: 'left'
}}>
						{translate.email}
					</div>
					<div style={{
 color: primary, fontWeight: 'bold', overflow: 'hidden', width: 'calc( 100% / 5 )', textAlign: 'left'
}}>
						{translate.last_connection}
					</div>
				</div>
				<div style={{ height: '300px' }}>
					<Scrollbar>
						{users.map((item, index) => (
								<div
									key={item.id}
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										padding: '1em',
										background: index % 2 ? '#edf4fb' : '',
									}}>
									<Cell text={getActivationText(item.actived, translate)} />
									<Cell text={item.id} />
									<Cell text={`${item.name} ${item.surname}` || ''} />
									<Cell text={item.email} />
									<Cell text={item.lastConnectionDate ? moment(item.lastConnectionDate).format('LLL') : '-'} />
								</div>

							))}
					</Scrollbar>
				</div>
				<Grid style={{ marginTop: '1em' }}>
					<PaginationFooter
						page={filters.page}
						translate={translate}
						length={users.length}
						total={usersTotal}
						limit={10}
						changePage={page => setFilters({ ...filters, page })}
						md={12}
						xs={12}
					/>
				</Grid>
			</div>
		</div>
	);
};

export default withApollo(OrganizationUsersTable);
