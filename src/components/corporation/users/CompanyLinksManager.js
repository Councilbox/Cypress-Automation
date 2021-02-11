import React from 'react';
import {
	Typography, Table, TableHead, TableRow, TableCell
} from 'material-ui';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import {
	BasicButton, AlertConfirm, ButtonIcon, LoadingSection, TextInput, Icon, Grid, PaginationFooter, SelectInput, MenuItem
} from '../../../displayComponents';
import { getSecondary, getPrimary } from '../../../styles/colors';
import CompanyItem from '../companies/CompanyItem';

const DEFAULT_OPTIONS = {
	limit: 10,
	offset: 0,
	orderBy: 'id',
	orderDirection: 'DESC'
};

const corporationCompanies = gql`
	query corporationCompanies($filters: [FilterInput], $options: OptionsInput, $corporationId: Int){
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


const CompanyLinksManager = ({ translate, client, ...props }) => {
	const [state, setState] = React.useState({
		checked: props.linkedCompanies || [],
		modal: false,
		step: 1,
		filterText: '',
		filterSelect: 'businessName',
		limit: DEFAULT_OPTIONS.limit
	});
	const [loading, setLoading] = React.useState(true);
	const [dataCorporationCompanies, setDataCorporationCompanies] = React.useState({});
	const [page, setPage] = React.useState(1);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: corporationCompanies,
			variables: {
				filters: [{ field: state.filterSelect, text: state.filterText }],
				options: {
					limit: 10,
					offset: (page - 1) * 10,
					orderDirection: 'DESC'
				},
				corporationId: props.company ? props.company.corporationId : 1
			}
		});
		if (response.data.corporationCompanies.list) {
			setDataCorporationCompanies(response.data.corporationCompanies);
			setLoading(false);
		}
	}, [state.filterText, state.filterSelect, page]);

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			getData();
		}, 350);

		return () => clearTimeout(timeout);
	}, [getData]);

	const addCheckedCompanies = () => {
		props.addCheckedCompanies(state.checked);
		setState({
			...state,
			step: 1,
			modal: false
		});
	};

	const close = () => {
		setState({
			...state,
			step: 1,
			page: 1,
			filterText: '',
			filterSelect: 'businessName',
			checked: props.linkedCompanies,
			modal: false
		});
	};

	return (
		<div> {/** "calc( 100% - 16em )" */}
			< div style={{
				width: '100%', display: 'flex', flexDirection: 'row', marginTop: '2em', alignItems: 'center', justifyContent: 'space-between'
			}}>
				<Typography variant="subheading" style={{ color: getPrimary(), marginRight: '0.6em' }}>
					{props.linkedCompanies.length} {translate.linked_companies}
				</Typography>
				<BasicButton
					text={translate.link_companies}
					color={getSecondary()}
					icon={<ButtonIcon type="save" color="white" />}
					textStyle={{ textTransform: 'none', color: 'white', fontWeight: '700' }}
					onClick={() => {
						setState({
							...state,
							modal: true
						});
					}}
				/>
			</div >
			<div style={{ width: '100%' }}>
				<Table
					style={{ width: '100%', maxWidth: '100%' }}
				>
					<TableHead>
						<TableRow>
							<TableCell style={{ width: '15%', padding: '4px 56px 4px 15px', textAlign: 'center' }}>Logo</TableCell>
							<TableCell style={{ width: '10%', padding: '4px 56px 4px 15px' }}>Id</TableCell>
							<TableCell style={{ width: '75%', padding: '4px 56px 4px 5px' }}>{translate.name}</TableCell>
						</TableRow>
					</TableHead>
				</Table>
				{props.linkedCompanies.map(company => (
					<CompanyItem
						tableRoot={true}
						key={`company_${company.id}`}
						company={company}
					/>
				))}
			</div>
			{/* {this.props.linkedCompanies.map(company => (
<CompanyItem
key={`company_${company.id}`}
company={company}
/>
))} */}
			<AlertConfirm
				requestClose={close}
				open={state.modal}
				acceptAction={state.step === 1 ? () => setState({ ...state, step: 2 }) : addCheckedCompanies}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				bodyText={
					<LinksCompanies
						translate={translate}
						linkedCompanies={props.linkedCompanies}
						client={client}
						companies={dataCorporationCompanies}
						company={props.company}
						page={page}
						state={state}
						setState={setState}
						setPage={setPage}
						loading={loading}
					/>
				}
				title={translate.link_companies}
			/>
		</div >
	);
};


const LinksCompanies = ({
	translate, companies, setPage, page, state, setState, loading
}) => {
	const isChecked = id => {
		const item = state.checked.find(company => company.id === id);
		return !!item;
	};

	const checkRow = (company, check) => {
		let checked = [...state.checked];
		if (check) {
			checked = [...checked, company];
		} else {
			const index = checked.findIndex(item => item.id === company.id);

			if (index !== -1) {
				checked.splice(index, 1);
			}
		}
		setState({
			...state,
			checked
		});
	};


	if (state.step === 1) {
		return (
			<div style={{ width: '650px', }}>
				<div style={{ display: 'flex' }}>
					<div style={{ width: '100px', marginRight: '1em' }}>
						<SelectInput
							value={state.filterSelect}
							onChange={event => setState({ ...state, filterSelect: event.target.value })}
						>
							<MenuItem value={'businessName'}>{translate.name}</MenuItem>
							<MenuItem value={'id'}>Id</MenuItem>
						</SelectInput>
					</div>
					<div style={{ width: '100%' }}>
						<TextInput
							adornment={<Icon>search</Icon>}
							floatingText={' '}
							type="text"
							value={state.filterText}
							onChange={event => {
								setState({
									...state,
									page: 1,
									filterText: event.target.value
								});
							}}
						/>
					</div>
				</div>
				{loading ?
					<LoadingSection />
					: <div>
						{companies.list.map(company => (
							<CompanyItem
								key={`company_${company.id}`}
								company={company}
								checkable={true}
								checked={isChecked(company.id)}
								onCheck={checkRow}
							/>
						))}
						<Grid style={{ marginTop: '1em' }}>
							<PaginationFooter
								page={page}
								translate={translate}
								length={companies.list.length}
								total={companies.total}
								limit={10}
								changePage={setPage}
								lg={12}
								md={12}
							/>
						</Grid>
					</div>
				}
			</div>
		);
	}

	if (state.step === 2) {
		return (
			<div style={{ width: '650px' }}>
				{state.checked.map(company => (
					<CompanyItem
						key={`company_${company.id}`}
						company={company}
						checkable={true}
						checked={isChecked(company.id)}
						onCheck={checkRow}
					/>
				))}
			</div>
		);
	}
};


export default withApollo(CompanyLinksManager);
