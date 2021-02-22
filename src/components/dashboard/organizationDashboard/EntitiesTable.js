import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import {
	PaginationFooter, Grid, Scrollbar, LoadingSection
} from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import CellAvatar from './CellAvatar';
import Cell from './Cell';

const corporationCompanies = gql`
	query corporationCompanies($filters: [FilterInput], $options: OptionsInput, $corporationId: Int!){
		corporationCompanies(filters: $filters, options: $options, corporationId: $corporationId){
			list{
				id
				businessName
				logo
			}
			total
		}
	}
`;

const OrganizationEntitiesTable = ({
	translate, company, client, textFilter
}) => {
	const [filters, setFilters] = React.useState({
		page: 1
	});
	const [companies, setCompanies] = React.useState(false);
	const [companiesTotal, setCompaniesTotal] = React.useState(false);

	const getCompanies = React.useCallback(async () => {
		const response = await client.query({
			query: corporationCompanies,
			variables: {
				filters: [{ field: 'businessName', text: textFilter }],
				options: {
					limit: 10,
					offset: (filters.page - 1) * 10,
					orderDirection: 'DESC'
				},
				corporationId: company.id
			}
		});

		if (response.data.corporationCompanies.list) {
			setCompanies(response.data.corporationCompanies.list);
			setCompaniesTotal(response.data.corporationCompanies.total);
		}
	}, [textFilter, filters.page, company.id]);

	React.useEffect(() => {
		getCompanies();
	}, [getCompanies]);

	const primary = getPrimary();

	if (!companies) {
		return <LoadingSection />;
	}

	return (
		<div style={{ fontSize: '13px' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', padding: '1em' }}>
				<div style={{
					color: primary, fontWeight: 'bold', width: 'calc( 100% / 3 )', textAlign: 'left'
				}}>

				</div>
				<div style={{
					color: primary, fontWeight: 'bold', width: 'calc( 100% / 3 )', textAlign: 'left'
				}}>
Id
				</div>
				<div style={{
					color: primary, fontWeight: 'bold', width: 'calc( 100% / 3 )', textAlign: 'left'
				}}>
					{translate.name}
				</div>
			</div>
			<div style={{ height: '300px' }}>
				<Scrollbar>
					{companies.map((item, index) => (
						<div
							key={item.id}
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								padding: '1em',
								background: index % 2 ? '#edf4fb' : '',
							}}>
							<CellAvatar width={3} avatar={item.logo} />
							<Cell width={3} text={item.id} />
							<Cell width={3} text={item.businessName} />
						</div>
					))}
				</Scrollbar>
			</div>
			<Grid style={{ marginTop: '1em' }}>
				<PaginationFooter
					page={filters.page}
					translate={translate}
					length={companies.length}
					total={companiesTotal}
					limit={10}
					changePage={value => setFilters({ ...filters, page: value })}
				/>
			</Grid>
		</div>
	);
};

export default withApollo(OrganizationEntitiesTable);
