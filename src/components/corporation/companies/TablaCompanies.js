import React from 'react';
import {
	Icon, Card, CardActions, CardContent
} from 'material-ui';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import { getPrimary } from '../../../styles/colors';
import {
	Grid,
	GridItem,
	BasicButton,
	Scrollbar,
	Link,
	TextInput,
	LoadingSection,
	PaginationFooter,
	CardPageLayout,
} from '../../../displayComponents';
import withSharedProps from '../../../HOCs/withSharedProps';
import NewCompanyPage from '../../company/new/NewCompanyPage';
import RemoveCompany from './RemoveCompany';
import DeleteCompany from './DeleteCompany';
import { isMobile } from '../../../utils/screen';
import { companyTypes as companyTypesQuery } from '../../../queries';

const queryLimit = 20;

const corporationCompanies = gql`
	query corporationCompanies($filters: [FilterInput], $options: OptionsInput, $corporationId: Int){
		corporationCompanies(filters: $filters, options: $options, corporationId: $corporationId){
			list{
				id
				type
				businessName
				logo
			}
			total
		}
	}
`;

const TablaCompanies = ({ client, translate, company }) => {
	const [companyTypes, setCompanyTypes] = React.useState(null);
	const [companies, setCompanies] = React.useState(false);
	const [companiesPage, setCompaniesPage] = React.useState(1);
	const [companiesTotal, setCompaniesTotal] = React.useState(false);
	const [addEntidades, setEntidades] = React.useState(false);
	const [inputSearch, setInputSearch] = React.useState(false);
	const [state, setState] = React.useState({
		filterTextCompanies: '',
		filterTextUsuarios: '',
		filterFecha: ''
	});
	const primary = getPrimary();


	const getCompanies = async () => {
		const response = await client.query({
			query: corporationCompanies,
			variables: {
				filters: [{ field: 'businessName', text: state.filterTextCompanies }],
				options: {
					limit: queryLimit,
					offset: (companiesPage - 1) * queryLimit,
					orderDirection: 'DESC'
				},
				corporationId: company.id
			}
		});

		if (response.data.corporationCompanies.list) {
			setCompanies(response.data.corporationCompanies.list);
			setCompaniesTotal(response.data.corporationCompanies.total);
		}
	};

	const getCompanyTypes = async () => {
		const response = await client.query({
			query: companyTypesQuery,
		});

		if (response.data.companyTypes) {
			setCompanyTypes(response.data.companyTypes.reduce((acc, curr) => {
				return {
					...acc,
					[curr.value]: curr.label
				};
			}, {}));
		}
	};

	React.useEffect(() => {
		getCompanyTypes();
	}, [companyTypesQuery]);

	React.useEffect(() => {
		getCompanies();
	}, [state.filterTextCompanies, companiesPage]);

	const changePageCompanies = value => {
		setCompaniesPage(value);
	};

	if (addEntidades) {
		return <NewCompanyPage requestClose={() => setEntidades(false)} buttonBack={true} />;
	}

	const printCompanyType = type => {
		return translate[companyTypes[type]];
	};

	if (isMobile) {
		return (
			companies.length === undefined ?
				<LoadingSection />
				: <CardPageLayout title={translate.entities} stylesNoScroll={{ height: '100%' }} disableScroll={true}>
					<div style={{
						fontSize: '13px', padding: '1.5em 1.5em 1.5em', height: '100%', paddingTop: '0px'
					}}>
						<div style={{
							display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', overflow: 'hidden'
						}}>
							<div style={{
								padding: '0.5em', display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', overflow: 'hidden', paddingTop: '0px'
							}}>
								<BasicButton
									buttonStyle={{
										boxShadow: 'none', marginRight: '1em', borderRadius: '4px', border: `1px solid ${primary}`, padding: '0.2em 0.4em', marginTop: '5px', color: primary,
									}}
									backgroundColor={{
										backgroundColor: getPrimary(), color: 'white', minHeight: '0', fontWeight: 'bold'
									}}
									text={translate.add}
									onClick={() => setEntidades(true)}
								/>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div style={{ padding: '0px 8px', fontSize: '24px', color: '#c196c3' }}>
										<i className="fa fa-filter"></i>
									</div>
									<div>
										<TextInput
											className={isMobile && !inputSearch ? 'openInput' : ''}
											disableUnderline={true}
											styleInInput={{
												fontSize: '12px', color: 'rgba(0, 0, 0, 0.54)', background: '#f0f3f6', padding: isMobile && inputSearch && '4px 5px', paddingLeft: !isMobile && '5px'
											}}
											stylesAdornment={{ background: '#f0f3f6', marginLeft: '0', paddingLeft: isMobile && inputSearch ? '8px' : '4px' }}
											adornment={<Icon onClick={() => setInputSearch(!inputSearch)} >search</Icon>}
											floatingText={' '}
											placeholder={isMobile ? '' : translate.search}
											type="text"
											value={state.filterTextCompanies || ''}
											onChange={event => {
												setState({
													...state,
													filterTextCompanies: event.target.value
												});
											}}
										/>
									</div>
								</div>
							</div>
						</div>
						<div style={{ height: 'calc( 100% - 5em )' }}>
							<Scrollbar>
								<Grid style={{ padding: '2em 2em 1em 2em', height: '100%' }}>
									{companies.filter(item => item.id !== company.id).map(item => (
										<Card
											key={item.id}
											style={{
												marginBottom: '0.5em', padding: '0.3em', position: 'relative', width: '100%'
											}}
										>
											<CardContent>
												<Grid>
													<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
														{translate.name}
													</GridItem>
													<GridItem xs={7} md={7}>
														{item.businessName}
													</GridItem>
													<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
														Id
													</GridItem>
													<GridItem xs={7} md={7}>
														{item.id}
													</GridItem>
													<GridItem xs={4} md={4} style={{ fontWeight: '700' }}>
														{translate.company_type}
													</GridItem>
													<GridItem xs={7} md={7}>
														{printCompanyType(item.type)}
													</GridItem>
												</Grid>
											</CardContent>
											<CardActions>
												<RemoveCompany
													translate={translate}
													refetch={getCompanies}
													company={item}
													styles={{
														color: primary,
														background: 'white',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														padding: '0.3em',
														width: '100px'
													}}
													render={
														<span style={{}}>
															{translate.expel}
														</span>
													}
												/>
												<DeleteCompany
													translate={translate}
													refetch={getCompanies}
													company={item}
													styles={{
														color: primary,
														background: 'white',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														padding: '0.3em',
														width: '100px'
													}}
													render={
														<span style={{}}>
															{translate.delete}
														</span>
													}
												/>
												<Link to={`/company/${company.id}/edit/${item.id}`}
													styles={{
														color: primary,
														background: 'white',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														padding: '0.3em',
														width: '100px'
													}}>
													{translate.edit}
												</Link>
												<Link to={`/company/${company.id}/file/${item.id}`}
													styles={{
														color: primary,
														background: 'white',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														padding: '0.3em',
														width: '100px'
													}}>
													{translate.partner_file}
												</Link>
											</CardActions>
										</Card>

									))}
									<Grid style={{ marginTop: '1em' }}>
										<PaginationFooter
											page={companiesPage}
											translate={translate}
											length={companies.length}
											total={companiesTotal}
											limit={queryLimit}
											changePage={changePageCompanies}
										/>
									</Grid>
								</Grid>
							</Scrollbar>
						</div>
					</div>
				</CardPageLayout>
		);
	}
	return (
		companies.length === undefined ?
			<LoadingSection />
			: <CardPageLayout title={translate.entities} stylesNoScroll={{ height: '100%' }} disableScroll={true}>
				<div style={{
					fontSize: '13px', padding: '1.5em 1.5em 1.5em', height: '100%', paddingTop: '0px'
				}}>
					<div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
						<div style={{
							padding: '0.5em', display: 'flex', alignItems: 'center', paddingTop: '0px'
						}}>
							<BasicButton
								buttonStyle={{
									boxShadow: 'none', marginRight: '1em', borderRadius: '4px', border: `1px solid ${primary}`, padding: '0.2em 0.4em', marginTop: '5px', color: primary,
								}}
								backgroundColor={{ backgroundColor: 'white' }}
								text={translate.add}
								onClick={() => setEntidades(true)}
							/>

							<div style={{ padding: '0px 8px', fontSize: '24px', color: '#c196c3' }}>
								<i className="fa fa-filter"></i>
							</div>

							<TextInput
								placeholder={translate.search}
								adornment={<Icon style={{
									background: '#f0f3f6', paddingLeft: '5px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'
								}}>search</Icon>}
								type="text"
								value={state.filterTextCompanies || ''}
								styleInInput={{
									fontSize: '12px', color: 'rgba(0, 0, 0, 0.54)', background: '#f0f3f6', marginLeft: '0', paddingLeft: '8px'
								}}
								disableUnderline={true}
								stylesAdornment={{ background: '#f0f3f6', marginLeft: '0', paddingLeft: '8px' }}
								onChange={event => {
									setState({
										...state,
										filterTextCompanies: event.target.value
									});
								}}
							/>
						</div>
					</div>
					<div style={{ display: 'flex', justifyContent: 'space-between', padding: '1em' }}>
						<div style={{
							color: primary, fontWeight: 'bold', width: 'calc( 5% )', textAlign: 'left'
						}}>

						</div>
						<div style={{
							color: primary, fontWeight: 'bold', width: 'calc( 40% )', textAlign: 'left'
						}}>
							{translate.name}
						</div>
						<div style={{
							color: primary, fontWeight: 'bold', width: 'calc( 10% )', textAlign: 'left'
						}}>
							Id
						</div>
						<div style={{
							color: primary, fontWeight: 'bold', width: 'calc( 15% )', textAlign: 'left'
						}}>
							{translate.company_type}
						</div>
						<div style={{
							color: primary, fontWeight: 'bold', width: 'calc( 40% )', textAlign: 'left'
						}}>
						</div>
					</div>
					<div style={{ height: 'calc( 100% - 13em )' }}>
						<Scrollbar>
							{companies.filter(item => item.id !== company.id).map(item => (
								<div
									key={item.id}
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										padding: '1em'
									}}>
									<CellAvatar width={5} avatar={item.logo} />
									<Cell width={40} style={{ fontWeight: 'bold' }} >
										{item.businessName}
									</Cell>
									<Cell width={10}>
										{item.id}
									</Cell>
									<Cell width={15}>
										{printCompanyType(item.type)}
									</Cell>
									<Cell width={40} style={{ display: 'flex', overflow: '' }}>
										<RemoveCompany
											translate={translate}
											refetch={getCompanies}
											company={item}
											styles={{
												color: primary,
												background: 'white',
												borderRadius: '4px',
												boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.5)',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												padding: '0.3em',
												marginRight: '1em',
												width: '100px'
											}}
											render={
												<span style={{}}>
													{translate.expel}
												</span>
											}
										/>
										<DeleteCompany
											translate={translate}
											refetch={getCompanies}
											company={item}
											styles={{
												color: primary,
												background: 'white',
												borderRadius: '4px',
												boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.5)',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												padding: '0.3em',
												marginRight: '1em',
												width: '100px'
											}}
											render={
												<span style={{}}>
													{translate.delete}
												</span>
											}
										/>
										<Link to={`/company/${company.id}/edit/${item.id}`}
											styles={{
												color: primary,
												background: 'white',
												borderRadius: '4px',
												boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.5)',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												padding: '0.3em',
												marginRight: '1em',
												width: '100px'
											}}>
											{translate.edit}
										</Link>
										<Link to={`/company/${company.id}/file/${item.id}`}
											styles={{
												color: primary,
												background: 'white',
												borderRadius: '4px',
												boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.5)',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												padding: '0.3em',
												marginRight: '1em',
												width: '100px'
											}}>
											{translate.partner_file}
										</Link>
									</Cell>
								</div>

							))}
						</Scrollbar>
					</div>
					<Grid style={{ marginTop: '1em' }}>
						<PaginationFooter
							page={companiesPage}
							translate={translate}
							length={companies.length}
							total={companiesTotal}
							limit={queryLimit}
							changePage={changePageCompanies}
						/>
					</Grid>
				</div>
			</CardPageLayout>
	);
};


const CellAvatar = ({ avatar, width }) => (
	<div style={{
		overflow: 'hidden', width: `calc(${width}%)`, textAlign: 'left', whiteSpace: 'nowrap', textOverflow: 'ellipsis', paddingRight: '10px'
	}}>
		{avatar ?
			<div style={{ height: '1.7em', width: '1.7em', borderRadius: '0.9em' }}>
				<img src={avatar} alt="Foto" style={{ height: '100%', width: '100%' }} />
			</div>
			: <i style={{ color: 'lightgrey', fontSize: '1.7em', marginLeft: '6px' }} className={'fa fa-building-o'} />
		}
	</div>
);

const Cell = ({ width, children, style }) => (
	<div style={{
		overflow: 'hidden',
		width: width ? `calc(${width}%)` : 'calc( 100% / 5 )',
		textAlign: 'left',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		paddingRight: '10px',
		...style
	}}>
		{children}
	</div>
);


export default withApollo(withSharedProps()(withRouter(TablaCompanies)));
